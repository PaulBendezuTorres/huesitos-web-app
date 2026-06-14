import { useState } from 'react';
import { X, Save, AlertTriangle } from 'lucide-react';
import { registrarLote } from '@/api/tiendaApi';
import CargadorSpinner from '@/componentes/comun/CargadorSpinner';

const ModalIngresoLote = ({
  isOpen,
  onClose,
  productos = [],
  calcularStockProducto,
  cargarDatos
}) => {
  const [formLote, setFormLote] = useState({
    productoId: '',
    codigoLote: '',
    stock: '',
    fechaVencimiento: ''
  });
  const [procesando, setProcesando] = useState(false);
  const [errorForm, setErrorForm] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setProcesando(true);
    setErrorForm('');
    try {
      if (!formLote.productoId) {
        throw new Error('El producto es obligatorio.');
      }
      if (!formLote.codigoLote.trim()) {
        throw new Error('El código de lote es obligatorio.');
      }
      if (!formLote.stock || Number(formLote.stock) < 0) {
        throw new Error('El stock debe ser un número igual o mayor a cero.');
      }

      const payload = {
        producto: { id: Number(formLote.productoId) },
        codigoLote: formLote.codigoLote.trim(),
        stock: Number(formLote.stock),
        fechaVencimiento: formLote.fechaVencimiento || null
      };

      await registrarLote(payload);
      alert('Lote de stock registrado con éxito.');
      setFormLote({ productoId: '', codigoLote: '', stock: '', fechaVencimiento: '' });
      cargarDatos();
      onClose();
    } catch (err) {
      const msg = err.response?.data || err.message || 'Error al guardar el lote.';
      setErrorForm(typeof msg === 'string' ? msg : JSON.stringify(msg));
    } finally {
      setProcesando(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="bg-white dark:bg-slate-800 rounded-2xl max-w-md w-full border border-slate-200 dark:border-slate-700 shadow-2xl overflow-hidden animate-in slide-in-from-bottom-4 duration-350">
        <div className="p-5 border-b border-slate-100 dark:border-slate-700 flex justify-between items-center bg-slate-50/50 dark:bg-slate-900/40">
          <h3 className="font-black text-slate-800 dark:text-slate-100 text-sm uppercase tracking-wide">
            Ingresar Lote de Stock
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
          <div className="space-y-1">
            <label className="block text-slate-500 dark:text-slate-400 uppercase">Seleccionar Producto</label>
            <select
              required
              value={formLote.productoId}
              onChange={(e) => setFormLote({ ...formLote, productoId: e.target.value })}
              className="w-full px-3 py-2 border border-slate-200 dark:border-slate-600 rounded-lg text-slate-800 dark:text-slate-100 outline-none focus:border-sky-400 transition-all bg-white dark:bg-slate-700"
              disabled={procesando}
            >
              <option value="">Seleccionar Producto</option>
              {productos.map((prod) => (
                <option key={prod.id} value={prod.id}>
                  {prod.nombre} (Stock actual: {calcularStockProducto(prod.id)})
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="block text-slate-500 dark:text-slate-400 uppercase">Código del Lote</label>
              <input
                type="text"
                required
                value={formLote.codigoLote}
                onChange={(e) => setFormLote({ ...formLote, codigoLote: e.target.value })}
                placeholder="Ej: LOTE-2026-A"
                className="w-full px-3 py-2 border border-slate-200 dark:border-slate-600 rounded-lg text-slate-800 dark:text-slate-100 outline-none focus:border-sky-400 transition-all font-mono font-bold bg-white dark:bg-slate-700"
                disabled={procesando}
              />
            </div>

            <div className="space-y-1">
              <label className="block text-slate-500 dark:text-slate-400 uppercase">Cantidad (Stock)</label>
              <input
                type="number"
                required
                value={formLote.stock}
                onChange={(e) => setFormLote({ ...formLote, stock: e.target.value })}
                placeholder="10"
                className="w-full px-3 py-2 border border-slate-200 dark:border-slate-600 rounded-lg text-slate-800 dark:text-slate-100 outline-none focus:border-sky-400 transition-all font-bold bg-white dark:bg-slate-700"
                disabled={procesando}
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="block text-slate-500 dark:text-slate-400 uppercase">Fecha de Vencimiento</label>
            <input
              type="date"
              value={formLote.fechaVencimiento}
              onChange={(e) => setFormLote({ ...formLote, fechaVencimiento: e.target.value })}
              className="w-full px-3 py-2 border border-slate-200 dark:border-slate-600 rounded-lg text-slate-800 dark:text-slate-100 outline-none focus:border-sky-400 transition-all bg-white dark:bg-slate-700"
              disabled={procesando}
            />
            <span className="text-[10px] text-slate-400 dark:text-slate-500 block mt-1 font-medium">
              Dejar vacío si el producto no tiene fecha de caducidad.
            </span>
          </div>

          {errorForm && (
            <div className="bg-red-50 border border-red-200 rounded-xl p-3 flex items-center gap-2 text-[11px] text-red-700">
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
              className="px-5 py-2 bg-slate-900 dark:bg-slate-100 hover:bg-slate-800 dark:hover:bg-slate-200 text-white dark:text-slate-900 rounded-lg transition-colors flex items-center gap-1.5 disabled:opacity-50"
            >
              {procesando ? <CargadorSpinner size="xs" color="border-white dark:border-slate-900" /> : <Save size={12} />}
              Ingresar Stock
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ModalIngresoLote;
