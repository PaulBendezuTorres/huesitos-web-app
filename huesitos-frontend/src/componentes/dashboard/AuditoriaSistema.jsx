import { useState } from 'react';
import { Clock } from 'lucide-react';
import Paginacion from '@/componentes/comun/Paginacion';

const AuditoriaSistema = ({ actividades = [] }) => {
  const [paginaActual, setPaginaActual] = useState(1);
  const [itemsPorPagina, setItemsPorPagina] = useState(5);

  const colorPorTipo = (tipo) => {
    switch (tipo) {
      case "SERVICIO": 
        return "bg-sky-100 text-sky-700 border-sky-200 dark:bg-sky-950/30 dark:text-sky-400 dark:border-sky-900/50";
      case "USUARIO": 
        return "bg-indigo-100 text-indigo-700 border-indigo-200 dark:bg-indigo-950/30 dark:text-indigo-400 dark:border-indigo-900/50";
      case "CONFIGURACION": 
        return "bg-slate-850 text-slate-100 border-slate-700 dark:bg-slate-700 dark:text-slate-200 dark:border-slate-650";
      default: 
        return "bg-slate-100 text-slate-700 border-slate-200 dark:bg-slate-800/50 dark:text-slate-400 dark:border-slate-750";
    }
  };

  // Ajustar la página si las actividades se reducen
  const totalPaginas = Math.ceil(actividades.length / itemsPorPagina);
  const paginaValida = paginaActual > totalPaginas ? Math.max(1, totalPaginas) : paginaActual;

  const actividadesPaginadas = actividades.slice(
    (paginaValida - 1) * itemsPorPagina,
    paginaValida * itemsPorPagina
  );

  return (
    <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200/60 dark:border-slate-700/60 overflow-hidden flex flex-col">
      <div className="border-b border-slate-100 dark:border-slate-700/60 px-6 py-5 bg-slate-50/50 dark:bg-slate-900/40 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Clock className="text-sky-500" size={20} />
          <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100 tracking-tight">Auditoría del Sistema</h3>
        </div>
        <span className="text-xs bg-white dark:bg-slate-700 text-slate-600 dark:text-slate-350 font-bold px-3 py-1 rounded-lg border border-slate-200 dark:border-slate-600 shadow-sm">
          {actividades.length} {actividades.length === 1 ? 'Log' : 'Logs'}
        </span>
      </div>
      
      <div className="p-6 flex-1">
        {actividadesPaginadas.length > 0 ? (
          <div className="divide-y divide-slate-100 dark:divide-slate-700">
            {actividadesPaginadas.map((actividad) => (
              <div key={actividad.id} className="flex items-start gap-4 py-4 first:pt-0 last:pb-0 hover:bg-slate-50/50 dark:hover:bg-slate-700/30 rounded-xl transition-colors px-3">
                <div className={`mt-1 px-3 py-1 rounded-lg text-[10px] font-black tracking-widest border shrink-0 ${colorPorTipo(actividad.tipo)}`}>
                  {actividad.tipo}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-slate-700 dark:text-slate-300 font-medium text-sm leading-relaxed break-words">{actividad.mensaje}</p>
                  <p className="text-slate-400 dark:text-slate-500 text-xs mt-1.5 font-semibold flex items-center gap-1.5">
                    <Clock size={12} />
                    {new Date(actividad.fecha).toLocaleString('es-PE', { dateStyle: 'medium', timeStyle: 'short' })}
                  </p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-10 text-slate-400 dark:text-slate-500 text-sm font-medium">
            No hay actividad reciente registrada en la base de datos.
          </div>
        )}
      </div>

      {actividades.length > 0 && (
        <Paginacion
          paginaActual={paginaValida}
          totalItems={actividades.length}
          itemsPorPagina={itemsPorPagina}
          onPaginaChange={setPaginaActual}
          onItemsPorPaginaChange={setItemsPorPagina}
          opcionesFilas={[5, 10, 15, 20]}
          singularLabel="registro de auditoría"
          pluralLabel="registros de auditoría"
        />
      )}
    </div>
  );
};

export default AuditoriaSistema;
