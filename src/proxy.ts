import { betterFetch } from "@better-fetch/fetch";
import { NextResponse, type NextRequest } from "next/server";

type Session = {
  user: {
    id: string;
    email: string;
    name: string;
    designation: string;
    buccDepartment: string;
  };
  session: {
    id: string;
    userId: string;
    expiresAt: Date;
  };
};

export async function proxy(request: NextRequest) {
  const { data: session } = await betterFetch<Session>("/api/auth/get-session", {
    baseURL: request.nextUrl.origin,
    headers: {
      cookie: request.headers.get("cookie") || "",
    },
  });

  const { pathname } = request.nextUrl;
  const isProtected = pathname.startsWith("/dashboard");

  if (!session && isProtected) {
    return NextResponse.redirect(new URL("/login", request.nextUrl.origin));
  }

  if (session && pathname === "/login") {
    return NextResponse.redirect(new URL("/dashboard", request.nextUrl.origin));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/login"],
};
