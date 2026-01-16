"use client"
import { useParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft } from "lucide-react"
import { InsertRecordForm } from "@/components/insert-record-form"

// Mock tables data with schema information
const tableSchemas = {
  users: {
    name: "Users",
    description: "User accounts and profiles",
    fields: [
      { name: "name", type: "text", required: true },
      { name: "email", type: "email", required: true },
      { name: "role_id", type: "reference", required: true, references: "roles" },
      { name: "department_id", type: "reference", required: false, references: "departments" },
      { name: "manager_id", type: "reference", required: false, references: "users" },
    ],
  },
  products: {
    name: "Products",
    description: "Product catalog and inventory",
    fields: [
      { name: "name", type: "text", required: true },
      { name: "description", type: "textarea", required: false },
      { name: "category_id", type: "reference", required: true, references: "categories" },
      { name: "supplier_id", type: "reference", required: true, references: "suppliers" },
      { name: "price", type: "number", required: true },
      { name: "stock", type: "number", required: true },
    ],
  },
  orders: {
    name: "Orders",
    description: "Customer orders and transactions",
    fields: [
      { name: "order_number", type: "text", required: true },
      { name: "user_id", type: "reference", required: true, references: "users" },
      { name: "product_id", type: "reference", required: true, references: "products" },
      { name: "quantity", type: "number", required: true },
      { name: "status_id", type: "reference", required: true, references: "statuses" },
      { name: "notes", type: "textarea", required: false },
    ],
  },
  analytics: {
    name: "Analytics",
    description: "Usage statistics and metrics",
    fields: [
      { name: "user_id", type: "reference", required: true, references: "users" },
      { name: "event_type", type: "text", required: true },
      { name: "metric_value", type: "number", required: true },
      { name: "timestamp", type: "datetime", required: true },
    ],
  },
  settings: {
    name: "Settings",
    description: "Application configuration",
    fields: [
      { name: "key", type: "text", required: true },
      { name: "value", type: "text", required: true },
      { name: "category", type: "text", required: false },
    ],
  },
}

export default function InsertRecordPage() {
  const params = useParams()
  const router = useRouter()
  const tableId = params.table as string

  const schema = tableSchemas[tableId as keyof typeof tableSchemas]

  if (!schema) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card>
          <CardHeader>
            <CardTitle>Table not found</CardTitle>
            <CardDescription>The table "{tableId}" does not exist.</CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={() => router.push("/")}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to tables
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-border bg-card">
        <div className="flex items-center gap-3 px-6 py-4">
          <Button variant="ghost" size="icon" onClick={() => router.push("/")} title="Back to table">
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div className="flex-1">
            <h1 className="text-lg font-semibold">Add new record to {schema.name}</h1>
            <p className="text-sm text-muted-foreground">{schema.description}</p>
          </div>
        </div>
      </div>

      {/* Main content */}
      <main className="p-6 max-w-4xl mx-auto">
        <InsertRecordForm schema={schema} tableId={tableId} onCancel={() => router.push("/")} />
      </main>
    </div>
  )
}
