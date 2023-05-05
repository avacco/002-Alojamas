import EmptyState from "../components/EmptyState";
import ClientOnly from "../components/ClientOnly";

import getCurrentUser from "../actions/getCurrentUser";
import getReservations from "../actions/getReservations";
import ReservationsClient from "./ReservationsClient";

const ReservationsPage = async () => {

  const currentUser = await getCurrentUser();

  if(!currentUser) return(
     <ClientOnly>
      <EmptyState 
        title="No autorizado"
        subtitle="Por favor, inicie sesión"
      />
     </ClientOnly>
  )

  const reservations = await getReservations({ authorId: currentUser.id });

  if(reservations.length === 0) return (
    <ClientOnly>
      <EmptyState 
        title="No se han encontrado reservas"
        subtitle="Parece que no tienes reservas en tus propiedades"
      />
    </ClientOnly>
  )

  return (
    <ClientOnly>
      <ReservationsClient
        reservations={reservations}
        currentUser={currentUser}
      />
    </ClientOnly>
  )


};

export default ReservationsPage;