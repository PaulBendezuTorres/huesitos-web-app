const ServicioTable = ({servicios, onEditar, onEstado}) =>{

    return (
        <div className="overflow-x-auto">
            <table className="min-w-full border border-gray-200">
                <thead className="bg-gray-100">
                    <tr>
                        <th className="p-3 text-left">Nombre</th>
                        <th className="p-3 text-left">Precio</th>
                        <th className="p-3 text-left">Duración</th>
                        <th className="p-3 text-left">Estado</th>
                        <th className="p-3 text-center">Acciones</th>
                    </tr>
                </thead>

                <tbody>
                            {servicios.map((servicio) => (

                    <tr key={servicio.id} className="border-t">

                    <td className="p-3">{servicio.nombre}</td>

                    <td className="p-3">
                        S/. {servicio.precio}
                    </td>

                    <td className="p-3">
                        {servicio.duracionMinutos} min
                    </td>

                    <td className="p-3">

                        <span
                        className={`px-2 py-1 rounded text-white text-sm
                            ${servicio.activo
                            ? "bg-green-500"
                            : "bg-red-500"
                            }`}
                        >
                        {servicio.activo ? "Activo" : "Inactivo"}
                        </span>

                    </td>

                    <td className="p-3 flex gap-2 justify-center">

                        <button
                        onClick={() => onEditar(servicio)}
                        className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded"
                        >
                        Editar
                        </button>

                        <button
                        onClick={() =>
                            onEstado(servicio.id, !servicio.activo)
                        }
                        className="bg-gray-500 hover:bg-gray-600 text-white px-3 py-1 rounded"
                        >
                        Estado
                        </button>

                    </td>

                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
};

export default ServicioTable;