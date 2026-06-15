import { useState } from 'react';
import { X, Save, AlertTriangle, Layers, Package, Hash, Calendar, Plus } from 'lucide-react';
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
    <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="bg-white dark:bg-slate-800 rounded-3xl max-w-md w-full border border-slate-200/60 dark:border-slate-700/60 shadow-2xl overflow-hidden animate-in slide-in-from-bottom-4 duration-300 flex flex-col">
        {/* Cabecera del Modal */}
        <div className="px-6 py-5 border-b border-slate-100 dark:border-slate-700/60 flex justify-between items-center bg-slate-50/50 dark:bg-slate-900/40">
          <h3 className="font-black text-slate-800 dark:text-slate-100 text-base flex items-center gap-2 tracking-tight">
            <Layers className="text-sky-500" size={20} /> Ingresar Lote de Stock
          </h3>
          <button 
            onClick={onClose} 
            className="p-1.5 rounded-lg hover:bg-slate-200/60 dark:hover:bg-slate-700/60 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 transition-colors"
            disabled={procesando}
          >
            <X size={20} />
          </button>
        </div>

        {/* Formulario */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5 text-xs font-semibold">
          {/* Seleccionar Producto */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wide">Seleccionar Producto</label>
            <div className="relative">
              <Package className="absolute left-3.5 top-3 text-slate-400" size={18} />
              <select
                required
                value={formLote.productoId}
                onChange={(e) => setFormLote({ ...formLote, productoId: e.target.value })}
                className="w-full pl-11 pr-4 py-2.5 border border-slate-300 dark:border-slate-600 rounded-xl text-slate-800 dark:text-slate-100 outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 transition-all bg-slate-50 dark:bg-slate-700 cursor-pointer font-bold"
                disabled={procesando}
              >
                <option value="">Selecciona el producto del inventario...</option>
                {productos.map((prod) => (
                  <option key={prod.id} value={prod.id}>
                    {prod.nombre} (Stock: {calcularStockProducto(prod.id)})
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {/* Código del Lote */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wide">Código del Lote</label>
              <div className="relative">
                <Hash className="absolute left-3.5 top-3 text-slate-400" size={18} />
                <input
                  type="text"
                  required
                  value={formLote.codigoLote}
                  onChange={(e) => setFormLote({ ...formLote, codigoLote: e.target.value })}
                  placeholder="LOTE-2026-A"
                  className="w-full pl-11 pr-4 py-2.5 border border-slate-300 dark:border-slate-600 rounded-xl text-slate-800 dark:text-slate-100 outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 transition-all font-mono font-bold bg-slate-50 dark:bg-slate-700"
                  disabled={procesando}
                />
              </div>
            </div>

            {/* Cantidad (Stock) */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wide">Cantidad (Stock)</label>
              <div className="relative">
                <Plus className="absolute left-3.5 top-3 text-slate-400" size={18} />
                <input
                  type="number"
                  required
                  min="0"
                  value={formLote.stock}
                  onChange={(e) => setFormLote({ ...formLote, stock: e.target.value })}
                  placeholder="10"
                  className="w-full pl-11 pr-4 py-2.5 border border-slate-300 dark:border-slate-600 rounded-xl text-slate-800 dark:text-slate-100 outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 transition-all font-bold bg-slate-50 dark:bg-slate-700"
                  disabled={procesando}
                />
              </div>
            </div>
          </div>

          {/* Fecha de Vencimiento */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wide">Fecha de Vencimiento</label>
            <div className="relative">
              <Calendar className="absolute left-3.5 top-3 text-slate-400" size={18} />
              <input
                type="date"
                value={formLote.fechaVencimiento}
                onChange={(e) => setFormLote({ ...formLote, fechaVencimiento: e.target.value })}
                className="w-full pl-11 pr-4 py-2.5 border border-slate-300 dark:border-slate-600 rounded-xl text-slate-800 dark:text-slate-100 outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 transition-all bg-slate-50 dark:bg-slate-700 font-bold"
                disabled={procesando}
              />
            </div>
            <span className="text-[10px] text-slate-400 dark:text-slate-500 block mt-1 font-medium italic">
              * Dejar vacío si el producto no tiene fecha de caducidad.
            </span>
          </div>

          {/* Mensaje de Error */}
          {errorForm && (
            <div className="bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-900/50 rounded-xl p-3 flex items-start gap-2.5 text-[11px] text-red-700 dark:text-red-400 transition-all">
              <AlertTriangle size={16} className="shrink-0 text-red-500 dark:text-red-400 mt-0.5" />
              <p className="leading-relaxed">{errorForm}</p>
            </div>
          )}

          {/* Botones de Acción */}
          <div className="pt-4 border-t border-slate-100 dark:border-slate-700/60 flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-600 text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors font-bold"
              disabled={procesando}
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={procesando}
              className="px-6 py-2.5 bg-gradient-to-r from-sky-500 to-cyan-400 hover:from-sky-600 hover:to-cyan-500 text-white font-bold rounded-xl shadow-lg shadow-sky-500/20 transition-all flex items-center gap-2 disabled:opacity-50"
            >
              {procesando ? (
                <CargadorSpinner size="xs" color="border-white" />
              ) : (
                <Save size={16} />
              )}
              {procesando ? "Guardando..." : "Ingresar Stock"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ModalIngresoLote;
