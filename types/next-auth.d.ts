import { User as PrismaUser , Account as PrismaAccount} from "@prisma/client";
import { DefaultSession, DefaultUser } from "next-auth";
import { AdapterAccountType, AdapterUser as DefaultAdapterUser } from "next-auth/adapters";

declare module "next-auth" {
  interface Session extends DefaultSession {
    user: {
      id: string;
      username?: string;
     image?:string ;
     bio?:string| null;
    } & DefaultSession["user"];
  }

  interface User extends DefaultUser {
    id: string;
    username?: string| null;
    accounts?:PrismaAccount[]
    bio?:string| null;
  }
}

declare module "next-auth/adapters" {
  interface AdapterUser extends DefaultAdapterUser {
    username?: string;
     bio?: string | null;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    username?: string;
   image?:string;
    bio?:string;
  }
}


export type AuthUser = {
  id: string;
  username?: string | null;

  image?: string | null;
};