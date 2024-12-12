import { ELanguage } from "@/models/language.model";
import { ESegment } from "@/models/url.model";
import { NextAuthConfig } from "next-auth";

export const authConfig = {
  pages: {
    signIn: `/${ELanguage.EN}/${ESegment.LOGIN}`,
    newUser: `/${ELanguage.EN}`,
  },
  providers: [
    // added later in auth.ts since it requires bcrypt which is only compatible with Node.js
    // while this file is also used in non-Node.js environments
  ],
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;

      const langPattern = Object.values(ELanguage).join("|");

      const isOnProtectedRoute = new RegExp(
        `/(${langPattern})/${ESegment.MASTER}(/|$)`,
      ).test(nextUrl.pathname);

      const isOnLoginRoute = new RegExp(
        `/(${langPattern})/${ESegment.LOGIN}(/|$)`,
      ).test(nextUrl.pathname);

      const isOnRegisterRoute = new RegExp(
        `/(${langPattern})/${ESegment.REGISTER}(/|$)`,
      ).test(nextUrl.pathname);

      // const isOnRegister = nextUrl.pathname.startsWith("/register");
      // const isOnLogin = nextUrl.pathname.startsWith("/login");

      if (isLoggedIn && (isOnLoginRoute || isOnRegisterRoute)) {
        return Response.redirect(new URL(`/${ELanguage.EN}`, nextUrl));
      }

      if (isOnRegisterRoute || isOnLoginRoute) {
        return true; // Always allow access to register and login pages
      }

      if (isOnProtectedRoute) {
        return isLoggedIn ? true : false; // Redirect unauthenticated users to login page
      }

      if (isLoggedIn) {
        return Response.redirect(new URL(`/${ELanguage.EN}`, nextUrl));
      }

      return true;
    },
  },
} satisfies NextAuthConfig;
