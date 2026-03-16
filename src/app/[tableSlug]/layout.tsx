import Image from "next/image";
import NavDropdown from "@/components/nav-dropdown";
import { tableSlugs } from "@/utils/table";
export type ParamsT = {
  tableSlug: string;
};

export async function generateStaticParams(): Promise<ParamsT[]> {
  return tableSlugs.map((col) => ({
    tableSlug: col,
  }));
}

export default async function TableLayout({
  params,
  children,
}: {
  params: Promise<ParamsT>;
  children: React.ReactNode;
}) {
  const { tableSlug } = await params;
  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card">
        <div className="flex items-center gap-3 px-6 py-4 justify-between">
          <a href={`/${tableSlug}`}>
            <Image
              src="/favicon.png"
              alt="Logo"
              width={50}
              height={50}
              className="object-cover"
              priority
            />
          </a>
          <span>
            <span className="text-muted-foreground ">Table: </span>
            <span className="font-medium">{tableSlug}</span>
          </span>
          <NavDropdown />
        </div>
      </header>
      {/* Main content area */}
      {children}
    </div>
  );
}
