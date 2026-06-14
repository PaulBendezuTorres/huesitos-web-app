import React from 'react';
import { PawPrint } from 'lucide-react';

/**
 * Componente reutilizable de Spinner de Carga personalizado con huellita de mascota.
 * 
 * @param {string} size - Tamaño del cargador ('xs', 'sm', 'md', 'lg', 'xl', 'responsive'). Por defecto 'sm'.
 * @param {string} color - Color del spinner y la huella (ej. 'text-sky-500'). Por defecto 'text-sky-500'.
 * @param {string} className - Clases de estilo adicionales.
 */
const CargadorSpinner = ({ size = 'sm', color = 'text-sky-500', className = '' }) => {
  // Configuración de dimensiones para el contenedor y el tamaño del icono SVG
  const mapaDimensiones = {
    xs: { contenedor: 'w-6 h-6', icono: 12, grosorBorde: 'border-2' },
    sm: { contenedor: 'w-8 h-8', icono: 16, grosorBorde: 'border-2' },
    md: { contenedor: 'w-12 h-12', icono: 24, grosorBorde: 'border-[3px]' },
    lg: { contenedor: 'w-20 h-20', icono: 40, grosorBorde: 'border-4' },
    xl: { contenedor: 'w-32 h-32', icono: 64, grosorBorde: 'border-4' },
    responsive: { 
      contenedor: 'w-16 h-16 sm:w-24 sm:h-24 md:w-32 md:h-32 lg:w-40 lg:h-40', 
      icono: 'w-8 h-8 sm:w-12 sm:h-12 md:w-16 md:h-16 lg:w-20 lg:h-20', 
      grosorBorde: 'border-[3px] sm:border-4 md:border-[5px]' 
    }
  };

  const config = mapaDimensiones[size] || mapaDimensiones.sm;

  // Determinar clases de color de borde y de texto para mantener compatibilidad hacia atrás
  let claseColorBorde = 'border-sky-500';
  let claseColorTexto = 'text-sky-500';

  if (color.startsWith('border-')) {
    claseColorBorde = color;
    claseColorTexto = color.replace('border-', 'text-');
  } else if (color.startsWith('text-')) {
    claseColorTexto = color;
    claseColorBorde = color.replace('text-', 'border-');
  } else {
    claseColorBorde = color;
    claseColorTexto = color;
  }

  // Si es responsive, manejamos las dimensiones del icono de forma diferente usando clases de Tailwind
  const esResponsive = size === 'responsive';

  return (
    <div className={`relative flex items-center justify-center ${esResponsive ? config.contenedor : config.contenedor} ${className}`} role="status" aria-label="Cargando...">
      {/* Círculo giratorio de fondo */}
      <span className={`absolute inset-0 rounded-full border-slate-200/60 ${config.grosorBorde}`} />
      
      {/* Arco giratorio del spinner */}
      <span className={`absolute inset-0 rounded-full border-t-transparent animate-spin ${config.grosorBorde} ${claseColorBorde}`} />
      
      {/* Huellita animada en el centro */}
      <div className={`animate-pulse ${claseColorTexto}`}>
        {esResponsive ? (
          <PawPrint className={config.icono} strokeWidth={2.2} />
        ) : (
          <PawPrint size={config.icono} strokeWidth={2.2} />
        )}
      </div>
    </div>
  );
};

export default CargadorSpinner;
