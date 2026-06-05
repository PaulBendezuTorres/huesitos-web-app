import { useState, useEffect, useCallback } from 'react';
import { AlertTriangle, Calendar, RefreshCw, Loader2, Package } from 'lucide-react';
import { obtenerAlertasBajoStock, obtenerAlertasVencimientos } from '../servicios/finanzasServicio';

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
      <div className="p-4 border-b border-slate-200 bg-white flex justify-between items-center shrink-0">
        <div className="flex items-center gap-2">
          <Package size={18} className="text-slate-750 text-slate-700" />
          <h2 className="font-bold text-slate-800 text-sm tracking-tight">Inventario crítico (FEFO)</h2>
        </div>
        <button
          onClick={cargarAlertas}
          disabled={loading}
          className="p-1.5 bg-white hover:bg-slate-50 border border-slate-200 shadow-sm rounded-lg text-xs font-semibold text-slate-550 hover:text-sky-600 transition-all flex items-center justify-center"
          title="Refrescar alertas"
        >
          {loading ? <Loader2 size={12} className="animate-spin" /> : <RefreshCw size={12} />}
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
          <div className="bg-white p-5 rounded-2xl border border-slate-200/60 shadow-sm flex flex-col">
            <div className="flex items-center gap-2 mb-4 border-b border-slate-100 pb-2">
              <AlertTriangle className="text-red-500" size={18} />
              <h3 className="font-bold text-slate-800 text-xs tracking-wide">Stock crítico</h3>
            </div>
            <div className="flex-1 space-y-3 overflow-y-auto max-h-[220px] pr-1 text-left">
              {loading ? (
                <p className="text-xs text-slate-400 animate-pulse font-semibold text-center py-4">Consultando stock...</p>
              ) : bajoStock.length === 0 ? (
                <p className="text-xs text-emerald-600 font-semibold text-center py-4">Insumos y productos al día.</p>
              ) : (
                bajoStock.map((prod) => (
                  <div key={prod.id} className="flex justify-between items-center p-2.5 rounded-xl bg-red-50/50 border border-red-100 text-xs">
                    <div>
                      <p className="font-bold text-slate-800">{prod.nombre}</p>
                      <p className="text-[10px] text-slate-400">Mínimo: {prod.stockMinimo} unds.</p>
                    </div>
                    <span className="bg-red-100 text-red-700 font-bold px-2 py-0.5 rounded-md text-[10px]">
                      Sin stock
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* FEFO Caducidad */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200/60 shadow-sm flex flex-col">
            <div className="flex items-center gap-2 mb-4 border-b border-slate-100 pb-2">
              <Calendar className="text-amber-500" size={18} />
              <h3 className="font-bold text-slate-800 text-xs tracking-wide">Próximos a vencer</h3>
            </div>
            <div className="flex-1 space-y-3 overflow-y-auto max-h-[220px] pr-1 text-left">
              {loading ? (
                <p className="text-xs text-slate-400 animate-pulse font-semibold text-center py-4">Analizando lotes...</p>
              ) : vencimientos.length === 0 ? (
                <p className="text-xs text-emerald-600 font-semibold text-center py-4">Lotes en buen estado.</p>
              ) : (
                vencimientos.map((lote) => (
                  <div key={lote.id} className="flex justify-between items-center p-2.5 rounded-xl bg-amber-50/50 border border-amber-150 text-xs">
                    <div>
                      <p className="font-bold text-slate-800">{lote.producto ? lote.producto.nombre : 'Producto'}</p>
                      <p className="text-[10px] text-slate-400 font-medium">Lote: {lote.numeroLote || lote.codigoLote || 'N/A'}</p>
                    </div>
                    <div className="text-right">
                      <span className="bg-amber-100 text-amber-700 font-bold px-2 py-0.5 rounded-md text-[9px] block">
                        Vence
                      </span>
                      <span className="text-[9px] text-slate-500 font-semibold mt-1 block">
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
