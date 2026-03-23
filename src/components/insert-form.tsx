"use client";

import { useForm } from "@tanstack/react-form";
import { Minus, Plus, Upload } from "lucide-react";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
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
import { sdk } from "@/utils/payload-sdk";
import { cifValueForKey } from "@/utils/utils";
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

type FormValues = Record<string, unknown>;

export default function InsertForm({ tableSlug, fields }: InsertFormProps) {
  const router = useRouter();

  const [showErrorDialog, setShowErrorDialog] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const form = useForm({
    defaultValues: {},
    onSubmit: async ({ value }) => {
      try {
        await sdk.create({
          collection: tableSlug,
          data: value as Record<string, unknown>,
        });
        router.push(`/${tableSlug}`);
        // window.location.href = `/${tableSlug}`;
      } catch (error) {
        const message =
          error instanceof Error ? error.message : JSON.stringify(error);
        setErrorMessage(message);
        setShowErrorDialog(true);
      }
    },
  });

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
            const isEmpty =
              value === undefined || value === null || value === "";

            if (field.required && isEmpty && field.type !== "checkbox") {
              return "This field is required";
            }

            const allValues = form.state.values;
            if (isConditionallyRequired(field.name, allValues) && isEmpty) {
              return "Required for non-ambient experiments";
            }

            return undefined;
          },
        }}
        mode={field.type === "array" ? "array" : "value"}
      >
        {field.type !== "array"
          ? (fieldApi) => {
              const { state, handleChange, handleBlur } = fieldApi;
              const value = state.value;

              return (
                <div className="space-y-2">
                  <Label
                    htmlFor={fieldName}
                    className={
                      state.meta.errors.length ? "text-destructive" : ""
                    }
                  >
                    {field.name}
                    {field.required && field.type !== "checkbox" && (
                      <span className="text-destructive"> *</span>
                    )}
                  </Label>

                  {field.type === "relationship" && field.relationTo ? (
                    <PayloadRelationshipInput
                      relationTo={field.relationTo}
                      value={value as number | null}
                      onChange={(val) => handleChange(val)}
                    />
                  ) : field.type === "select" && field.options ? (
                    <Select
                      value={value as string}
                      onValueChange={handleChange}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select..." />
                      </SelectTrigger>
                      <SelectContent>
                        {field.options.map((opt) => {
                          const optVal =
                            typeof opt === "string" ? opt : opt.value;
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
                    <Checkbox
                      id={fieldName}
                      checked={!!value}
                      onCheckedChange={(checked) => handleChange(checked)}
                    />
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
                          ? new Date(value as string)
                              .toISOString()
                              .split("T")[0]
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
            }
          : (fieldApi) => {
              return (
                <div className="flex flex-col gap-2">
                  <div className="flex gap-2">
                    <Label
                      htmlFor={fieldName}
                      className={
                        fieldApi.state.meta.errors.length
                          ? "text-destructive"
                          : ""
                      }
                    >
                      {fieldApi.name}
                      {field.required && (
                        <span className="text-destructive"> *</span>
                      )}
                    </Label>
                    <Button
                      type="button"
                      onClick={() =>
                        fieldApi.pushValue({ refinement: null } as never)
                      }
                      className="p-0 self-center w-5 h-5"
                      size="sm"
                    >
                      <Plus size="xs" />
                    </Button>
                  </div>
                  {(fieldApi.state.value as unknown[])?.map((_, i) => {
                    const subfieldName = field.fields?.[0]?.name;
                    const relationTo = field.fields?.[0]?.relationTo;
                    if (!subfieldName || !relationTo) return null;
                    return (
                      <form.Field
                        key={`${fieldApi.name}-${i}`}
                        name={`${fieldApi.name}[${i}].${subfieldName}`}
                      >
                        {(subfield) => {
                          return (
                            <div className="flex gap-2">
                              <PayloadRelationshipInput
                                relationTo={relationTo}
                                value={subfield.state.value as number | null}
                                onChange={subfield.handleChange}
                                className="flex-1"
                              />
                              <Button
                                type="button"
                                onClick={() => fieldApi.removeValue(i)}
                              >
                                <Minus size="lg" className="stroke-3" />
                              </Button>
                            </div>
                          );
                        }}
                      </form.Field>
                    );
                  })}
                  {fieldApi.state.meta.errors.length > 0 && (
                    <p className="text-sm text-destructive">
                      {fieldApi.state.meta.errors.join(", ")}
                    </p>
                  )}
                </div>
              );
            }}
      </form.Field>
    );
  };

  const cifInputRef = useRef<HTMLInputElement>(null);

  const handleCifUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const text = await file.text();

    fields.forEach((field) => {
      const cifValue = cifValueForKey(text, field.name);
      if (cifValue !== null) {
        if (
          field.type === "group" &&
          field.fields?.some((f) => f.name === "measurement")
        ) {
          if (typeof cifValue === "object" && "value" in cifValue) {
            form.setFieldValue(`${field.name}.measurement`, cifValue.value);
            if (cifValue.uncertainty !== undefined) {
              form.setFieldValue(
                `${field.name}.uncertainty`,
                cifValue.uncertainty,
              );
            }
          } else {
            form.setFieldValue(`${field.name}.measurement`, Number(cifValue));
          }
        } else {
          if (typeof cifValue === "object" && "value" in cifValue) {
            form.setFieldValue(field.name, cifValue.value);
          } else {
            form.setFieldValue(field.name, cifValue);
          }
        }
      }
    });

    if (cifInputRef.current) {
      cifInputRef.current.value = "";
    }
  };

  return (
    <>
      <div className="mb-6 flex justify-end">
        <input
          type="file"
          accept=".cif"
          className="hidden"
          ref={cifInputRef}
          onChange={handleCifUpload}
        />
        <Button type="button" onClick={() => cifInputRef.current?.click()}>
          <Upload className="mr-2 h-4 w-4" />
          Load from CIF
        </Button>
      </div>

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

      <AlertDialog open={showErrorDialog} onOpenChange={setShowErrorDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Error</AlertDialogTitle>
            <AlertDialogDescription>{errorMessage}</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction onClick={() => setShowErrorDialog(false)}>
              Close
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
