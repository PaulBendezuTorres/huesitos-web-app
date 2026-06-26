import { PawPrint, Check } from 'lucide-react';
import { obtenerUrlImagen } from '@/servicios/imagenServicio';

/**
 * PasadorMascota — Paso 1 del flujo de reserva de cita.
 * Muestra grid de mascotas con foto, seleccionable.
 */
const PasadorMascota = ({ mascotas, mascotaSeleccionada, onSeleccionar }) => {
  if (mascotas.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 gap-3">
        <div className="w-14 h-14 bg-slate-100 dark:bg-slate-800 rounded-2xl flex items-center justify-center">
          <PawPrint size={26} className="text-slate-300 dark:text-slate-600" />
        </div>
        <p className="text-slate-500 dark:text-slate-400 font-semibold text-sm">No tienes mascotas registradas</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {mascotas.map((m) => {
        const urlFoto = m.fotoUrl || m.foto_url || '';
        const tieneFoto = urlFoto && !urlFoto.includes('defecto-mascota');
        const seleccionada = mascotaSeleccionada?.id === m.id;

        return (
          <button
            key={m.id}
            onClick={() => onSeleccionar(m)}
            className={`relative flex flex-col text-left rounded-2xl border-2 overflow-hidden transition-all duration-200 group ${
              seleccionada
                ? 'border-sky-500 shadow-lg shadow-sky-500/15'
                : 'border-slate-200 dark:border-slate-700 hover:border-sky-300 dark:hover:border-sky-700'
            }`}
          >
            {/* Foto */}
            <div className="relative w-full aspect-[4/3] bg-gradient-to-tr from-sky-100 to-cyan-50 dark:from-sky-950/60 dark:to-slate-900 overflow-hidden">
              {tieneFoto ? (
                <img
                  src={obtenerUrlImagen(urlFoto)}
                  alt={m.nombre}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  onError={(e) => { e.currentTarget.style.display = 'none'; e.currentTarget.nextSibling.style.display = 'flex'; }}
                />
              ) : null}
              <div
                className="absolute inset-0 flex items-center justify-center"
                style={{ display: tieneFoto ? 'none' : 'flex' }}
              >
                <span className="text-4xl font-black text-sky-400/50 dark:text-sky-500/30 select-none">
                  {m.nombre?.charAt(0).toUpperCase() || '🐾'}
                </span>
              </div>

              {/* Check de selección */}
              {seleccionada && (
                <div className="absolute top-2 right-2 w-6 h-6 bg-sky-500 rounded-full flex items-center justify-center shadow-md">
                  <Check size={13} className="text-white" />
                </div>
              )}
            </div>

            {/* Info */}
            <div className={`px-4 py-3 transition-colors duration-200 ${
              seleccionada ? 'bg-sky-50 dark:bg-sky-950/30' : 'bg-white dark:bg-slate-900'
            }`}>
              <p className="font-bold text-slate-800 dark:text-slate-100 text-sm">{m.nombre}</p>
              <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">
                {m.especie}{m.raza ? ` · ${m.raza}` : ''}
              </p>
            </div>
          </button>
        );
      })}
    </div>
  );
};

export default PasadorMascota;
