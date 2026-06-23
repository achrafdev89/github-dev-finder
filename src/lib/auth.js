import NextAuth from "next-auth";
import GitHub from "next-auth/providers/github";
import { MongoDBAdapter } from "@auth/mongodb-adapter";
import { clientPromise } from "@/lib/mongodb";
export const { handlers, signIn, signOut, auth } = NextAuth({
    // Adapter persists users/sessions/accounts in MongoDB.
    // Falls back to JWT sessions if the DB isn't configured.
    adapter: clientPromise ? MongoDBAdapter(clientPromise) : undefined,
    session: { strategy: clientPromise ? "database" : "jwt" },
    providers: [
        GitHub({
            authorization: { params: { scope: "read:user user:email" } },
        }),
    ],
    pages: {
        signIn: "/", // we trigger sign-in from the navbar modal/button
    },
    callbacks: {
        async session({ session, user, token }) {
            if (session.user) {
                session.user.id = (user?.id ?? token?.sub);
            }
            return session;
        },
    },
});
