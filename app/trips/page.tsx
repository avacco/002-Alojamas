import EmptyState from "../components/EmptyState";
import ClientOnly from "../components/ClientOnly";

import getCurrentUser from "../actions/getCurrentUser";
import getReservations from "../actions/getReservations";
import TripsClient from "./TripsClient";

const TripsPage = async () => {

  const currentUser = await getCurrentUser();

  if(!currentUser) return (
    <ClientOnly>
      <EmptyState
        title="No autorizado"
        subtitle="Por favor, inicie sesión"
      />
    </ClientOnly>
  )

  const reservations = await getReservations({
    userId: currentUser.id
  });

  if (reservations.length === 0) return (
    <ClientOnly>
      <EmptyState
        title="No hay viajes"
        subtitle="No ha reservado ningun viaje"
      />
    </ClientOnly>
  )

  return (
    <ClientOnly>
      <TripsClient
        reservations={reservations}
        
      />
    </ClientOnly>
  )

}

export default TripsPage;