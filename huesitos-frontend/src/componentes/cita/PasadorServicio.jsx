import { Stethoscope, Check, CircleDollarSign } from 'lucide-react';

/**
 * PasadorServicio — Paso 2 del flujo de reserva de cita.
 */
const PasadorServicio = ({ servicios, servicioSeleccionado, mascota, onSeleccionar }) => (
  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-[420px] overflow-y-auto pr-1">
    {servicios.map((s) => {
      const seleccionado = servicioSeleccionado?.id === s.id;
      return (
        <button
          key={s.id}
          onClick={() => onSeleccionar(s)}
          className={`flex items-center gap-3 p-4 rounded-xl border-2 transition-all duration-200 text-left ${
            seleccionado
              ? 'border-sky-500 bg-sky-50 dark:bg-sky-950/30 shadow-md shadow-sky-500/10'
              : 'border-slate-200 dark:border-slate-700 hover:border-sky-300 dark:hover:border-sky-700 bg-white dark:bg-slate-900'
          }`}
        >
          <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 flex items-center justify-center shrink-0">
            <Stethoscope size={18} className="text-emerald-500" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-bold text-slate-800 dark:text-slate-100 text-sm truncate">{s.nombre}</p>
            {s.descripcion && (
              <p className="text-[11px] text-slate-400 dark:text-slate-500 truncate">{s.descripcion}</p>
            )}
          </div>
          <div className="text-right shrink-0 space-y-1">
            <p className="text-sm font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1 justify-end">
              <CircleDollarSign size={13} />
              S/ {Number(s.precioRegular || s.precio || 0).toFixed(2)}
            </p>
            {seleccionado && <Check size={14} className="text-sky-500 ml-auto" />}
          </div>
        </button>
      );
    })}
  </div>
);

export default PasadorServicio;
