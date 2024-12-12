import NextAuth from "next-auth";

import { authConfig } from "@/app/[lang]/(auth)/auth.config";

export default NextAuth(authConfig).auth;

export const config = {
  matcher: [
    "/:lang/master(/.*)?",
    "/:lang/login(/.*)?",
    "/:lang/register(/.*)?",
  ],
};
// matcher: ["/", "/:id", "/api/:path*", "/login", "/register"],
