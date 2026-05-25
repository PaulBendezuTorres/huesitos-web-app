

const ServicioTable = ({ servicios, onEditar, onEstado }) => {
  if (servicios.length === 0) {
    return (
      <div className="text-center p-8 text-slate-500 bg-white rounded-xl shadow-sm border border-slate-200">
        No hay servicios registrados aún.
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-slate-200">
          <thead className="bg-slate-50">
            <tr>
              <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Servicio</th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Precio</th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Duración</th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Estado</th>
              <th className="px-6 py-4 text-center text-xs font-semibold text-slate-500 uppercase tracking-wider">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200">
            {servicios.map((servicio) => (
              <tr key={servicio.id} className="hover:bg-slate-50 transition">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="font-medium text-slate-800">{servicio.nombre}</div>
                  <div className="text-sm text-slate-500 truncate max-w-[250px]">{servicio.descripcion}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap font-medium text-slate-800">S/. {servicio.precio}</td>
                <td className="px-6 py-4 whitespace-nowrap text-slate-600">{servicio.duracionMinutos} min</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`inline-flex px-3 py-1 rounded-full text-xs font-bold ${servicio.activo ? "bg-emerald-100 text-emerald-700" : "bg-red-100 text-red-700"}`}>
                    {servicio.activo ? "Activo" : "Inactivo"}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap flex gap-2 justify-center">
                  <button 
                    onClick={() => onEditar(servicio)} 
                    className="bg-blue-50 hover:bg-blue-100 text-blue-600 px-3 py-1.5 rounded-md text-sm font-medium transition"
                  >
                    Editar
                  </button>
                  <button 
                    onClick={() => onEstado(servicio.id, !servicio.activo)} 
                    className={`${servicio.activo ? "bg-red-50 text-red-600 hover:bg-red-100" : "bg-emerald-50 text-emerald-600 hover:bg-emerald-100"} px-3 py-1.5 rounded-md text-sm font-medium transition`}
                  >
                    {servicio.activo ? "Desactivar" : "Activar"}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ServicioTable;