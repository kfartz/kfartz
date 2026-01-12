"use client";

import type React from "react";

import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface Column {
  id: string;
  label: string;
  width: number;
  minWidth: number;
}

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
    products: [
      {
        id: 1,
        name: "Wireless Headphones",
        sku: "WH-001",
        price: "$199",
        stock: 45,
        category: "Audio",
      },
      {
        id: 2,
        name: "Smart Watch",
        sku: "SW-002",
        price: "$299",
        stock: 23,
        category: "Wearables",
      },
      {
        id: 3,
        name: "Laptop Stand",
        sku: "LS-003",
        price: "$49",
        stock: 150,
        category: "Accessories",
      },
      {
        id: 4,
        name: "USB-C Hub",
        sku: "UH-004",
        price: "$79",
        stock: 89,
        category: "Accessories",
      },
      {
        id: 5,
        name: "Mechanical Keyboard",
        sku: "MK-005",
        price: "$149",
        stock: 34,
        category: "Input Devices",
      },
    ],
    orders: [
      {
        id: 1,
        order: "#ORD-1001",
        customer: "John Doe",
        amount: "$450",
        status: "Completed",
        date: "2024-03-10",
      },
      {
        id: 2,
        order: "#ORD-1002",
        customer: "Jane Smith",
        amount: "$325",
        status: "Processing",
        date: "2024-03-12",
      },
      {
        id: 3,
        order: "#ORD-1003",
        customer: "Bob Brown",
        amount: "$890",
        status: "Shipped",
        date: "2024-03-13",
      },
      {
        id: 4,
        order: "#ORD-1004",
        customer: "Alice Green",
        amount: "$125",
        status: "Pending",
        date: "2024-03-14",
      },
      {
        id: 5,
        order: "#ORD-1005",
        customer: "Tom White",
        amount: "$675",
        status: "Completed",
        date: "2024-03-15",
      },
    ],
  };

  return baseData[tableId as keyof typeof baseData] || baseData.users;
};

export function ResizableTable({
  currentTable,
  searchQuery,
}: ResizableTableProps) {
  const [columns, setColumns] = useState<Column[]>([
    { id: "col1", label: "Column 1", width: 200, minWidth: 100 },
    { id: "col2", label: "Column 2", width: 250, minWidth: 100 },
    { id: "col3", label: "Column 3", width: 150, minWidth: 100 },
    { id: "col4", label: "Column 4", width: 150, minWidth: 100 },
    { id: "col5", label: "Column 5", width: 180, minWidth: 100 },
  ]);

  const [resizing, setResizing] = useState<{
    columnId: string;
    startX: number;
    startWidth: number;
  } | null>(null);

  const handleMouseDown = (
    e: React.MouseEvent,
    columnId: string,
    currentWidth: number,
  ) => {
    e.preventDefault();
    setResizing({
      columnId,
      startX: e.clientX,
      startWidth: currentWidth,
    });
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (!resizing) return;

    const diff = e.clientX - resizing.startX;
    const newWidth = Math.max(
      columns.find((col) => col.id === resizing.columnId)?.minWidth || 100,
      resizing.startWidth + diff,
    );

    setColumns((prev) =>
      prev.map((col) =>
        col.id === resizing.columnId ? { ...col, width: newWidth } : col,
      ),
    );
  };

  const handleMouseUp = () => {
    setResizing(null);
  };

  // Set up mouse move/up listeners
  if (typeof window !== "undefined") {
    if (resizing) {
      window.addEventListener("mousemove", handleMouseMove);
      window.addEventListener("mouseup", handleMouseUp);
    } else {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    }
  }

  const data = generateMockData(currentTable.id);
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

  const getStatusColor = (status: string) => {
    const statusLower = status.toLowerCase();
    if (statusLower === "active" || statusLower === "completed")
      return "default";
    if (statusLower === "pending" || statusLower === "processing")
      return "secondary";
    if (statusLower === "inactive" || statusLower === "shipped")
      return "outline";
    return "secondary";
  };

  return (
    <div className="rounded-lg border border-border bg-card overflow-hidden">
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent border-border">
              {dataKeys.map((key, index) => {
                const column = columns[index] || { width: 150 };
                return (
                  <TableHead
                    key={key}
                    className="relative font-medium"
                    style={{ width: `${column.width}px` }}
                  >
                    <div className="flex items-center justify-between pr-2">
                      <span className="capitalize">
                        {key.replace(/([A-Z])/g, " $1").trim()}
                      </span>
                    </div>
                    {/* Resize handle */}
                    <div
                      className="absolute right-0 top-0 h-full w-1 cursor-col-resize hover:bg-primary/50 active:bg-primary"
                      onMouseDown={(e) =>
                        handleMouseDown(
                          e,
                          columns[index]?.id || `col${index}`,
                          column.width,
                        )
                      }
                    />
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
                  {dataKeys.map((key, index) => {
                    const column = columns[index] || { width: 150 };
                    const value = row[key];
                    const isStatus = key === "status";

                    return (
                      <TableCell
                        key={key}
                        style={{ width: `${column.width}px` }}
                        className="font-mono text-sm"
                      >
                        {isStatus ? (
                          <Badge
                            variant={getStatusColor(value)}
                            className="font-sans"
                          >
                            {value}
                          </Badge>
                        ) : (
                          value
                        )}
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
