import NextAuth from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: number;
      name: string,
      email: string,
      token: string,
    } & DefaultSession["user"];

  } 
  interface User {
    id: number;
    name: string,
    email: string,
    token: string,
  }
}

declare module "next-auth/jwt" {
    interface DefaultJWT {
        id: number;
        name: string,
        email: string,
        token: string,
    }
}