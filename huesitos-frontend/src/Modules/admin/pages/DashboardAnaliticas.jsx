import { useDashboard } from "../../../hooks/useDashboard";

const DashboardAnaliticas = () => {
  const { stats, loading, refetch } = useDashboard();

  if (loading) {
    return <div className="flex justify-center items-center h-64 text-slate-500 font-semibold animate-pulse">Cargando analíticas en tiempo real...</div>;
  }

  // Helper para asignar colores según el tipo de actividad
  const colorPorTipo = (tipo) => {
    switch (tipo) {
      case "SERVICIO": return "bg-blue-100 text-blue-700";
      case "USUARIO": return "bg-purple-100 text-purple-700";
      case "CONFIGURACION": return "bg-amber-100 text-amber-700";
      default: return "bg-slate-100 text-slate-700";
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Panel de Analíticas</h2>
          <p className="text-slate-500 text-sm">Resumen en tiempo real de tu clínica veterinaria.</p>
        </div>
        <button onClick={refetch} className="px-4 py-2 bg-white border border-slate-200 shadow-sm rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-50 transition">
          🔄 Actualizar
        </button>
      </div>

      {/* TARJETAS DE MÉTRICAS */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-slate-500 font-medium text-sm">Servicios Totales</h3>
            <span className="text-blue-500 bg-blue-50 p-2 rounded-lg">🩺</span>
          </div>
          <p className="text-3xl font-black text-slate-800">{stats.totalServicios}</p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-slate-500 font-medium text-sm">Servicios Activos</h3>
            <span className="text-emerald-500 bg-emerald-50 p-2 rounded-lg">✅</span>
          </div>
          <p className="text-3xl font-black text-slate-800">{stats.serviciosActivos}</p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-slate-500 font-medium text-sm">Usuarios Registrados</h3>
            <span className="text-purple-500 bg-purple-50 p-2 rounded-lg">👥</span>
          </div>
          <p className="text-3xl font-black text-slate-800">{stats.totalUsuarios}</p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-slate-500 font-medium text-sm">Ingresos (Aprobados)</h3>
            <span className="text-amber-500 bg-amber-50 p-2 rounded-lg">💰</span>
          </div>
          <p className="text-3xl font-black text-slate-800">
            S/ {stats.ingresosTotales ? stats.ingresosTotales.toFixed(2) : "0.00"}
          </p>
        </div>
      </div>

      {/* ACTIVIDAD RECIENTE */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
        <h3 className="text-lg font-bold text-slate-800 mb-4 border-b pb-2">Actividad Reciente</h3>
        
        {stats.actividades && stats.actividades.length > 0 ? (
          <div className="space-y-4">
            {stats.actividades.map((actividad) => (
              <div key={actividad.id} className="flex items-start gap-4 p-3 hover:bg-slate-50 rounded-lg transition">
                <div className={`mt-1 px-2.5 py-1 rounded-md text-[10px] font-bold tracking-wider ${colorPorTipo(actividad.tipo)}`}>
                  {actividad.tipo}
                </div>
                <div>
                  <p className="text-slate-700 font-medium text-sm">{actividad.mensaje}</p>
                  <p className="text-slate-400 text-xs mt-1">
                    {new Date(actividad.fecha).toLocaleString('es-PE', { dateStyle: 'medium', timeStyle: 'short' })}
                  </p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-slate-500 text-sm py-4 text-center">No hay actividad reciente registrada.</p>
        )}
      </div>

    </div>
  );
};

export default DashboardAnaliticas;