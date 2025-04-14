import { loginApi } from "@/service/auth"
import { userBasicInfoApi } from "@/service/user"
import NextAuth, { AuthOptions } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"

const handler = NextAuth({
    providers: [
      CredentialsProvider({
        name: 'Credentials',
        credentials: {
          username: { label: "Username", type: "text" },
          password: { label: "Password", type: "password" }
        },
        async authorize(credentials) {
          const { email, password } = credentials as Record<"email"|"password", string>
          
          const result = await loginApi({email, password});
          // If no error and we have user data, return it
          if (result && result.statusCode == 201) {
            const {accessToken} = result; 
            const user = await userBasicInfoApi(accessToken);
            user.accessToken = accessToken;
            return user;
          }

          throw new Error("Invalid credentials.")
        }
      }),
      
    ],
    callbacks: {
      async jwt({ token, user }) {
        console.log(user);
        
        if (user) {
          token.id = Number(user.id);
          token.name = user.name
          token.email = user.email
          token.accessToken = user.accessToken
        }

        return token;
      },
      async session({ session, token }) {
        session = {
          ...session,
          user: {
            name: token.name,
            email: token.email,
            accessToken: token.accessToken,
          }
        }

        return session;
      },
    }
} as AuthOptions)

export { handler as GET, handler as POST }