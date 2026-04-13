import type { Operator as PayloadOperator, Where } from "payload";

const IDENT_SPECIAL_CHARS = "._";

enum Operator {
  NEGATE = "-",
  LIKE = ":",
  EQUALS = "=",
  GREATER = ">",
  GREATER_EQUAL = ">=",
  GREATER_EQUAL2 = "=>",
  LESS = "<",
  LESS_EQUAL = "<=",
  LESS_EQUAL2 = "=<",
}

type OperatorToken = { type: "operator"; op: Operator };
type IdentToken = { type: "ident"; ident: string };
type ValueToken = { type: "value"; value: number | string };

type Token = OperatorToken | IdentToken | ValueToken;
type SubLexerResult = { newS: string; token: Token };

export type ParseResult = {
  result: Where;
  warnings: string[];
};

const isAlnumChar = (s: string) => /^[a-zA-Z0-9]$/.test(s);
const isAlphaChar = (s: string) => /^[a-zA-Z]$/.test(s);
const isNumChar = (s: string) => /^[0-9]$/.test(s);

function lexIdent(s: string): SubLexerResult | null {
  let i = 0;
  for (; isAlnumChar(s[i]) || IDENT_SPECIAL_CHARS.includes(s[i]); i++);
  if (!i) return null;
  return {
    newS: s.slice(i),
    token: { type: "ident", ident: s.slice(0, i) },
  };
}

function lexOp(s: string): SubLexerResult | null {
  const ops = Object.values(Operator) as Operator[];
  const op = ops.findLast((op) => s.startsWith(op));
  if (!op) return null;
  return {
    newS: s.slice(op.length),
    token: { type: "operator", op },
  };
}

function lexNumber(s: string): SubLexerResult | null {
  let i = 0;
  let hasDot = false;
  for (; isNumChar(s[i]) || (s[i] === "." && !hasDot); i++) {
    hasDot ||= s[i] === ".";
  }
  if (!i) return null;
  return {
    newS: s.slice(i),
    token: { type: "value", value: Number(s.slice(0, i)) },
  };
}

function lexString(s: string): SubLexerResult | null {
  const quote = ["'", '"'].includes(s[0]) ? s[0] : null;
  let value = null;
  if (quote) {
    s = s.slice(1);
    let i = s.indexOf(quote);
    if (i === -1) i = s.length;
    value = s.slice(0, i);
    s = s.slice(i);
  } else {
    let i = s.indexOf(" ");
    if (i === -1) i = s.length;
    value = s.slice(0, i);
    s = s.slice(i);
  }

  if (!value) return null;

  return {
    newS: s,
    token: { type: "value", value },
  };
}

const lexValue = (s: string) => lexNumber(s) ?? lexString(s);

function lex(s: string): Token[] {
  s = s.trim();
  const tokens = [];

  while (s) {
    const lastToken = tokens.at(-1);
    let result = null;

    if (
      (isAlphaChar(s[0]) || IDENT_SPECIAL_CHARS.includes(s[0])) &&
      (lastToken?.type !== "operator" || lastToken?.op === Operator.NEGATE)
    )
      result = lexIdent(s);
    else if (
      Object.values(Operator)
        .map((s) => s[0])
        .includes(s[0])
    )
      result = lexOp(s);
    else result = lexValue(s);

    if (result) {
      s = result.newS;
      tokens.push(result.token);
    } else {
      s = s.slice(1);
    }

    s = s.trim();
  }

  return tokens;
}

type Expression = {
  n: boolean;
  i: string | null;
  op: Operator | null;
  v: string | number | null;
};

export function parse(s: string): ParseResult {
  const tokens = lex(s);
  let state: Expression = { n: false, i: null, op: null, v: null };
  const warnings = [];
  const result: Where = { and: [] };

  for (const token of tokens) {
    switch (token.type) {
      case "operator":
        if (state.op && token.op !== Operator.NEGATE)
          warnings.push(
            `Second operator '${token.op}' overriding operator '${state.op}`,
          );
        if (token.op === Operator.NEGATE) state.n = true;
        else state.op = token.op;
        break;
      case "value":
        if (state.v)
          warnings.push(
            `Second value '${token.value}' overriding value '${state.v}`,
          );
        state.v = token.value;
        break;
      case "ident":
        if (state.i)
          warnings.push(
            `Second identifier '${token.ident}' overriding identifier '${state.i}`,
          );
        state.i = token.ident;
        break;
    }

    if (state.i && state.op && state.v) {
      let op: PayloadOperator = "equals";
      switch (state.op) {
        case Operator.EQUALS:
          break;
        case Operator.LIKE:
          op = "like";
          break;
        case Operator.GREATER:
          op = "greater_than";
          break;
        case Operator.GREATER_EQUAL:
        case Operator.GREATER_EQUAL2:
          op = "greater_than_equal";
          break;
        case Operator.LESS:
          op = "less_than";
          break;
        case Operator.LESS_EQUAL:
        case Operator.LESS_EQUAL2:
          op = "less_than_equal";
          break;
      }

      if (state.n) {
        if (op === "equals") op = `not_${op}` as PayloadOperator;
        else warnings.push(`Can't negate operator '${state.op}'`);
      }

      result.and?.push({ [state.i]: { [op]: state.v } });

      state = { n: false, i: null, op: null, v: null };
    }
  }

  return { result, warnings };
}
