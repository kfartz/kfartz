"use client";

import { Check, ChevronsUpDown, Loader2 } from "lucide-react";
import type { CollectionSlug } from "payload";
import { useState } from "react";
import useSWR from "swr";
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
import { sdk } from "@/utils/payload-sdk";

interface Props {
  relationTo: string;
  value: number | null;
  onChange: (value: number) => void;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
}

interface RelationshipDoc {
  id: number;
  name?: string | null;
  createdAt: string;
}

export function PayloadRelationshipInput({
  relationTo,
  value,
  onChange,
  placeholder,
  disabled,
  className,
}: Props) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");

  const { data, isLoading } = useSWR(
    open ? ["payload-relation", relationTo, search] : null,
    async () =>
      sdk.find({
        collection: relationTo as CollectionSlug,
        limit: 10,
        select: { name: true, createdAt: true },
        where: search ? { name: { contains: search } } : undefined,
      }),
  );

  const docs = (data?.docs as RelationshipDoc[]) || [];

  const formatDate = (dateStr: string) => {
    if (!dateStr) return "";
    return new Date(dateStr).toLocaleDateString(undefined, {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const selectedLabel = value
    ? docs.find((d) => d.id === value)?.name || String(value)
    : placeholder || "Select item...";

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={cn("w-full justify-between font-normal", className)}
          disabled={disabled}
        >
          {selectedLabel}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[25rem] p-0" align="start">
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
                  value={String(doc.id)}
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
