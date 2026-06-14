import { useState, useEffect } from "react";
import { obtenerReporteDiario, obtenerTransacciones, procesarPago } from '@/servicios/finanzasServicio';
import { Wallet, Banknote, CreditCard, Smartphone, CheckCircle, Clock, Calendar } from 'lucide-react';
import CargadorSpinner from '@/componentes/comun/CargadorSpinner';

const PaginaFinanzas = () => {
  const [reporte, setReporte] = useState(null);
  const [transacciones, setTransacciones] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  
  // Por defecto carga la fecha de hoy
  const [fechaConsulta, setFechaConsulta] = useState(new Date().toISOString().split("T")[0]);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [dataReporte, dataTransacciones] = await Promise.all([
          obtenerReporteDiario(fechaConsulta),
          obtenerTransacciones()
        ]);
        setReporte(dataReporte);
        setTransacciones(dataTransacciones);
      } catch (error) {
        console.error("Error al cargar los datos financieros:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fechaConsulta, refreshTrigger]);

  const handleAprobarPago = async (id) => {
    const medio = window.prompt("Ingrese el Medio de Pago (EFECTIVO, TARJETA_DEBITO, YAPE, PLIN):", "EFECTIVO");
    if (!medio) return;

    try {
      await procesarPago(id, medio.toUpperCase(), "CAJA_MANUAL");
      setRefreshTrigger(prev => prev + 1);
      alert("Pago procesado exitosamente en caja.");
    } catch (_error) {
      console.error(_error);
      alert("Error al procesar el pago. Verifica el medio ingresado.");
    }
  };

  const getEstadoBadge = (estado) => {
    switch (estado) {
      case "APROBADO": return "bg-emerald-50 text-emerald-600 border-emerald-200";
      case "PENDIENTE": return "bg-amber-50 text-amber-600 border-amber-200";
      case "RECHAZADO": return "bg-red-50 text-red-600 border-red-200";
      default: return "bg-slate-50 text-slate-600 border-slate-200";
    }
  };

  if (loading && !reporte) {
    return (
      <div className="flex flex-col items-center justify-center h-64 gap-3 bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200/60 dark:border-slate-700/60 shadow-sm">
        <CargadorSpinner size="lg" />
        <span className="text-slate-500 dark:text-slate-400 text-sm font-semibold animate-pulse">Calculando métricas financieras...</span>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* CABECERA Y FILTRO */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200/60 dark:border-slate-700/60 shadow-sm">
        <div>
          <h1 className="text-2xl font-black text-slate-800 dark:text-slate-100 tracking-tight">Caja y Finanzas</h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">Control de ingresos, cuadre de caja y registro de transacciones.</p>
        </div>
        <div className="flex items-center gap-3 bg-slate-50 dark:bg-slate-700 p-1.5 rounded-xl border border-slate-200 dark:border-slate-600">
          <Calendar className="ml-2 text-slate-400" size={16} />
          <input 
            type="date" 
            value={fechaConsulta} 
            onChange={(e) => setFechaConsulta(e.target.value)}
            className="border-none bg-transparent font-bold text-slate-800 dark:text-slate-100 focus:ring-0 outline-none text-sm cursor-pointer"
          />
        </div>
      </div>

      {/* MÉTRICAS FINANCIERAS */}
      {reporte && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-gradient-to-tr from-emerald-500 to-teal-400 p-6 rounded-2xl shadow-xl shadow-emerald-500/20 text-white relative overflow-hidden">
            <Wallet className="absolute -right-4 -bottom-4 text-white/20 w-32 h-32" />
            <h3 className="font-bold text-xs uppercase tracking-widest text-emerald-100 relative z-10">Ingresos Totales</h3>
            <p className="text-4xl font-black mt-2 relative z-10">S/ {reporte.totalIngresos?.toFixed(2)}</p>
          </div>
          <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-slate-200/60 dark:border-slate-700/60 hover:border-sky-300 transition-colors">
            <h3 className="text-slate-400 dark:text-slate-500 font-bold text-xs uppercase tracking-widest flex items-center gap-2"><Banknote size={16}/> Efectivo</h3>
            <p className="text-2xl font-black text-slate-800 dark:text-slate-100 mt-2">S/ {reporte.ingresosEfectivo?.toFixed(2)}</p>
          </div>
          <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-slate-200/60 dark:border-slate-700/60 hover:border-indigo-300 transition-colors">
            <h3 className="text-slate-400 dark:text-slate-500 font-bold text-xs uppercase tracking-widest flex items-center gap-2"><CreditCard size={16}/> Tarjetas</h3>
            <p className="text-2xl font-black text-slate-800 dark:text-slate-100 mt-2">S/ {reporte.ingresosTarjeta?.toFixed(2)}</p>
          </div>
          <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-slate-200/60 dark:border-slate-700/60 hover:border-purple-300 transition-colors">
            <h3 className="text-slate-400 dark:text-slate-500 font-bold text-xs uppercase tracking-widest flex items-center gap-2"><Smartphone size={16}/> Transferencias</h3>
            <p className="text-2xl font-black text-slate-800 dark:text-slate-100 mt-2">S/ {reporte.ingresosTransferencia?.toFixed(2)}</p>
          </div>
        </div>
      )}

      {/* TABLA DE TRANSACCIONES */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200/60 dark:border-slate-700/60 overflow-hidden">
        <div className="p-6 border-b border-slate-100 dark:border-slate-700 flex justify-between items-center bg-slate-50/50 dark:bg-slate-900/40">
          <h2 className="text-lg font-black text-slate-800 dark:text-slate-100">Historial Global de Transacciones</h2>
          <span className="text-xs bg-white dark:bg-slate-700 text-slate-600 dark:text-slate-300 font-bold px-3 py-1 rounded-lg border border-slate-200 dark:border-slate-600 shadow-sm">
            {transacciones.length} Registros
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
              {transacciones.map((tx) => (
                <tr key={tx.id} className="hover:bg-slate-50 dark:hover:bg-slate-700/40 transition-colors">
                  <td className="px-6 py-4">
                    <div className="font-bold text-slate-800 dark:text-slate-100">#{tx.id}</div>
                    <div className="text-[10px] text-slate-400 dark:text-slate-500 flex items-center gap-1 mt-0.5"><Clock size={12}/> {new Date(tx.fechaCreacion).toLocaleString('es-PE', { dateStyle: 'short', timeStyle: 'short' })}</div>
                  </td>
                  <td className="px-6 py-4 font-black text-slate-900 dark:text-slate-100 text-lg">S/ {tx.monto.toFixed(2)}</td>
                  <td className="px-6 py-4 font-bold text-slate-600 dark:text-slate-400">{tx.medioPago || "—"}</td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-lg text-[10px] font-black tracking-widest uppercase border ${getEstadoBadge(tx.estadoPago)}`}>
                      {tx.estadoPago}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-center">
                    {tx.estadoPago === "PENDIENTE" ? (
                      <button 
                        onClick={() => handleAprobarPago(tx.id)}
                        className="bg-emerald-100 dark:bg-emerald-900/40 hover:bg-emerald-200 dark:hover:bg-emerald-900/70 text-emerald-700 dark:text-emerald-400 px-4 py-2 rounded-xl text-xs font-bold shadow-sm transition-all flex items-center gap-1.5 mx-auto"
                      >
                        <CheckCircle size={16} /> Cobrar
                      </button>
                    ) : (
                      <span className="text-slate-300 dark:text-slate-600 font-bold">—</span>
                    )}
                  </td>
                </tr>
              ))}
              {transacciones.length === 0 && (
                <tr>
                  <td colSpan="5" className="text-center py-10 text-slate-400 dark:text-slate-500 font-medium bg-slate-50/50 dark:bg-slate-800/50">No se encontraron transacciones registradas.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default PaginaFinanzas;