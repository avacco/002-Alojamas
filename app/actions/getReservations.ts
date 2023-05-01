import prisma from '@/app/libs/prismadb';

interface IParams {
  listingId?: string;
  userId?: string;
  authorId?: string;
}
/* Dependiendo de lo que se envie, retorna queries especificos */
export default async function getReservations( params: IParams ) {
  try{
    const { listingId, userId, authorId } = params;

    const query: any = {};

    // Retorna todas las reservas de la propiedad (listing)
    if(listingId) query.listingId = listingId;

    // Retorna todos los viajes de un usuario
    if(userId) query.userId = userId;

    // Retorna todas las reservas que otros usuarios han hecho a nuestras propiedades
    if(authorId) query.authorId = authorId;

    const reservations = await prisma.reservation.findMany({
      where: query,
      include: {
        listing: true,
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    const safeReservations = reservations.map((reservation) => ({
        ...reservation,
        createdAt: reservation.createdAt.toISOString(),
        startDate: reservation.startDate.toISOString(),
        endDate: reservation.endDate.toISOString(),
        listing: {
          ...reservation.listing,
          createdAt: reservation.listing.createdAt.toISOString()
        }
      })
    );

  return safeReservations;

  } catch (error: any) {
    throw new Error(error);
  } 
} 