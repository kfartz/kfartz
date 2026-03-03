/**
 * Pure decision logic for the auth proxy middleware.
 * Returns the action to take based on user auth state and request URL.
 */
export type ProxyDecision =
  | { action: "redirect"; url: string }
  | { action: "next" };

export function getProxyDecision(
  user: unknown,
  requestUrl: string,
): ProxyDecision {
  const loginUrl = new URL("/login", requestUrl);
  if (!user && requestUrl !== loginUrl.toString()) {
    return { action: "redirect", url: loginUrl.toString() };
  }
  if (user && requestUrl === loginUrl.toString()) {
    return { action: "redirect", url: new URL("/", requestUrl).toString() };
  }
  return { action: "next" };
}
