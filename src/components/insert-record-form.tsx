"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { RelationSelector } from "@/components/relation-selector"
import { Save, X } from "lucide-react"
import { useRouter } from "next/navigation"

interface Field {
  name: string
  type: string
  required: boolean
  references?: string
}

interface Schema {
  name: string
  description: string
  fields: Field[]
}

interface InsertRecordFormProps {
  schema: Schema
  tableId: string
  onCancel: () => void
}

export function InsertRecordForm({ schema, tableId, onCancel }: InsertRecordFormProps) {
  const router = useRouter()
  const [formData, setFormData] = useState<Record<string, any>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleFieldChange = (fieldName: string, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [fieldName]: value,
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))

    console.log("[v0] Submitting record:", formData)

    setIsSubmitting(false)
    router.push("/")
  }

  const renderField = (field: Field) => {
    const fieldId = `field-${field.name}`
    const value = formData[field.name] || ""

    switch (field.type) {
      case "reference":
        return (
          <div key={field.name} className="space-y-2">
            <Label htmlFor={fieldId}>
              {field.name.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase())}
              {field.required && <span className="text-destructive ml-1">*</span>}
            </Label>
            <RelationSelector
              fieldName={field.name}
              referencedTable={field.references!}
              value={value}
              onChange={(val) => handleFieldChange(field.name, val)}
              required={field.required}
            />
            <p className="text-xs text-muted-foreground">References: {field.references}</p>
          </div>
        )

      case "textarea":
        return (
          <div key={field.name} className="space-y-2">
            <Label htmlFor={fieldId}>
              {field.name.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase())}
              {field.required && <span className="text-destructive ml-1">*</span>}
            </Label>
            <Textarea
              id={fieldId}
              value={value}
              onChange={(e) => handleFieldChange(field.name, e.target.value)}
              required={field.required}
              placeholder={`Enter ${field.name.replace(/_/g, " ")}`}
              rows={4}
            />
          </div>
        )

      case "number":
        return (
          <div key={field.name} className="space-y-2">
            <Label htmlFor={fieldId}>
              {field.name.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase())}
              {field.required && <span className="text-destructive ml-1">*</span>}
            </Label>
            <Input
              id={fieldId}
              type="number"
              value={value}
              onChange={(e) => handleFieldChange(field.name, e.target.value)}
              required={field.required}
              placeholder={`Enter ${field.name.replace(/_/g, " ")}`}
            />
          </div>
        )

      case "datetime":
        return (
          <div key={field.name} className="space-y-2">
            <Label htmlFor={fieldId}>
              {field.name.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase())}
              {field.required && <span className="text-destructive ml-1">*</span>}
            </Label>
            <Input
              id={fieldId}
              type="datetime-local"
              value={value}
              onChange={(e) => handleFieldChange(field.name, e.target.value)}
              required={field.required}
            />
          </div>
        )

      default: // text, email, etc.
        return (
          <div key={field.name} className="space-y-2">
            <Label htmlFor={fieldId}>
              {field.name.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase())}
              {field.required && <span className="text-destructive ml-1">*</span>}
            </Label>
            <Input
              id={fieldId}
              type={field.type}
              value={value}
              onChange={(e) => handleFieldChange(field.name, e.target.value)}
              required={field.required}
              placeholder={`Enter ${field.name.replace(/_/g, " ")}`}
            />
          </div>
        )
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <Card>
        <CardHeader>
          <CardTitle>Record Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">{schema.fields.map((field) => renderField(field))}</CardContent>
        <CardFooter className="flex justify-end gap-3 border-t pt-6">
          <Button type="button" variant="outline" onClick={onCancel} disabled={isSubmitting}>
            <X className="mr-2 h-4 w-4" />
            Cancel
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            <Save className="mr-2 h-4 w-4" />
            {isSubmitting ? "Saving..." : "Save Record"}
          </Button>
        </CardFooter>
      </Card>
    </form>
  )
}
