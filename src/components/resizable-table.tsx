"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

// interface Column {
//   id: string;
//   label: string;
//   width: number;
//   minWidth: number;
// }

interface ResizableTableProps {
  currentTable: {
    id: string;
    name: string;
    description: string;
  };
  searchQuery: string;
}

// Mock data
const generateMockData = (tableId: string) => {
  const baseData = {
    users: [
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
    ],
  };

  return baseData[tableId as keyof typeof baseData];
};

export function ResizableTable({
  currentTable,
  searchQuery,
}: ResizableTableProps) {
  const data = generateMockData(currentTable.id);
  // const data = []
  const dataKeys =
    data.length > 0 ? Object.keys(data[0]).filter((key) => key !== "id") : [];

  // Filter data based on search query
  const filteredData = searchQuery
    ? data.filter((row: any) =>
        Object.values(row).some((value) =>
          String(value).toLowerCase().includes(searchQuery.toLowerCase()),
        ),
      )
    : data;

  return (
    <div className="rounded-lg border border-border bg-card overflow-hidden">
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent border-border">
              {dataKeys.map((key, _) => {
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
            {filteredData.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={dataKeys.length}
                  className="h-32 text-center text-muted-foreground"
                >
                  No data found
                </TableCell>
              </TableRow>
            ) : (
              filteredData.map((row: any) => (
                <TableRow key={row.id} className="border-border">
                  {dataKeys.map((key, _) => {
                    const value = row[key];
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
