import { useState } from 'react';
import { X, Plus, AlertTriangle } from 'lucide-react';
import { registrarCategoria } from '@/api/tiendaApi';
import CargadorSpinner from '@/componentes/comun/CargadorSpinner';

const ModalCrearCategoria = ({ isOpen, onClose, onCreated }) => {
  const [nuevoNombreCat, setNuevoNombreCat] = useState('');
  const [nuevaDescCat, setNuevaDescCat] = useState('');
  const [guardandoCat, setGuardandoCat] = useState(false);
  const [errorCat, setErrorCat] = useState('');

  if (!isOpen) return null;

  const handleCrearCategoria = async (e) => {
    e.preventDefault();
    if (!nuevoNombreCat.trim()) {
      setErrorCat('El nombre de la categoría es obligatorio.');
      return;
    }
    setGuardandoCat(true);
    setErrorCat('');
    try {
      const payload = {
        nombre: nuevoNombreCat.trim(),
        descripcion: nuevaDescCat.trim() || null
      };
      const catCreada = await registrarCategoria(payload);
      alert('Categoría creada con éxito.');
      onCreated(catCreada);
      setNuevoNombreCat('');
      setNuevaDescCat('');
      onClose();
    } catch (err) {
      setErrorCat(err.response?.data || err.message || 'Error al guardar la categoría.');
    } finally {
      setGuardandoCat(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="bg-white dark:bg-slate-800 rounded-2xl max-w-md w-full border border-slate-200 dark:border-slate-700 shadow-2xl overflow-hidden animate-in slide-in-from-bottom-4 duration-300">
        <div className="p-5 border-b border-slate-100 dark:border-slate-700 flex justify-between items-center bg-slate-50/50 dark:bg-slate-900/40">
          <h3 className="font-black text-slate-800 dark:text-slate-100 text-sm uppercase tracking-wide">
            Crear Nueva Categoría
          </h3>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-400 transition-all"
            disabled={guardandoCat}
          >
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleCrearCategoria} className="p-5 space-y-4 text-xs font-bold uppercase tracking-wider">
          <div className="space-y-1">
            <label className="block text-slate-500 dark:text-slate-400">Nombre de la Categoría</label>
            <input
              type="text"
              required
              value={nuevoNombreCat}
              onChange={(e) => setNuevoNombreCat(e.target.value)}
              placeholder="Ej: Alimentos, Farmacia, Accesorios..."
              className="w-full px-4 py-3 border border-slate-200 dark:border-slate-600 rounded-xl text-slate-800 dark:text-slate-100 outline-none focus:ring-2 focus:ring-sky-100 focus:border-sky-400 transition-all bg-slate-50 dark:bg-slate-700 focus:bg-white"
              disabled={guardandoCat}
            />
          </div>

          <div className="space-y-1">
            <label className="block text-slate-500 dark:text-slate-400">Descripción (Opcional)</label>
            <textarea
              value={nuevaDescCat}
              onChange={(e) => setNuevaDescCat(e.target.value)}
              placeholder="Ingresa una breve descripción de la categoría..."
              className="w-full px-4 py-3 border border-slate-200 dark:border-slate-600 rounded-xl text-slate-800 dark:text-slate-100 outline-none focus:ring-2 focus:ring-sky-100 focus:border-sky-400 transition-all h-20 bg-slate-50 dark:bg-slate-700 focus:bg-white resize-none"
              disabled={guardandoCat}
            />
          </div>

          {errorCat && (
            <div className="bg-red-50 border border-red-200 rounded-2xl p-3.5 flex items-center gap-2.5 text-xs text-red-750 font-semibold">
              <AlertTriangle size={15} className="shrink-0 text-red-555" />
              <p className="text-left leading-normal">{errorCat}</p>
            </div>
          )}

          <div className="pt-3 border-t border-slate-100 dark:border-slate-700 flex justify-end gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-650 text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700 font-bold transition-all text-[11px]"
              disabled={guardandoCat}
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={guardandoCat}
              className="px-5 py-2 bg-sky-500 hover:bg-sky-600 text-white rounded-xl font-bold transition-all flex items-center gap-1.5 disabled:opacity-50 text-[11px]"
            >
              {guardandoCat ? (
                <CargadorSpinner size="xs" color="border-white" />
              ) : (
                <Plus size={12} />
              )}
              Crear Categoría
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ModalCrearCategoria;
