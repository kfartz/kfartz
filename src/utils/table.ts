// Table stuff

import config from "@payload-config";
import { getPayload } from "payload";
import {
  excludedCollections,
  type TExcludedCollections,
  type TTable,
  type TTableSlug,
  type TTables,
} from "@/types";

export const payload = await getPayload({ config });

const getDesc = (col: TTableSlug) => {
  const desc = payload.collections[col].config.admin.description?.toString();
  if (desc) return desc;
  else return "";
};

export const tableSlugs = Object.keys(payload.collections).filter(
  (
    coll,
  ): coll is Exclude<keyof typeof payload.collections, TExcludedCollections> =>
    !excludedCollections.includes(coll as TExcludedCollections),
);

export const tables = Object.fromEntries(
  tableSlugs.map((col): [TTableSlug, TTable] => [
    col,
    { name: col, desc: getDesc(col) },
  ]),
) as TTables;
