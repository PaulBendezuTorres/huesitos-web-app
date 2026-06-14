import { useState } from "react";
import { Routes, Route, useNavigate, useLocation } from "react-router-dom";
import FormularioServicio from '@/componentes/servicio/FormularioServicio';
import TablaServicio from '@/componentes/servicio/TablaServicio';
import ModalEditarServicio from '@/componentes/servicio/ModalEditarServicio';
import { crearServicio, cambiarEstadoServicio, subirFotoServicio, eliminarServicio } from '@/servicios/servicioServicio';
import { useServicios } from '@/hooks/useServicios';
import { Stethoscope, List, Plus } from 'lucide-react';
import CargadorSpinner from '@/componentes/comun/CargadorSpinner';
import ModalConfirmacion from '@/componentes/comun/ModalConfirmacion';
import Boton from '@/componentes/comun/Boton';

const PaginaServicios = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { servicios, loading, obtenerServicios } = useServicios();
  const [modalOpen, setModalOpen] = useState(false);
  const [servicioAEditar, setServicioAEditar] = useState(null);
  const [servicioAEliminar, setServicioAEliminar] = useState(null);
  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);

  const esRegistro = location.pathname.endsWith('/registrar');

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

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-10">
      {/* CABECERA DINÁMICA (Siempre visible para evitar Layout Shift) */}
      <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200/60 dark:border-slate-700/60 shadow-sm flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 group">
        <div>
          <h1 className="text-2xl font-black text-slate-800 dark:text-slate-100 tracking-tight flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-sky-50 dark:bg-sky-900/40 border border-sky-100 dark:border-sky-800 flex items-center justify-center text-sky-500 shadow-sm shrink-0 group-hover:scale-105 group-hover:rotate-6 transition-all duration-300">
              <Stethoscope size={20} />
            </div>
            {!esRegistro ? "Catálogo de Servicios" : "Registrar Servicio Médico"}
          </h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm mt-1.5 md:ml-13">
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

      {loading ? (
        <div className="flex flex-col items-center justify-center min-h-[400px] gap-3 bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200/60 dark:border-slate-700/60 shadow-sm">
          <CargadorSpinner size="lg" />
          <span className="text-slate-500 dark:text-slate-400 text-sm font-semibold animate-pulse">Sincronizando catálogo...</span>
        </div>
      ) : (
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
      )}

      {/* MODAL DE EDICIÓN MODULARIZADA */}
      <ModalEditarServicio
        isOpen={modalOpen}
        onClose={() => {
          setModalOpen(false);
          setServicioAEditar(null);
        }}
        servicio={servicioAEditar}
        obtenerServicios={obtenerServicios}
      />

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