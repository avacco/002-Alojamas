import prisma from '@/app/libs/prismadb';

import getCurrentUser from './getCurrentUser';

/* Trae la lista de favoritos del usuario */
export default async function getFavoriteListings() {
  try{
    const currentUser = await getCurrentUser();

    if(!currentUser) return []; // Si no hay usuarios, envia un array vacio

    const favorites = await prisma.listing.findMany({
      where: {
        id: {
          in: [...(currentUser.favoriteIds || [])]
        }
      }
    });

    /* Sanitiza fecha de creacion de favoritos */
    const safeFavorites = favorites.map((favorite) => ({
      ...favorite,
      createdAt: favorite.createdAt.toISOString()
    }));

    return safeFavorites;

  } catch(error: any) {
    throw new Error(error);
  }

}