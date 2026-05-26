import { useState } from "react";
import ServicioForm from "../components/ServicioForm";
import ServicioTable from "../components/ServicioTable";
import { crearServicio, cambiarEstadoServicio, actualizarServicio } from "../services/servicioService";
import { useServicios } from "../hooks/useServicios";

const ServiciosPage = () => {
  const { servicios, loading, obtenerServicios } = useServicios();
  const [modalOpen, setModalOpen] = useState(false);
  const [servicioAEditar, setServicioAEditar] = useState(null);
  const [formEdit, setFormEdit] = useState({ nombre: "", precio: "", descripcion: "", duracionMinutos: "" });

  const guardar = async (data) => {
    try {
      await crearServicio(data);
      obtenerServicios();
      alert("Servicio creado con éxito");
    } catch (error) {
      console.error(error);
      alert("Hubo un error al crear el servicio");
    }
  };

  const cambiarEstado = async (id, activo) => {
    try {
      await cambiarEstadoServicio(id, activo);
      obtenerServicios();
    } catch (error) {
      console.error(error);
      alert("Error al cambiar el estado");
    }
  };

  const abrirEditarModal = (servicio) => {
    setServicioAEditar(servicio);
    setFormEdit({
      nombre: servicio.nombre,
      precio: servicio.precio,
      descripcion: servicio.descripcion,
      duracionMinutos: servicio.duracionMinutos
    });
    setModalOpen(true);
  };

  const handleEditChange = (e) => {
    setFormEdit({
      ...formEdit,
      [e.target.name]: e.target.value
    });
  };

  const ejecutarEdicion = async (e) => {
    e.preventDefault();
    try {
      const datosFormateados = {
        ...formEdit,
        precio: parseFloat(formEdit.precio),
        duracionMinutos: parseInt(formEdit.duracionMinutos)
      };
      await actualizarServicio(servicioAEditar.id, datosFormateados);
      setModalOpen(false);
      obtenerServicios();
      alert("Servicio actualizado con éxito");
    } catch (error) {
      console.error(error);
      alert("Error al actualizar el servicio");
    }
  };

  if (loading) {
    return <div className="flex justify-center items-center h-64 text-slate-500 font-semibold">Cargando servicios...</div>;
  }

  return (
    <div className="space-y-6 relative">
      <div>
        <h1 className="text-2xl font-bold text-slate-800">Gestión de Catálogo de Servicios</h1>
        <p className="text-slate-500 text-sm">Crea y administra los servicios que ofrece la clínica.</p>
      </div>

      <ServicioForm onGuardar={guardar} />

      <ServicioTable 
        servicios={servicios} 
        onEstado={cambiarEstado} 
        onEditar={abrirEditarModal} 
      />

      {/* MODAL DE EDICIÓN FLOTANTE */}
      {modalOpen && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl border border-slate-200 max-w-lg w-full overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-200 flex justify-between items-center bg-slate-50">
              <h3 className="text-lg font-bold text-slate-800">Editar Servicio</h3>
              <button 
                onClick={() => setModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 text-xl font-semibold focus:outline-none"
              >
                &times;
              </button>
            </div>
            
            <form onSubmit={ejecutarEdicion} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">Nombre del Servicio</label>
                <input 
                  type="text" 
                  name="nombre" 
                  value={formEdit.nombre} 
                  onChange={handleEditChange} 
                  required 
                  className="w-full border border-slate-300 p-2.5 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-800"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1">Precio (S/.)</label>
                  <input 
                    type="number" 
                    step="0.01" 
                    name="precio" 
                    value={formEdit.precio} 
                    onChange={handleEditChange} 
                    required 
                    className="w-full border border-slate-300 p-2.5 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-800"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1">Duración (Minutos)</label>
                  <input 
                    type="number" 
                    name="duracionMinutos" 
                    value={formEdit.duracionMinutos} 
                    onChange={handleEditChange} 
                    required 
                    className="w-full border border-slate-300 p-2.5 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-800"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">Descripción</label>
                <textarea 
                  name="descripcion" 
                  value={formEdit.descripcion} 
                  onChange={handleEditChange} 
                  required 
                  rows="3" 
                  className="w-full border border-slate-300 p-2.5 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-800"
                />
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
                <button 
                  type="button" 
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 rounded-lg border border-slate-300 text-slate-700 font-medium hover:bg-slate-50 transition"
                >
                  Cancelar
                </button>
                <button 
                  type="submit" 
                  className="px-4 py-2 rounded-lg bg-blue-600 text-white font-medium hover:bg-blue-700 transition shadow-sm"
                >
                  Guardar Cambios
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ServiciosPage;