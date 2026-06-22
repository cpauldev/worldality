/**
 * Next.js Proxy - Locale Routing
 *
 * Handles locale extraction from URLs and request rewriting.
 */
import { NextRequest, NextResponse } from "next/server";

export async function proxy(request: NextRequest) {
  // Handle locale routing with Worldality utility (one function call)
  const { handleLocaleMiddleware } = await import("worldality/server/nextjs");
  const { cleanPathname, hasLocale, headers } =
    await handleLocaleMiddleware(request);

  if (hasLocale) {
    // Locale detected - rewrite to clean URL with locale headers injected
    return NextResponse.rewrite(new URL(cleanPathname, request.url), {
      request: { headers },
    });
  }

  // No locale detected - continue normally
  return NextResponse.next({ request: { headers } });
}

export const config = {
  matcher: [
    /*
     * Match all paths except:
     * - _next/static (static files)
     * - _next/image (image optimization)
     * - favicon.ico, favicon.svg
     * - fonts
     * - worldality (translation bundles)
     */
    "/((?!_next/static|_next/image|favicon.ico|favicon.svg|fonts|worldality).*)",
  ],
};
