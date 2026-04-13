"use client";

import { Button } from "@/components/ui/button";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error;
  reset: () => void;
}) {
  return (
    <html lang="en" className="dark">
      <body
        style={{ fontFamily: "'Courier Prime', monospace", fontWeight: 700 }}
      >
        <div className="flex min-h-screen flex-col items-center justify-center gap-6 bg-background px-4 text-center">
          {/* biome-ignore lint: since things went very wrong, let's just use img */}
          <img src="/images/sad.png" alt="Error" width={128} height={128} />
          <div className="flex flex-col gap-2">
            <h1 className="text-3xl font-bold text-foreground">
              Something went very wrong
            </h1>
            <p className="max-w-md text-muted-foreground">{error.message}</p>
          </div>
          <Button onClick={reset} variant="outline" size="lg">
            Try again
          </Button>
        </div>
      </body>
    </html>
  );
}
