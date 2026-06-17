import { PawPrint, Stethoscope, UserRound, CalendarClock, Check } from 'lucide-react';

const PASOS = [
  { num: 1, label: 'Mascota', icono: PawPrint },
  { num: 2, label: 'Servicio', icono: Stethoscope },
  { num: 3, label: 'Profesional', icono: UserRound },
  { num: 4, label: 'Horario', icono: CalendarClock },
];

/**
 * StepperCita — Indicador de progreso del flujo de agendamiento.
 */
const StepperCita = ({ pasoActual }) => (
  <div className="flex items-center justify-between">
    {PASOS.map((paso, i) => {
      const Icono = paso.icono;
      const esActivo = pasoActual === paso.num;
      const esCompletado = pasoActual > paso.num;
      return (
        <div key={paso.num} className="flex items-center flex-1">
          <div className="flex flex-col items-center flex-1">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-300 ${
              esActivo
                ? 'bg-sky-500 text-white shadow-lg shadow-sky-500/30 scale-110'
                : esCompletado
                  ? 'bg-emerald-100 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-500'
            }`}>
              {esCompletado ? <Check size={18} /> : <Icono size={18} />}
            </div>
            <span className={`text-[10px] sm:text-xs font-semibold mt-1.5 transition-colors ${
              esActivo ? 'text-sky-600 dark:text-sky-400' : esCompletado ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-400 dark:text-slate-500'
            }`}>
              {paso.label}
            </span>
          </div>
          {i < PASOS.length - 1 && (
            <div className={`h-0.5 w-full mx-2 rounded transition-colors duration-300 ${
              pasoActual > paso.num ? 'bg-emerald-300 dark:bg-emerald-700' : 'bg-slate-200 dark:bg-slate-700'
            }`} />
          )}
        </div>
      );
    })}
  </div>
);

export default StepperCita;
