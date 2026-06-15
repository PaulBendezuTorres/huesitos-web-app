import { useState, useEffect } from "react";
import { obtenerReporteDiario, obtenerTransacciones, procesarPago } from '@/servicios/finanzasServicio';
import { Wallet, Banknote, CreditCard, Smartphone, Calendar } from 'lucide-react';
import CargadorSpinner from '@/componentes/comun/CargadorSpinner';
import TablaTransacciones from '@/componentes/finanzas/TablaTransacciones';

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



  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* CABECERA Y FILTRO (Siempre visible para evitar Layout Shift) */}
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

      {loading && !reporte ? (
        <div className="flex flex-col items-center justify-center min-h-[400px] gap-3 bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200/60 dark:border-slate-700/60 shadow-sm">
          <CargadorSpinner size="lg" />
          <span className="text-slate-500 dark:text-slate-400 text-sm font-semibold animate-pulse">Calculando métricas financieras...</span>
        </div>
      ) : (
        <>
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
      <TablaTransacciones 
        transacciones={transacciones} 
        onAprobarPago={handleAprobarPago} 
      />
      </>
      )}
    </div>
  );
};

export default PaginaFinanzas;