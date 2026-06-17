import { Clock } from 'lucide-react';

/**
 * PasadorHorario — Paso 4 del flujo de reserva de cita.
 */
const PasadorHorario = ({ fechaSeleccionada, horaSeleccionada, fechaMinima, horariosDisponibles, onFechaChange, onHoraChange }) => (
  <div className="space-y-5">
    {/* Selector de fecha */}
    <div>
      <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2 block">
        Fecha
      </label>
      <input
        type="date"
        value={fechaSeleccionada}
        min={fechaMinima}
        onChange={(e) => onFechaChange(e.target.value)}
        className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-sm text-slate-700 dark:text-slate-200 focus:border-sky-400 focus:ring-2 focus:ring-sky-100 dark:focus:ring-sky-900/30 outline-none transition-all"
      />
    </div>

    {/* Grid de horarios */}
    {fechaSeleccionada && (
      <div>
        <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2 block">
          Horarios disponibles
        </label>
        {horariosDisponibles.length === 0 ? (
          <div className="text-center py-10 bg-slate-50 dark:bg-slate-950/40 rounded-xl border border-slate-200 dark:border-slate-800">
            <Clock size={28} className="text-slate-300 dark:text-slate-600 mx-auto mb-2" />
            <p className="text-sm text-slate-500 dark:text-slate-400 font-semibold">
              No hay horarios disponibles para esta fecha
            </p>
            <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">
              Intenta con otro día o profesional
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-3 sm:grid-cols-5 lg:grid-cols-6 gap-2">
            {horariosDisponibles.map((hora) => (
              <button
                key={hora}
                onClick={() => onHoraChange(hora)}
                className={`py-2.5 px-3 rounded-xl text-sm font-bold transition-all duration-200 ${
                  horaSeleccionada === hora
                    ? 'bg-sky-500 text-white shadow-lg shadow-sky-500/20 scale-105'
                    : 'bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:border-sky-300 dark:hover:border-sky-600 hover:bg-sky-50 dark:hover:bg-sky-950/30'
                }`}
              >
                {hora}
              </button>
            ))}
          </div>
        )}
      </div>
    )}
  </div>
);

export default PasadorHorario;
