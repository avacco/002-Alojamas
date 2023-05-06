'use client';

import useRentModal from "@/app/hooks/useRentModal";
import Modal from "./Modal";
import { useMemo, useState } from "react";
import Heading from "../Heading";
import { categories } from "../navbar/Categories";
import CategoryInput from "../inputs/CategoryInput";
import { FieldValues, SubmitHandler, useForm } from "react-hook-form";
import CountrySelect from "../inputs/CountrySelect";
import dynamic from "next/dynamic";
import Counter from "../inputs/Counter";
import ImageUpload from "../inputs/ImageUpload";
import Input from "../inputs/Input";
import axios from "axios";
import { toast } from "react-hot-toast";
import { useRouter } from "next/navigation";


/* Pasos  */
enum STEPS {
  CATEGORY = 0,
  LOCATION = 1,
  INFO = 2,
  IMAGES = 3,
  DESCRIPTION = 4,
  PRICE = 5
}

const RentModal = () => {
  const router = useRouter();
  const rentModal = useRentModal();

  const [step, setStep] = useState(STEPS.CATEGORY);
  const [isLoading, setIsLoading] = useState(false);

  /* Valores que se usaran para el formulario */
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

  // Vigila por cambios en el campo correspondiente, y lo asigna a la variable del mismo nombre.
  const category = watch('category'); 
  const location = watch('location') 
  const guestCount = watch('guestCount');
  const roomCount = watch('roomCount');
  const bathroomCount = watch('bathroomCount');
  const imageSrc = watch('imageSrc');

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

  /* Controladores para los botones de Siguiente y Atras */
  const onBack = () => {
    setStep((value) => value - 1);
  };

  const onNext = () => {
    setStep((value) => value + 1);
  }

  /* Envia la informacion del formulario */
  const onSubmit: SubmitHandler<FieldValues> = (data) => {
    if(step !== STEPS.PRICE) return onNext(); // Si no se encuentra en el ultimo paso, sigue con el siguiente paso.
    
    setIsLoading(true);
    
    axios.post('/api/listings', data)
    .then(() => {
      toast.success('Se ha registrado la propiedad exitosamente');
      router.refresh(); // Refresca la pagina
      reset(); // Limpia el formulario
      setStep(STEPS.CATEGORY); // Devuelve al primer paso
      rentModal.onClose(); // Cierra el modal
    })
    .catch(() => {
      toast.error('Hubo un error al registrar la propiedad');
    })
    .finally(() => {
      setIsLoading(false);
    })
  }
  

  const actionLabel = useMemo(() => { 
    if(step === STEPS.PRICE) { // Si se encuentra en el ultimo paso, cambia el label del boton rojo a Crear en vez de Siguiente.
      return 'Crear';
    }
    return 'Siguiente';
  }, [step]);

  const secondaryActionLabel = useMemo(() => {

    if(step === STEPS.CATEGORY) return undefined; // Si se encuentra en el primer paso, no muestra el boton Atras.
    
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

  // Paso de informacion
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

  // Paso de imagenes
  if (step === STEPS.IMAGES) {
    bodyContent = (
      <div className="flex flex-col gap-8">
        <Heading
          title="Agregue una foto de su propiedad"
          subtitle="Muestra a tus potenciales huespedes como se ve tu propiedad."
        />
        <ImageUpload 
          value={imageSrc}
          onChange={(value) => setCustomValue('imageSrc', value)}
        />
      </div>
    )
  }

  // Paso de descripcion
  if (step === STEPS.DESCRIPTION) {
    bodyContent = (
      <div className="flex flex-col gap-8">
        <Heading
          title="Descripción de su propiedad"
          subtitle="Describa su propiedad."
        />
        <Input
          id="title"
          label="Titulo"
          disabled={isLoading}
          register={register}
          errors={errors}
          required
        />
        <hr/>
        <Input
          id="description"
          label="Descripción"
          disabled={isLoading}
          register={register}
          errors={errors}
          required
        />
      </div>
    )
  }

  if (step === STEPS.PRICE) {
    bodyContent = (
      <div className="flex flex-col gap-8">
        <Heading
          title="Precio por noche en su propiedad"
          subtitle="Indique el precio por pasar una noche en su propiedad."
        />
        <Input
          id="price"
          label="Precio"
          formatPrice
          type="number"
          disabled={isLoading}
          register={register}
          errors={errors}
          required
        />
      </div>
    )
  }

  return (
    <Modal 
      isOpen={rentModal.isOpen}
      onClose={rentModal.onClose}
      onSubmit={handleSubmit(onSubmit)}
      actionLabel={actionLabel}
      secondaryActionLabel={secondaryActionLabel}
      secondaryAction={step === STEPS.CATEGORY ? undefined : onBack}
      title="Renta tu propiedad"
      body={bodyContent}
    />
  )
}

export default RentModal