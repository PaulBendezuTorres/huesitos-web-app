import { useState } from "react";
import { Routes, Route, useNavigate, useLocation } from "react-router-dom";
import FormularioServicio from "../componentes/FormularioServicio";
import TablaServicio from "../componentes/TablaServicio";
import { crearServicio, cambiarEstadoServicio, actualizarServicio, subirFotoServicio, eliminarServicio } from "../servicios/servicioServicio";
import { useServicios } from "../hooks/useServicios";
import { X, Stethoscope, Tag, Clock, FileText, Camera, List, Plus } from 'lucide-react';
import CargadorSpinner from "../componentes/CargadorSpinner";
import AreaTexto from "../componentes/AreaTexto";
import ModalConfirmacion from "../componentes/ModalConfirmacion";
import Boton from "../componentes/Boton";

const PaginaServicios = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { servicios, loading, obtenerServicios } = useServicios();
  const [modalOpen, setModalOpen] = useState(false);
  const [servicioAEditar, setServicioAEditar] = useState(null);
  const [formEdit, setFormEdit] = useState({ nombre: "", precio: "", descripcion: "", duracionMinutos: "", fotoUrl: "" });
  const [subiendoFoto, setSubiendoFoto] = useState(false);
  const [servicioAEliminar, setServicioAEliminar] = useState(null);
  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);

  const esRegistro = location.pathname.endsWith('/registrar');

  const handleSubirFoto = async (e) => {
    const file = e.target.files[0];
    if (!file || !servicioAEditar) return;

    if (file.size > 5 * 1024 * 1024) {
      alert("El tamaño de la imagen no debe superar los 5MB");
      e.target.value = "";
      return;
    }

    setSubiendoFoto(true);
    try {
      const res = await subirFotoServicio(servicioAEditar.id, file);
      setFormEdit(prev => ({ ...prev, fotoUrl: res.fotoUrl }));
      setServicioAEditar(prev => ({ ...prev, fotoUrl: res.fotoUrl }));
      obtenerServicios();
      alert("Foto del servicio actualizada con éxito");
    } catch (error) {
      console.error(error);
      alert("Hubo un error al subir la imagen");
    } finally {
      setSubiendoFoto(false);
    }
  };

  const guardar = async (data, archivo) => {
    try {
      const nuevoServicio = await crearServicio(data);
      if (archivo) {
        await subirFotoServicio(nuevoServicio.id, archivo);
      }
      obtenerServicios();
      alert("Servicio creado con éxito");
      navigate('/admin/servicios'); // Redirigir a la lista
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
      duracionMinutos: servicio.duracionMinutos,
      fotoUrl: servicio.fotoUrl || ""
    });
    setModalOpen(true);
  };

  const abrirEliminarModal = (servicio) => {
    setServicioAEliminar(servicio);
    setConfirmDeleteOpen(true);
  };

  const ejecutarEliminacion = async () => {
    if (!servicioAEliminar) return;
    try {
      await eliminarServicio(servicioAEliminar.id);
      setConfirmDeleteOpen(false);
      setServicioAEliminar(null);
      obtenerServicios();
      alert("Servicio eliminado con éxito");
    } catch (error) {
      console.error(error);
      alert("Error al eliminar el servicio");
    }
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
    return (
      <div className="flex flex-col items-center justify-center h-64 gap-3 bg-white p-6 rounded-2xl border border-slate-200/60 shadow-sm">
        <CargadorSpinner size="lg" />
        <span className="text-slate-500 text-sm font-semibold animate-pulse">Sincronizando catálogo...</span>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* CABECERA DINÁMICA */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200/60 shadow-sm flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-800 tracking-tight">
            {!esRegistro ? "Catálogo de Servicios" : "Registrar Servicio Médico"}
          </h1>
          <p className="text-slate-500 text-sm mt-1">
            {!esRegistro 
              ? "Lista completa de la oferta médica y los servicios disponibles en la clínica." 
              : "Crea un nuevo servicio médico y configúralo en tiempo real."}
          </p>
        </div>
        
        {!esRegistro ? (
          <Boton
            onClick={() => navigate('registrar')}
            variant="primary"
            icono={Plus}
          >
            Registrar nuevo servicio
          </Boton>
        ) : (
          <Boton
            onClick={() => navigate('/admin/servicios')}
            variant="secondary"
            icono={List}
          >
            Ver todos mis servicios
          </Boton>
        )}
      </div>

      <div className="animate-in fade-in slide-in-from-bottom-4 duration-300">
        <Routes>
          <Route path="/" element={
            <TablaServicio 
              servicios={servicios} 
              onEstado={cambiarEstado} 
              onEditar={abrirEditarModal} 
              onEliminar={abrirEliminarModal}
            />
          } />
          <Route path="registrar" element={<FormularioServicio onGuardar={guardar} />} />
        </Routes>
      </div>

      {/* MODAL DE EDICIÓN PREMIUM */}
      {modalOpen && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center z-50 z-[100] p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 max-w-lg w-full max-h-[90vh] overflow-hidden">
            <div className="px-6 py-5 border-b border-slate-100 flex justify-between items-center shrink-0 bg-slate-50/50">
              <h3 className="text-lg font-black text-slate-800 flex items-center gap-2">
                <Stethoscope className="text-sky-500" size={20} /> Editar Servicio
              </h3>
              <button 
                onClick={() => setModalOpen(false)}
                className="text-slate-400 hover:text-slate-700 transition-colors"
              >
                <X size={20}/>
              </button>
            </div>
            
            <form onSubmit={ejecutarEdicion} className="p-6 space-y-5">
              {/* Sección de Foto del Servicio */}
              <div className="flex items-center gap-4 bg-slate-50 p-4 rounded-2xl border border-slate-100">
                <div className="w-16 h-16 rounded-xl bg-white border border-slate-200 overflow-hidden shrink-0 flex items-center justify-center text-slate-400 shadow-inner relative">
                  {servicioAEditar?.fotoUrl && servicioAEditar.fotoUrl !== '/uploads/defecto-servicio.png' ? (
                    <img src={`http://localhost:8080${servicioAEditar.fotoUrl}`} alt="Servicio" className={`w-full h-full object-cover ${subiendoFoto ? 'opacity-40' : ''}`} />
                  ) : (
                    <Stethoscope size={24} className="text-slate-350" />
                  )}
                  {subiendoFoto && (
                    <div className="absolute inset-0 flex items-center justify-center bg-slate-950/20 backdrop-blur-[1px]">
                      <CargadorSpinner size="xs" />
                    </div>
                  )}
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-1 uppercase tracking-wide">Imagen del Servicio</label>
                  <label className={`inline-flex items-center gap-1.5 bg-white hover:bg-slate-100 text-slate-700 border border-slate-300 px-3 py-1.5 rounded-lg text-xs font-bold transition-all shadow-sm ${subiendoFoto ? 'opacity-55 cursor-not-allowed' : 'cursor-pointer'}`}>
                    <Camera size={14} />
                    {subiendoFoto ? "Cargando..." : "Subir foto"}
                    <input type="file" accept="image/*" onChange={handleSubirFoto} className="hidden" disabled={subiendoFoto} />
                  </label>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 mb-1.5 uppercase tracking-wide">Nombre del Servicio</label>
                <input 
                  type="text" 
                  name="nombre" 
                  value={formEdit.nombre} 
                  onChange={handleEditChange} 
                  required 
                  className="w-full border border-slate-300 p-2.5 rounded-xl text-slate-800 focus:ring-2 focus:ring-sky-500 focus:border-sky-500 outline-none transition-all bg-slate-50 focus:bg-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-1.5 uppercase tracking-wide">Precio (S/.)</label>
                  <div className="relative">
                    <Tag className="absolute left-3 top-3 text-slate-400" size={18} />
                    <input 
                      type="number" step="0.01" name="precio" value={formEdit.precio} onChange={handleEditChange} required 
                      className="w-full pl-10 border border-slate-300 p-2.5 rounded-xl text-slate-800 focus:ring-2 focus:ring-sky-500 focus:border-sky-500 outline-none transition-all bg-slate-50 focus:bg-white"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-1.5 uppercase tracking-wide">Duración (Min)</label>
                  <div className="relative">
                    <Clock className="absolute left-3 top-3 text-slate-400" size={18} />
                    <input 
                      type="number" name="duracionMinutos" value={formEdit.duracionMinutos} onChange={handleEditChange} required 
                      className="w-full pl-10 border border-slate-300 p-2.5 rounded-xl text-slate-800 focus:ring-2 focus:ring-sky-500 focus:border-sky-500 outline-none transition-all bg-slate-50 focus:bg-white"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 mb-1.5 uppercase tracking-wide">Descripción</label>
                <AreaTexto 
                  value={formEdit.descripcion} 
                  onChange={(val) => setFormEdit(prev => ({ ...prev, descripcion: val }))} 
                  placeholder="Descripción detallada del servicio..." 
                  limite={250} 
                  required={true}
                />
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
                <button 
                  type="button" 
                  onClick={() => setModalOpen(false)}
                  className="px-5 py-2.5 rounded-xl text-sm font-bold text-slate-500 hover:bg-slate-100 transition-colors"
                >
                  Cancelar
                </button>
                <button 
                  type="submit" 
                  className="px-5 py-2.5 bg-gradient-to-r from-sky-500 to-cyan-400 hover:from-sky-600 hover:to-cyan-500 text-white text-sm font-bold rounded-xl shadow-lg shadow-sky-500/30 transition-all"
                >
                  Guardar Cambios
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal de confirmación para eliminar servicio */}
      <ModalConfirmacion
        isOpen={confirmDeleteOpen}
        onClose={() => setConfirmDeleteOpen(false)}
        onConfirm={ejecutarEliminacion}
        titulo="Eliminar Servicio Médico"
        mensaje={`¿Estás seguro de que deseas eliminar permanentemente el servicio "${servicioAEliminar?.nombre}"? Esta acción borrará el registro de la base de datos y no se podrá deshacer.`}
        textoConfirmar="Eliminar permanentemente"
        textoCancelar="Volver"
        tipo="danger"
      />
    </div>
  );
};

export default PaginaServicios;