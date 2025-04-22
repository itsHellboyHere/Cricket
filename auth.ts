import NextAuth from 'next-auth';
import GitHub from 'next-auth/providers/github';
import Google from 'next-auth/providers/google';
import Credentials from 'next-auth/providers/credentials';
import { authConfig } from './auth.config';
import { z } from 'zod';
import bcrypt from 'bcryptjs';
import { prisma } from './app/lib/db';
import { User as PrismaUser, Account as PrismaAccount } from "@prisma/client";
import { PrismaAdapter } from "@auth/prisma-adapter";

// Required for GitHub OAuth to work
export const { handlers, auth, signIn, signOut  } = NextAuth({
  ...authConfig,
  adapter: PrismaAdapter(prisma),
  providers: [
      Google({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      authorization: {
        params: {
          // prompt: "consent",
          // access_type: "offline",
          response_type: "code",
          redirect_uri: `${process.env.NEXTAUTH_URL}/api/auth/callback/google`,
        },
      },
    }),
    GitHub({
      clientId: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
      authorization: {
      params: {
          redirect_uri: `${process.env.NEXTAUTH_URL}/api/auth/callback/github`,
        },
      },
    }),
    Credentials({
      async authorize(credentials) {
        const parsed = z.object({
          email: z.string().email(),
          password: z.string().min(6)
        }).safeParse(credentials);

        if (!parsed.success) return null;

        const user = await prisma.user.findUnique({
          where: { email: parsed.data.email }
        });

        if (!user?.password) return null;

        const isValid = await bcrypt.compare(parsed.data.password, user.password);
        return isValid ? user : null;
      },
    }),
  ],
  session: { strategy: "jwt" },
  secret: process.env.NEXTAUTH_SECRET,
   callbacks: {
   async signIn({ user, account }) {
    if (account?.provider !== 'credentials') {
      const email = user.email;
      if (email) {
        const existingUser = await prisma.user.findUnique({
          where: { email },
          include: { accounts: true }
        }) as PrismaUser & { accounts: PrismaAccount[] };

        // Check if user exists with different provider
        if (existingUser?.accounts?.some(acc => acc.provider !== account?.provider)) {
          return `/auth/error?error=OAuthAccountNotLinked`;
        }

        // Only proceed with username generation if user exists
        if (existingUser && !existingUser.username) {
          let baseUsername = email.split('@')[0].replace(/[^a-zA-Z0-9_]/g, '_');
        let username = baseUsername;
          let counter = 1;
          
          while (true) {
            const exists = await prisma.user.findUnique({ where: { username } });
            if (!exists) break;
            username = `${baseUsername}${counter++}`;
          }

          try {
            await prisma.user.update({
              where: { id: existingUser.id },
              data: { username }
            });
            user.username = username;
          } catch (error) {
            console.error('Failed to update username:', error);
         
          }
        }
      }
    }
    return true;
  },
    async jwt({ token, user , trigger, session}) {
      if (user) {
        token.id = user.id;
        token.username = (user as unknown as PrismaUser).username;
        token.image= (user as unknown as PrismaUser).image;
      }
      // console.log("before trigger ",session) 
      //  updates token when session is explicitly called 
      if(trigger == "update" && session?.image){
        console.log("after trigger ", session)
        token.image= session.image 
      }
      return token;
    },
    async session({ session, token , trigger}) {
      if (session.user) {
        
        session.user.id = token.id as string;
        session.user.username = token.username as string;
        session.user.image= token.image as string;
      }
      // console.log(session?.user?.image)
      return session;
    },
  },
})
