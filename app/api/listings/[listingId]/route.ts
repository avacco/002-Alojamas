import { NextResponse } from "next/server";

import getCurrentUser from "@/app/actions/getCurrentUser";
import prisma from "@/app/libs/prismadb";

interface IParams {
  listingId?: string;
}

/* Elimina propiedades segun id del usuario e id de propiedad */
export async function DELETE(request: Request, { params }: { params: IParams }) {
  
  const currentUser = await getCurrentUser();
  const { listingId } = params;

  if (!currentUser) return NextResponse.error();
  
  if (!listingId || typeof listingId !== 'string') throw new Error("ID inválido");

  const listing = await prisma.listing.deleteMany({
    where: {
      id: listingId,
      userid: currentUser.id
    }
  });

  return NextResponse.json(listing);

}