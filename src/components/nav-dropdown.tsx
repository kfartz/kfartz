"use client";
import { Loader2, User as UserIcon } from "lucide-react";
import type { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { User } from "@/payload-types";

async function logout(router: AppRouterInstance) {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_PAYLOAD_URL || ""}/api/users/logout`,
    {
      method: "POST",
      credentials: "include",
    },
  );

  if (!res.ok) throw new Error(`Logout failed with status ${res.status}`);
  router.replace("/login");
}

export default function NavDropdown({ user }: { user: User }) {
  const router = useRouter();
  const pathname = usePathname();

  const [isLoggingOut, setisLoggingOut] = useState(false);
  const [error, setError] = useState("");
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "i") {
        // Move to insert
        e.preventDefault();
        router.push(`${pathname}/insert`);
      } else if ((e.metaKey || e.ctrlKey) && e.key === "l") {
        // Logout
        e.preventDefault();
        setisLoggingOut(true);
        logout(router).catch((e: Error) => setError(e.message));
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [router, pathname]);

  if (error) throw Error(error);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline">
          {isLoggingOut ? (
            <div>
              <Loader2 />
            </div>
          ) : (
            <>
              <span className="font-bold">
                <UserIcon />
              </span>
              {user.email.split("@")[0]}
            </>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-40" align="start">
        <DropdownMenuGroup>
          <DropdownMenuItem
            onClick={() => {
              const event = new KeyboardEvent("keydown", {
                key: "k",
                ctrlKey: true,
                bubbles: true,
                cancelable: true,
              });

              document.dispatchEvent(event);
            }}
          >
            <span> Switch Tables</span>
            <DropdownMenuShortcut>⌘+K</DropdownMenuShortcut>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onClick={() => {
              router.push(`${pathname}/insert`);
            }}
          >
            <span> Insert</span>
            <DropdownMenuShortcut>⌘+I</DropdownMenuShortcut>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onClick={() => {
              // Logout
              setisLoggingOut(true);

              logout(router).catch((e: Error) => setError(e.message));
            }}
          >
            <span> Log out</span>
            <DropdownMenuShortcut>⌘+L</DropdownMenuShortcut>
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
