'use client';
// Debido al uso de Next13, se necesita de un Provider (este archivo) para poder utilizar componentes de paquetes externos, ya que estos no traeran el 'use client' requerido.
import { Toaster } from "react-hot-toast";

const ToasterProvider = () => {
  return (
    <Toaster />
  );
}
export default ToasterProvider;