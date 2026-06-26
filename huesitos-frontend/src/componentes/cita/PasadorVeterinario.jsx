import { UserRound, Check } from 'lucide-react';
import { obtenerUrlImagen } from '@/servicios/imagenServicio';

/**
 * PasadorVeterinario — Paso 3 del flujo de reserva de cita.
 */
const PasadorVeterinario = ({ veterinarios, veterinarioSeleccionado, onSeleccionar }) => (
  <div className="space-y-3">
    {/* Opción sin preferencia */}
    <button
      onClick={() => onSeleccionar(null)}
      className={`w-full flex items-center gap-3 p-4 rounded-xl border-2 transition-all duration-200 text-left ${
        veterinarioSeleccionado === null
          ? 'border-sky-500 bg-sky-50 dark:bg-sky-950/30 shadow-md shadow-sky-500/10'
          : 'border-slate-200 dark:border-slate-700 hover:border-sky-300 dark:hover:border-sky-700 bg-white dark:bg-slate-900'
      }`}
    >
      <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center shrink-0">
        <UserRound size={18} className="text-slate-400 dark:text-slate-500" />
      </div>
      <div>
        <p className="font-bold text-slate-800 dark:text-slate-100 text-sm">Sin preferencia</p>
        <p className="text-[11px] text-slate-400 dark:text-slate-500">La clínica asignará al profesional disponible</p>
      </div>
      {veterinarioSeleccionado === null && <Check size={18} className="text-sky-500 ml-auto" />}
    </button>

    {/* Lista de veterinarios */}
    {veterinarios.length > 0 && (
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {veterinarios.map((v) => {
          const urlFoto = v.fotoPerfilUrl || '';
          const tieneFoto = urlFoto && !urlFoto.includes('defecto-');
          const seleccionado = veterinarioSeleccionado?.id === v.id;

          return (
            <button
              key={v.id}
              onClick={() => onSeleccionar(v)}
              className={`flex items-center gap-3 p-4 rounded-xl border-2 transition-all duration-200 text-left ${
                seleccionado
                  ? 'border-sky-500 bg-sky-50 dark:bg-sky-950/30 shadow-md shadow-sky-500/10'
                  : 'border-slate-200 dark:border-slate-700 hover:border-sky-300 dark:hover:border-sky-700 bg-white dark:bg-slate-900'
              }`}
            >
              {/* Avatar con foto */}
              <div className="w-10 h-10 rounded-xl overflow-hidden bg-gradient-to-tr from-violet-500 to-purple-400 flex items-center justify-center shrink-0 relative">
                {tieneFoto ? (
                  <img
                    src={obtenerUrlImagen(urlFoto)}
                    alt={v.nombre}
                    className="w-full h-full object-cover"
                    onError={(e) => { e.currentTarget.style.display = 'none'; }}
                  />
                ) : (
                  <span className="text-white font-bold text-sm">
                    {(v.nombre || v.correo)?.charAt(0).toUpperCase() || 'V'}
                  </span>
                )}
              </div>
              <div className="min-w-0 flex-1">
                <p className="font-bold text-slate-800 dark:text-slate-100 text-sm truncate">
                  {v.nombre ? `${v.nombre} ${v.apellido || ''}`.trim() : v.correo}
                </p>
                <p className="text-[11px] text-slate-400 dark:text-slate-500">Veterinario/a</p>
              </div>
              {seleccionado && <Check size={16} className="text-sky-500 shrink-0" />}
            </button>
          );
        })}
      </div>
    )}

    {veterinarios.length === 0 && (
      <p className="text-xs text-slate-400 dark:text-slate-500 text-center py-4">
        No se pudieron cargar los veterinarios. La clínica asignará uno.
      </p>
    )}
  </div>
);

export default PasadorVeterinario;
