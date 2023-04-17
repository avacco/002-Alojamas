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
import { toast } from 'react-hot-toast';
import Button from '../Button';

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
        toast.error('Error');
      }).finally(() => {
        setIsLoading(false);
      })
    }

    const bodyContent = (
      <div className='flex flex-col gap-4'>
        <Heading title='Bienvenido a Alojamiento' subtitle='Crea una cuenta para continuar'/>
        <Input id='email' type='email' label='Correo' disabled={isLoading} register={register} errors={errors} required />
        <Input id='nombre' type='text' label='Nombre' disabled={isLoading} register={register} errors={errors} required />
        <Input id='password' type='password' label='Contraseña' disabled={isLoading} register={register} errors={errors} required />
      </div>
    )

    const footerContent = (
      <div className='flex flex-col mt-3 gap-4'>
        <hr />
        <Button outline label='Continuar con Google' icon={FcGoogle} onClick={() => ({})} />
        <Button outline label='Continuar con GitHub' icon={AiFillGithub} onClick={() => ({})} />
        <div className='text-neutral-500 text-center mt-4 font-light'>
          <div className='justify-center flex flex-row items-center gap-2'>
            ¿Ya estas registrado?
            <div onClick={registerModal.onClose} className='text-neutral-800 cursor-pointer hover:underline font-semibold'>
              Inicia sesión
            </div>
          </div>
        </div>
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
      footer={footerContent}
    />
  )
}

export default RegisterModal