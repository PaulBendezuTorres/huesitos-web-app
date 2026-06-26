import { Eye, Syringe } from 'lucide-react';
import { obtenerUrlImagen } from '@/servicios/imagenServicio';

/**
 * TarjetaMascotaPerfil
 * Versión compacta de la tarjeta de mascota para uso en perfiles o listas reducidas.
 */
const TarjetaMascotaPerfil = ({ mascota, onVerHistorial, onVacunas }) => {
  const urlFoto = mascota.fotoUrl || mascota.foto_url || '';
  const tieneFoto = urlFoto && !urlFoto.includes('defecto-mascota');

  return (
    <div className="group flex items-center gap-3 p-3.5 bg-gradient-to-r from-white to-slate-50 dark:from-slate-900 dark:to-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm hover:shadow-lg hover:shadow-sky-500/10 dark:hover:shadow-sky-500/5 hover:border-sky-200 dark:hover:border-sky-900/50 transition-all duration-300">
      {/* Imagen de la mascota */}
      <div className="relative w-16 h-16 rounded-lg overflow-hidden bg-gradient-to-br from-sky-100 to-cyan-100 dark:from-sky-950/80 dark:to-cyan-950/50 border border-sky-200 dark:border-sky-900 ring-2 ring-sky-100 dark:ring-sky-950/50 shadow-md group-hover:ring-sky-300 dark:group-hover:ring-sky-800 group-hover:shadow-lg transition-all duration-300 flex-shrink-0">
        {tieneFoto ? (
          <img
            src={obtenerUrlImagen(urlFoto)}
            alt={mascota.nombre}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-slate-200 dark:from-slate-700 to-slate-300 dark:to-slate-600 text-3xl font-black text-sky-400/60 dark:text-sky-500/40">
            🐾
          </div>
        )}
      </div>

      {/* Información de la mascota */}
      <div className="flex-1 min-w-0">
        <h4 className="font-bold text-base text-slate-800 dark:text-slate-100 truncate leading-tight group-hover:text-sky-600 dark:group-hover:text-sky-400 transition-colors">{mascota.nombre}</h4>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 capitalize">
          {mascota.especie || 'Mascota'} • <span className="text-slate-400 dark:text-slate-500">#{mascota.id}</span>
        </p>
      </div>

      {/* Acciones rápidas */}
      <div className="flex gap-1.5 flex-shrink-0">
        <button
          onClick={onVerHistorial}
          className="p-2 rounded-lg bg-white dark:bg-slate-800/50 text-slate-500 hover:text-sky-600 hover:bg-sky-50 dark:hover:bg-sky-950/30 dark:hover:text-sky-400 border border-transparent hover:border-sky-200 dark:hover:border-sky-900 shadow-sm hover:shadow-md transition-all duration-300"
          title="Ver historial"
        >
          <Eye size={16} className="stroke-2" />
        </button>
        <button
          onClick={onVacunas}
          className="p-2 rounded-lg bg-white dark:bg-slate-800/50 text-slate-500 hover:text-sky-600 hover:bg-sky-50 dark:hover:bg-sky-950/30 dark:hover:text-sky-400 border border-transparent hover:border-sky-200 dark:hover:border-sky-900 shadow-sm hover:shadow-md transition-all duration-300"
          title="Ver vacunas"
        >
          <Syringe size={16} className="stroke-2" />
        </button>
      </div>
    </div>
  );
};

export default TarjetaMascotaPerfil;
