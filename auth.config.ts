import type { NextAuthConfig } from 'next-auth';

export const authConfig = {
  pages: {
    signIn: '/login',
    error:'/auth/error',
  },
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      // console.log("Auth config is hit!")
      const isLoggedIn = auth?.user;
      // console.log(isLoggedIn)
      // const isPosts = nextUrl.pathname.startsWith('/posts');
      const protectedRoutes = ['/posts', '/profile','/settings']
      const isProtected = protectedRoutes.some((route) =>
        nextUrl.pathname.startsWith(route))
      const publicRoutes = ['/', '/about', '/news'];
      if (publicRoutes.includes(nextUrl.pathname)) return true;
      if (isProtected) {
        if (isLoggedIn) return true;
        return false;
      } else if (isLoggedIn) {
        return Response.redirect(new URL('/posts', nextUrl));
      }
      return true;

    },
  },
  providers: [],
} satisfies NextAuthConfig;