import { Calendar, Stethoscope } from 'lucide-react';

const TablaCitasProximas = ({ citas }) => {
  // Filtrar citas pendientes/confirmadas/en espera (próximas)
  const citasProximas = citas.filter(
    (c) => c.estado === 'PENDIENTE' || c.estado === 'CONFIRMADA' || c.estado === 'EN_ESPERA'
  );

  const badgeEstado = (estado) => {
    const estilos = {
      PENDIENTE: 'bg-amber-50 text-amber-700 border-amber-100 dark:bg-amber-950/20 dark:text-amber-400 dark:border-amber-900/30',
      CONFIRMADA: 'bg-emerald-50 text-emerald-700 border-emerald-100 dark:bg-emerald-950/20 dark:text-emerald-400 dark:border-emerald-900/30',
      EN_ESPERA: 'bg-sky-50 text-sky-700 border-sky-100 dark:bg-sky-950/20 dark:text-sky-400 dark:border-sky-900/30',
      COMPLETADA: 'bg-slate-50 text-slate-500 border-slate-100 dark:bg-slate-800/30 dark:text-slate-400 dark:border-slate-700/30',
      CANCELADA: 'bg-red-50 text-red-600 border-red-100 dark:bg-red-950/20 dark:text-red-400 dark:border-red-900/30',
    };
    return estilos[estado] || 'bg-slate-50 text-slate-500 border-slate-100 dark:bg-slate-800/30 dark:text-slate-400 dark:border-slate-750';
  };

  const formatearEstado = (estado) => {
    const nombres = {
      PENDIENTE: 'Pendiente',
      CONFIRMADA: 'Confirmada',
      EN_ESPERA: 'En espera',
      COMPLETADA: 'Completada',
      CANCELADA: 'Cancelada',
    };
    return nombres[estado] || estado;
  };

  return (
    <div>
      <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100 tracking-tight mb-1 transition-colors duration-300">
        Próximas citas
      </h2>
      <p className="text-sm text-slate-400 dark:text-slate-500 mb-5 transition-colors duration-300">
        Tus citas agendadas y confirmadas
      </p>

      {citasProximas.length === 0 ? (
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/60 dark:border-slate-800 p-10 text-center shadow-sm transition-all duration-300">
          <div className="w-14 h-14 bg-emerald-50 dark:bg-emerald-950/30 rounded-2xl flex items-center justify-center mx-auto mb-3 transition-colors duration-300">
            <Calendar size={24} className="text-emerald-500 dark:text-emerald-400" />
          </div>
          <h3 className="text-base font-bold text-slate-700 dark:text-slate-200 mb-1 transition-colors duration-300">
            No tienes citas pendientes
          </h3>
          <p className="text-sm text-slate-400 dark:text-slate-500 transition-colors duration-300">
            Agenda una cita desde el menú lateral.
          </p>
        </div>
      ) : (
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/60 dark:border-slate-800 shadow-sm overflow-hidden transition-all duration-300">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-100 dark:border-slate-850 bg-slate-50/50 dark:bg-slate-950/50 transition-colors duration-300">
                  <th className="text-left px-6 py-3.5 text-xs font-semibold text-slate-500 dark:text-slate-400 tracking-wider">Fecha / hora</th>
                  <th className="text-left px-6 py-3.5 text-xs font-semibold text-slate-500 dark:text-slate-400 tracking-wider">Servicio</th>
                  <th className="text-left px-6 py-3.5 text-xs font-semibold text-slate-500 dark:text-slate-400 tracking-wider">Mascota</th>
                  <th className="text-left px-6 py-3.5 text-xs font-semibold text-slate-500 dark:text-slate-400 tracking-wider">Estado</th>
                </tr>
              </thead>
              <tbody>
                {citasProximas.map((cita) => {
                  const fecha = cita.fechaHora
                    ? new Date(cita.fechaHora).toLocaleDateString('es-PE', { day: '2-digit', month: 'short', year: 'numeric' })
                    : '—';
                  const hora = cita.fechaHora
                    ? new Date(cita.fechaHora).toLocaleTimeString('es-PE', { hour: '2-digit', minute: '2-digit' })
                    : '';

                  return (
                    <tr
                      key={cita.id}
                      className="border-b border-slate-50 dark:border-slate-850 last:border-0 hover:bg-slate-50/60 dark:hover:bg-slate-850/40 transition-colors duration-200"
                    >
                      <td className="px-6 py-4">
                        <p className="text-sm font-bold text-slate-700 dark:text-slate-200 transition-colors duration-300">{fecha}</p>
                        <p className="text-xs text-slate-400 dark:text-slate-500 transition-colors duration-300">{hora}</p>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <Stethoscope size={16} className="text-sky-500 dark:text-sky-400 shrink-0" />
                          <span className="text-sm font-semibold text-slate-600 dark:text-slate-300 transition-colors duration-300">
                            {cita.servicio?.nombre || 'Consulta'}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-sm text-slate-600 dark:text-slate-300 transition-colors duration-300">
                          {cita.mascota?.nombre || '—'}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center px-2.5 py-1 rounded-lg text-[11px] font-semibold border ${badgeEstado(cita.estado)}`}>
                          {formatearEstado(cita.estado)}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default TablaCitasProximas;
