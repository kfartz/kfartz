import { type NextRequest, NextResponse, type ProxyConfig } from "next/server";
import { getProxyDecision } from "./utils/proxy-logic";
import { payload } from "./utils/table";

export async function proxy(request: NextRequest) {
  const { user } = await payload.auth({
    headers: request.headers,
  });
  const decision = getProxyDecision(user, request.url);
  if (decision.action === "redirect") {
    return NextResponse.redirect(decision.url);
  }
  return NextResponse.next();
}

export const config: ProxyConfig = {
  matcher: [
    {
      source: "/((?!public|_next|api|favicon.png|admin).*)",
    },
  ],
};
