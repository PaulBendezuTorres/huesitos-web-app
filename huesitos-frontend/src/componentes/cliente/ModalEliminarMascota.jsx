import { useState } from 'react';
import { X, Trash2, AlertTriangle, Eye, EyeOff } from 'lucide-react';
import { eliminarMascota } from '@/api/clienteApi';

const ModalEliminarMascota = ({ mascota, onCerrar, onExito }) => {
  const [contrasena, setContrasena] = useState('');
  const [mostrarContrasena, setMostrarContrasena] = useState(false);
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!contrasena.trim()) {
      setError('Debes ingresar tu contraseña para confirmar.');
      return;
    }

    setCargando(true);
    try {
      await eliminarMascota(mascota.id, contrasena);
      onExito(mascota.id);
    } catch (err) {
      setError(err.response?.data || 'Error al eliminar la mascota. Reintenta.');
    } finally {
      setCargando(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="w-full max-w-md bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200/60 dark:border-slate-800 overflow-hidden">
        {/* Header peligro */}
        <div className="bg-rose-50 dark:bg-rose-950/30 border-b border-rose-100 dark:border-rose-900/40 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-rose-100 dark:bg-rose-950/60 flex items-center justify-center">
              <Trash2 size={16} className="text-rose-600 dark:text-rose-400" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-rose-700 dark:text-rose-300">Eliminar mascota</h3>
              <p className="text-xs text-rose-500 dark:text-rose-400/70">{mascota?.nombre}</p>
            </div>
          </div>
          <button
            onClick={onCerrar}
            className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-rose-100 dark:hover:bg-rose-900/40 text-rose-400 dark:text-rose-500 transition-colors"
            disabled={cargando}
          >
            <X size={16} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {/* Advertencia */}
          <div className="flex items-start gap-3 bg-amber-50 dark:bg-amber-950/20 border border-amber-100 dark:border-amber-900/30 rounded-xl p-4">
            <AlertTriangle size={16} className="text-amber-500 shrink-0 mt-0.5" />
            <div className="text-xs text-amber-700 dark:text-amber-400 space-y-1">
              <p className="font-bold">Esta acción es irreversible.</p>
              <p className="text-amber-600 dark:text-amber-400/80">
                Se eliminará permanentemente el perfil de <strong>{mascota?.nombre}</strong>. 
                Solo es posible si la mascota no tiene citas, consultas ni historial clínico registrado.
              </p>
            </div>
          </div>

          {error && (
            <div className="flex items-start gap-2.5 bg-rose-50 dark:bg-rose-950/20 text-rose-700 dark:text-rose-400 border border-rose-100 dark:border-rose-900/30 p-3.5 rounded-xl text-xs font-semibold">
              <span>{error}</span>
            </div>
          )}

          {/* Campo contraseña */}
          <div>
            <label className="block text-xs font-bold text-slate-600 dark:text-slate-300 mb-2">
              Confirma con tu contraseña
            </label>
            <div className="relative">
              <input
                type={mostrarContrasena ? 'text' : 'password'}
                value={contrasena}
                onChange={(e) => setContrasena(e.target.value)}
                placeholder="Tu contraseña de acceso"
                className="w-full pl-4 pr-10 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-700 dark:text-slate-200 focus:outline-none focus:border-rose-400 dark:focus:border-rose-500 transition-colors"
                disabled={cargando}
                autoFocus
              />
              <button
                type="button"
                onClick={() => setMostrarContrasena(!mostrarContrasena)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
              >
                {mostrarContrasena ? <EyeOff size={15} /> : <Eye size={15} />}
              </button>
            </div>
          </div>

          {/* Acciones */}
          <div className="flex gap-3 pt-1">
            <button
              type="button"
              onClick={onCerrar}
              className="flex-1 px-4 py-2.5 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-semibold text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
              disabled={cargando}
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-rose-500 hover:bg-rose-600 text-white rounded-xl text-sm font-bold transition-all shadow-md shadow-rose-500/20 disabled:opacity-50"
              disabled={cargando}
            >
              {cargando ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <Trash2 size={14} />
              )}
              Eliminar mascota
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ModalEliminarMascota;
