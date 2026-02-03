"use client";
import { ArrowLeft } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { InsertRecordForm } from "@/components/insert-record-form";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import app_schema from "@/schema";
import { SdkCtx } from "@/components/sdk-context";
import { PayloadSDK } from "@payloadcms/sdk";

export default function InsertRecordPage() {
  const sdk = new PayloadSDK({
      'baseURL': '/api'
    })
  const params = useParams();
  const router = useRouter();
  const tableId = params.table as string;

  const schema = app_schema.find((e) => e.slug === tableId)!;

  if (!schema) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card>
          <CardHeader>
            <CardTitle>Table not found</CardTitle>
            <CardDescription>
              The table "{tableId}" does not exist.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={() => router.push("/")}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to tables
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-border bg-card">
        <div className="flex items-center gap-3 px-6 py-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => router.push("/")}
            title="Back to table"
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div className="flex-1">
            <h1 className="text-lg font-semibold">
              Add new record to {schema.name}
            </h1>
            <p className="text-sm text-muted-foreground">
              {schema.description}
            </p>
          </div>
        </div>
      </div>

      {/* Main content */}
      <main className="p-6 max-w-4xl mx-auto">
        <SdkCtx value={sdk}>
        <InsertRecordForm
          schema={schema}
          onCancel={() => router.push("/")}
        />
        </SdkCtx>
      </main>
    </div>
  );
}
