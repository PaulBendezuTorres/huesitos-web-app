import { useNavigate } from 'react-router-dom';
import { Eye, Syringe, Pencil, Trash2 } from 'lucide-react';

/**
 * TarjetaMascota
 * Tarjeta individual de mascota para el portal del cliente.
 *
 * Props:
 *  - mascota: objeto Mascota
 *  - onEditar: () => void — abre el modal de edición
 *  - onEliminar: () => void — abre el modal de eliminación
 */
const TarjetaMascota = ({ mascota, onEditar, onEliminar }) => {
  const navigate = useNavigate();
  const urlFoto = mascota.fotoUrl || mascota.foto_url || '';
  const tieneFoto = urlFoto && !urlFoto.includes('defecto-mascota');

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/60 dark:border-slate-800 shadow-sm hover:shadow-xl hover:shadow-sky-500/8 dark:hover:shadow-sky-500/5 hover:border-sky-200/80 dark:hover:border-sky-900/60 transition-all duration-300 group overflow-hidden flex flex-col">

      {/* ── Foto / Avatar ── */}
      <div className="relative w-full aspect-[4/3] bg-gradient-to-tr from-sky-100 to-cyan-50 dark:from-sky-950/60 dark:to-slate-900 overflow-hidden shrink-0">

        {tieneFoto ? (
          <img
            src={`http://localhost:8080${urlFoto}`}
            alt={mascota.nombre}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            onError={(e) => {
              e.currentTarget.style.display = 'none';
              e.currentTarget.nextSibling.style.display = 'flex';
            }}
          />
        ) : null}

        {/* Fallback inicial */}
        <div
          className="absolute inset-0 flex items-center justify-center"
          style={{ display: tieneFoto ? 'none' : 'flex' }}
        >
          <span className="text-5xl font-black text-sky-400/60 dark:text-sky-500/40 select-none">
            {mascota.nombre ? mascota.nombre.charAt(0).toUpperCase() : '🐾'}
          </span>
        </div>

        {/* Botones flotantes (editar / eliminar) - solo si se proveen las funciones */}
        {(onEditar || onEliminar) && (
          <div className="absolute top-2.5 right-2.5 flex flex-col gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
            {onEditar && (
              <button
                onClick={onEditar}
                title="Editar mascota"
                className="w-7 h-7 flex items-center justify-center rounded-lg bg-white/90 dark:bg-slate-800/90 text-sky-500 hover:bg-white dark:hover:bg-slate-700 shadow-md transition-all duration-150 backdrop-blur-sm"
              >
                <Pencil size={13} />
              </button>
            )}
            {onEliminar && (
              <button
                onClick={onEliminar}
                title="Eliminar mascota"
                className="w-7 h-7 flex items-center justify-center rounded-lg bg-white/90 dark:bg-slate-800/90 text-rose-400 hover:bg-white dark:hover:bg-slate-700 shadow-md transition-all duration-150 backdrop-blur-sm"
              >
                <Trash2 size={13} />
              </button>
            )}
          </div>
        )}

        {/* Badge peso */}
        {mascota.pesoActual && (
          <div className="absolute bottom-2.5 left-2.5">
            <span className="inline-flex items-center px-2 py-0.5 rounded-lg bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm text-[11px] font-bold text-slate-600 dark:text-slate-300 shadow-sm">
              {mascota.pesoActual} kg
            </span>
          </div>
        )}
      </div>

      {/* ── Info + acciones ── */}
      <div className="p-4 flex flex-col flex-1">
        <div className="mb-3">
          <h4 className="text-base font-bold text-slate-800 dark:text-slate-100 truncate">
            {mascota.nombre}
          </h4>
          <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">
            {mascota.especie}{mascota.raza ? ` · ${mascota.raza}` : ''}
          </p>
        </div>

        <div className="flex gap-2 mt-auto">
          <button
            onClick={() => navigate(`/cliente/mascotas/${mascota.id}/historial`)}
            className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-sky-50 dark:bg-sky-950/30 text-sky-600 dark:text-sky-400 text-xs font-bold hover:bg-sky-100 dark:hover:bg-sky-900/40 transition-all duration-200"
          >
            <Eye size={13} />
            Ver historial
          </button>
          <button
            onClick={() => navigate(`/cliente/mascotas/${mascota.id}/vacunas`)}
            className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 text-slate-500 dark:text-slate-400 text-xs font-bold hover:bg-slate-100 dark:hover:bg-slate-700 transition-all duration-200 border border-slate-200/60 dark:border-slate-700"
          >
            <Syringe size={13} />
            Vacunas
          </button>
        </div>
      </div>
    </div>
  );
};

export default TarjetaMascota;
