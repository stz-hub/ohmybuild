/**
 * Middleware Next.js — protège `/mes-configs` en redirigeant les visiteurs
 * non connectés vers `/login`. Les routes API gèrent leur auth eux-mêmes.
 */
import { NextResponse } from "next/server";

import { auth } from "@/auth";

export default auth((req) => {
  const isAuthed = !!req.auth?.user;
  const path = req.nextUrl.pathname;

  if (!isAuthed && path.startsWith("/mes-configs")) {
    const url = new URL("/login", req.nextUrl.origin);
    url.searchParams.set("callbackUrl", req.nextUrl.pathname);
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
});

export const config = {
  // Limite le middleware aux routes app, exclut assets et API.
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|.*\\..*).*)"],
};
