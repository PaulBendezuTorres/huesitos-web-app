import { useTablero } from '@/hooks/useTablero';
import { Activity, Users, Stethoscope, Wallet, RefreshCw } from 'lucide-react';
import AuditoriaSistema from '@/componentes/dashboard/AuditoriaSistema';

const TableroAnaliticas = () => {
  const { stats, loading, refetch } = useTablero();

  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center h-64 text-sky-600 font-semibold animate-pulse gap-3">
        <RefreshCw className="animate-spin" size={32} />
        <p>Cargando métricas en tiempo real...</p>
      </div>
    );
  }



  return (
    <div className="space-y-6">
      {/* CABECERA */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center bg-white/80 dark:bg-slate-800/80 backdrop-blur-md p-6 rounded-2xl border border-slate-200/60 dark:border-slate-700/60 shadow-sm">
        <div>
          <h2 className="text-2xl font-black text-slate-800 dark:text-slate-100 tracking-tight">Resumen Estadístico</h2>
          <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">Métricas en tiempo real desde la base de datos MySQL.</p>
        </div>
        <button 
          onClick={refetch} 
          className="mt-4 sm:mt-0 px-4 py-2.5 bg-white dark:bg-slate-700 hover:bg-slate-50 dark:hover:bg-slate-600 border border-slate-200 dark:border-slate-600 shadow-sm rounded-xl text-sm font-bold text-slate-600 dark:text-slate-200 transition-all flex items-center gap-2 hover:text-sky-600 dark:hover:text-sky-400"
        >
          <RefreshCw size={16} /> Sincronizar Datos
        </button>
      </div>

      {/* TARJETAS DE MÉTRICAS */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        
        <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-slate-200/60 dark:border-slate-700/60 hover:shadow-lg hover:shadow-sky-500/10 transition-all group relative overflow-hidden">
          <div className="absolute -right-6 -top-6 bg-sky-50 dark:bg-sky-500/10 w-24 h-24 rounded-full blur-2xl group-hover:bg-sky-100 transition-all"></div>
          <div className="flex items-center justify-between mb-4 relative z-10">
            <h3 className="text-slate-500 dark:text-slate-400 font-bold text-xs uppercase tracking-wider">Servicios Totales</h3>
            <div className="bg-sky-100 dark:bg-sky-900/40 text-sky-600 dark:text-sky-400 p-2.5 rounded-xl"><Stethoscope size={20} /></div>
          </div>
          <p className="text-4xl font-black text-slate-800 dark:text-slate-100 relative z-10">{stats.totalServicios}</p>
        </div>

        <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-slate-200/60 dark:border-slate-700/60 hover:shadow-lg hover:shadow-emerald-500/10 transition-all group relative overflow-hidden">
          <div className="absolute -right-6 -top-6 bg-emerald-50 dark:bg-emerald-500/10 w-24 h-24 rounded-full blur-2xl group-hover:bg-emerald-100 transition-all"></div>
          <div className="flex items-center justify-between mb-4 relative z-10">
            <h3 className="text-slate-500 dark:text-slate-400 font-bold text-xs uppercase tracking-wider">Servicios Activos</h3>
            <div className="bg-emerald-100 dark:bg-emerald-900/40 text-emerald-600 dark:text-emerald-400 p-2.5 rounded-xl"><Activity size={20} /></div>
          </div>
          <p className="text-4xl font-black text-slate-800 dark:text-slate-100 relative z-10">{stats.serviciosActivos}</p>
        </div>

        <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-slate-200/60 dark:border-slate-700/60 hover:shadow-lg hover:shadow-indigo-500/10 transition-all group relative overflow-hidden">
          <div className="absolute -right-6 -top-6 bg-indigo-50 dark:bg-indigo-500/10 w-24 h-24 rounded-full blur-2xl group-hover:bg-indigo-100 transition-all"></div>
          <div className="flex items-center justify-between mb-4 relative z-10">
            <h3 className="text-slate-500 dark:text-slate-400 font-bold text-xs uppercase tracking-wider">Usuarios Total</h3>
            <div className="bg-indigo-100 dark:bg-indigo-900/40 text-indigo-600 dark:text-indigo-400 p-2.5 rounded-xl"><Users size={20} /></div>
          </div>
          <p className="text-4xl font-black text-slate-800 dark:text-slate-100 relative z-10">{stats.totalUsuarios}</p>
        </div>

        <div className="bg-gradient-to-tr from-slate-900 to-slate-800 p-6 rounded-2xl shadow-xl hover:shadow-2xl hover:shadow-slate-900/20 transition-all relative overflow-hidden">
          <div className="absolute -right-6 -top-6 bg-white/5 w-24 h-24 rounded-full blur-2xl"></div>
          <div className="flex items-center justify-between mb-4 relative z-10">
            <h3 className="text-slate-400 font-bold text-xs uppercase tracking-wider">Ingresos Caja</h3>
            <div className="bg-white/10 text-white p-2.5 rounded-xl backdrop-blur-sm border border-white/10"><Wallet size={20} /></div>
          </div>
          <p className="text-4xl font-black text-white relative z-10">
            S/ {stats.ingresosTotales ? stats.ingresosTotales.toFixed(2) : "0.00"}
          </p>
        </div>
      </div>

      {/* AUDITORÍA DEL SISTEMA */}
      <AuditoriaSistema actividades={stats.actividades} />
    </div>
  );
};

export default TableroAnaliticas;