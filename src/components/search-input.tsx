"use client";

import { AlertTriangle, HelpCircle } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { parse } from "@/lib/search-parsing";
import type { TTableSlug } from "@/types";
import { useSearch } from "@/utils/data-store";
import { Button } from "./ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { Input } from "./ui/input";
import {
  Popover,
  PopoverAnchor,
  PopoverContent,
  PopoverHeader,
  PopoverTitle,
} from "./ui/popover";

type SearchInputProps = {
  tableSlug: TTableSlug;
  className?: string;
};

const syntaxExamples = [
  { operator: "Equals", symbol: "=", example: "status=active" },
  { operator: "Not equals", symbol: "-=", example: "-status=inactive" },
  { operator: "Contains", symbol: ":", example: "name:john" },
  { operator: "Greater than", symbol: ">", example: "age>18" },
  { operator: "Greater or equal", symbol: ">= or =>", example: "price>=100" },
  { operator: "Less than", symbol: "<", example: "count<10" },
  { operator: "Less or equal", symbol: "<= or =<", example: "score<=50" },
];

export function SearchInput({ tableSlug, ...props }: SearchInputProps) {
  const { query, setQuery } = useSearch(tableSlug);
  const [value, setValue] = useState(query ?? "");
  const [warnings, setWarnings] = useState<string[]>([]);
  const [isFocused, setIsFocused] = useState(false);
  const [helpOpen, setHelpOpen] = useState(false);
  const blurTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const timeout = setTimeout(() => {
      const result = parse(value);
      setWarnings(result.warnings);
      setQuery(value, result.result);
    }, 250);
    return () => clearTimeout(timeout);
  }, [value]);

  const handleFocus = () => {
    if (blurTimeoutRef.current) {
      clearTimeout(blurTimeoutRef.current);
      blurTimeoutRef.current = null;
    }
    setIsFocused(true);
  };

  const handleBlur = () => {
    blurTimeoutRef.current = setTimeout(() => {
      setIsFocused(false);
    }, 150);
  };

  const showWarnings = isFocused && warnings.length > 0;

  return (
    <Popover open={showWarnings}>
      <PopoverAnchor asChild>
        <div className="flex gap-2 pb-2">
          <Dialog open={helpOpen} onOpenChange={setHelpOpen}>
            <DialogTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="shrink-0"
                aria-label="Query syntax help"
              >
                <HelpCircle className="h-full w-full" />
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-lg">
              <DialogHeader>
                <DialogTitle>Query Syntax Help</DialogTitle>
                <DialogDescription>
                  Use these operators to filter your results.
                </DialogDescription>
              </DialogHeader>
              <div className="mt-4">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b">
                      <th className="pb-2 text-left font-medium">Operator</th>
                      <th className="pb-2 text-left font-medium">Symbol</th>
                      <th className="pb-2 text-left font-medium">Example</th>
                    </tr>
                  </thead>
                  <tbody>
                    {syntaxExamples.map((row) => (
                      <tr key={row.operator} className="border-b last:border-0">
                        <td className="py-2">{row.operator}</td>
                        <td className="py-2 font-mono">{row.symbol}</td>
                        <td className="py-2">{row.example}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <div className="mt-4 space-y-2 text-sm text-muted-foreground">
                  <p>
                    <span className="font-medium text-foreground">
                      Values with spaces:
                    </span>
                    <br />
                    Use quotes, e.g.: name:"John Doe"
                  </p>
                  <p>
                    <span className="font-medium text-foreground">
                      Nested fields:
                    </span>
                    <br />
                    Use dots, e.g.: user.email:example
                  </p>
                  <p>
                    <span className="font-medium text-foreground">
                      Multiple conditions:
                    </span>
                    <br />
                    Separate with spaces (AND), e.g.: status=active age&gt;18
                  </p>
                </div>
              </div>
            </DialogContent>
          </Dialog>
          <Input
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onFocus={handleFocus}
            onBlur={handleBlur}
            {...props}
          />
        </div>
      </PopoverAnchor>
      <PopoverContent
        side="bottom"
        align="start"
        onOpenAutoFocus={(e) => e.preventDefault()}
      >
        <PopoverHeader>
          <PopoverTitle className="flex items-center gap-2 text-amber-600">
            <AlertTriangle className="h-4 w-4" />
            Warnings
          </PopoverTitle>
        </PopoverHeader>
        <ul className="mt-2 flex flex-col gap-1 text-sm text-amber-600">
          {warnings.map((warning, i) => (
            <li key={`${i}-${warning}`}>{warning}</li>
          ))}
        </ul>
      </PopoverContent>
    </Popover>
  );
}
