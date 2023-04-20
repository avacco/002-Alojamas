'use client';

import Container  from "../Container";
import { TbBeach, TbMountain, TbPool } from "react-icons/tb";
import { GiBarn, GiBoatFishing, GiCactus, GiCastle, GiCaveEntrance, GiForestCamp, GiIsland, GiWindmill } from "react-icons/gi";
import { MdOutlineVilla } from 'react-icons/md';
import CategoryBox from "../CategoryBox";
import { usePathname, useSearchParams } from "next/navigation";
import { FaSkiing } from 'react-icons/fa'
import { BsSnow } from 'react-icons/bs'
import { IoDiamond } from 'react-icons/io5'

export const categories = [
  {
    label: 'Playa',
    icon: TbBeach,
    description: 'Esta propiedad se encuentra cercana a la playa.'
  },
  {
    label: 'Molinos',
    icon: GiWindmill,
    description: 'Esta propiedad tiene molinos de viento.'
  },
  {
    label: 'Moderna',
    icon: MdOutlineVilla,
    description: 'Esta propiedad tiene un estilo moderno.'
  },
  {
    label: 'Campo',
    icon: TbMountain,
    description: 'Esta propiedad se encuentra en el campo.'
  },
  {
    label: 'Piscina',
    icon: TbPool,
    description: 'Esta propiedad cuenta con piscina.'
  },
  {
    label: 'Isla',
    icon: GiIsland,
    description: 'Esta propiedad se encuentra en una isla.'
  },
  {
    label: 'Lago',
    icon: GiBoatFishing,
    description: 'Esta propiedad se encuentra cercana a un lago'
  },
  {
    label: 'Esquí',
    icon: FaSkiing,
    description: 'Esta propiedad cuenta con actividades de esquí'
  },
  {
    label: 'Castillo',
    icon: GiCastle,
    description: 'Esta propiedad se encuentra en un castillo'
  },
  {
    label: 'Camping',
    icon: GiForestCamp,
    description: 'Esta propiedad cuenta con actividades de camping'
  },
  {
    label: 'Ártico',
    icon: BsSnow,
    description: 'Esta propiedad se encuentra en el ártico'
  },
  {
    label: 'Cueva',
    icon: GiCaveEntrance,
    description: 'Esta propiedad se encuentra en una cueva.'
  },
  {
    label: 'Desierto',
    icon: GiCactus,
    description: 'Esta propiedad se encuentra en un desierto'
  },
  {
    label: 'Granja',
    icon: GiBarn,
    description: 'Esta propiedad se encuentra en una granja'
  },
  {
    label: 'Lujo',
    icon: IoDiamond,
    description: 'Esta propiedad es lujosa.'
  }
]

const Categories = () => {

  const params = useSearchParams(); // Prepara para tomar la url
  const category = params?.get('category'); //  Toma la categoria de la URL y la utiliza para comprobar que sea igual al label correspondiente en las categorias
  const pathname = usePathname(); // Toma la URL actual y la utiliza para comprobar si es la pagina principal.

  const isMainPage = pathname === '/';

  if(!isMainPage) return null;

  return (
    <Container>
      <div className="pt-4 flex flex-row items-center justify-between overflow-x-auto">
        {categories.map((item) => (
          <CategoryBox key={item.label} label={item.label} icon={item.icon} selected={category === item.label} />
        ))}
      </div>
    </Container>
  )
}

export default Categories