"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Check, ChevronsUpDown, ExternalLink } from "lucide-react"
import { cn } from "@/lib/utils"

// Mock data for related tables
const relatedTableData: Record<string, any[]> = {
  roles: [
    { id: "1", name: "Administrator", description: "Full system access", permissions: 15 },
    { id: "2", name: "Manager", description: "Team management access", permissions: 10 },
    { id: "3", name: "Developer", description: "Development access", permissions: 8 },
    { id: "4", name: "Viewer", description: "Read-only access", permissions: 3 },
  ],
  departments: [
    { id: "1", name: "Engineering", location: "Building A", employees: 45 },
    { id: "2", name: "Marketing", location: "Building B", employees: 20 },
    { id: "3", name: "Sales", location: "Building C", employees: 30 },
    { id: "4", name: "Support", location: "Building A", employees: 15 },
  ],
  users: [
    { id: "1", name: "John Doe", email: "john@example.com", role: "Administrator" },
    { id: "2", name: "Jane Smith", email: "jane@example.com", role: "Manager" },
    { id: "3", name: "Bob Johnson", email: "bob@example.com", role: "Developer" },
    { id: "4", name: "Alice Williams", email: "alice@example.com", role: "Developer" },
  ],
  categories: [
    { id: "1", name: "Electronics", products: 120, status: "Active" },
    { id: "2", name: "Clothing", products: 350, status: "Active" },
    { id: "3", name: "Books", products: 890, status: "Active" },
    { id: "4", name: "Home & Garden", products: 200, status: "Active" },
  ],
  suppliers: [
    { id: "1", name: "TechCorp Inc", country: "USA", rating: 4.8 },
    { id: "2", name: "Global Supplies Ltd", country: "UK", rating: 4.5 },
    { id: "3", name: "FastShip Co", country: "China", rating: 4.2 },
  ],
  products: [
    { id: "1", name: "Wireless Mouse", category: "Electronics", price: "$29.99", stock: 150 },
    { id: "2", name: "USB-C Cable", category: "Electronics", price: "$12.99", stock: 500 },
    { id: "3", name: "Desk Lamp", category: "Home & Garden", price: "$45.99", stock: 80 },
  ],
  statuses: [
    { id: "1", name: "Pending", color: "yellow", description: "Awaiting processing" },
    { id: "2", name: "Processing", color: "blue", description: "Order is being prepared" },
    { id: "3", name: "Shipped", color: "purple", description: "Order has been shipped" },
    { id: "4", name: "Delivered", color: "green", description: "Order delivered successfully" },
    { id: "5", name: "Cancelled", color: "red", description: "Order was cancelled" },
  ],
}

interface RelationSelectorProps {
  fieldName: string
  referencedTable: string
  value: string
  onChange: (value: string) => void
  required?: boolean
}

export function RelationSelector({ fieldName, referencedTable, value, onChange, required }: RelationSelectorProps) {
  const [open, setOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedRecord, setSelectedRecord] = useState<any>(null)

  const records = relatedTableData[referencedTable] || []

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
                    value={record.id}
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
