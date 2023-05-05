'use client';

import Image from "next/image";
import imgLogo from '../../../public/images/logo.png'
import { useRouter } from 'next/navigation';

const Logo = () => {
  const router = useRouter();

  return (
    <Image alt="logo" className="hidden md:block cursor-pointer" height="150"  width="150" src={imgLogo} onClick={() => router.push('/')} />
  )
}

export default Logo;