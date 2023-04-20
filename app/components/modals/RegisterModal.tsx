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
import { signIn } from 'next-auth/react';
import useLoginModal from '@/app/hooks/useLoginModal';

const RegisterModal = () => {

  const registerModal = useRegisterModal();
  const loginModal = useLoginModal();
  const [isLoading, setIsLoading] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm<FieldValues>({
    defaultValues: {
      name: '',
      email: '',
      password: ''
    }
  });

  /* Maneja evento de registro */
  const onSubmit: SubmitHandler<FieldValues> = (data) => {
    setIsLoading(true); 

    axios.post('/api/register', data).then(res => { // Envia una petición POST al endpoint /api/register con los datos del formulario
        registerModal.onClose(); // Cierra el modal de registro
      }).catch(err => {
        toast.error('Error'); // Envia un toast con un mensaje de error si algo sale mal
      }).finally(() => {
        setIsLoading(false);
      })
    }

      /* Cuando presiona en 'Inicia sesión', cierra el modal de registro y abre el de login. */
      const toggle = useCallback(() => {
        registerModal.onClose();
        loginModal.onOpen();
      }, [loginModal, registerModal]);
  
  /* Contenido del body del modal de registro */
    const bodyContent = (
      <div className='flex flex-col gap-4'>
        <Heading title='Bienvenido a Alojamiento' subtitle='Crea una cuenta para continuar'/>
        <Input id='email' type='email' label='Correo' disabled={isLoading} register={register} errors={errors} required />
        <Input id='name' type='text' label='Nombre' disabled={isLoading} register={register} errors={errors} required />
        <Input id='password' type='password' label='Contraseña' disabled={isLoading} register={register} errors={errors} required />
      </div>
    )
  /* Contenido del footer del modal de registro */
    const footerContent = (
      <div className='flex flex-col mt-3 gap-4'>
        <hr />
        <Button outline label='Continuar con Google' icon={FcGoogle} onClick={() => signIn('google')} />
        <Button outline label='Continuar con GitHub' icon={AiFillGithub} onClick={() => signIn('github')} />
        <div className='text-neutral-500 text-center mt-4 font-light'>
          <div className='justify-center flex flex-row items-center gap-2'>
            ¿Ya estas registrado?
            <div onClick={toggle} className='text-neutral-800 cursor-pointer hover:underline font-semibold'>
              Inicia sesión
            </div>
          </div>
        </div>
      </div>
    )
  /* Retorna el componente de modal con los contenidos antes definidos */
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