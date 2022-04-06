import NextAuth from "next-auth"
import GithubProvider from "next-auth/providers/github"
import Credentials from "next-auth/providers/credentials"
import { dbUsers } from "../../../database"
export default NextAuth({
  // Configure one or more authentication providers
  providers: [
    // ...add more providers here
    Credentials({
      name: "Custom Login",
      credentials: {
        email: {
          label: "Correo",
          type: "email",
          placeholder: "correo@google.com",
        },
        password: {
          label: "Contraseña",
          type: "password",
          placeholder: "Contraseña",
        },
      },
      async authorize(credentials) {
        console.log(credentials)

        return await dbUsers.checkUserEmailPassword(
          (credentials as any).email,
          (credentials as any).password
        )
      },
    }),
    GithubProvider({
      clientId: process.env.GITHUB_ID,
      clientSecret: process.env.GITHUB_SECRET,
    }),
  ],

  // the pages of our login and signup
  pages: {
    signIn: "/auth/login",
    newUser: "/auth/register",
  },

  jwt: {},

  session: {
    maxAge: 2592000,
    strategy: "jwt",
    updateAge: 86400,
  },

  callbacks: {
    async jwt({ token, account, user }) {
      if (account) {
        token.accessToken = account.access_token

        switch (account.type) {
          case "oauth":
            // if it is a social account, we need to create a new user o if it exists we need to set that user
            token.user = await dbUsers.oAUthToDbUser(
              (user as any).email,
              (user as any).name
            )
            break
          case "credentials":
            // we set the user in the payload of the token, whatever the user put in the form
            token.user = user
            break
        }
      }

      return token
    },
    async session({ session, token, user }: any) {
      session.accessToken = token.accessToken
      session.user = token.user

      return session
    },
  },
})
