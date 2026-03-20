import { type NextRequest, NextResponse, type ProxyConfig } from "next/server";

import { payload } from "./utils/table";

export async function proxy(request: NextRequest) {
  const { user } = await payload.auth({
    headers: request.headers,
  });
  const loginUrl = new URL("/login", request.url);
  if (!user && request.url !== loginUrl.toString()) {
    return NextResponse.redirect(loginUrl);
  } else if (user && request.url === loginUrl.toString()) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  return NextResponse.next();
}

export const config: ProxyConfig = {
  matcher: [
    {
      source: "/((?!public/|_next/|api/|favicon.png|admin/).*)",
    },
  ],
};
