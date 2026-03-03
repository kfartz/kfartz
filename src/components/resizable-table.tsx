"use client";

import {
  createColumnHelper,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import type { DataFromCollectionSlug, PaginatedDocs } from "payload";
import { useMemo, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { TTableSlug } from "@/types";
import { flattenObject } from "@/utils/flatten";
import { Button } from "./ui/button";

type TTableProps = {
  name: TTableSlug;
  query: PaginatedDocs<DataFromCollectionSlug<TTableSlug>>;
};

const columnHelper = createColumnHelper<any>();

export function ResizableTable({ query }: TTableProps) {
  const docs = query.docs;

  const data = useMemo(() => docs.map((doc) => flattenObject(doc)), [docs]);

  const [dataKeys, setDataKeys] = useState(() => {
    if (data.length === 0) return {};
    const keys = Object.keys(data[0]);
    const initialKeys: Record<string, { selected: boolean }> = {};

    keys.forEach((key, index) => {
      initialKeys[key] = { selected: index < 5 };
    });
    initialKeys.id = { selected: true };
    return initialKeys;
  });

  const columns = useMemo(() => {
    return Object.keys(dataKeys)
      .filter((key) => dataKeys[key].selected)
      .map((key) => columnHelper.accessor(key, { id: key }));
  }, [dataKeys]);

  const table = useReactTable({
    columns,
    data,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <>
      <header className="rounded-lg border border-border bg-card mb-2 pt-1 pb-1 pl-2 flex gap-4 items-center justify-center flex-wrap">
        {Object.keys(dataKeys).map((key) => (
          <Button
            key={key}
            className="text-[0.90rem] p-1 flex h-auto"
            variant={dataKeys[key].selected ? "default" : "outline"}
            onClick={() =>
              setDataKeys((prev) => ({
                ...prev,
                [key]: { selected: !prev[key].selected },
              }))
            }
          >
            <span>{key}</span>
          </Button>
        ))}
      </header>

      <div className="rounded-lg border border-border bg-card overflow-hidden">
        <div className="overflow-x-auto">
          <Table className="w-full">
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow
                  key={headerGroup.id}
                  className="hover:bg-transparent border-border"
                >
                  {headerGroup.headers.map((header) => (
                    <TableHead key={header.id} className="relative font-medium">
                      <span className="capitalize">
                        {header.id.replaceAll("_", " ")}
                      </span>
                    </TableHead>
                  ))}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {data.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={columns.length}
                    className="h-32 text-center text-muted-foreground"
                  >
                    No data found
                  </TableCell>
                </TableRow>
              ) : (
                table.getRowModel().rows.map((row) => (
                  <TableRow key={row.id} className="border-border">
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id} className="font-mono text-sm">
                        {String(cell.getValue() ?? "null")}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </>
  );
}
