import { useState, useEffect } from 'react';
import { X, Stethoscope, Tag, Clock, Camera } from 'lucide-react';
import CargadorSpinner from '@/componentes/comun/CargadorSpinner';
import AreaTexto from '@/componentes/comun/AreaTexto';
import { actualizarServicio, subirFotoServicio } from '@/servicios/servicioServicio';

const ModalEditarServicio = ({
  isOpen,
  onClose,
  servicio,
  obtenerServicios
}) => {
  const [formEdit, setFormEdit] = useState({
    nombre: "",
    precio: "",
    descripcion: "",
    duracionMinutos: "",
    fotoUrl: ""
  });
  const [subiendoFoto, setSubiendoFoto] = useState(false);
  const [procesando, setProcesando] = useState(false);
  const [errorForm, setErrorForm] = useState('');

  useEffect(() => {
    if (servicio) {
      setFormEdit({
        nombre: servicio.nombre || "",
        precio: servicio.precio || "",
        descripcion: servicio.descripcion || "",
        duracionMinutos: servicio.duracionMinutos || "",
        fotoUrl: servicio.fotoUrl || ""
      });
      setErrorForm('');
    }
  }, [servicio]);

  if (!isOpen || !servicio) return null;

  const handleSubirFoto = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      alert("El tamaño de la imagen no debe superar los 5MB");
      e.target.value = "";
      return;
    }

    setSubiendoFoto(true);
    try {
      const res = await subirFotoServicio(servicio.id, file);
      setFormEdit(prev => ({ ...prev, fotoUrl: res.fotoUrl }));
      servicio.fotoUrl = res.fotoUrl; // Actualizar la referencia local
      obtenerServicios();
      alert("Foto del servicio actualizada con éxito");
    } catch (error) {
      console.error(error);
      alert("Hubo un error al subir la imagen");
    } finally {
      setSubiendoFoto(false);
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
    setProcesando(true);
    setErrorForm('');
    try {
      const datosFormateados = {
        ...formEdit,
        precio: parseFloat(formEdit.precio),
        duracionMinutos: parseInt(formEdit.duracionMinutos)
      };
      await actualizarServicio(servicio.id, datosFormateados);
      obtenerServicios();
      alert("Servicio actualizado con éxito");
      onClose();
    } catch (error) {
      console.error(error);
      setErrorForm(error.response?.data || error.message || "Error al actualizar el servicio");
    } finally {
      setProcesando(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center z-[100] p-4 animate-in fade-in duration-200">
      <div className="bg-white dark:bg-slate-800 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-700 max-w-lg w-full max-h-[90vh] overflow-hidden animate-in slide-in-from-bottom-4 duration-300">
        <div className="px-6 py-5 border-b border-slate-100 dark:border-slate-700 flex justify-between items-center shrink-0 bg-slate-50/50 dark:bg-slate-900/40">
          <h3 className="text-lg font-black text-slate-800 dark:text-slate-100 flex items-center gap-2">
            <Stethoscope className="text-sky-500" size={20} /> Editar Servicio
          </h3>
          <button 
            onClick={onClose}
            className="text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 transition-colors"
            disabled={procesando}
          >
            <X size={20}/>
          </button>
        </div>
        
        <form onSubmit={ejecutarEdicion} className="p-6 space-y-5 overflow-y-auto max-h-[calc(90vh-140px)] custom-scrollbar">
          {/* Sección de Foto del Servicio */}
          <div className="flex items-center gap-4 bg-slate-50 dark:bg-slate-900/40 p-4 rounded-2xl border border-slate-100 dark:border-slate-700">
            <div className="w-16 h-16 rounded-xl bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 overflow-hidden shrink-0 flex items-center justify-center text-slate-400 shadow-inner relative">
              {formEdit.fotoUrl && formEdit.fotoUrl !== '/uploads/defecto-servicio.png' ? (
                <img 
                  src={`http://localhost:8080${formEdit.fotoUrl}`} 
                  alt="Servicio" 
                  className={`w-full h-full object-cover ${subiendoFoto ? 'opacity-40' : ''}`} 
                />
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
              <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 mb-1 uppercase tracking-wide">Imagen del Servicio</label>
              <label className={`inline-flex items-center gap-1.5 bg-white dark:bg-slate-700 hover:bg-slate-100 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-200 border border-slate-300 dark:border-slate-600 px-3 py-1.5 rounded-lg text-xs font-bold transition-all shadow-sm ${subiendoFoto || procesando ? 'opacity-55 cursor-not-allowed' : 'cursor-pointer'}`}>
                <Camera size={14} />
                {subiendoFoto ? "Cargando..." : "Subir foto"}
                <input 
                  type="file" 
                  accept="image/*" 
                  onChange={handleSubirFoto} 
                  className="hidden" 
                  disabled={subiendoFoto || procesando} 
                />
              </label>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 mb-1.5 uppercase tracking-wide">Nombre del Servicio</label>
            <input 
              type="text" 
              name="nombre" 
              value={formEdit.nombre} 
              onChange={handleEditChange} 
              required 
              className="w-full border border-slate-300 dark:border-slate-600 p-2.5 rounded-xl text-slate-800 dark:text-slate-100 focus:ring-2 focus:ring-sky-500 focus:border-sky-500 outline-none transition-all bg-slate-50 dark:bg-slate-700 focus:bg-white dark:focus:bg-slate-600"
              disabled={procesando}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 mb-1.5 uppercase tracking-wide">Precio (S/.)</label>
              <div className="relative">
                <Tag className="absolute left-3 top-3 text-slate-400" size={18} />
                <input 
                  type="number" 
                  step="0.01" 
                  name="precio" 
                  value={formEdit.precio} 
                  onChange={handleEditChange} 
                  required 
                  className="w-full pl-10 border border-slate-300 dark:border-slate-600 p-2.5 rounded-xl text-slate-800 dark:text-slate-100 focus:ring-2 focus:ring-sky-500 focus:border-sky-500 outline-none transition-all bg-slate-50 dark:bg-slate-700 focus:bg-white dark:focus:bg-slate-600"
                  disabled={procesando}
                />
              </div>
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 mb-1.5 uppercase tracking-wide">Duración (Min)</label>
              <div className="relative">
                <Clock className="absolute left-3 top-3 text-slate-400" size={18} />
                <input 
                  type="number" 
                  name="duracionMinutos" 
                  value={formEdit.duracionMinutos} 
                  onChange={handleEditChange} 
                  required 
                  className="w-full pl-10 border border-slate-300 dark:border-slate-600 p-2.5 rounded-xl text-slate-800 dark:text-slate-100 focus:ring-2 focus:ring-sky-500 focus:border-sky-500 outline-none transition-all bg-slate-50 dark:bg-slate-700 focus:bg-white dark:focus:bg-slate-600"
                  disabled={procesando}
                />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 mb-1.5 uppercase tracking-wide">Descripción</label>
            <AreaTexto 
              value={formEdit.descripcion} 
              onChange={(val) => setFormEdit(prev => ({ ...prev, descripcion: val }))} 
              placeholder="Descripción detallada del servicio..." 
              limite={250} 
              required={true}
            />
          </div>

          {errorForm && (
            <div className="bg-red-50 border border-red-200 rounded-xl p-3 text-red-750 font-semibold text-left">
              {errorForm}
            </div>
          )}

          <div className="flex justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-700 shrink-0">
            <button 
              type="button" 
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl text-sm font-bold text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
              disabled={procesando}
            >
              Cancelar
            </button>
            <button 
              type="submit" 
              className="px-5 py-2.5 bg-slate-900 dark:bg-slate-100 hover:bg-slate-800 dark:hover:bg-slate-200 text-white dark:text-slate-900 text-sm font-bold rounded-xl transition-all shadow-md flex items-center gap-1.5 disabled:opacity-50"
              disabled={procesando}
            >
              {procesando && <CargadorSpinner size="xs" color="border-white dark:border-slate-900" />}
              Guardar Cambios
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ModalEditarServicio;
