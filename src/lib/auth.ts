// src/lib/auth.ts
import { PrismaAdapter } from "@next-auth/prisma-adapter"; 
import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { prisma } from "@/lib/prisma";
import bcrypt from 'bcryptjs';

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email", placeholder: "test@test.com" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        // Controlla se email e password sono state fornite
        if (!credentials?.email || !credentials.password) {
          return null;
        }

        // Cerca l'utente nel database
        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
        });

        // Se l'utente non esiste, ritorna null
        if (!user) {
          return null;
        }

        // Confronta la password fornita con quella hashata nel database
        const passwordMatch = await bcrypt.compare(
          credentials.password,
          user.password
        );

        // Se le password corrispondono, ritorna l'utente
        if (passwordMatch) {
          return user;
        }
        
        // Se le password non corrispondono, ritorna null
        return null;
      },
    }),
  ],
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET,
  pages: {
    signIn: "/login", // Specifica la pagina di login custom
  },
  callbacks: {
    // Aggiunge il ruolo e l'ID dell'utente al token JWT
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
      }
      return token;
    },
    // Aggiunge il ruolo e l'ID dell'utente all'oggetto sessione
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.role = token.role as string;
      }
      return session;
    },
  },
};