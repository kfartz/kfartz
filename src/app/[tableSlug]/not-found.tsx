import sad from "@public/images/sad.png";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function TableNotFound() {
  return (
    <div className="flex min-h-[calc(100vh-82px)] flex-col items-center justify-center gap-6 px-4 text-center">
      <Image src={sad} alt="Not found" width={128} height={128} />
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold text-foreground">Page not found</h1>
        <p className="max-w-md text-muted-foreground">
          This table doesn&apos;t exist or may have been removed.
        </p>
      </div>
      <Button asChild variant="outline" size="lg">
        <Link href="/">Back to tables</Link>
      </Button>
    </div>
  );
}
