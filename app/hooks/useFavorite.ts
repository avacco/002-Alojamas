import axios from 'axios';
import { useRouter } from 'next/navigation';
import { useCallback, useMemo } from 'react';
import { toast } from 'react-hot-toast';

import { SafeUser } from '../types';

import useLoginModal from './useLoginModal';

interface IUseFavorite {
  listingId: string;
  currentUser?: SafeUser | null;
}
/* Hook que controla el estado de favoritos */
const useFavorite = ({ listingId, currentUser }: IUseFavorite) => {
 
  const router = useRouter();
  const loginModal = useLoginModal();

  // Comprueba si el usuario actual tiene favoritos
  const hasFavorited = useMemo(() => {
    const list = currentUser?.favoriteIds || [];
    return list.includes(listingId);
  }, [currentUser, listingId]);
 
  // Cambia el estado de favorites
  const toggleFavorite = useCallback(async (e: React.MouseEvent<HTMLDivElement>) => {
      e.stopPropagation();

      let favoriteMsg;

      // Abre el modal de login si no hay un usuario activo
      if(!currentUser) return loginModal.onOpen();

      try {
        let request;

        // Borra el id de la propiedad de favoritos si este ya figuraba como favorito, o lo añade si no.
        if(hasFavorited){
          request = () => axios.delete(`/api/favorites/${listingId}`); 
          favoriteMsg = "Eliminado de favoritos";
        } 
        else {
           request = () => axios.post(`/api/favorites/${listingId}`); 
           favoriteMsg = "Añadido a favoritos";
        }

        await request();
        router.refresh();
        toast.success(favoriteMsg);
      } catch(error) {
        toast.error("Algo ha salido mal");
      }
    }, [currentUser, hasFavorited, listingId, loginModal, router]);

    return {
      hasFavorited,
      toggleFavorite
    }
}

export default useFavorite;