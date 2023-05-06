import prisma from '@/app/libs/prismadb';

export interface IListingsParams {
  userId?: string;
  guestCount?: number;
  roomCount?: number;
  bathroomCount?: number;
  startDate?: string;
  endDate?: string;
  locationValue?: string;
  category?: string;
}

/* Funcion que devuelve la lista de propiedades, las ordena de forma descendiente por fecha de creación. */
export default async function getListings(params: IListingsParams) {
  
  try {
    const { userId, guestCount, roomCount, bathroomCount, startDate, endDate, locationValue, category } = params; 

    let query: any = {};

    if(userId) query.userid = userId;    
    if(category) query.category = category;
    if (roomCount) query.roomCount = { gte: +roomCount } // Transforma a numero
    if (guestCount) query.guestCount = { gte: +guestCount }
    if (bathroomCount) query.bathroomCount = { gte: +bathroomCount }
    if (locationValue) query.locationValue = locationValue;
    if (startDate && endDate) query.NOT = { // Revierte la logica
      reservations: {
        some: {
          OR: [
            { // Logica que filtra los conflictos entre reservas. Ej: Si hay aunque sea una reserva de 1 dia entre un rango establecido, esta será filtrada.
              endDate: { gte: startDate },
              startDate: { lte: startDate }
            },
            {
              startDate: { lte: endDate},
              endDate: { gte: endDate }
            }
          ]
        }
      }
    }

    const listings = await prisma.listing.findMany({
      where: query, // Si esta vacio, equivale a *
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