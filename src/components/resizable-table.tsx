"use client";

import {
  createColumnHelper,
  getCoreRowModel,
  useReactTable,
  type VisibilityState,
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

  const columns = useMemo(() => {
    if (data.length === 0) return [];
    return Object.keys(data[0]).map((key) =>
      columnHelper.accessor(key, {
        id: key,
        header: key.replaceAll("_", " "),
      }),
    );
  }, [data]);

  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>(
    () => {
      if (data.length === 0) return {};

      const initialVisibility: VisibilityState = {};
      const keys = Object.keys(data[0]);

      keys.forEach((key, index) => {
        if (index >= 5 && key !== "id") {
          initialVisibility[key] = false;
        }
      });
      return initialVisibility;
    },
  );

  const table = useReactTable({
    data,
    columns,
    state: {
      columnVisibility,
    },
    onColumnVisibilityChange: setColumnVisibility,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <>
      <header className="rounded-lg border border-border bg-card mb-2 pt-1 pb-1 pl-2 flex gap-4 items-center justify-center flex-wrap">
        {table.getAllLeafColumns().map((column) => (
          <Button
            key={column.id}
            className="text-[0.90rem] p-1 flex h-auto"
            variant={column.getIsVisible() ? "default" : "outline"}
            onClick={column.getToggleVisibilityHandler()}
          >
            <span className="capitalize">{column.id.replaceAll("_", " ")}</span>
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
                        {/* We set the header string in the column definition above */}
                        {String(header.column.columnDef.header)}
                      </span>
                    </TableHead>
                  ))}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {table.getRowModel().rows.length === 0 ? (
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
