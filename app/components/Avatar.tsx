'use client';

import Image from "next/image";
import Placeholder from '../../public/images/avatar.png';

const Avatar = () => {
  return (
    <Image className="rounded-full" height={30} width={30} alt="Avatar" src={Placeholder} />
  )
}

export default Avatar;