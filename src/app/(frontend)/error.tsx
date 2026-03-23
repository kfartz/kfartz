"use client";

import sad from "@public/images/sad.png";
import Image from "next/image";
import { Button } from "@/components/ui/button";

export default function RootError({
  error,
  reset,
}: {
  error: Error;
  reset: () => void;
}) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-6 bg-background px-4 text-center">
      <Image src={sad} alt="Error" width={128} height={128} />
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold text-foreground">
          Something went wrong
        </h1>
        <p className="max-w-md text-muted-foreground">{error.message}</p>
      </div>
      <Button onClick={reset} variant="outline" size="lg">
        Try again
      </Button>
    </div>
  );
}
