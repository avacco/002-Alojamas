'use client';
import { AiFillGithub } from 'react-icons/ai';
import { FcGoogle } from 'react-icons/fc'
import { useState  } from 'react';
import { FieldValues, SubmitHandler, useForm } from 'react-hook-form';
import useLoginModal from '@/app/hooks/useLoginModal';
import Modal from './Modal';
import Heading from '../Heading';
import Input from '../inputs/Input';
import { toast } from 'react-hot-toast';
import Button from '../Button';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';

const LoginModal = () => {

  const router = useRouter();
  const loginModal = useLoginModal();
  const [isLoading, setIsLoading] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm<FieldValues>({
    defaultValues: {
      email: '',
      password: ''
    }
  });

  /* Maneja evento de login */
  const onSubmit: SubmitHandler<FieldValues> = (data) => {
    setIsLoading(true);

    signIn('credentials', { // Utiliza signIn de Next Auth con las credenciales enviadas a traves de 'data'
      ...data,
      redirect: false,
    }).then((callback) => {
      setIsLoading(false);

      if(callback?.ok) { // Envia un toast con un mensaje de bienvenida si todo sale bien
        toast.success('Bienvenido de nuevo');
        router.refresh();
        loginModal.onClose();
      }

      if(callback?.error) { // Envia un toast con un mensaje de error si algo sale mal
        toast.error(callback.error);
      }
    })
  }

  /* Contenido del body del modal de login */
    const bodyContent = (
      <div className='flex flex-col gap-4'>
        <Heading title='Bienvenido de nuevo' subtitle='Ingresa a tu cuenta'/>
        <Input id='email' type='email' label='Correo' disabled={isLoading} register={register} errors={errors} required />
        <Input id='password' type='password' label='Contraseña' disabled={isLoading} register={register} errors={errors} required />
      </div>
    )

  /*/* Contenido del footer del modal de login */
    const footerContent = (
      <div className='flex flex-col mt-3 gap-4'>
        <hr />
        <Button outline label='Continuar con Google' icon={FcGoogle} onClick={() => signIn('google')} />
        <Button outline label='Continuar con GitHub' icon={AiFillGithub} onClick={() => signIn('github')} />
        <div className='text-neutral-500 text-center mt-4 font-light'>
          <div className='justify-center flex flex-row items-center gap-2'>
            ¿Ya estas registrado?
            <div onClick={loginModal.onClose} className='text-neutral-800 cursor-pointer hover:underline font-semibold'>
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
      isOpen={loginModal.isOpen} 
      onClose={loginModal.onClose} 
      title="Ingresar"
      onSubmit={handleSubmit(onSubmit)}
      actionLabel='Continuar'
      body={bodyContent}  
      footer={footerContent}
    />
  )
}

export default LoginModal