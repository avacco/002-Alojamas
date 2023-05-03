import { NextResponse } from "next/server";

import getCurrentUser from "@/app/actions/getCurrentUser";
import prisma from '@/app/libs/prismadb';

interface IParams {
  reservationId?: string;
};

export async function DELETE(request: Request, { params }: { params: IParams }) {
  
  const currentUser = await getCurrentUser();

  if (!currentUser) return NextResponse.error();
  
  const { reservationId } = params;
  
  if (!reservationId || typeof reservationId !== 'string') throw new Error('ID inválido');

  /* Permite eliminar la reserva tanto al usuario que pidio la reserva, como al dueño de la propiedad */
  const reservation = await prisma.reservation.deleteMany({
    where: {
      id: reservationId,
      OR: [
        { userId: currentUser.id },
        { listing: { userid: currentUser.id } }
      ]
    }
  });

  return NextResponse.json(reservation);

}