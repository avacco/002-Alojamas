'use client';

import useRentModal from "@/app/hooks/useRentModal";
import Modal from "./Modal";
import { useMemo, useState } from "react";
import Heading from "../Heading";
import { categories } from "../navbar/Categories";
import CategoryInput from "../inputs/CategoryInput";
import { FieldValues, useForm } from "react-hook-form";
import CountrySelect from "../inputs/CountrySelect";
import dynamic from "next/dynamic";
import Counter from "../inputs/Counter";


/* Pasos  */
enum STEPS {
  CATEGORY = 0,
  LOCATION = 1,
  INFO = 2,
  IMAAGES = 3,
  DESCRIPTION = 4,
  PRICE = 5
}

const RentModal = () => {
  const rentModal = useRentModal();

  const [step, setStep] = useState(STEPS.CATEGORY);

  /* Valores para el formulario */
  const { register, handleSubmit, setValue, watch, formState: { errors }, reset } = useForm<FieldValues>({
    defaultValues: {
      category: '',
      location: null,
      guestCount: 1,
      roomCount: 1,
      bathroomCount: 1,
      imageSrc: '',
      price: 1,
      title:  '',
      description: ''
    }

  });

  const category = watch('category'); // Vigila por cambios en el campo category, y lo asigna a la variable 'category'
  const location = watch('location') // Hace lo mismo con las demas variables
  const guestCount = watch('guestCount');
  const roomCount = watch('roomCount');
  const bathroomCount = watch('bathroomCount');

  /* WORKAROUND: Importa el mapa de una manera especifica debido a incompatibilidades de leaflet con React */
  const Map = useMemo(() => dynamic(() => import("../Map"), { ssr: false }), [location])


  /* Crea setCustomValue ya que React, si bien setea el valor con setValue, no re-renderiza la pagina. Esto lo soluciona. */
  const setCustomValue = (id: string, value: any) => { 
    setValue(id, value, {
      shouldDirty: true,
      shouldTouch: true,
      shouldValidate: true
    })
  }

  const onBack = () => {
    setStep((value) => value - 1);
  };

  const onNext = () => {
    setStep((value) => value + 1);
  }

  const actionLabel = useMemo(() => {
    if(step === STEPS.PRICE) {
      return 'Crear';
    }
    return 'Siguiente';
  }, [step]);

  const secondaryActionLabel = useMemo(() => {

    if(step === STEPS.CATEGORY) {
      return undefined;
    }
    return 'Atras';
  }, [step]);

    // Paso de categoria
  let bodyContent = (
    <div className="flex flex-col gap-8">
      <Heading 
        title="¿Cual de estas categorías describe mejor tu propiedad?"
        subtitle="Selecciona una categoría."
      />
      <div className="grid grid-cols-2 gap-3 max-h-[50vh] overflow-y-auto">
        {categories.map((item) => (
          <div key={item.label} className="col-span-1"> {/* Al clickear, setea la categoria. La categoria seleccionada sera igual a la categoria marcada en 'label'*/}
            <CategoryInput onClick={(category) => setCustomValue('category', category)} selected={category === item.label} label={item.label} icon={item.icon} />
          </div>
        ))}
      </div>
    </div>
  )

  // Paso de localizacion
  if (step === STEPS.LOCATION) {
    bodyContent = (
      <div className="flex flex-col gap-8">
        <Heading 
          title="¿Donde se encuentra tu propiedad?"
          subtitle="Selecciona una localización."
        />
        <CountrySelect
          value={location}
          onChange={(value) => setCustomValue('location', value)}
        />
        <Map center={location?.latlng} />

      </div>
    )
  }

  if (step === STEPS.INFO) {
    bodyContent = (
      <div className="flex flex-col gap-8">
        <Heading
          title="Información sobre su propiedad"
          subtitle="Describe tu propiedad."
        />
        <Counter 
          title="Huespedes"
          subtitle="¿Cuantos huespedes pueden albergarse?"
          value={guestCount}
          onChange={(value) => setCustomValue('guestCount', value)}
        />
        <hr/>
        <Counter 
          title="Habitaciones"
          subtitle="¿Cuantas habitaciones tiene?"
          value={roomCount}
          onChange={(value) => setCustomValue('roomCount', value)}
        />
        <hr/>
        <Counter 
          title="Baños"
          subtitle="¿Cuantos baños tiene?"
          value={bathroomCount}
          onChange={(value) => setCustomValue('bathroomCount', value)}
        />
        <hr/>
        
      </div>
    )
  }

  return (
    <Modal 
      isOpen={rentModal.isOpen}
      onClose={rentModal.onClose}
      onSubmit={onNext}
      actionLabel={actionLabel}
      secondaryActionLabel={secondaryActionLabel}
      secondaryAction={step === STEPS.CATEGORY ? undefined : onBack}
      title="Rent modal"
      body={bodyContent}
    />
  )
}

export default RentModal