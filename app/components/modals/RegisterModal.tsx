'use client';
import axios from 'axios';
import { AiFillGithub } from 'react-icons/ai';
import { FcGoogle } from 'react-icons/fc'
import { useCallback, useState  } from 'react';
import { FieldValues, SubmitHandler, useForm } from 'react-hook-form';
import useRegisterModal from '@/app/hooks/useRegisterModal';
import Modal from './Modal';
import Heading from '../Heading';
import Input from '../inputs/Input';

const RegisterModal = () => {

  const registerModal = useRegisterModal();
  const [isLoading, setIsLoading] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm<FieldValues>({
    defaultValues: {
      name: '',
      email: '',
      password: ''
    }
  });

  const onSubmit: SubmitHandler<FieldValues> = (data) => {
    setIsLoading(true);

    axios.post('/api/register', data).then(res => {
        registerModal.onClose();
      }).catch(err => {
        console.log(err);
      }).finally(() => {
        setIsLoading(false);
      })
    }

    const bodyContent = (
      <div className='flex flex-col gap-4'>
        <Heading title='Bienvenido a Alojamiento' subtitle='Crea una cuenta para continuar'/>
        <Input id='email' label='Correo' disabled={isLoading} register={register} errors={errors} required />
      </div>
    )

  return (
    <Modal 
      disabled={isLoading} 
      isOpen={registerModal.isOpen} 
      onClose={registerModal.onClose} 
      title="Registrarse"
      onSubmit={handleSubmit(onSubmit)}
      actionLabel='Continuar'
      body={bodyContent}  
    />
  )
}

export default RegisterModal