import { getServerSession } from "next-auth/next";

import { authOptions } from "@/pages/api/auth/[...nextauth]";
import prisma from "@/app/libs/prismadb";

export async function getSession() {
  return await getServerSession(authOptions);
}

export default async function getCurrentUser() {
  try {
    const session = await getSession();

    if (!session?.user?.email) {
      return null;
    }

    const currentUser = await prisma.user.findUnique({
      where: {
        email: session.user.email as string
      }
    });

    if(!currentUser) {
      return null;
    }

    // Ademas de retornar el usuario, envia tambien ciertos parametros para evitar alertas en consola respecto al traspaso de objetos potencialmente peligrosos. 
    // Esto significa la creacion de la carpeta types y un archivo index.ts en la misma para sanitizar el usuario.
    return {
      ...currentUser, 
      createdAt: currentUser.createdAt.toISOString(),
      updatedAt: currentUser.updatedAt.toISOString(),
      emailVerified: currentUser.emailVerified?.toISOString() || null,
    }

  } catch (error: any) {
    return null; // A fin de prevenir que la app explote si no hay un usuario activo, retorna null.
  }
}