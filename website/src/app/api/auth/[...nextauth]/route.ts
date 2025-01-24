import { loginApi } from "@/api/auth"
import { userBasicInfoApi } from "@/api/user"
import NextAuth, { AuthOptions } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"

const handler = NextAuth({
    providers: [
      CredentialsProvider({
        // The name to display on the sign in form (e.g. 'Sign in with...')
        name: 'Credentials',
        // The credentials is used to generate a suitable form on the sign in page.
        // You can specify whatever fields you are expecting to be submitted.
        // e.g. domain, username, password, 2FA token, etc.
        // You can pass any HTML attribute to the <input> tag through the object.
        credentials: {
          username: { label: "Username", type: "text", placeholder: "jsmith" },
          password: { label: "Password", type: "password" }
        },
        async authorize(credentials, req) {
          // You need to provide your own logic here that takes the credentials
          // submitted and returns either a object representing a user or value
          // that is false/null if the credentials are invalid.
          // e.g. return { id: 1, name: 'J Smith', email: 'jsmith@example.com' }
          // You can also use the `req` object to obtain additional parameters
          // (i.e., the request IP address)
          const { email, password } = credentials as Record<"email"|"password", string>
          
          const result = await loginApi({email, password});
          // If no error and we have user data, return it
          if (result && result.statusCode == 201) {
            const accessToken = result.accessToken; 
            const user = await userBasicInfoApi(accessToken);
            return result
          }
  
          // Return null if user data could not be retrieved
          return null
        }
      }),
    ],
} as AuthOptions)

export { handler as GET, handler as POST }