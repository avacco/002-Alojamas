import prisma from '@/app/libs/prismadb';

/* Funcion que devuelve la lista de propiedades, las ordena de forma descendiente por fecha de creación */
export default async function getListings() {
  try {
    const listings = await prisma.listing.findMany({
      orderBy: {
        createdAt: 'desc'
      }
  });
  // Solo objetos planos pueden ser pasados desde componentes de cliente a componentes de servidor. Objetos de fecha (Date) no son soportados.
  // Para solucionar este problema, se convierten los objetos de fecha a string en formato ISO, y se crea una entrada en types/index.ts con el safeListing
    const safeListings = listings.map((listing) => ({
      ...listing,
      createdAt: listing.createdAt.toISOString(),
    }));
  
    return safeListings;

  } catch(error: any) {
    throw new Error(error)
  }
}