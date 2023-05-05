'use client';

import { toast } from 'react-hot-toast';
import axios from 'axios';
import { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation'

import { SafeReservation, SafeUser } from '../types';

import Heading from '../components/Heading';
import Container from '../components/Container';
import ListingCard from '../components/listings/ListingCard';

interface ReservationsClientProps {
  reservations: SafeReservation[];
  currentUser?: SafeUser | null;
}

const ReservationsClient: React.FC<ReservationsClientProps> = ({ reservations, currentUser }) => {
  
  const router = useRouter();
  const [deletingId, setDeletingId] = useState('')

  /* Cancelar reserva */
  const onCancel = useCallback((id: string) => {
    setDeletingId(id)

    axios.delete(`/api/reservations/${id}`)
    .then(() => {
      toast.success('Reserva cancelada con éxito');
      router.refresh();
    })
    .catch((error) => {
      toast.error("Error al cancelar la reserva");
    })
    .finally(() => {
      setDeletingId('')
    })
  }, [router]);
  
  
  return (
    <Container>
      <Heading
        title='Reservas'
        subtitle='Reservas hechas en tus propiedades'
      />
      <div className='mt-10 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-8'>
        {reservations.map((reservation) => (
          <ListingCard
            key={reservation.id}
            data={reservation.listing}
            actionId={reservation.id}
            onAction={onCancel}
            disabled={deletingId === reservation.id}
            actionLabel='Cancelar reserva del huésped'
            currentUser={currentUser}
          />
        ))}
      </div>
    </Container>
  )
}

export default ReservationsClient