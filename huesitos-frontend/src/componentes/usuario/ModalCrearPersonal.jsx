import { useState } from "react";
import { registrarNuevoPersonal } from "@/servicios/usuarioServicio";
import { UserPlus, X, Mail, Lock, Info } from "lucide-react";
import CargadorSpinner from "@/componentes/comun/CargadorSpinner";

const ModalCrearPersonal = ({ isOpen, onClose, onCreated }) => {
  const [crearForm, setCrearForm] = useState({ correo: "", contrasena: "", rol: "RECEPCIONISTA" });
  const [procesandoCreacion, setProcesandoCreacion] = useState(false);

  const handleCrearFormChange = (e) => {
    setCrearForm({ ...crearForm, [e.target.name]: e.target.value });
  };

  const ejecutarCreacionPersonal = async (e) => {
    e.preventDefault();
    setProcesandoCreacion(true);
    try {
      await registrarNuevoPersonal(crearForm);
      setCrearForm({ correo: "", contrasena: "", rol: "RECEPCIONISTA" }); // Limpiar
      alert("Personal registrado exitosamente.");
      onCreated();
      onClose();
    } catch (error) {
      console.error(error);
      alert(error.response?.data || "Error al intentar crear la cuenta.");
    } finally {
      setProcesandoCreacion(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in duration-200">
      <div className="bg-white dark:bg-slate-800 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-700 max-w-md w-full overflow-hidden flex flex-col">
        <div className="px-6 py-5 border-b border-slate-100 dark:border-slate-700 flex justify-between items-center bg-slate-50/50 dark:bg-slate-900/40">
          <h3 className="text-lg font-black text-slate-800 dark:text-slate-100 flex items-center gap-2">
            <UserPlus className="text-sky-500" size={20} /> Alta de Nuevo Personal
          </h3>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 transition-colors">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={ejecutarCreacionPersonal} className="p-6 space-y-5">
          <p className="text-sm text-slate-500 dark:text-slate-400 flex items-start gap-2 bg-slate-50 dark:bg-slate-900/40 p-3 rounded-xl border border-slate-100 dark:border-slate-700">
            <Info className="text-sky-500 shrink-0 mt-0.5" size={16} />
            Crea credenciales seguras para los colaboradores de la clínica.
          </p>

          <div>
            <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 mb-1.5 uppercase tracking-wide">Correo Electrónico</label>
            <div className="relative">
              <Mail className="absolute left-3 top-3 text-slate-400" size={18} />
              <input
                type="email"
                name="correo"
                value={crearForm.correo}
                onChange={handleCrearFormChange}
                required
                placeholder="ejemplo@huesitos.com"
                className="w-full pl-10 border border-slate-300 dark:border-slate-600 p-2.5 rounded-xl text-slate-800 dark:text-slate-100 focus:ring-2 focus:ring-sky-500 focus:border-sky-500 outline-none transition-all bg-slate-50 dark:bg-slate-700 focus:bg-white dark:focus:bg-slate-600"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 mb-1.5 uppercase tracking-wide">Contraseña Inicial</label>
            <div className="relative">
              <Lock className="absolute left-3 top-3 text-slate-400" size={18} />
              <input
                type="password"
                name="contrasena"
                value={crearForm.contrasena}
                onChange={handleCrearFormChange}
                required
                placeholder="Mínimo 6 caracteres"
                minLength="6"
                className="w-full pl-10 border border-slate-300 dark:border-slate-600 p-2.5 rounded-xl text-slate-800 dark:text-slate-100 focus:ring-2 focus:ring-sky-500 focus:border-sky-500 outline-none transition-all bg-slate-50 dark:bg-slate-700 focus:bg-white dark:focus:bg-slate-600"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 mb-1.5 uppercase tracking-wide">Asignar Rol</label>
            <select
              name="rol"
              value={crearForm.rol}
              onChange={handleCrearFormChange}
              className="w-full border border-slate-300 dark:border-slate-600 p-2.5 rounded-xl text-slate-800 dark:text-slate-100 focus:ring-2 focus:ring-sky-500 font-bold bg-slate-50 dark:bg-slate-700 focus:bg-white dark:focus:bg-slate-600 cursor-pointer"
            >
              <option value="RECEPCIONISTA">RECEPCIONISTA</option>
              <option value="VETERINARIO">VETERINARIO</option>
              <option value="ADMINISTRADOR">ADMINISTRADOR</option>
            </select>
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
              disabled={procesandoCreacion}
              className="px-5 py-2.5 bg-gradient-to-r from-sky-500 to-cyan-400 hover:from-sky-600 hover:to-cyan-500 text-white text-sm font-bold rounded-xl shadow-lg shadow-sky-500/30 transition-all disabled:opacity-50"
            >
              {procesandoCreacion ? "Creando..." : "Crear Personal"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ModalCrearPersonal;
