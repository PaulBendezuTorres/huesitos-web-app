import { useState, useEffect } from "react";
import { eliminarCuentaUsuario } from "@/servicios/usuarioServicio";
import { X, AlertTriangle } from "lucide-react";

const ModalEliminarUsuario = ({ isOpen, onClose, usuario, onDeleted }) => {
  const [confirmadoEliminar, setConfirmadoEliminar] = useState(false);
  const [procesandoEliminacion, setProcesandoEliminacion] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setConfirmadoEliminar(false);
    }
  }, [isOpen, usuario]);

  const ejecutarEliminacionUsuario = async () => {
    if (!confirmadoEliminar || !usuario) return;
    setProcesandoEliminacion(true);
    try {
      await eliminarCuentaUsuario(usuario.id);
      alert("Usuario eliminado exitosamente.");
      onDeleted();
      onClose();
    } catch (error) {
      console.error(error);
      const mensaje = typeof error.response?.data === "string"
        ? error.response.data
        : (error.response?.data?.mensaje || "Ocurrió un error al intentar eliminar el usuario.");
      alert(mensaje);
    } finally {
      setProcesandoEliminacion(false);
    }
  };

  if (!isOpen || !usuario) return null;

  return (
    <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in duration-200">
      <div className="bg-white dark:bg-slate-800 rounded-3xl shadow-2xl border border-red-100 dark:border-red-900/50 max-w-md w-full overflow-hidden flex flex-col">
        <div className="px-6 py-5 border-b border-red-50 dark:border-red-900/50 flex justify-between items-center bg-red-50/30 dark:bg-red-900/20">
          <h3 className="text-lg font-black text-red-700 dark:text-red-400 flex items-center gap-2">
            <AlertTriangle className="text-red-600 animate-bounce" size={22} /> Advertencia Crítica
          </h3>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 transition-colors"
            disabled={procesandoEliminacion}
          >
            <X size={20} />
          </button>
        </div>

        <div className="p-6 space-y-6">
          <div className="bg-red-50/50 dark:bg-red-900/20 border border-red-100 dark:border-red-900/50 p-4 rounded-2xl space-y-3">
            <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">
              ¿Estás seguro de que deseas eliminar permanentemente esta cuenta? Esta acción no se puede deshacer.
            </p>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Se eliminarán o desvincularán todos los registros asociados a este usuario respetando las reglas de integridad de datos.
            </p>
          </div>

          <div className="bg-slate-50 dark:bg-slate-900/40 p-4 rounded-xl border border-slate-100 dark:border-slate-700 text-sm">
            <span className="block text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-1">Usuario a eliminar</span>
            <p className="font-bold text-slate-800 dark:text-slate-100 break-all">{usuario.correo}</p>
            <p className="text-xs text-sky-600 dark:text-sky-400 font-bold mt-1">Rol: {usuario.rol}</p>
          </div>

          <label className="flex items-start gap-3 cursor-pointer select-none group">
            <input
              type="checkbox"
              checked={confirmadoEliminar}
              onChange={(e) => setConfirmadoEliminar(e.target.checked)}
              disabled={procesandoEliminacion}
              className="mt-1 h-4.5 w-4.5 rounded border-slate-300 text-red-600 focus:ring-red-500 cursor-pointer"
            />
            <span className="text-xs font-bold text-slate-600 dark:text-slate-400 group-hover:text-slate-800 dark:group-hover:text-slate-200 transition-colors leading-tight">
              Confirmo que deseo eliminar definitivamente esta cuenta de usuario del sistema.
            </span>
          </label>

          <div className="flex justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-700">
            <button
              type="button"
              onClick={onClose}
              disabled={procesandoEliminacion}
              className="px-5 py-2.5 rounded-xl text-sm font-bold text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors disabled:opacity-50"
            >
              Cancelar
            </button>
            <button
              type="button"
              onClick={ejecutarEliminacionUsuario}
              disabled={!confirmadoEliminar || procesandoEliminacion}
              className="px-5 py-2.5 bg-red-600 hover:bg-red-700 disabled:bg-slate-200 dark:disabled:bg-slate-700 text-white disabled:text-slate-400 text-sm font-bold rounded-xl shadow-lg shadow-red-600/20 disabled:shadow-none transition-all cursor-pointer disabled:cursor-not-allowed"
            >
              {procesandoEliminacion ? "Eliminando..." : "Eliminar cuenta"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModalEliminarUsuario;
