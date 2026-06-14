import { useState, useEffect, useCallback } from 'react';
import { AlertTriangle, Calendar, RefreshCw, Package } from 'lucide-react';
import { obtenerAlertasBajoStock, obtenerAlertasVencimientos } from '@/servicios/finanzasServicio';
import CargadorSpinner from '@/componentes/comun/CargadorSpinner';

const WidgetInventarioCritico = () => {
  const [bajoStock, setBajoStock] = useState([]);
  const [vencimientos, setVencimientos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const cargarAlertas = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const [stock, vencs] = await Promise.all([
        obtenerAlertasBajoStock(),
        obtenerAlertasVencimientos(30)
      ]);
      setBajoStock(stock);
      setVencimientos(vencs);
    } catch (err) {
      console.error("Error al cargar alertas de inventario:", err);
      setError("No se pudieron cargar las alertas de inventario.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    cargarAlertas();
  }, [cargarAlertas]);

  return (
    <>
      {/* Cabecera del widget */}
      <div className="p-4 border-b border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 flex justify-between items-center shrink-0">
        <div className="flex items-center gap-2">
          <Package size={18} className="text-slate-750 text-slate-700 dark:text-slate-300" />
          <h2 className="font-bold text-slate-800 dark:text-slate-100 text-sm tracking-tight">Inventario crítico (FEFO)</h2>
        </div>
        <button
          onClick={cargarAlertas}
          disabled={loading}
          className="p-1.5 bg-white dark:bg-slate-700 hover:bg-slate-50 dark:hover:bg-slate-600 border border-slate-200 dark:border-slate-600 shadow-sm rounded-lg text-xs font-semibold text-slate-550 dark:text-slate-300 hover:text-sky-600 transition-all flex items-center justify-center"
          title="Refrescar alertas"
        >
          {loading ? <CargadorSpinner size="xs" /> : <RefreshCw size={12} />}
        </button>
      </div>

      {/* Cuerpo del widget */}
      <div className="p-6 space-y-6 lg:flex-1 lg:overflow-y-auto custom-scrollbar">
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-3 flex items-center gap-2 text-xs text-red-700">
            <AlertTriangle size={14} className="shrink-0" />
            <p>{error}</p>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Stock Mínimo */}
          <div className="bg-white dark:bg-slate-800 p-5 rounded-2xl border border-slate-200/60 dark:border-slate-700/60 shadow-sm flex flex-col">
            <div className="flex items-center gap-2 mb-4 border-b border-slate-100 dark:border-slate-700 pb-2">
              <AlertTriangle className="text-red-500" size={18} />
              <h3 className="font-bold text-slate-800 dark:text-slate-100 text-xs tracking-wide">Stock crítico</h3>
            </div>
            <div className="flex-1 space-y-3 overflow-y-auto max-h-[220px] pr-1 text-left">
              {loading ? (
                <div className="flex flex-col items-center justify-center py-4 gap-1.5">
                  <CargadorSpinner size="xs" />
                  <span className="text-xs font-semibold text-slate-400 dark:text-slate-500">Consultando stock...</span>
                </div>
              ) : bajoStock.length === 0 ? (
                <p className="text-xs text-emerald-600 font-semibold text-center py-4">Insumos y productos al día.</p>
              ) : (
                bajoStock.map((prod) => (
                  <div key={prod.id} className="flex justify-between items-center p-2.5 rounded-xl bg-red-50/50 dark:bg-red-900/20 border border-red-100 dark:border-red-800/40 text-xs">
                    <div>
                      <p className="font-bold text-slate-800 dark:text-slate-100">{prod.nombre}</p>
                      <p className="text-[10px] text-slate-400 dark:text-slate-500">Mínimo: {prod.stockMinimo} unds.</p>
                    </div>
                    <span className="bg-red-100 dark:bg-red-900/40 text-red-700 dark:text-red-400 font-bold px-2 py-0.5 rounded-md text-[10px]">
                      Sin stock
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* FEFO Caducidad */}
          <div className="bg-white dark:bg-slate-800 p-5 rounded-2xl border border-slate-200/60 dark:border-slate-700/60 shadow-sm flex flex-col">
            <div className="flex items-center gap-2 mb-4 border-b border-slate-100 dark:border-slate-700 pb-2">
              <Calendar className="text-amber-500" size={18} />
              <h3 className="font-bold text-slate-800 dark:text-slate-100 text-xs tracking-wide">Próximos a vencer</h3>
            </div>
            <div className="flex-1 space-y-3 overflow-y-auto max-h-[220px] pr-1 text-left">
              {loading ? (
                <div className="flex flex-col items-center justify-center py-4 gap-1.5">
                  <CargadorSpinner size="xs" />
                  <span className="text-xs font-semibold text-slate-400 dark:text-slate-500">Analizando lotes...</span>
                </div>
              ) : vencimientos.length === 0 ? (
                <p className="text-xs text-emerald-600 font-semibold text-center py-4">Lotes en buen estado.</p>
              ) : (
                vencimientos.map((lote) => (
                  <div key={lote.id} className="flex justify-between items-center p-2.5 rounded-xl bg-amber-50/50 dark:bg-amber-900/20 border border-amber-150 dark:border-amber-800/40 text-xs">
                    <div>
                      <p className="font-bold text-slate-800 dark:text-slate-100">{lote.producto ? lote.producto.nombre : 'Producto'}</p>
                      <p className="text-[10px] text-slate-400 dark:text-slate-500 font-medium">Lote: {lote.numeroLote || lote.codigoLote || 'N/A'}</p>
                    </div>
                    <div className="text-right">
                      <span className="bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-400 font-bold px-2 py-0.5 rounded-md text-[9px] block">
                        Vence
                      </span>
                      <span className="text-[9px] text-slate-500 dark:text-slate-400 font-semibold mt-1 block">
                        {new Date(lote.fechaVencimiento).toLocaleDateString('es-PE')}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default WidgetInventarioCritico;
