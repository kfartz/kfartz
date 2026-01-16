"use client";

import { Plus, Search, SlidersHorizontal } from "lucide-react";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { AdvancedFiltersDialog } from "@/components/advanced-filters-dialog";
import { ResizableTable } from "@/components/resizable-table";
import { TableSwitcherDialog } from "@/components/table-switcher-dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { availableTables } from "@/tables";

function TablePageContent() {
  const [searchQuery, setSearchQuery] = useState("");
  const [currentTable, setCurrentTable] = useState(availableTables[0]);

  // Dialog states
  const [showTableSwitcher, setShowTableSwitcher] = useState(false);
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);

  // Keyboard shortcut handler (Cmd/Ctrl + K)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setShowTableSwitcher(true);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const handleTableSelect = useCallback(
    (table: (typeof availableTables)[0]) => {
      setCurrentTable(table);
      setShowTableSwitcher(false);
    },
    [],
  );

  return (
    <div className="min-h-screen bg-background">
      {/* Header with search and actions */}
      <div className="border-b border-border bg-card">
        <div className="flex items-center gap-3 px-6 py-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Row fuzzy finder..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 bg-muted/50 border-muted"
            />
          </div>

          <Button
            variant="outline"
            size="icon"
            onClick={() => setShowAdvancedFilters(true)}
            title="Advanced filters"
          >
            <SlidersHorizontal className="h-4 w-4" />
          </Button>
          <Link href={`insert/${currentTable.id}`} target="_blank">
            <Button size="icon" title="Add content to table">
              {" "}
              <Plus className="h-4 w-4" />
            </Button>
          </Link>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowTableSwitcher(true)}
            className="ml-2"
          >
            <span className="text-muted-foreground mr-2">Table:</span>
            <span className="font-medium">{currentTable.name}</span>
            <kbd className="ml-3 pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border border-border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground">
              <span className="text-xs">⌘</span>K
            </kbd>
          </Button>
        </div>
      </div>

      {/* Main content area */}
      <main className="p-6">
        <ResizableTable currentTable={currentTable} searchQuery={searchQuery} />
      </main>

      {/* Dialogs */}
      <TableSwitcherDialog
        open={showTableSwitcher}
        onOpenChange={setShowTableSwitcher}
        tables={availableTables}
        currentTable={currentTable}
        onSelectTable={handleTableSelect}
      />

      <AdvancedFiltersDialog
        open={showAdvancedFilters}
        onOpenChange={setShowAdvancedFilters}
        currentTable={currentTable} // Pass currentTable for dynamic filters
      />
    </div>
  );
}

export default function TablePage() {
  return <TablePageContent />;
}
