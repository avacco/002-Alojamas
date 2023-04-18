'use client';

import Image from "next/image";
import Placeholder from '../../public/images/avatar.png';

interface AvatarProps {
  src: string | null | undefined;
};

const Avatar: React.FC<AvatarProps> = ({ src }) => {
  return (
    <Image className="rounded-full" height={30} width={30} alt="Avatar" src={src || Placeholder} />
  )
}

export default Avatar;