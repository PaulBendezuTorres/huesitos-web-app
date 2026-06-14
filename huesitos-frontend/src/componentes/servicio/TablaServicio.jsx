import { useState } from 'react';
import { Edit2, ShieldAlert, ShieldCheck, Stethoscope, Trash2 } from 'lucide-react';
import Paginacion from '@/componentes/comun/Paginacion';

const TablaServicio = ({ servicios, onEditar, onEstado, onEliminar }) => {
  const [paginaActual, setPaginaActual] = useState(1);
  const [itemsPorPagina, setItemsPorPagina] = useState(5);

  if (servicios.length === 0) {
    return (
      <div className="text-center p-8 text-slate-500 dark:text-slate-400 bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700">
        No hay servicios registrados aún.
      </div>
    );
  }

  // Ajustar la página si los servicios se reducen (por ejemplo, al eliminar)
  const totalPaginas = Math.ceil(servicios.length / itemsPorPagina);
  const paginaValida = paginaActual > totalPaginas ? Math.max(1, totalPaginas) : paginaActual;

  const serviciosPaginados = servicios.slice(
    (paginaValida - 1) * itemsPorPagina,
    paginaValida * itemsPorPagina
  );

  return (
    <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200/60 dark:border-slate-700/60 overflow-hidden flex flex-col">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-slate-100 dark:divide-slate-700">
          <thead className="bg-slate-50/50 dark:bg-slate-900/40">
            <tr>
              <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest">Servicio</th>
              <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest">Precio</th>
              <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest">Duración</th>
              <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest">Estado</th>
              <th className="px-6 py-4 text-center text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-700 text-sm">
            {serviciosPaginados.map((servicio) => (
              <tr key={servicio.id} className="hover:bg-sky-50/30 dark:hover:bg-slate-700/40 transition-colors">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-slate-50 dark:bg-slate-700 border border-slate-200/60 dark:border-slate-600/60 overflow-hidden shrink-0 flex items-center justify-center text-slate-400 shadow-inner">
                      {servicio.fotoUrl && servicio.fotoUrl !== '/uploads/defecto-servicio.png' ? (
                        <img src={`http://localhost:8080${servicio.fotoUrl}`} alt={servicio.nombre} className="w-full h-full object-cover" />
                      ) : (
                        <Stethoscope size={20} className="text-slate-350 dark:text-slate-500" />
                      )}
                    </div>
                    <div>
                      <div className="font-bold text-slate-900 dark:text-slate-100">{servicio.nombre}</div>
                      <div className="text-xs text-slate-550 dark:text-slate-400 truncate max-w-[250px]">{servicio.descripcion}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap font-black text-slate-900 dark:text-slate-100">S/. {servicio.precio.toFixed(2)}</td>
                <td className="px-6 py-4 whitespace-nowrap font-semibold text-slate-600 dark:text-slate-400">{servicio.duracionMinutos} min</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`inline-flex px-3 py-1 rounded-lg text-[10px] font-black tracking-widest uppercase border ${servicio.activo ? "bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 border-emerald-200 dark:border-emerald-700" : "bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 border-red-200 dark:border-red-700"}`}>
                     {servicio.activo ? "Activo" : "Inactivo"}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex gap-2 justify-center">
                    <button 
                      onClick={() => onEditar(servicio)} 
                      className="bg-white dark:bg-slate-700 hover:bg-sky-50 dark:hover:bg-sky-900/30 text-sky-600 dark:text-sky-400 p-2 rounded-lg transition-all border border-slate-200 dark:border-slate-600 hover:border-sky-200 dark:hover:border-sky-600 shadow-sm"
                      title="Editar"
                    >
                      <Edit2 size={16} />
                    </button>
                    <button 
                      onClick={() => onEstado(servicio.id, !servicio.activo)} 
                      className={`p-2 rounded-lg transition-all border shadow-sm ${servicio.activo ? "bg-white dark:bg-slate-700 hover:bg-amber-50 dark:hover:bg-amber-900/30 text-slate-400 hover:text-amber-500 border-slate-200 dark:border-slate-600 hover:border-amber-200 dark:hover:border-amber-600" : "bg-white dark:bg-slate-700 hover:bg-emerald-50 dark:hover:bg-emerald-900/30 text-slate-400 hover:text-emerald-500 border-slate-200 dark:border-slate-600 hover:border-emerald-200 dark:hover:border-emerald-600"}`}
                      title={servicio.activo ? "Desactivar" : "Activar"}
                    >
                      {servicio.activo ? <ShieldAlert size={16} /> : <ShieldCheck size={16} />}
                    </button>
                    <button 
                      onClick={() => onEliminar(servicio)} 
                      className="bg-white dark:bg-slate-700 hover:bg-red-50 dark:hover:bg-red-900/30 text-red-650 dark:text-red-400 p-2 rounded-lg transition-all border border-slate-200 dark:border-slate-600 hover:border-red-200 dark:hover:border-red-600 shadow-sm"
                      title="Eliminar"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      {/* Componente de Paginación */}
      <Paginacion
        paginaActual={paginaValida}
        totalItems={servicios.length}
        itemsPorPagina={itemsPorPagina}
        onPaginaChange={setPaginaActual}
        onItemsPorPaginaChange={setItemsPorPagina}
      />
    </div>
  );
};

export default TablaServicio;