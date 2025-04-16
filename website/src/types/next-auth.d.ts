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
    accessToken: string,
  }
}

declare module "next-auth/jwt" {
    interface DefaultJWT {
      id: number,
      name: string,
      email: string,
      sub: string,
      accessToken: string,
      iat: number,
      exp: number,
      jti: string
    }
}