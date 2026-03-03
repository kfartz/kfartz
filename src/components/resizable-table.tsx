"use client";

import {
  createColumnHelper,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import type { DataFromCollectionSlug, PaginatedDocs } from "payload";
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

type TTableProps = {
  name: TTableSlug;
  query: PaginatedDocs<DataFromCollectionSlug<TTableSlug>>;
};

export function ResizableTable({ query }: TTableProps) {
  const docs = query.docs;

  console.log(docs);
  const data = docs.map((doc) => flattenObject(doc));
  const dataKeys = data.length > 0 ? Object.keys(flattenObject(data[0])) : [];

  const columnHelper = createColumnHelper<(typeof data)[number]>();

  const columns = dataKeys.map((key) =>
    columnHelper.accessor(key, { id: key }),
  );

  const table = useReactTable({
    columns,
    data: data,
    getCoreRowModel: getCoreRowModel(),
  });
  return (
    <div className="rounded-lg border border-border bg-card overflow-hidden">
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent border-border">
              {dataKeys.map((key) => {
                return (
                  <TableHead key={key} className="relative font-medium">
                    <div className="flex items-center justify-between pr-2">
                      <span className="capitalize">
                        {key.replaceAll("_", " ")}
                      </span>
                    </div>
                  </TableHead>
                );
              })}
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={dataKeys.length}
                  className="h-32 text-center text-muted-foreground"
                >
                  No data found
                </TableCell>
              </TableRow>
            ) : (
              table.getCoreRowModel().rows.map((row, _) => (
                <TableRow key={row.id} className="border-border">
                  {dataKeys.map((key, _) => {
                    const value = row.original[key];
                    return (
                      <TableCell key={key} className="font-mono text-sm">
                        {(() => {
                          if (!value) return "null";
                          else return String(value);
                        })()}
                      </TableCell>
                    );
                  })}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
