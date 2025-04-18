import React from 'react';

/**
 * Componente para mostrar un indicador de carga
 * @returns {JSX.Element} Componente de carga con animación
 */
const Loader = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[300px]">
      <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mb-4"></div>
      <p className="text-xl text-center">Cargando...</p>
    </div>
  );
};

export default Loader; 