import { useState, useEffect } from "react";
import { obtenerDetallesDueño, actualizarCredencialesUsuario } from "@/servicios/usuarioServicio";
import { X, Lock, Mail, Info } from "lucide-react";
import Avatar from "@/componentes/comun/Avatar";
import CargadorSpinner from "@/componentes/comun/CargadorSpinner";

const ModalDetallesUsuario = ({ isOpen, onClose, usuario, onUpdated }) => {
  const [datosDueño, setDatosDueño] = useState(null);
  const [loadingDueño, setLoadingDueño] = useState(false);
  const [editForm, setEditForm] = useState({ correo: "", contrasena: "" });
  const [procesandoForm, setProcesandoForm] = useState(false);

  useEffect(() => {
    if (!usuario) return;
    
    setEditForm({ correo: usuario.correo, contrasena: "" });
    setDatosDueño(null);

    if (usuario.rol === "CLIENTE") {
      setLoadingDueño(true);
      obtenerDetallesDueño(usuario.id)
        .then((data) => {
          setDatosDueño(data);
        })
        .catch((error) => {
          console.error("Este cliente no cuenta con datos de dueño registrados aún:", error);
        })
        .finally(() => {
          setLoadingDueño(false);
        });
    }
  }, [usuario]);

  const handleFormChange = (e) => {
    setEditForm({ ...editForm, [e.target.name]: e.target.value });
  };

  const ejecutarGuardadoCredenciales = async (e) => {
    e.preventDefault();
    setProcesandoForm(true);
    try {
      await actualizarCredencialesUsuario(usuario.id, editForm);
      alert("Credenciales actualizadas de manera exitosa.");
      onUpdated();
      onClose();
    } catch (error) {
      console.error(error);
      alert(error.response?.data || "Error de red al intentar actualizar los accesos.");
    } finally {
      setProcesandoForm(false);
    }
  };

  if (!isOpen || !usuario) return null;

  return (
    <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in duration-200">
      <div className="bg-white dark:bg-slate-800 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-700 max-w-2xl w-full overflow-hidden flex flex-col max-h-[90vh]">
        <div className="px-6 py-5 border-b border-slate-100 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-900/40 flex justify-between items-center">
          <h3 className="text-lg font-black text-slate-800 dark:text-slate-100">Detalles de Cuenta de Usuario</h3>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 transition-colors">
            <X size={20} />
          </button>
        </div>

        <div className="p-6 overflow-y-auto space-y-6">
          <div className="flex flex-col sm:flex-row items-center gap-6 bg-slate-50 dark:bg-slate-900/40 p-5 rounded-2xl border border-slate-100 dark:border-slate-700">
            <Avatar url={usuario.fotoPerfilUrl} size="w-20 h-20" className="border-2 border-slate-200" />
            <div className="space-y-1 text-center sm:text-left">
              <p className="text-sm font-bold text-slate-500 dark:text-slate-400">
                Rol del Sistema: <span className="text-sky-600 dark:text-sky-400 font-black tracking-wide">{usuario.rol}</span>
              </p>
              <p className="text-slate-800 dark:text-slate-100 font-bold text-lg tracking-tight">{usuario.correo}</p>
              <p className="text-xs text-slate-400 dark:text-slate-500 font-mono flex items-center justify-center sm:justify-start gap-1 mt-1">
                <Lock size={12} /> Contraseña: ••••••••
              </p>
            </div>
          </div>

          {usuario.rol === "CLIENTE" && (
            <div className="border-t border-slate-100 dark:border-slate-700 pt-5 space-y-4">
              <h4 className="font-black text-slate-800 dark:text-slate-100 text-sm tracking-widest uppercase">Información de Dueño Asociada</h4>
              {loadingDueño ? (
                <p className="text-xs text-sky-600 dark:text-sky-400 animate-pulse font-medium">Cargando datos de contacto desde la tabla dueño...</p>
              ) : datosDueño ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-sky-50/50 dark:bg-sky-900/20 p-5 rounded-2xl border border-sky-100/50 dark:border-sky-800/50 text-sm">
                  <div>
                    <span className="block text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-1">Nombre Completo</span>
                    <p className="font-bold text-slate-800 dark:text-slate-100">{datosDueño.nombreCompleto}</p>
                  </div>
                  <div>
                    <span className="block text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-1">Teléfono / Celular</span>
                    <p className="font-bold text-slate-800 dark:text-slate-100">{datosDueño.telefono}</p>
                  </div>
                  <div className="sm:col-span-2">
                    <span className="block text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-1">Dirección de Domicilio</span>
                    <p className="font-bold text-slate-800 dark:text-slate-100">{datosDueño.direccion}</p>
                  </div>
                </div>
              ) : (
                <div className="flex items-center gap-2 text-xs text-amber-600 bg-amber-50 p-4 rounded-xl border border-amber-200 font-medium">
                  <Info size={16} /> Este cliente no ha completado el registro de sus datos de contacto físicos.
                </div>
              )}
            </div>
          )}

          {usuario.rol !== "CLIENTE" && (
            <form onSubmit={ejecutarGuardadoCredenciales} className="border-t border-slate-100 dark:border-slate-700 pt-5 space-y-5">
              <div>
                <h4 className="font-black text-slate-800 dark:text-slate-100 text-sm tracking-widest uppercase">Modificación de Credenciales</h4>
                <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">Puedes modificar uno o ambos campos. Deja la contraseña en blanco si no deseas cambiarla.</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 mb-1.5 uppercase tracking-wide">Correo Electrónico</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 text-slate-400" size={18} />
                    <input
                      type="email"
                      name="correo"
                      value={editForm.correo}
                      onChange={handleFormChange}
                      required
                      className="w-full pl-10 border border-slate-300 dark:border-slate-600 p-2.5 rounded-xl text-slate-800 dark:text-slate-100 focus:ring-2 focus:ring-sky-500 focus:border-sky-500 outline-none transition-all bg-slate-50 dark:bg-slate-700 focus:bg-white dark:focus:bg-slate-600"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 mb-1.5 uppercase tracking-wide">Nueva Contraseña</label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 text-slate-400" size={18} />
                    <input
                      type="password"
                      name="contrasena"
                      value={editForm.contrasena}
                      onChange={handleFormChange}
                      placeholder="Dejar en blanco para conservar"
                      className="w-full pl-10 border border-slate-300 dark:border-slate-600 p-2.5 rounded-xl text-slate-800 dark:text-slate-100 focus:ring-2 focus:ring-sky-500 focus:border-sky-500 outline-none transition-all bg-slate-50 dark:bg-slate-700 focus:bg-white dark:focus:bg-slate-600"
                    />
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-700">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-5 py-2.5 rounded-xl text-sm font-bold text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={procesandoForm}
                  className="px-5 py-2.5 bg-gradient-to-r from-sky-500 to-cyan-400 hover:from-sky-600 hover:to-cyan-500 text-white text-sm font-bold rounded-xl shadow-lg shadow-sky-500/30 transition-all disabled:opacity-50"
                >
                  {procesandoForm ? "Guardando..." : "Guardar Cambios"}
                </button>
              </div>
            </form>
          )}
        </div>

        {usuario.rol === "CLIENTE" && (
          <div className="p-5 border-t border-slate-100 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-900/40 flex justify-end">
            <button
              onClick={onClose}
              className="px-6 py-2.5 bg-slate-800 dark:bg-slate-700 hover:bg-slate-900 dark:hover:bg-slate-600 text-white rounded-xl text-sm font-bold shadow-md transition-colors"
            >
              Cerrar Vista
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ModalDetallesUsuario;
