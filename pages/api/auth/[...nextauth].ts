import { PrismaAdapter } from "@next-auth/prisma-adapter";
import NextAuth, { AuthOptions } from "next-auth";
import GithubProvider from "next-auth/providers/github";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcrypt"

import prisma from "@/app/libs/prismadb";

/**
 * Prepara las opciones para autenticación
 */
export const authOptions: AuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [ // Proveedores, utilizan variables de entorno para configurar
    GithubProvider({
      clientId: process.env.GITHUB_ID as string,
      clientSecret: process.env.GITHUB_SECRET as string,
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_ID as string,
      clientSecret: process.env.GOOGLE_SECRET as string,
    }),
    CredentialsProvider({ // Credenciales, correo y contraseña en este caso
      name: 'credentials',
      credentials: {
        email: {label: 'email', type: 'text'},
        password: {label: 'password', type: 'password'},
      },
      async authorize(credentials) { // Valida credenciales, lanzando error si no son correctas
        if(!credentials?.email || !credentials?.password) {
          throw new Error('Datos inválidos');
        }

        const user = await prisma.user.findUnique({ // Busca usuario por correo
          where: {
            email: credentials.email
          }
        });

        if(!user || !user?.hashedPassword) { // Si no existe o hay discrepancias en la contraseña, lanza error
          throw new Error('Datos inválidos');
        }

        const isCorrectPassword = await bcrypt.compare(credentials.password, user.hashedPassword); // Comprueba contraseña con bcrypt

        if(!isCorrectPassword) { // Lanza error si no es correcto
          throw new Error('Datos inválidos');
        }
        
        return user; // Retorna el usuario si ha pasado todas las pruebas
      }
    })
  ],
  pages: {
    signIn: '/',
  },
  debug: process.env.NODE_ENV === "development",
  session: {
    strategy: "jwt"
  },
  secret: process.env.NEXTAUTH_SECRET,
};

export default NextAuth(authOptions);