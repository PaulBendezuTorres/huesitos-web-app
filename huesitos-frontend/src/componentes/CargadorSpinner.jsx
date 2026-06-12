import React from 'react';

/**
 * Componente reutilizable de Spinner de Carga.
 * 
 * @param {string} size - Tamaño del spinner ('xs', 'sm', 'md', 'lg'). Por defecto 'sm'.
 * @param {string} color - Clases de Tailwind CSS para el color del borde (ej. 'border-sky-500'). Por defecto 'border-sky-500'.
 * @param {string} className - Clases de estilo adicionales.
 */
const CargadorSpinner = ({ size = 'sm', color = 'border-sky-500', className = '' }) => {
  const dimensionMap = {
    xs: 'w-3 h-3 border-2',
    sm: 'w-4 h-4 border-2',
    md: 'w-6 h-6 border-2.5',
    lg: 'w-10 h-10 border-4',
  };

  const sizeClass = dimensionMap[size] || dimensionMap.sm;

  return (
    <span 
      className={`inline-block rounded-full border-t-transparent animate-spin ${sizeClass} ${color} ${className}`}
      role="status"
      aria-label="Cargando..."
    />
  );
};

export default CargadorSpinner;
