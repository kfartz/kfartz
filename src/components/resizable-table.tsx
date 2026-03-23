"use client";

import {
  createColumnHelper,
  getCoreRowModel,
  useReactTable,
  type VisibilityState,
} from "@tanstack/react-table";
import { Loader2 } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useInView } from "react-intersection-observer";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { TInitialQuery, TTableSlug } from "@/types";
import { useData } from "@/utils/data-store";
import { sdk } from "@/utils/payload-sdk";
import { PageSize } from "@/utils/vars";

type TTableProps = {
  slug: TTableSlug;
  initQuery: TInitialQuery;
};

// biome-ignore lint: Update types later
const columnHelper = createColumnHelper<any>();

export function ResizableTable({ initQuery, slug }: TTableProps) {
  const { data, addRecords, setFetched } = useData(slug, initQuery);

  const [isFetching, setIsFetching] = useState(false);

  let currentPage = data.records
    ? Math.ceil(data.records.length / PageSize)
    : 1;

  const { ref: loadMoreRef, inView } = useInView({ threshold: 0.1 });
  useEffect(() => {
    if (inView) {
      if (!data.isFetched) {
        setIsFetching(true);
        sdk
          .find({
            collection: slug,
            page: ++currentPage,
            limit: PageSize,
            where: data.query === null ? undefined : data.query,
          })
          .then((res) => {
            if (!res.hasNextPage) {
              setFetched(true);
            }

            addRecords(res.docs);
            setIsFetching(false);
          });
      }
    }
  }, [inView, data.query]);

  const columns = useMemo(() => {
    if (data.records.length === 0) return [];
    return Object.keys(data.records[0]).map((key) =>
      columnHelper.accessor(key, {
        id: key,
        header: key.replaceAll("_", " "),
      }),
    );
  }, [data]);

  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>(
    () => {
      if (data.records.length === 0) return {};

      const initialVisibility: VisibilityState = {};
      const keys = Object.keys(data.records[0]);

      keys.forEach((key, index) => {
        if (index >= 5 && key !== "id") {
          initialVisibility[key] = false;
        }
      });
      return initialVisibility;
    },
  );
  const table = useReactTable({
    data: data.records,
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
            <TableFooter ref={loadMoreRef}>
              {isFetching && !data.isFetched && (
                <TableRow>
                  <TableCell colSpan={table.getVisibleFlatColumns().length}>
                    <div className="flex justify-center items-center">
                      <Loader2 className="animate-spin h-6 w-6 text-blue-500" />
                    </div>
                  </TableCell>
                </TableRow>
              )}
            </TableFooter>
          </Table>
        </div>
      </div>
    </>
  );
}
