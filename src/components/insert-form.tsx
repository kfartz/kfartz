"use client";

import { useForm } from "@tanstack/react-form";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import type { TTableSlug } from "@/types";
import { PayloadRelationshipInput } from "./payload-relationship-input";

export type SerializedField = {
  name: string;
  type: string;
  required?: boolean;
  options?: (string | { label: string; value: string })[];
  relationTo?: string;
  fields?: SerializedField[];
  min?: number;
  max?: number;
};

interface InsertFormProps {
  tableSlug: TTableSlug;
  fields: SerializedField[];
}

// Define the shape of the form state for safer access
type FormValues = Record<string, unknown>;

export default function InsertForm({ tableSlug, fields }: InsertFormProps) {
  const handleBack = (e: Event) => {
    if (confirm("Discard changes?")) {
      window.removeEventListener("beforeunload", handleBack);
    }
    e.preventDefault();
    e.stopPropagation();
  };

  useEffect(() => {
    window.addEventListener("beforeunload", handleBack);
  });

  const form = useForm({
    defaultValues: {},
    onSubmit: async ({ value }) => {
      console.log("Submitting:", value);
      try {
        const res = await fetch(`/api/${tableSlug}`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(value),
        });
        if (!res.ok) {
          const err = await res.json();
          alert(`Error: ${JSON.stringify(err.errors || err)}`);
        } else {
          alert("Successfully created!");
          window.removeEventListener("beforeunload", handleBack);
          window.location.reload();
        }
      } catch (e) {
        console.error(e);
      }
    },
  });

  const [queryClient] = useState(() => new QueryClient());

  // Helper to determine if a field is conditionally required
  const isConditionallyRequired = (fieldName: string, values: FormValues) => {
    if (tableSlug !== "measurements") return false;

    const conditionalFields = [
      "pressure",
      "pressure_measurement_location",
      "chamber_type",
      "opening_angle",
      "pressure_medium",
    ];

    if (conditionalFields.includes(fieldName)) {
      return values.experiment_type === "non-ambient";
    }
    return false;
  };

  const renderField = (field: SerializedField, parentPath: string = "") => {
    const fieldName = parentPath ? `${parentPath}.${field.name}` : field.name;

    if (field.type === "group" && field.fields) {
      return (
        <div key={fieldName} className="border p-4 rounded-md space-y-4 my-4">
          <h3 className="font-semibold text-sm uppercase text-muted-foreground mb-2">
            {field.name}
          </h3>
          <div className="grid gap-4 pl-2">
            {field.fields.map((subField) => renderField(subField, fieldName))}
          </div>
        </div>
      );
    }

    if (["ui", "hidden"].includes(field.type)) return null;

    return (
      <form.Field
        key={fieldName}
        name={fieldName}
        validators={{
          onChange: ({ value }) => {
            // value is unknown here, so strictly check against null/undefined/empty string
            const isEmpty =
              value === undefined || value === null || value === "";

            if (field.required && isEmpty && field.type !== "checkbox") {
              return "This field is required";
            }

            // Access root form state
            const allValues = form.state.values;
            if (isConditionallyRequired(field.name, allValues) && isEmpty) {
              return `Required for non-ambient experiments`;
            }

            return undefined;
          },
        }}
        // biome-ignore lint:biome is dumb
        children={(fieldApi) => {
          const { state, handleChange, handleBlur } = fieldApi;
          const value = state.value;

          return (
            <div className="space-y-2">
              <Label
                htmlFor={fieldName}
                className={state.meta.errors.length ? "text-destructive" : ""}
              >
                {field.name}
                {field.required && <span className="text-destructive"> *</span>}
              </Label>

              {field.type === "relationship" && field.relationTo ? (
                <PayloadRelationshipInput
                  relationTo={field.relationTo}
                  value={value as string}
                  onChange={(val) => handleChange(val)}
                />
              ) : field.type === "select" && field.options ? (
                <Select value={value as string} onValueChange={handleChange}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select..." />
                  </SelectTrigger>
                  <SelectContent>
                    {field.options.map((opt) => {
                      const optVal = typeof opt === "string" ? opt : opt.value;
                      const optLabel =
                        typeof opt === "string" ? opt : opt.label;
                      return (
                        <SelectItem key={optVal} value={optVal}>
                          {optLabel}
                        </SelectItem>
                      );
                    })}
                  </SelectContent>
                </Select>
              ) : field.type === "textarea" ? (
                <Textarea
                  id={fieldName}
                  value={(value as string) || ""}
                  onChange={(e) => handleChange(e.target.value)}
                  onBlur={handleBlur}
                />
              ) : field.type === "checkbox" ? (
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id={fieldName}
                    checked={!!value}
                    onCheckedChange={(checked) => handleChange(checked)}
                  />
                  <span className="text-sm text-muted-foreground">
                    {field.name}
                  </span>
                </div>
              ) : field.type === "number" ? (
                <Input
                  id={fieldName}
                  type="number"
                  value={
                    value === undefined || value === null
                      ? ""
                      : (value as number)
                  }
                  onChange={(e) => handleChange(e.target.valueAsNumber)}
                  onBlur={handleBlur}
                  min={field.min}
                  max={field.max}
                />
              ) : field.type === "date" ? (
                <Input
                  id={fieldName}
                  type="date"
                  value={
                    value
                      ? new Date(value as string).toISOString().split("T")[0]
                      : ""
                  }
                  onChange={(e) => handleChange(e.target.value)}
                  onBlur={handleBlur}
                />
              ) : (
                <Input
                  id={fieldName}
                  value={(value as string) || ""}
                  onChange={(e) => handleChange(e.target.value)}
                  onBlur={handleBlur}
                />
              )}

              {state.meta.errors.length > 0 && (
                <p className="text-sm text-destructive">
                  {state.meta.errors.join(", ")}
                </p>
              )}
            </div>
          );
        }}
      />
    );
  };

  return (
    <QueryClientProvider client={queryClient}>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          e.stopPropagation();
          form.handleSubmit();
        }}
        className="space-y-6"
      >
        {fields.map((f) => renderField(f))}

        <div className="pt-6">
          <Button type="submit" className="w-full">
            Insert Record
          </Button>
        </div>
      </form>
    </QueryClientProvider>
  );
}
