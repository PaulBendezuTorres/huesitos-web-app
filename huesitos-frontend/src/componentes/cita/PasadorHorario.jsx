import { Clock, Sun, Sunset, Calendar } from 'lucide-react';

/**
 * PasadorHorario — Paso 4 del flujo de reserva de cita con interfaz Premium.
 */
const PasadorHorario = ({
  fechaSeleccionada,
  horaSeleccionada,
  fechaMinima,
  horariosDisponibles,
  onFechaChange,
  onHoraChange,
}) => {
  // Clasificar horarios por jornada
  const horariosManana = horariosDisponibles.filter((h) => h < '12:00');
  const horariosTarde = horariosDisponibles.filter((h) => h >= '12:00');

  const renderBotonHorario = (hora) => {
    const seleccionado = horaSeleccionada === hora;
    return (
      <button
        key={hora}
        type="button"
        onClick={() => onHoraChange(hora)}
        className={`py-3 px-4 rounded-2xl text-sm font-black tracking-wide transition-all duration-250 flex items-center justify-center gap-1.5 focus:outline-none focus:ring-2 focus:ring-sky-500/30 ${
          seleccionado
            ? 'bg-gradient-to-r from-sky-500 to-sky-600 text-white shadow-lg shadow-sky-500/25 scale-[1.03] border border-sky-400/30'
            : 'bg-slate-50/50 dark:bg-slate-950/40 text-slate-700 dark:text-slate-300 border border-slate-200/70 dark:border-slate-850 hover:border-sky-400 dark:hover:border-sky-500/60 hover:bg-sky-50/50 dark:hover:bg-sky-950/20 active:scale-95'
        }`}
      >
        <Clock size={13} className={seleccionado ? 'text-white/80' : 'text-slate-400'} />
        <span>{hora}</span>
      </button>
    );
  };

  return (
    <div className="space-y-6">
      {/* Selector de fecha con icono premium */}
      <div className="space-y-2">
        <label className="text-[11px] font-extrabold text-slate-400 dark:text-slate-550 uppercase tracking-widest flex items-center gap-1.5">
          <Calendar size={13} className="text-sky-500" />
          <span>Selecciona la Fecha de Atención</span>
        </label>
        <div className="relative">
          <input
            type="date"
            value={fechaSeleccionada}
            min={fechaMinima}
            onChange={(e) => onFechaChange(e.target.value)}
            className="w-full pl-5 pr-5 py-3.5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/40 dark:bg-slate-950/40 text-sm font-bold text-slate-700 dark:text-slate-200 focus:border-sky-500 dark:focus:border-sky-400 focus:bg-white dark:focus:bg-slate-900 focus:ring-4 focus:ring-sky-500/5 outline-none transition-all duration-300"
          />
        </div>
      </div>

      {/* Grid de horarios */}
      {fechaSeleccionada ? (
        <div className="space-y-6 animate-in fade-in duration-300">
          <label className="text-[11px] font-extrabold text-slate-400 dark:text-slate-550 uppercase tracking-widest flex items-center gap-1.5 mb-2">
            <Clock size={13} className="text-sky-500" />
            <span>Horarios Disponibles de Consulta</span>
          </label>

          {horariosDisponibles.length === 0 ? (
            <div className="text-center py-12 bg-slate-50/40 dark:bg-slate-950/40 rounded-2xl border border-slate-200/60 dark:border-slate-850">
              <Clock size={32} className="text-slate-350 dark:text-slate-650 mx-auto mb-3 animate-bounce" />
              <p className="text-sm text-slate-700 dark:text-slate-300 font-bold">
                No hay horarios de atención disponibles para este día
              </p>
              <p className="text-xs text-slate-450 dark:text-slate-500 mt-1 max-w-xs mx-auto">
                Prueba seleccionando otra fecha o cambia el profesional a cargo de la cita.
              </p>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Turno Mañana */}
              {horariosManana.length > 0 && (
                <div className="space-y-3">
                  <div className="flex items-center gap-2 border-b border-slate-100 dark:border-slate-850 pb-2">
                    <Sun size={15} className="text-amber-500" />
                    <h4 className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                      Turno Mañana
                    </h4>
                    <span className="text-[10px] bg-slate-100 dark:bg-slate-800 text-slate-550 dark:text-slate-400 px-2 py-0.5 rounded-full font-bold">
                      {horariosManana.length} {horariosManana.length === 1 ? 'disponible' : 'disponibles'}
                    </span>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-3">
                    {horariosManana.map(renderBotonHorario)}
                  </div>
                </div>
              )}

              {/* Turno Tarde */}
              {horariosTarde.length > 0 && (
                <div className="space-y-3 pt-2">
                  <div className="flex items-center gap-2 border-b border-slate-100 dark:border-slate-850 pb-2">
                    <Sunset size={15} className="text-sky-500" />
                    <h4 className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                      Turno Tarde
                    </h4>
                    <span className="text-[10px] bg-slate-100 dark:bg-slate-800 text-slate-550 dark:text-slate-400 px-2 py-0.5 rounded-full font-bold">
                      {horariosTarde.length} {horariosTarde.length === 1 ? 'disponible' : 'disponibles'}
                    </span>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-3">
                    {horariosTarde.map(renderBotonHorario)}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      ) : (
        <div className="text-center py-14 bg-slate-50/30 dark:bg-slate-950/20 rounded-2xl border-2 border-dashed border-slate-200 dark:border-slate-850 p-6 transition-all duration-300">
          <div className="w-14 h-14 bg-sky-50 dark:bg-sky-950/30 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Clock size={24} className="text-sky-500 dark:text-sky-400 animate-pulse" />
          </div>
          <h4 className="text-sm font-bold text-slate-700 dark:text-slate-200 mb-1.5">
            Esperando fecha de agendamiento
          </h4>
          <p className="text-xs text-slate-400 dark:text-slate-550 max-w-[300px] mx-auto leading-relaxed">
            Por favor, selecciona un día en el selector superior para cargar los bloques de horarios disponibles de la veterinaria.
          </p>
        </div>
      )}
    </div>
  );
};

export default PasadorHorario;

