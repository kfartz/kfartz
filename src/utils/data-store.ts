"use client";

import type { DataFromCollectionSlug, Where } from "payload";
import { useRef } from "react";
import { create } from "zustand";
import type { TInitialQuery, TTableSlug } from "@/types";

export type TTableState<Slug extends TTableSlug> = {
  records: DataFromCollectionSlug<Slug>[];
  query: string | null;
  parsedQuery: Where | null;
};

export type TDataState = {
  data: { [key in TTableSlug]?: TTableState<TTableSlug> };
  // New: Track completion status per table
  fetchedFully: { [key in TTableSlug]?: boolean };

  add: (
    tableSlug: TTableSlug,
    entries: DataFromCollectionSlug<TTableSlug>[],
    isFull?: boolean, // Optional: update status while adding
  ) => void;

  setFetchedFully: (tableSlug: TTableSlug, status: boolean) => void;
  // clear: (tableSlug: TTableSlug) => void;
  setQuery: (tableSlug: TTableSlug, query: string, parsedQuery: Where) => void;
};

const useDataStore = create<TDataState>((set) => {
  return {
    data: {},
    fetchedFully: {},

    add: (tableSlug, entries, isFull) =>
      set((prev) => {
        const currentData = prev.data[tableSlug] || {
          records: [],
          parsedQuery: {},
          query: "",
        };
        return {
          data: {
            ...prev.data,
            [tableSlug]: {
              ...currentData,
              records: [...currentData.records, ...entries],
            },
          },
          // Update status if provided, otherwise keep existing
          fetchedFully: {
            ...prev.fetchedFully,
            [tableSlug]: isFull ?? prev.fetchedFully[tableSlug] ?? false,
          },
        };
      }),

    setFetchedFully: (tableSlug, status) =>
      set((prev) => ({
        fetchedFully: {
          ...prev.fetchedFully,
          [tableSlug]: status,
        },
      })),

    // clear: (tableSlug) =>
    //   set((prev) => ({
    //     data: {
    //       ...prev.data,
    //       [tableSlug]: {
    //         ...prev.data[tableSlug],
    //         records: [],
    //       },
    //     },
    //     fetchedFully: {
    //       ...prev.fetchedFully,
    //       [tableSlug]: false,
    //     },
    //   })),

    setQuery: (tableSlug, query, parsedQuery) => {
      set((prev) => ({
        data: {
          ...prev.data,
          [tableSlug]: {
            parsedQuery,
            query,
            records: [],
          },
        },
        fetchedFully: {
          ...prev.fetchedFully,
          [tableSlug]: false,
        },
      }));
    },
  };
});

export const useData = (slug: TTableSlug, initial: TInitialQuery) => {
  const add = useDataStore((state) => state.add);
  const storeData = useDataStore((state) => state.data[slug]);
  const storeRecords = storeData?.records;
  const storeIsFetched = useDataStore((state) => state.fetchedFully[slug]);

  const initialized = useRef(false);

  if (!initialized.current) {
    if (!storeRecords || storeRecords.length === 0) {
      useDataStore.getState().add(slug, initial.records, initial.isFetched);
    }
    initialized.current = true;
  }

  const records = storeRecords ? storeRecords : initial.records;
  const isFetched = storeIsFetched ?? initial.isFetched;

  return {
    data: { records, isFetched, query: storeData?.parsedQuery },
    addRecords: (added: DataFromCollectionSlug<TTableSlug>[]) =>
      add(slug, added),
    setFetched: (status: boolean) =>
      useDataStore.getState().setFetchedFully(slug, status),
  };
};

export const useSearch = (slug: TTableSlug) => {
  const query = useDataStore((state) => state.data[slug]?.query);

  return {
    query,
    setQuery: (query: string, parsedQuery: Where) =>
      useDataStore.getState().setQuery(slug, query, parsedQuery),
  };
};
