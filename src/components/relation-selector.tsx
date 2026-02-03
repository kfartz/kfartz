"use client"

import { useState, useEffect, useContext } from "react"
import { Button } from "@/components/ui/button"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Check, ChevronsUpDown, ExternalLink } from "lucide-react"
import { cn } from "@/lib/utils"
import { SdkCtx } from "./sdk-context"

interface RelationSelectorProps {
  referencedTable: string
  value: string
  onChange: (value: string) => void
}

export function RelationSelector({ referencedTable, value, onChange }: RelationSelectorProps) {
  const [open, setOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedRecord, setSelectedRecord] = useState<any>(null)
  const sdk = useContext(SdkCtx)
  // const records = relatedTableData[referencedTable] || []
  const [paginated, setPaginated] = useState<any>(null)
  useEffect(()=>{(async ()=>{
    setPaginated(await sdk?.find({collection: referencedTable}) as any)
  })()}, [sdk, referencedTable])
  const records = paginated?.docs ?? []

  useEffect(() => {
    if (value) {
      const record = records.find((r) => r.id === value)
      setSelectedRecord(record)
    }
  }, [value, records])

  const filteredRecords = records.filter((record) => {
    const searchLower = searchQuery.toLowerCase()
    return Object.values(record).some((val) => String(val).toLowerCase().includes(searchLower))
  })

  const handleSelect = (record: any) => {
    onChange(record.id)
    setSelectedRecord(record)
    setOpen(false)
  }

  return (
    <div className="space-y-3">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className={cn("w-full justify-between", !value && "text-muted-foreground")}
          >
            {selectedRecord ? (
              <span className="truncate">{selectedRecord.name || selectedRecord.id}</span>
            ) : (
              `Select from ${referencedTable}...`
            )}
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[500px] p-0" align="start">
          <Command>
            <CommandInput
              placeholder={`Search ${referencedTable}...`}
              value={searchQuery}
              onValueChange={setSearchQuery}
            />
            <CommandList>
              <CommandEmpty>No records found.</CommandEmpty>
              <CommandGroup>
                {filteredRecords.map((record) => (
                  <CommandItem
                    key={record.id}
                    value={record.id.toString()}
                    onSelect={() => handleSelect(record)}
                    className="flex items-start gap-3 py-3"
                  >
                    <Check className={cn("mt-1 h-4 w-4 shrink-0", value === record.id ? "opacity-100" : "opacity-0")} />
                    <div className="flex-1 min-w-0">
                      <div className="font-medium">{record.name || `Record #${record.id}`}</div>
                      <div className="flex flex-wrap gap-2 mt-1">
                        {Object.entries(record)
                          .filter(([key]) => key !== "id" && key !== "name")
                          .slice(0, 3)
                          .map(([key, val]) => (
                            <span key={key} className="text-xs text-muted-foreground">
                              {key}: <span className="text-foreground font-medium">{String(val)}</span>
                            </span>
                          ))}
                      </div>
                    </div>
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>

      {/* Context card showing selected record details */}
      {selectedRecord && (
        <Card className="bg-muted/50">
          <CardHeader className="pb-3">
            <div className="flex items-start justify-between">
              <div>
                <CardTitle className="text-sm font-medium">
                  Selected: {selectedRecord.name || `#${selectedRecord.id}`}
                </CardTitle>
                <CardDescription className="text-xs">From {referencedTable} table</CardDescription>
              </div>
              <Button variant="ghost" size="sm" className="h-6 px-2 text-xs" title="View full record">
                <ExternalLink className="h-3 w-3" />
              </Button>
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="grid grid-cols-2 gap-2">
              {Object.entries(selectedRecord)
                .filter(([key]) => key !== "id")
                .map(([key, val]) => (
                  <div key={key} className="text-xs">
                    <span className="text-muted-foreground">{key.replace(/_/g, " ")}: </span>
                    <span className="font-medium">{String(val)}</span>
                  </div>
                ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
