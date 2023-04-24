'use client';

import { AiFillHeart, AiOutlineHeart } from "react-icons/ai";
import { SafeUser } from "../types";
import useFavorite from "../hooks/useFavorite";

interface HeartButtonProps {
  listingId: string;
  currentUser?: SafeUser | null
}

const HeartButton: React.FC<HeartButtonProps> = ({ listingId, currentUser }) => {

  const { hasFavorited, toggleFavorite } = useFavorite({listingId, currentUser});

  return (
    <div onClick={toggleFavorite} className="relative hover:opacity-80 transition cursor-pointer">
      <AiOutlineHeart size={28} className="fill-white absolute top-8 -right-2" />
      <AiFillHeart  size={24} className={hasFavorited ? 'fill-rose-500 absolute top-[34.5px] -right-[6.5px]' : 'fill-neutral-500/70 absolute top-[34.5px] -right-[6.5px]'} />      
    </div>
  );
}

export default HeartButton