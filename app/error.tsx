'use client';

import { useEffect } from "react";
import EmptyState from "./components/EmptyState";

interface ErrorStateProps{
  error: Error
}

const ErrorState: React.FC<ErrorStateProps> = ({ error }) => {

  useEffect(() => {
    console.error(error);
  }, [error])

  return (
    <EmptyState
      title="Ha ocurrido un error"
      subtitle="Si el problema persiste, contacta con el administrador"
    />
  )
  

}

export default ErrorState;