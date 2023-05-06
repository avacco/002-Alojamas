import Image from 'next/image'
import { Inter } from 'next/font/google'
import ClientOnly from './components/ClientOnly'
import Container from './components/Container'
import EmptyState from './components/EmptyState';
import getListings, { IListingsParams } from './actions/getListing';
import ListingCard from './components/listings/ListingCard';
import getCurrentUser from './actions/getCurrentUser';

interface HomeProps {
  searchParams: IListingsParams;
}

/* Componente de Home, donde se verán las propiedades disponibles para el arriendo. */
const Home = async ({ searchParams }: HomeProps) => {
  
  const listings = await getListings(searchParams);
  const currentUser = await getCurrentUser();

  /*  Si no hay propiedades disponibles, se muestra el componente EmptyState con el botón de resetear filtros. */
  if(listings.length === 0) return (
      <ClientOnly>
        <EmptyState showReset/>
      </ClientOnly>
    )
  

  return (
    <ClientOnly>
      <Container>
        <div className='pt-24 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-8'>
          {listings.map((listing) => {
            return (
              <ListingCard
                currentUser={currentUser}
                key={listing.id}
                data={listing}

              />
            )
          })}
        </div>
      </Container>
    </ClientOnly>
  )
}

export default Home;