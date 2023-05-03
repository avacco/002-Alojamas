import getCurrentUser from "@/app/actions/getCurrentUser";
import getListingById from "@/app/actions/getListingById";
import ClientOnly from "@/app/components/ClientOnly";
import EmptyState from "@/app/components/EmptyState";
import ListingClient from "./ListingClient";
import getReservations from "@/app/actions/getReservations";

interface IParams {
  listingId?: string;
}

/**
 * Enrutado a pagina de una propiedad. Ej: /listings/6446e230f6652d4fb4cd88b0
 */
const ListingPage = async ({ params }: {params: IParams}) => {

  const listing = await getListingById(params);
  const reservations = await getReservations(params); // params es listingId, por tanto retornara todas las reservas de la propiedad 
  const currentUser = await getCurrentUser();

  if(!listing) {
    return (
      <ClientOnly>
        <EmptyState />
      </ClientOnly>
    )
  }
  
  return (
    <div>
      <ClientOnly>
        <ListingClient 
          listing={listing}
          currentUser={currentUser}
          reservations={reservations}
        />
      </ClientOnly>
    </div>
  )
}

export default ListingPage