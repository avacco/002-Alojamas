import EmptyState from "../components/EmptyState";
import ClientOnly from "../components/ClientOnly";

import getCurrentUser from "../actions/getCurrentUser";
import PropertiesClient from "./PropertiesClient";
import getListings from "../actions/getListing";

const PropertiesPage = async () => {

  const currentUser = await getCurrentUser();

  if(!currentUser) return (
    <ClientOnly>
      <EmptyState
        title="No autorizado"
        subtitle="Por favor, inicie sesión"
      />
    </ClientOnly>
  )

  const listings = await getListings({
    userId: currentUser.id
  });

  if (listings.length === 0) return (
    <ClientOnly>
      <EmptyState
        title="No se han encontrado propiedades"
        subtitle="No tienes propiedades"
      />
    </ClientOnly>
  )

  return (
    <ClientOnly>
      <PropertiesClient
        listings={listings}
        currentUser={currentUser}
      />
    </ClientOnly>
  )

}

export default PropertiesPage;