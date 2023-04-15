'use client';
import axios from 'axios';
import { AiFillGithub } from 'react-icons/ai';
import { FcGoogle } from 'react-icons/fc'
import { useCallback, useState  } from 'react';
import { FieldValues, SubmitHandler, useForm } from 'react-hook-form';
import useRegisterModal from '@/app/hooks/useRegisterModal';
import Modal from './Modal';

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

  return (
    <Modal 
      disabled={isLoading} 
      isOpen={registerModal.isOpen} 
      onClose={registerModal.onClose} 
      title="Registrarse"
      onSubmit={handleSubmit(onSubmit)}
      actionLabel='Continuar'  
    />
  )
}

export default RegisterModal