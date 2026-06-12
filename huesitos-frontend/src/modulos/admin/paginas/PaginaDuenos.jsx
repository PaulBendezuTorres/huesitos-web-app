import { useState, useEffect } from "react";
import { 
  obtenerListaDuenos, 
  crearNuevoDueno, 
  actualizarDuenoExistente 
} from "../../../servicios/duenoServicio";
import { UserPlus, MapPin, Phone, Mail, X, Edit2 } from 'lucide-react';
import CargadorSpinner from "../../../componentes/CargadorSpinner";
import Buscador from "../../../componentes/Buscador";
import Avatar from "../../../componentes/Avatar";

const PaginaDuenos = () => {
  const [duenos, setDuenos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [busqueda, setBusqueda] = useState("");

  const [modalOpen, setModalOpen] = useState(false);
  const [editandoId, setEditandoId] = useState(null);
  const [form, setForm] = useState({ 
    correo: "", 
    contrasena: "", 
    nombreCompleto: "", 
    telefono: "", 
    direccion: "" 
  });
  const [procesando, setProcesando] = useState(false);

  useEffect(() => {
    const fetchDuenos = async () => {
      setLoading(true);
      try {
        const data = await obtenerListaDuenos();
        setDuenos(data);
      } catch (error) {
        console.error("Error al recuperar los clientes:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchDuenos();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [refreshTrigger]);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const abrirCrearModal = () => {
    setEditandoId(null);
    setForm({ correo: "", contrasena: "", nombreCompleto: "", telefono: "", direccion: "" });
    setModalOpen(true);
  };

  const abrirEditarModal = (dueno) => {
    setEditandoId(dueno.id);
    setForm({
      correo: dueno.correo || "",
      contrasena: "",
      nombreCompleto: dueno.nombreCompleto || "",
      telefono: dueno.telefono || "",
      direccion: dueno.direccion || ""
    });
    setModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setProcesando(true);
    try {
      if (editandoId) {
        await actualizarDuenoExistente(editandoId, form);
        alert("Ficha del cliente actualizada exitosamente.");
      } else {
        await crearNuevoDueno(form);
        alert("Nuevo cliente y cuenta de acceso creados con éxito.");
      }
      setModalOpen(false);
      setRefreshTrigger(prev => prev + 1);
    } catch (error) {
      console.error(error);
      alert(error.response?.data || "Hubo un problema al procesar la solicitud en el servidor.");
    } finally {
      setProcesando(false);
    }
  };

  const duenosFiltrados = duenos.filter(d => 
    d.nombreCompleto?.toLowerCase().includes(busqueda.toLowerCase()) ||
    d.correo?.toLowerCase().includes(busqueda.toLowerCase()) ||
    d.telefono?.includes(busqueda)
  );

  if (loading && duenos.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-64 gap-3 bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200/60 dark:border-slate-700/60 shadow-sm">
        <CargadorSpinner size="lg" />
        <span className="text-slate-500 dark:text-slate-400 text-sm font-semibold animate-pulse">Sincronizando expedientes de clientes...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* CABECERA */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200/60 dark:border-slate-700/60 shadow-sm">
        <div>
          <h1 className="text-2xl font-black text-slate-800 dark:text-slate-100 tracking-tight">Directorio de Clientes</h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">Administración de fichas y cuentas de acceso de la clientela.</p>
        </div>
        <button 
          onClick={abrirCrearModal}
          className="bg-gradient-to-r from-sky-500 to-cyan-400 hover:from-sky-600 hover:to-cyan-500 text-white px-5 py-2.5 rounded-xl font-bold shadow-lg shadow-sky-500/30 transition-all flex items-center gap-2"
        >
          <UserPlus size={18} /> Registrar Cliente
        </button>
      </div>

      {/* BUSCADOR */}
      <div className="max-w-md">
        <Buscador 
          value={busqueda} 
          onChange={setBusqueda} 
          placeholder="Buscar por nombre, correo o teléfono..." 
        />
      </div>

      {/* TABLA */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200/60 dark:border-slate-700/60 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-100 dark:divide-slate-700">
            <thead className="bg-slate-50/50 dark:bg-slate-900/40">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest">Cliente y Correo</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest">Contacto</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest">Dirección Física</th>
                <th className="px-6 py-4 text-center text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-700 text-sm">
              {duenosFiltrados.length === 0 ? (
                <tr>
                  <td colSpan="4" className="px-6 py-10 text-center text-slate-500 dark:text-slate-400 font-semibold">
                    No se encontraron clientes que coincidan con la búsqueda.
                  </td>
                </tr>
              ) : (
                duenosFiltrados.map((dueno) => (
                  <tr key={dueno.id} className="hover:bg-sky-50/30 dark:hover:bg-slate-700/40 transition-colors">
                    <td className="px-6 py-4">
                      <div className="font-bold text-slate-800 dark:text-slate-100 flex items-center gap-3">
                         <Avatar url={dueno.fotoPerfilUrl} />
                         {dueno.nombreCompleto}
                      </div>
                      <div className="text-xs text-sky-600 dark:text-sky-400 font-semibold mt-1 flex items-center gap-1"><Mail size={12}/> {dueno.correo || "Sin correo"}</div>
                    </td>
                    <td className="px-6 py-4 font-medium text-slate-600 dark:text-slate-400">
                      <div className="flex items-center gap-1.5">
                        <Phone size={14}/> {dueno.telefono}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-slate-500 dark:text-slate-400 max-w-xs truncate"><div className="flex items-center gap-1.5"><MapPin size={14}/> {dueno.direccion}</div></td>
                    <td className="px-6 py-4 text-center">
                      <button
                        onClick={() => abrirEditarModal(dueno)}
                        className="bg-white dark:bg-slate-700 hover:bg-sky-50 dark:hover:bg-sky-900/30 text-sky-600 dark:text-sky-400 p-2 rounded-lg transition-all border border-slate-200 dark:border-slate-600 hover:border-sky-200 shadow-sm"
                      >
                        <Edit2 size={16} />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* MODAL */}
      {modalOpen && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in duration-200">
          <div className="bg-white dark:bg-slate-800 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-700 max-w-lg w-full overflow-hidden flex flex-col">
            <div className="px-6 py-5 border-b border-slate-100 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-900/40 flex justify-between items-center">
              <h3 className="text-lg font-black text-slate-800 dark:text-slate-100">
                {editandoId ? "Actualizar Expediente" : "Registro de Cliente Nuevo"}
              </h3>
              <button onClick={() => setModalOpen(false)} className="text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 transition-colors"><X size={20}/></button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-5 overflow-y-auto">
              <h4 className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wide border-b dark:border-slate-700 pb-1">Datos de Contacto</h4>
              <div>
                <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 mb-1.5 uppercase tracking-wide">Nombre Completo</label>
                <input type="text" name="nombreCompleto" value={form.nombreCompleto} onChange={handleChange} required placeholder="Ej: Juan Pérez Ramos" className="w-full border border-slate-300 dark:border-slate-600 p-2.5 rounded-xl text-slate-800 dark:text-slate-100 focus:ring-2 focus:ring-sky-500 focus:border-sky-500 outline-none transition-all bg-slate-50 dark:bg-slate-700 focus:bg-white dark:focus:bg-slate-600" />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 mb-1.5 uppercase tracking-wide">Teléfono / Celular</label>
                <input type="text" name="telefono" value={form.telefono} onChange={handleChange} required placeholder="Ej: 994142421" className="w-full border border-slate-300 dark:border-slate-600 p-2.5 rounded-xl text-slate-800 dark:text-slate-100 focus:ring-2 focus:ring-sky-500 focus:border-sky-500 outline-none transition-all bg-slate-50 dark:bg-slate-700 focus:bg-white dark:focus:bg-slate-600" />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 mb-1.5 uppercase tracking-wide">Dirección Física</label>
                <input type="text" name="direccion" value={form.direccion} onChange={handleChange} required placeholder="Ej: Av. Santo Domingo C-22, Ica" className="w-full border border-slate-300 dark:border-slate-600 p-2.5 rounded-xl text-slate-800 dark:text-slate-100 focus:ring-2 focus:ring-sky-500 focus:border-sky-500 outline-none transition-all bg-slate-50 dark:bg-slate-700 focus:bg-white dark:focus:bg-slate-600" />
              </div>

              <h4 className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wide border-b dark:border-slate-700 pb-1 pt-3">Cuenta de Acceso</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 mb-1.5 uppercase tracking-wide">Correo</label>
                  <input type="email" name="correo" value={form.correo} onChange={handleChange} required={!editandoId} className="w-full border border-slate-300 dark:border-slate-600 p-2.5 rounded-xl text-slate-800 dark:text-slate-100 focus:ring-2 focus:ring-sky-500 outline-none transition-all bg-slate-50 dark:bg-slate-700 focus:bg-white dark:focus:bg-slate-600" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 mb-1.5 uppercase tracking-wide">Contraseña</label>
                  <input type="password" name="contrasena" value={form.contrasena} onChange={handleChange} required={!editandoId} placeholder={editandoId ? "Dejar en blanco para no cambiar" : "Mínimo 6 chars"} className="w-full border border-slate-300 dark:border-slate-600 p-2.5 rounded-xl text-slate-800 dark:text-slate-100 focus:ring-2 focus:ring-sky-500 outline-none transition-all bg-slate-50 dark:bg-slate-700 focus:bg-white dark:focus:bg-slate-600" />
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-700">
                <button type="button" onClick={() => setModalOpen(false)} className="px-5 py-2.5 rounded-xl text-sm font-bold text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors">Cancelar</button>
                <button type="submit" disabled={procesando} className="px-5 py-2.5 bg-gradient-to-r from-sky-500 to-cyan-400 hover:from-sky-600 hover:to-cyan-500 text-white text-sm font-bold rounded-xl shadow-lg shadow-sky-500/30 transition-all disabled:opacity-50">
                  {procesando ? "Guardando..." : "Guardar Ficha"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default PaginaDuenos;