'use client';

import { toast } from 'react-hot-toast';
import axios from 'axios';
import { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation'

import { SafeReservation, SafeUser } from '../types';

import Heading from '../components/Heading';
import Container from '../components/Container';
import ListingCard from '../components/listings/ListingCard';

const ReservationsClient = () => {
  return (
    <Container>
      <Heading
        title='Reservas'
        subtitle='Reservas hechas en tus propiedades'
      />
    </Container>
  )
}

export default ReservationsClient