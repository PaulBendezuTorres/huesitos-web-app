import { useState, useEffect } from "react";
import { 
  obtenerListaUsuarios, 
  modificarRolUsuario, 
  modificarEstadoUsuario
} from '@/servicios/usuarioServicio';
import { UserPlus, ShieldAlert, ShieldCheck, Edit, Trash2 } from 'lucide-react';
import CargadorSpinner from '@/componentes/comun/CargadorSpinner';
import Buscador from '@/componentes/comun/Buscador';
import Avatar from '@/componentes/comun/Avatar';

// Nuevos componentes desacoplados
import ModalCrearPersonal from "@/componentes/usuario/ModalCrearPersonal";
import ModalDetallesUsuario from "@/componentes/usuario/ModalDetallesUsuario";
import ModalEliminarUsuario from "@/componentes/usuario/ModalEliminarUsuario";

const PaginaUsuarios = () => {
  const [usuarios, setUsuarios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [busqueda, setBusqueda] = useState('');

  // Controladores de Modales
  const [modalCrearOpen, setModalCrearOpen] = useState(false);
  const [modalDetallesOpen, setModalDetallesOpen] = useState(false);
  const [modalEliminarOpen, setModalEliminarOpen] = useState(false);

  // Datos para modales
  const [usuarioSeleccionado, setUsuarioSeleccionado] = useState(null);
  const [usuarioAEliminar, setUsuarioAEliminar] = useState(null);

  // Estado para bloquear la fila de un usuario en acción
  const [usuarioEnAccionId, setUsuarioEnAccionId] = useState(null);

  useEffect(() => {
    const fetchUsuarios = async () => {
      setLoading(true);
      try {
        const data = await obtenerListaUsuarios();
        setUsuarios(data);
      } catch (error) {
        console.error("Error al recuperar los usuarios:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchUsuarios();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [refreshTrigger]);

  const handleRolChange = async (id, nuevoRol) => {
    setUsuarioEnAccionId(id);
    try {
      await modificarRolUsuario(id, nuevoRol);
      setRefreshTrigger(prev => prev + 1);
      alert("Rol de usuario actualizado correctamente.");
    } catch (error) {
      console.error(error);
      alert("No se pudo procesar el cambio de rol.");
    } finally {
      setUsuarioEnAccionId(null);
    }
  };

  const handleEstadoToggle = async (id, estadoActual) => {
    setUsuarioEnAccionId(id);
    try {
      await modificarEstadoUsuario(id, !estadoActual);
      setRefreshTrigger(prev => prev + 1);
    } catch (error) {
      console.error(error);
      alert("Error al actualizar el estado de acceso.");
    } finally {
      setUsuarioEnAccionId(null);
    }
  };

  const abrirDetallesModal = (usuario) => {
    setUsuarioSeleccionado(usuario);
    setModalDetallesOpen(true);
  };

  const abrirModalEliminar = (usuario) => {
    setUsuarioAEliminar(usuario);
    setModalEliminarOpen(true);
  };

  const recargarUsuarios = () => {
    setRefreshTrigger(prev => prev + 1);
  };

  if (loading && usuarios.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-64 gap-3 bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200/60 dark:border-slate-700/60 shadow-sm">
        <CargadorSpinner size="lg" />
        <span className="text-slate-500 dark:text-slate-400 text-sm font-semibold animate-pulse">Sincronizando cuentas de usuario...</span>
      </div>
    );
  }

  const usuariosFiltrados = usuarios.filter((usuario) => {
    const termino = busqueda.toLowerCase().trim();
    if (!termino) return true;
    
    const correoMatches = usuario.correo?.toLowerCase().includes(termino);
    const rolMatches = usuario.rol?.toLowerCase().includes(termino);
    const estadoTexto = usuario.activo ? "permitido" : "suspendido";
    const estadoMatches = estadoTexto.includes(termino);
    
    return correoMatches || rolMatches || estadoMatches;
  });

  return (
    <div className="space-y-6">
      {/* CABECERA Y BOTÓN NUEVO */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200/60 dark:border-slate-700/60 shadow-sm">
        <div>
          <h1 className="text-2xl font-black text-slate-800 dark:text-slate-100 tracking-tight">Gestión de Usuarios y Permisos</h1>
        </div>
        <button 
          onClick={() => setModalCrearOpen(true)}
          className="bg-gradient-to-r from-sky-500 to-cyan-400 hover:from-sky-600 hover:to-cyan-500 text-white px-5 py-2.5 rounded-xl font-bold shadow-lg shadow-sky-500/30 transition-all flex items-center gap-2"
        >
          <UserPlus size={18} /> Nuevo Personal
        </button>
      </div>

      {/* BUSCADOR DE USUARIOS */}
      <Buscador 
        value={busqueda} 
        onChange={setBusqueda} 
        placeholder="Buscar usuario por correo, rol o estado (permitido/suspendido)..." 
      />

      {/* TABLA PRINCIPAL */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200/60 dark:border-slate-700/60 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-100 dark:divide-slate-700">
            <thead className="bg-slate-50/50 dark:bg-slate-900/40">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest">Identificador / Correo</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest">Rol Asignado</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest">Estado Cuenta</th>
                <th className="px-6 py-4 text-center text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-700 text-sm">
              {usuariosFiltrados.length === 0 ? (
                <tr>
                  <td colSpan="4" className="px-6 py-10 text-center text-slate-500 dark:text-slate-400 font-semibold">
                    No se encontraron usuarios que coincidan con la búsqueda.
                  </td>
                </tr>
              ) : (
                usuariosFiltrados.map((usuario) => (
                  <tr key={usuario.id} className="hover:bg-sky-50/30 dark:hover:bg-slate-700/40 transition-colors">
                    <td className="px-6 py-4 font-bold text-slate-800 dark:text-slate-100">
                      <div className="flex items-center gap-3">
                        <Avatar url={usuario.fotoPerfilUrl} />
                        <div className="flex items-center gap-2">
                          {usuario.correo}
                          {usuarioEnAccionId === usuario.id && (
                            <CargadorSpinner size="xs" color="border-sky-500" />
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <select
                        value={usuario.rol}
                        onChange={(e) => handleRolChange(usuario.id, e.target.value)}
                        disabled={usuarioEnAccionId === usuario.id || loading}
                        className={`border border-slate-200 dark:border-slate-600 rounded-lg p-2 bg-slate-50 dark:bg-slate-700 hover:bg-white dark:hover:bg-slate-600 text-slate-700 dark:text-slate-200 focus:ring-2 focus:ring-sky-500 focus:outline-none font-bold text-xs tracking-wide cursor-pointer transition-all ${usuarioEnAccionId === usuario.id ? 'opacity-50 cursor-not-allowed' : ''}`}
                      >
                        <option value="ADMINISTRADOR">ADMINISTRADOR</option>
                        <option value="VETERINARIO">VETERINARIO</option>
                        <option value="RECEPCIONISTA">RECEPCIONISTA</option>
                        <option value="CLIENTE">CLIENTE</option>
                      </select>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex px-3 py-1 rounded-lg text-[10px] font-black tracking-widest uppercase border ${usuario.activo ? "bg-emerald-50 text-emerald-600 border-emerald-200" : "bg-red-50 text-red-600 border-red-200"}`}>
                        {usuario.activo ? "Permitido" : "Suspendido"}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex gap-2 justify-center">
                        <button 
                          onClick={() => abrirDetallesModal(usuario)} 
                          disabled={usuarioEnAccionId === usuario.id || loading}
                          className={`bg-white dark:bg-slate-700 hover:bg-sky-50 dark:hover:bg-sky-900/30 text-sky-600 dark:text-sky-400 p-2 rounded-lg transition-all border border-slate-200 dark:border-slate-600 hover:border-sky-200 shadow-sm ${usuarioEnAccionId === usuario.id ? 'opacity-50 cursor-not-allowed' : ''}`} 
                          title="Ver / Editar"
                        >
                          <Edit size={16} />
                        </button>
                        <button 
                          onClick={() => handleEstadoToggle(usuario.id, usuario.activo)} 
                          disabled={usuarioEnAccionId === usuario.id || loading}
                          className={`p-2 rounded-lg transition-all border shadow-sm ${usuarioEnAccionId === usuario.id ? 'opacity-50 cursor-not-allowed' : ''} ${usuario.activo ? "bg-white dark:bg-slate-700 hover:bg-red-50 dark:hover:bg-red-900/30 text-slate-400 hover:text-red-500 border-slate-200 dark:border-slate-600 hover:border-red-200" : "bg-white dark:bg-slate-700 hover:bg-emerald-50 dark:hover:bg-emerald-900/30 text-slate-400 hover:text-emerald-500 border-slate-200 dark:border-slate-600 hover:border-emerald-200"}`} 
                          title={usuario.activo ? "Suspender" : "Habilitar"}
                        >
                          {usuario.activo ? <ShieldAlert size={16} /> : <ShieldCheck size={16} />}
                        </button>
                        <button 
                          onClick={() => abrirModalEliminar(usuario)} 
                          disabled={usuarioEnAccionId === usuario.id || loading}
                          className={`bg-white dark:bg-slate-700 hover:bg-red-50 dark:hover:bg-red-900/30 text-red-600 dark:text-red-400 p-2 rounded-lg transition-all border border-slate-200 dark:border-slate-600 hover:border-red-200 shadow-sm ${usuarioEnAccionId === usuario.id ? 'opacity-50 cursor-not-allowed' : ''}`} 
                          title="Eliminar Cuenta"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Componentes modales desacoplados */}
      <ModalCrearPersonal 
        isOpen={modalCrearOpen} 
        onClose={() => setModalCrearOpen(false)} 
        onCreated={recargarUsuarios} 
      />

      <ModalDetallesUsuario 
        isOpen={modalDetallesOpen} 
        onClose={() => {
          setModalDetallesOpen(false);
          setUsuarioSeleccionado(null);
        }} 
        usuario={usuarioSeleccionado}
        onUpdated={recargarUsuarios}
      />

      <ModalEliminarUsuario 
        isOpen={modalEliminarOpen} 
        onClose={() => {
          setModalEliminarOpen(false);
          setUsuarioAEliminar(null);
        }} 
        usuario={usuarioAEliminar}
        onDeleted={recargarUsuarios}
      />
    </div>
  );
};

export default PaginaUsuarios;