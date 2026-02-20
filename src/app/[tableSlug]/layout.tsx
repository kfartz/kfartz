import { headers } from "next/headers";
import NavDropdown from "@/components/nav-dropdown";
import type { User } from "@/payload-types";
import { payload, tableSlugs } from "@/utils/table";
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
  const { user } = await payload.auth({ headers: await headers() });
  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card">
        <div className="flex items-center gap-3 px-6 py-4 justify-between">
          <span>
            <span className="text-muted-foreground ">Table: </span>
            <span className="font-medium">{tableSlug}</span>
          </span>
          <NavDropdown user={user as User} />
        </div>
      </header>
      {/* Main content area */}
      {children}
    </div>
  );
}
