"use client";

import {
  createColumnHelper,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useCurrentTableContext } from "@/context";

type ResizableTableProps = {};

// Mock data
const generateMockData = () => {
  return [
    {
      id: 1,
      name: "Alex Thompson",
      email: "alex@example.com",
      status: "Active",
      role: "Admin",
      created: "2024-01-15",
    },
    {
      id: 2,
      name: "Sarah Chen",
      email: "sarah@example.com",
      status: "Active",
      role: "User",
      created: "2024-02-20",
    },
    {
      id: 3,
      name: "Mike Johnson",
      email: "mike@example.com",
      status: "Inactive",
      role: "User",
      created: "2024-01-10",
    },
    {
      id: 4,
      name: "Emma Davis",
      email: "emma@example.com",
      status: "Active",
      role: "Editor",
      created: "2024-03-05",
    },
    {
      id: 5,
      name: "James Wilson",
      email: "james@example.com",
      status: "Pending",
      role: "User",
      created: "2024-03-15",
    },
  ];
};

export function ResizableTable() {
  const data = generateMockData();
  const [currentTable, _] = useCurrentTableContext();
  const dataKeys =
    data.length > 0
      ? (Object.keys(data[0]).filter(
          (key) => key !== "id",
        ) as (keyof (typeof data)[number])[])
      : [];

  const columnHelper =
    createColumnHelper<ReturnType<typeof generateMockData>[number]>();

  const columns = dataKeys.map((key) =>
    columnHelper.accessor(key, { id: key }),
  );

  // const columns = data[columnHelper.accessor("id", { id: "id" })];

  const table = useReactTable({
    columns,
    data,
    getCoreRowModel: getCoreRowModel(),
  });

  // Filter data based on search query
  // const filteredData = searchQuery
  //   ? data.filter((row: any) =>
  //       Object.values(row).some((value) =>
  //         String(value).toLowerCase().includes(searchQuery.toLowerCase()),
  //       ),
  //     )
  //   : data;
  return <div> {currentTable.name} </div>;
  return (
    <div className="rounded-lg border border-border bg-card overflow-hidden">
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent border-border">
              {dataKeys.map((key) => {
                return (
                  <TableHead
                    key={key}
                    className="relative font-medium"
                    // style={{ width: `${column.width}px` }}
                  >
                    <div className="flex items-center justify-between pr-2">
                      <span className="capitalize">
                        {key.replace(/([A-Z])/g, " $1").trim()}
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
                      <TableCell
                        key={key}
                        //style={{ width: `${column.width}px` }}
                        className="font-mono text-sm"
                      >
                        {value}
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
