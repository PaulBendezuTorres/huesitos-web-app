const DashboardAnalytics = () => {

  // Datos simulados
  const estadisticas = {
    totalServicios: 12,
    serviciosActivos: 10,
    usuarios: 25,
    ingresos: 4500,
  };

  return (

    <div className="space-y-8">

      {/* TÍTULO */}
      <div>
        <h2 className="text-3xl font-bold text-slate-800">
          Panel de Analíticas
        </h2>

        <p className="text-slate-500 mt-1">
          Resumen general del sistema
        </p>
      </div>

      {/* CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">

        {/* CARD */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">

          <div className="flex justify-between items-center">

            <div>
              <p className="text-slate-500 text-sm">
                Servicios Totales
              </p>

              <h3 className="text-3xl font-bold text-slate-800 mt-2">
                {estadisticas.totalServicios}
              </h3>
            </div>

            <div className="text-4xl">
              🩺
            </div>

          </div>

        </div>

        {/* CARD */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">

          <div className="flex justify-between items-center">

            <div>
              <p className="text-slate-500 text-sm">
                Servicios Activos
              </p>

              <h3 className="text-3xl font-bold text-green-600 mt-2">
                {estadisticas.serviciosActivos}
              </h3>
            </div>

            <div className="text-4xl">
              ✅
            </div>

          </div>

        </div>

        {/* CARD */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">

          <div className="flex justify-between items-center">

            <div>
              <p className="text-slate-500 text-sm">
                Usuarios
              </p>

              <h3 className="text-3xl font-bold text-blue-600 mt-2">
                {estadisticas.usuarios}
              </h3>
            </div>

            <div className="text-4xl">
              👥
            </div>

          </div>

        </div>

        {/* CARD */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">

          <div className="flex justify-between items-center">

            <div>
              <p className="text-slate-500 text-sm">
                Ingresos
              </p>

              <h3 className="text-3xl font-bold text-purple-600 mt-2">
                S/. {estadisticas.ingresos}
              </h3>
            </div>

            <div className="text-4xl">
              💰
            </div>

          </div>

        </div>

      </div>

      {/* TABLA / ACTIVIDAD */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">

        <h3 className="text-xl font-bold text-slate-800 mb-6">
          Actividad reciente
        </h3>

        <div className="space-y-4">

          <div className="flex justify-between border-b pb-3">
            <span>Nuevo servicio registrado</span>
            <span className="text-slate-400 text-sm">
              Hace 2 horas
            </span>
          </div>

          <div className="flex justify-between border-b pb-3">
            <span>Usuario actualizado</span>
            <span className="text-slate-400 text-sm">
              Hace 5 horas
            </span>
          </div>

          <div className="flex justify-between">
            <span>Configuración modificada</span>
            <span className="text-slate-400 text-sm">
              Hace 1 día
            </span>
          </div>

        </div>

      </div>

    </div>
  );
};

export default DashboardAnalytics;
