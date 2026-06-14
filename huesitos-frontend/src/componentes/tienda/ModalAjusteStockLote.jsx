import { useState, useEffect } from 'react';
import { X, Save, AlertTriangle } from 'lucide-react';
import { ajustarStockLote } from '@/api/tiendaApi';
import CargadorSpinner from '@/componentes/comun/CargadorSpinner';

const ModalAjusteStockLote = ({
  lote,
  onClose,
  cargarDatos
}) => {
  const [nuevoStockAjuste, setNuevoStockAjuste] = useState('');
  const [procesando, setProcesando] = useState(false);
  const [errorForm, setErrorForm] = useState('');

  useEffect(() => {
    if (lote) {
      setNuevoStockAjuste(lote.stock?.toString() || '');
      setErrorForm('');
    }
  }, [lote]);

  if (!lote) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setProcesando(true);
    setErrorForm('');
    try {
      if (nuevoStockAjuste === '' || Number(nuevoStockAjuste) < 0) {
        throw new Error('El stock debe ser un número igual o mayor a cero.');
      }
      await ajustarStockLote(lote.id, Number(nuevoStockAjuste));
      alert('Stock del lote ajustado con éxito.');
      cargarDatos();
      onClose();
    } catch (err) {
      const msg = err.response?.data || err.message || 'Error al ajustar el stock.';
      setErrorForm(typeof msg === 'string' ? msg : JSON.stringify(msg));
    } finally {
      setProcesando(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="bg-white dark:bg-slate-800 rounded-2xl max-w-sm w-full border border-slate-200 dark:border-slate-700 shadow-2xl overflow-hidden animate-in slide-in-from-bottom-4 duration-350">
        <div className="p-5 border-b border-slate-100 dark:border-slate-700 flex justify-between items-center bg-slate-50/50 dark:bg-slate-900/40">
          <h3 className="font-black text-slate-800 dark:text-slate-100 text-sm uppercase tracking-wide">
            Ajustar Stock de Lote
          </h3>
          <button 
            onClick={onClose} 
            className="p-1.5 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-400 transition-all"
            disabled={procesando}
          >
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-4 text-xs font-semibold">
          <div className="bg-slate-50 dark:bg-slate-900/40 p-3.5 border border-slate-100 dark:border-slate-700 rounded-xl space-y-1.5 text-left">
            <p className="text-[10px] text-slate-400 dark:text-slate-500 uppercase tracking-widest font-bold">Lote Seleccionado</p>
            <p className="font-mono font-bold text-slate-800 dark:text-slate-100">{lote.codigoLote}</p>
            <p className="text-slate-500 dark:text-slate-400">Producto: {lote.producto?.nombre}</p>
          </div>

          <div className="space-y-1">
            <label className="block text-slate-500 dark:text-slate-400 uppercase">Nueva Cantidad (Stock)</label>
            <input
              type="number"
              required
              value={nuevoStockAjuste}
              onChange={(e) => setNuevoStockAjuste(e.target.value)}
              placeholder="0"
              className="w-full px-3 py-2 border border-slate-200 dark:border-slate-600 rounded-lg text-slate-800 dark:text-slate-100 outline-none focus:border-sky-400 transition-all font-bold bg-white dark:bg-slate-700"
              disabled={procesando}
            />
          </div>

          {errorForm && (
            <div className="bg-red-50 border border-red-200 rounded-xl p-3 flex items-center gap-2 text-[11px] text-red-750 font-semibold text-left">
              <AlertTriangle size={14} className="shrink-0 text-red-500" />
              <p>{errorForm}</p>
            </div>
          )}

          <div className="pt-3 border-t border-slate-100 dark:border-slate-700 flex justify-end gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-600 text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
              disabled={procesando}
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={procesando}
              className="px-5 py-2 bg-sky-500 hover:bg-sky-600 text-white rounded-lg transition-colors flex items-center gap-1.5 disabled:opacity-50"
            >
              {procesando ? <CargadorSpinner size="xs" color="border-white" /> : <Save size={12} />}
              Guardar Ajuste
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ModalAjusteStockLote;
