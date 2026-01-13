"use client";

import { Search } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Kbd } from "@/components/ui/kbd";
import { cn } from "@/lib/utils";

interface TableSwitcherDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  tables: { id: string; name: string; description: string }[];
  currentTable: { id: string; name: string; description: string };
  onSelectTable: (table: {
    id: string;
    name: string;
    description: string;
  }) => void;
}

export function TableSwitcherDialog({
  open,
  onOpenChange,
  tables,
  currentTable,
  onSelectTable,
}: TableSwitcherDialogProps) {
  const [search, setSearch] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);

  const filteredTables = useMemo(() => {
    return tables.filter(
      (table) =>
        table.name.toLowerCase().includes(search.toLowerCase()) ||
        table.description.toLowerCase().includes(search.toLowerCase()),
    );
  }, [search, tables]);

  useEffect(() => {
    // Find the first table that is not the current table
    const firstSelectableIndex = filteredTables.findIndex(
      (table) => table.id !== currentTable.id,
    );

    setSelectedIndex(firstSelectableIndex >= 0 ? firstSelectableIndex : 0);
  }, [filteredTables, currentTable]);

  // Reset search when dialog opens/closes
  useEffect(() => {
    if (!open) {
      setSearch("");
      setSelectedIndex(
        tables.findIndex((table) => table.id !== currentTable.id),
      );
    }
  }, [open, tables, currentTable]);

  // Keyboard navigation
  useEffect(() => {
    if (!open) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowDown") {
        e.preventDefault();
        setSelectedIndex((prev) => {
          if (prev > filteredTables.length - 2) return prev;
          if (tables[prev + 1].id === currentTable.id) return prev;
          else return prev + 1;
        });
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setSelectedIndex((prev) => {
          if (prev <= 0) return prev;
          if (tables[prev - 1].id === currentTable.id) return prev;
          else return prev - 1;
        });
      } else if (e.key === "Enter" && filteredTables[selectedIndex]) {
        e.preventDefault();
        onSelectTable(filteredTables[selectedIndex]);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [
    open,
    filteredTables,
    selectedIndex,
    onSelectTable,
    currentTable,
    tables,
  ]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-137.5 p-0 gap-0">
        <DialogHeader className="px-4 pt-4 pb-3 border-b border-border">
          <DialogTitle>Table picker</DialogTitle>
          <DialogDescription>
            Search and switch between available tables
          </DialogDescription>
        </DialogHeader>

        {/* Search */}
        <div className="p-4 border-b border-border">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search tables..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
              }}
              className="pl-9 bg-muted/50"
              autoFocus
            />
          </div>
        </div>

        {/* List */}
        <div className="max-h-75 overflow-y-auto">
          {filteredTables.length === 0 ? (
            <div className="py-8 text-center text-muted-foreground text-sm">
              No tables found
            </div>
          ) : (
            <div className="p-2">
              {filteredTables.map((table, index) => {
                const isCurrent = currentTable.id === table.id;
                return (
                  <button
                    type="button"
                    key={table.id}
                    onClick={() => onSelectTable(table)}
                    onMouseMove={() => !isCurrent && setSelectedIndex(index)}
                    className={cn(
                      "w-full flex items-start gap-3 px-3 py-2.5 rounded-md text-left transition-colors",
                      selectedIndex === index &&
                        "bg-accent text-accent-foreground",
                      isCurrent && "bg-primary/10",
                    )}
                  >
                    {/* <img */}
                    {/*   src="/path/to/table-icon.svg" */}
                    {/*   alt="Table" */}
                    {/*   className="h-4 w-4 mt-0.5 flex-shrink-0" */}
                    {/* /> */}
                    <div className="flex-1 min-w-0">
                      <div className="font-medium text-sm">{table.name}</div>
                      <div className="text-xs text-muted-foreground line-clamp-1">
                        {table.description}
                      </div>
                    </div>
                    {isCurrent && (
                      <div className="text-xs text-primary font-medium">
                        Current
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-4 py-3 border-t border-border bg-muted/30">
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <div className="flex items-center gap-4">
              <span>
                <Kbd>↑↓</Kbd>
                Navigate
              </span>
              <span>
                <Kbd>↵</Kbd>
                Select
              </span>
            </div>
            <span>
              <Kbd>Esc</Kbd> Close
            </span>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
