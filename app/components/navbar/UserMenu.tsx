'use client';

import { AiOutlineMenu } from 'react-icons/ai';
import Avatar from '../Avatar';
import { useCallback, useState } from 'react';
import MenuItem from './MenuItem';
import useRegisterModal from '@/app/hooks/useRegisterModal';
import useLoginModal from '@/app/hooks/useLoginModal';
import { SafeUser } from '@/app/types';
import { signOut } from 'next-auth/react';
import useRentModal from '@/app/hooks/useRentModal';
import { useRouter } from 'next/navigation';


interface UserMenuProps {
  currentUser?: SafeUser | null
}

const UserMenu: React.FC<UserMenuProps> = ({ currentUser }) => {

  const [isOpen, setIsOpen] = useState(false)

  const router = useRouter();
  const registerModal = useRegisterModal();
  const loginModal = useLoginModal();
  const rentModal = useRentModal();

  const toggleOpen = useCallback(() => {
    setIsOpen((value) => !value);

  }, [])
  
  const onRent = useCallback(() => {
      if(!currentUser) {
        loginModal.onOpen(); // Si no hay un usuario logeado, abre el modal de login.
        return;
      }

      rentModal.onOpen();

    }, [currentUser, loginModal], );
  

  return (
    <div className="relative">
      <div className="flex flex-row items-center gap-3">
        <div onClick={onRent} className="hidden md:block text-sm font-semibold py-3 px-4 rounded-full hover:bg-neutral-100 transition cursor-pointer">
          Renta tu propiedad
        </div>
        <div onClick={toggleOpen} className="p-4 md:py-1 md:px-2 border-[1px] border-neutral-200 flex flex-row items-center gap-3 rounded-full cursor-pointer hover:shadow-md transition">
          <AiOutlineMenu />
          <div className='hidden md:block'>
            <Avatar src={currentUser?.image} />
          </div>
        </div>
      </div>
      {isOpen && (
        <div className='absolute rounded-xl shadow-md w-[40vw] md:w-3/4 bg-white overflow-hidden right-0 top-12 text-sm'>
          <div className='flex flex-col cursor-pointer'>
            {currentUser ? (
              <>
                <MenuItem onClick={() => router.push("/trips")} label='Mis viajes'/>
                <MenuItem onClick={() => router.push("/favorites")} label='Mis favoritos'/>
                <MenuItem onClick={() => router.push("/reservations")} label='Mis reservas'/>
                <MenuItem onClick={() => router.push("/properties")} label='Mis propiedades'/>
                <MenuItem onClick={rentModal.onOpen} label='Añadir propiedad'/>
                <hr />
                <MenuItem onClick={() => signOut()} label='Salir'/>
              </>

            ) : (
              <>
                <MenuItem onClick={loginModal.onOpen} label='Ingresar'/>
                <MenuItem onClick={registerModal.onOpen} label='Registrarse'/>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default UserMenu;