import type { NextAuthConfig } from 'next-auth';
 
export const authConfig = {
  pages: {
    signIn: '/login',
  },
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      console.log("Auth config is hit!")
      const isLoggedIn = auth?.user;
      console.log(isLoggedIn)
      const isPosts = nextUrl.pathname.startsWith('/posts');

      if (isPosts) {
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