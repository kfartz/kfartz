import type { CollectionSlug } from "payload";

export const excludedCollections = [
  "search",
  "users",
  "chamber-types",
  "payload-kv",
  "payload-locked-documents",
  "payload-preferences",
  "payload-migrations",
] as const;

export type TExcludedCollections = (typeof excludedCollections)[number];

export type TTableSlug = Exclude<CollectionSlug, TExcludedCollections>;

export type TTable = {
  name: TTableSlug;
  desc: string;
};

export type TTables = Record<TTableSlug, TTable>;
