'use client';

import useSearchModal from "@/app/hooks/useSearchModal"
import Modal from "./Modal";
import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useMemo, useState } from "react";
import { Range } from "react-date-range";
import dynamic from "next/dynamic";
import CountrySelect, { CountrySelectValue } from "../inputs/CountrySelect";
import qs from "query-string";
import { formatISO } from "date-fns";
import Heading from "../Heading";
import Calendar from "../inputs/Calendar";
import Counter from "../inputs/Counter";

enum STEPS {
  LOCATION = 0,
  DATE = 1,
  INFO = 2
}

const SearchModal = () => {

  const params = useSearchParams();
  const router = useRouter();
  const searchModal = useSearchModal();

  const [location, setLocation] = useState<CountrySelectValue>();
  const [step, setStep] = useState(STEPS.LOCATION)
  const [guestCount, setGuestCount] = useState(1)
  const [roomCount, setRoomCount] = useState(1)
  const [bathroomCount, setBathroomCount] = useState(1)
  const [dateRange, setDateRange] = useState<Range>({
    startDate: new Date(),
    endDate: new Date(),
    key: "selection"
  });

  const Map = useMemo(() => dynamic(() => import("../Map"), {
    ssr: false,
  }), [location]);

  const onBack = useCallback(() => {
    setStep((value) => value - 1)
  },[]);

  const onNext = useCallback(() => {
    setStep((value) => value + 1)
  },[]);

  /* Acciones a tomar durante el submit */
  const onSubmit = useCallback(() => {
    
    if(step !== STEPS.INFO) return onNext(); // Si el paso actual es distinto de info, avanza un paso.

    let currentQuery = {}; // Prepara query

    if(params) currentQuery = qs.parse(params.toString()); // Si hay parametros, los agrega al query
    
    const updatedQuery: any = { // Actualiza el query con nuevos valores
      ...currentQuery,
      locationValue: location?.value,
      guestCount,
      roomCount,
      bathroomCount
    };

    // Si hay fechas, las agrega al query
    if(dateRange.startDate) updatedQuery.startDate = formatISO(dateRange.startDate);
    if(dateRange.endDate) updatedQuery.endDate = formatISO(dateRange.endDate);

    // Prepara url con query actualizado.
    const url = qs.stringifyUrl({
      url: '/',
      query: updatedQuery
    }, {skipNull: true});

    setStep(STEPS.LOCATION); // Reinicia los pasos
    searchModal.onClose(); // Cierra el modal

    router.push(url); // Redirecciona a la url

  }, [step, searchModal, location, router, guestCount, roomCount, bathroomCount, dateRange, onNext, params]);

  // Cambia el label por Buscar si el paso actual es INFO, o Siguiente si no.
  const actionLabel = useMemo(() => {
    if(step === STEPS.INFO) return 'Buscar'

    return "Siguiente";
  }, [step]);

  // Cambia el segundo label por Anterior, o retorna undefined si el paso actual es LOCATION
  const secondaryActionLabel = useMemo(() => {
    if(step === STEPS.LOCATION) return undefined;

    return "Anterior";
  }, [step]);

  /* Contenido del body del modal, con el mapa y la seleccion de localización */
  let bodyContent = (
    <div className="flex flex-col gap-8">
      <Heading
        title="¿A donde quieres ir?"
        subtitle="Encuentra el lugar perfecto."
      />
      <CountrySelect
        value={location}
        onChange={(value) => setLocation(value as CountrySelectValue)}
      />
      <hr />
      <Map center={location?.latlng} />
    </div>
  )

  // Si el paso actual es DATE, cambia los contenidos del body con un calendario para agendar fechas.
  if(step === STEPS.DATE) {
    bodyContent = (
      <div className="flex flex-col gap-8">
        <Heading
          title="¿Cuándo quieres ir?"
          subtitle="Selecciona una fecha y hora."
        />
      <Calendar
        value={dateRange}
        onChange={(value) => setDateRange(value.selection)}
      />       
      </div> 
    )
  }

  if(step === STEPS.INFO) {
    bodyContent = (
      <div className="flex flex-col gap-8">
        <Heading
          title="Mas información"
          subtitle="Encuentra tu lugar perfecto."
        />
        <Counter
          title="Huéspedes"
          subtitle="¿Cuantos huéspedes viajarán?"
          value={guestCount}
          onChange={(value) => setGuestCount(value)}
        />
        <Counter
          title="Habitaciones"
          subtitle="¿Cuantas habitaciones necesitarán?"
          value={roomCount}
          onChange={(value) => setRoomCount(value)}
        />
        <Counter
          title="Baños"
          subtitle="¿Cuantos baños necesitarán?"
          value={bathroomCount}
          onChange={(value) => setBathroomCount(value)}
        />
      </div>
    )
  }

  return (
    <Modal
      isOpen={searchModal.isOpen}
      onClose={searchModal.onClose}
      onSubmit={onSubmit}
      title="Filtros"
      actionLabel={actionLabel}
      secondaryAction={step === STEPS.LOCATION ? undefined : onBack} // Si el paso actual es LOCATION, no muestra el botón de back
      secondaryActionLabel={secondaryActionLabel}
      body={bodyContent}
    />
  )
}

export default SearchModal