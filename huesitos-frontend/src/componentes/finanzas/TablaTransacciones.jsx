import { useState } from 'react';
import { Clock, CheckCircle } from 'lucide-react';
import Paginacion from '@/componentes/comun/Paginacion';

const TablaTransacciones = ({ transacciones = [], onAprobarPago }) => {
  const [paginaActual, setPaginaActual] = useState(1);
  const [itemsPorPagina, setItemsPorPagina] = useState(10);

  const getEstadoBadge = (estado) => {
    switch (estado) {
      case "APROBADO": 
        return "bg-emerald-50 dark:bg-emerald-950/30 text-emerald-600 dark:text-emerald-400 border-emerald-200 dark:border-emerald-900/50";
      case "PENDIENTE": 
        return "bg-amber-50 dark:bg-amber-950/30 text-amber-600 dark:text-amber-400 border-amber-200 dark:border-amber-900/50";
      case "RECHAZADO": 
        return "bg-red-50 dark:bg-red-950/30 text-red-600 dark:text-red-400 border-red-200 dark:border-red-900/50";
      default: 
        return "bg-slate-50 dark:bg-slate-800/50 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-750";
    }
  };

  // Ajustar la página si las transacciones se reducen
  const totalPaginas = Math.ceil(transacciones.length / itemsPorPagina);
  const paginaValida = paginaActual > totalPaginas ? Math.max(1, totalPaginas) : paginaActual;

  const transaccionesPaginadas = transacciones.slice(
    (paginaValida - 1) * itemsPorPagina,
    paginaValida * itemsPorPagina
  );

  return (
    <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200/60 dark:border-slate-700/60 overflow-hidden flex flex-col">
      <div className="p-6 border-b border-slate-100 dark:border-slate-700/60 flex justify-between items-center bg-slate-50/50 dark:bg-slate-900/40">
        <h2 className="text-lg font-black text-slate-800 dark:text-slate-100">Historial Global de Transacciones</h2>
        <span className="text-xs bg-white dark:bg-slate-700 text-slate-600 dark:text-slate-350 font-bold px-3 py-1 rounded-lg border border-slate-200 dark:border-slate-600 shadow-sm">
          {transacciones.length} {transacciones.length === 1 ? 'Registro' : 'Registros'}
        </span>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-slate-100 dark:divide-slate-700">
          <thead className="bg-slate-50/50 dark:bg-slate-900/40">
            <tr>
              <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest">ID / Fecha</th>
              <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest">Monto</th>
              <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest">Medio</th>
              <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest">Estado</th>
              <th className="px-6 py-4 text-center text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest">Acción de Caja</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-700 text-sm">
            {transaccionesPaginadas.map((tx) => (
              <tr key={tx.id} className="hover:bg-slate-50 dark:hover:bg-slate-700/40 transition-colors">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="font-bold text-slate-800 dark:text-slate-100">#{tx.id}</div>
                  <div className="text-[10px] text-slate-400 dark:text-slate-500 flex items-center gap-1 mt-0.5">
                    <Clock size={12} /> {new Date(tx.fechaCreacion).toLocaleString('es-PE', { dateStyle: 'short', timeStyle: 'short' })}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap font-black text-slate-900 dark:text-slate-100 text-lg">
                  S/ {tx.monto.toFixed(2)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap font-bold text-slate-650 dark:text-slate-400">
                  {tx.medioPago || "—"}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-3 py-1 rounded-lg text-[10px] font-black tracking-widest uppercase border ${getEstadoBadge(tx.estadoPago)}`}>
                    {tx.estadoPago}
                  </span>
                </td>
                <td className="px-6 py-4 text-center whitespace-nowrap">
                  {tx.estadoPago === "PENDIENTE" ? (
                    <button 
                      onClick={() => onAprobarPago(tx.id)}
                      className="bg-emerald-100 dark:bg-emerald-900/40 hover:bg-emerald-200 dark:hover:bg-emerald-900/70 text-emerald-750 dark:text-emerald-400 px-4 py-2 rounded-xl text-xs font-bold shadow-sm transition-all flex items-center gap-1.5 mx-auto active:scale-95 duration-150"
                    >
                      <CheckCircle size={16} /> Cobrar
                    </button>
                  ) : (
                    <span className="text-slate-350 dark:text-slate-600 font-bold">—</span>
                  )}
                </td>
              </tr>
            ))}
            {transacciones.length === 0 && (
              <tr>
                <td colSpan="5" className="text-center py-12 text-slate-400 dark:text-slate-500 font-medium bg-slate-50/50 dark:bg-slate-800/50">
                  No se encontraron transacciones registradas.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {transacciones.length > 0 && (
        <Paginacion
          paginaActual={paginaValida}
          totalItems={transacciones.length}
          itemsPorPagina={itemsPorPagina}
          onPaginaChange={setPaginaActual}
          onItemsPorPaginaChange={setItemsPorPagina}
          opcionesFilas={[5, 10, 20, 50]}
          singularLabel="transacción"
          pluralLabel="transacciones"
        />
      )}
    </div>
  );
};

export default TablaTransacciones;
