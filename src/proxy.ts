import { type NextRequest, NextResponse, type ProxyConfig } from "next/server";

import { payload } from "./utils/table";

export async function proxy(request: NextRequest) {
  const { user } = await payload.auth({
    headers: request.headers,
  });
  console.log(user);
  if (!user) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  return NextResponse.next();
}

export const config: ProxyConfig = {
  matcher: [
    {
      source: "/((?!login|public|_next|api).*)",
    },
  ],
};
