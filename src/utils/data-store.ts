"use client";

import type { DataFromCollectionSlug } from "payload";
import { useRef } from "react";
import { create } from "zustand";
import type { TInitialQuery, TTableSlug } from "@/types";

export type TDataState = {
  data: Partial<{ [key in TTableSlug]: DataFromCollectionSlug<TTableSlug>[] }>;
  // New: Track completion status per table
  fetchedFully: Partial<{ [key in TTableSlug]: boolean }>;

  add: (
    tableSlug: TTableSlug,
    entries: DataFromCollectionSlug<TTableSlug>[],
    isFull?: boolean, // Optional: update status while adding
  ) => void;

  setFetchedFully: (tableSlug: TTableSlug, status: boolean) => void;
  clear: (tableSlug: TTableSlug) => void;
};

const useDataStore = create<TDataState>((set) => ({
  data: {},
  fetchedFully: {},

  add: (tableSlug, entries, isFull) =>
    set((prev) => {
      const currentData = prev.data[tableSlug] || [];
      return {
        data: {
          ...prev.data,
          [tableSlug]: [...currentData, ...entries],
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

  clear: (tableSlug) =>
    set((prev) => ({
      data: {
        ...prev.data,
        [tableSlug]: [],
      },
      fetchedFully: {
        ...prev.fetchedFully,
        [tableSlug]: false,
      },
    })),
}));

// export const useData = (slug: TTableSlug, initial: TInitialQuery) => {
//   const { data, add, setFetchedFully } = useDataStore();
//
//   const addRecords = (added: DataFromCollectionSlug<TTableSlug>[]) => {
//     setDataState((prev) => {
//       return {
//         records: [...prev.records, ...added],
//         isFetched: prev.isFetched,
//       };
//     });
//     useDataStore.getState().add(slug, added);
//   };
//
//   const setFetched = (fetched: boolean) => {
//     setDataState((prev) => ({ ...prev, isFetched: fetched }));
//
//     useDataStore.getState().setFetchedFully(slug, fetched);
//   };
//
//   return { data, addRecords, setFetched };
// };
//

export const useData = (slug: TTableSlug, initial: TInitialQuery) => {
  const add = useDataStore((state) => state.add);
  const storeRecords = useDataStore((state) => state.data[slug]);
  const storeIsFetched = useDataStore((state) => state.fetchedFully[slug]);

  const initialized = useRef(false);

  if (!initialized.current) {
    if (!storeRecords || storeRecords.length === 0) {
      useDataStore.getState().add(slug, initial.records, initial.isFetched);
    }
    initialized.current = true;
  }

  const records = storeRecords?.length ? storeRecords : initial.records;
  const isFetched = storeIsFetched ?? initial.isFetched;

  return {
    data: { records, isFetched },
    addRecords: (added: DataFromCollectionSlug<TTableSlug>[]) =>
      add(slug, added),
    setFetched: (status: boolean) =>
      useDataStore.getState().setFetchedFully(slug, status),
  };
};
