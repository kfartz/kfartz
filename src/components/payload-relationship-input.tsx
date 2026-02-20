"use client";

import { useQuery } from "@tanstack/react-query";
import { Check, ChevronsUpDown, Loader2 } from "lucide-react";
import * as React from "react";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";

interface Props {
  relationTo: string;
  value: string | null;
  onChange: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
}

// Define the shape of the document we fetch for suggestions
interface RelationshipDoc {
  id: string;
  name?: string | null;
  createdAt: string;
}

// Define the Payload paginated response shape
interface PayloadResponse<T> {
  docs: T[];
  totalDocs: number;
  limit: number;
  totalPages: number;
  page: number;
  pagingCounter: number;
  hasPrevPage: boolean;
  hasNextPage: boolean;
  prevPage: number | null;
  nextPage: number | null;
}

export function PayloadRelationshipInput({
  relationTo,
  value,
  onChange,
  placeholder,
  disabled,
}: Props) {
  const [open, setOpen] = React.useState(false);
  const [search, setSearch] = React.useState("");

  const { data, isLoading } = useQuery<PayloadResponse<RelationshipDoc>>({
    queryKey: ["payload-relation", relationTo, search],
    queryFn: async () => {
      const searchParam = search ? `&where[name][contains]=${search}` : "";

      const res = await fetch(
        `/api/${relationTo}?limit=10&select[name]=true&select[createdAt]=true${searchParam}`,
      );
      if (!res.ok) throw new Error("Failed to fetch");
      return res.json() as Promise<PayloadResponse<RelationshipDoc>>;
    },
    enabled: open,
  });

  const docs = data?.docs || [];

  const formatDate = (dateStr: string) => {
    if (!dateStr) return "";
    return new Date(dateStr).toLocaleDateString(undefined, {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const selectedLabel = value
    ? docs.find((d) => d.id === value)?.name || value
    : placeholder || "Select item...";

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between font-normal"
          disabled={disabled}
        >
          {selectedLabel}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-100 p-0" align="start">
        <Command shouldFilter={false}>
          <CommandInput placeholder="Search..." onValueChange={setSearch} />
          <CommandList>
            {isLoading && (
              <div className="flex items-center justify-center p-4">
                <Loader2 className="h-4 w-4 animate-spin" />
              </div>
            )}
            {!isLoading && docs.length === 0 && (
              <CommandEmpty>No results found.</CommandEmpty>
            )}
            <CommandGroup>
              {docs.map((doc) => (
                <CommandItem
                  key={doc.id}
                  value={doc.id}
                  onSelect={() => {
                    onChange(doc.id);
                    setOpen(false);
                  }}
                  className="flex justify-between items-center"
                >
                  <div className="flex items-center">
                    <Check
                      className={cn(
                        "mr-2 h-4 w-4",
                        value === doc.id ? "opacity-100" : "opacity-0",
                      )}
                    />
                    <span className="truncate max-w-50">
                      {doc.name || doc.id}
                    </span>
                  </div>
                  <span className="text-xs text-muted-foreground ml-2">
                    {formatDate(doc.createdAt)}
                  </span>
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
