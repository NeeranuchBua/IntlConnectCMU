import CredentialsProvider from "next-auth/providers/credentials";
import { CredentialsSignin, type NextAuthConfig } from "next-auth";
import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";
import Google from 'next-auth/providers/google';

// Function to validate a password
async function validatePassword(password: string, hash: string) {
    return bcrypt.compare(password, hash);
}

// Notice this is only an object, not a full Auth.js instance
export default {
    providers: [
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                username: { label: "Username", type: "text", placeholder: "jsmith" },
                password: { label: "Password", type: "password" },
            },
            async authorize(credentials) {
                if (!credentials?.username || !credentials.password || typeof credentials.password !== 'string' || typeof credentials.username !== 'string') {
                    throw new CredentialsSignin("Username and password are required");
                }

                const user = await prisma.user.findUnique({
                    where: { email: credentials.username },
                });

                if (!user || !user.password || !(await validatePassword(credentials.password, user.password))) {
                    // Throwing a generic error for invalid credentials
                    throw new CredentialsSignin("Invalid credentials");
                }

                return { id: user.id, name: user.name, email: user.email };
            },
        }),
        Google(
            {
                clientId: process.env.AUTH_GOOGLE_ID,
                clientSecret: process.env.AUTH_GOOGLE_SECRET,
                authorization: {
                    params: {
                        redirect_uri: process.env.AUTH_GOOGLE_REDIRECT_URI,
                        prompt: "login",
                    },
                }
            }
        )
    ],
    // debug: true
} satisfies NextAuthConfig