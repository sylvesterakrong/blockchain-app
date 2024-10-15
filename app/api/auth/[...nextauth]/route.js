    import { connectMongoDB } from "@/lib/mongodb";
    import User from "@/models/user";
    import NextAuth from "next-auth";
    import Credentials from "next-auth/providers/credentials";
    import bcrypt from "bcryptjs/dist/bcrypt";

    export const authOptions = {
    providers: [
    Credentials({
        name: 'credentials',
        credentials: {},

        async authorize(credentials) {
        const { username, password } = credentials;

        try {
            await connectMongoDB();
            const user = await User.findOne({ username });

            if (!user) {
            return null;
            }

            const passwordsMatch = await bcrypt.compare(password, user.password);

            if (!passwordsMatch) {
            return null;
            }

            return user; // Ensure the user object has the username field
        } catch (error) {
            console.log("Error: ", error);
            return null; // Return null on error to prevent logging in
        }
        },
    }),
    ],

    session: {
    strategy: 'jwt',
    },
    secret: process.env.NEXTAUTH_SECRET,
    pages: {
    signIn: '/',
    },
    callbacks: {
    async jwt({ token, user }) {
        // If user exists, add username to token
        if (user) {
        token.username = user.username; 
        token.email = user.email;       
        token.sub = user.id; 
        }
        return token;
    },
    async session({ session, token }) {
        // Attach user info to the session from the token
        session.user.id = token.sub; // Attach user ID
        session.user.username = token.username; // Attach username
        return session;
    },
    },
    };

    const handler = NextAuth(authOptions);

    export { handler as GET, handler as POST };
