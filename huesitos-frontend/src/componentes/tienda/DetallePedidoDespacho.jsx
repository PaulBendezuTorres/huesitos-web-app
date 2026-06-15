import { ShoppingBag, Truck, Check, X, ChevronLeft, Calendar, User } from 'lucide-react';
import CargadorSpinner from '@/componentes/comun/CargadorSpinner';

const DetallePedidoDespacho = ({
  pedido,
  onVolver,
  onActualizarEstado,
  procesando
}) => {
  if (!pedido) {
    return (
      <div className="flex-1 flex flex-col justify-center items-center p-8 text-center text-slate-500 dark:text-slate-400 select-none bg-white dark:bg-slate-800 rounded-3xl border border-slate-200/60 dark:border-slate-700/60 shadow-xl h-full animate-in fade-in duration-300">
        <div className="w-16 h-16 bg-slate-100 dark:bg-slate-900/60 text-slate-450 dark:text-slate-555 rounded-full flex items-center justify-center mb-4 border border-slate-200/40 dark:border-slate-850 shadow-inner">
          <Truck size={32} />
        </div>
        <h3 className="text-base font-black text-slate-800 dark:text-slate-100 tracking-tight">Despacho de Pedidos</h3>
        <p className="text-xs text-slate-400 dark:text-slate-500 max-w-sm mt-1.5 font-medium leading-relaxed">
          Selecciona un pedido entrante de la lista para gestionar su estado de pago, verificar lotes y despachar físicamente el producto.
        </p>
      </div>
    );
  }

  return (
    <div className="flex-1 bg-white dark:bg-slate-800 rounded-3xl border border-slate-200/60 dark:border-slate-700/60 shadow-xl overflow-hidden flex flex-col h-full animate-in fade-in duration-300">
      {/* Header del Detalle */}
      <div className="bg-slate-50/50 dark:bg-slate-900/40 p-5 border-b border-slate-100 dark:border-slate-700/60 flex justify-between items-center shrink-0">
        <div className="flex items-center">
          <button
            onClick={onVolver}
            className="lg:hidden p-2 rounded-xl text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-700 hover:text-slate-700 transition-colors mr-2.5 flex items-center justify-center border border-slate-200/40 dark:border-slate-650"
            title="Volver al listado"
          >
            <ChevronLeft size={18} />
          </button>
          <div>
            <span className="text-[9px] text-slate-400 dark:text-slate-500 font-black tracking-wider uppercase block">Detalles de Compra</span>
            <h3 className="text-sm font-black text-slate-800 dark:text-slate-100 tracking-tight mt-0.5">
              Pedido #{pedido.id}
            </h3>
          </div>
        </div>

        {/* Acciones de Despacho */}
        <div className="flex gap-2">
          {pedido.estado === 'PENDIENTE' && (
            <button
              onClick={() => onActualizarEstado(pedido.id, 'PAGADO')}
              disabled={procesando}
              className="bg-gradient-to-r from-sky-500 to-cyan-400 hover:from-sky-600 hover:to-cyan-500 text-white px-4 py-2 rounded-xl text-xs font-bold shadow-md shadow-sky-500/10 transition-all disabled:opacity-50 flex items-center gap-1.5 active:scale-95 duration-150"
            >
              {procesando ? <CargadorSpinner size="xs" color="border-white" /> : null} Confirmar pago
            </button>
          )}
          {pedido.estado === 'PAGADO' && (
            <button
              onClick={() => onActualizarEstado(pedido.id, 'ENTREGADO')}
              disabled={procesando}
              className="bg-gradient-to-r from-emerald-500 to-teal-400 hover:from-emerald-600 hover:to-teal-500 text-white px-4 py-2 rounded-xl text-xs font-bold shadow-md shadow-emerald-500/10 transition-all disabled:opacity-50 flex items-center gap-1.5 active:scale-95 duration-150"
            >
              {procesando ? <CargadorSpinner size="xs" color="border-white" /> : <Check size={14} />} Marcar como entregado
            </button>
          )}
          {pedido.estado !== 'ENTREGADO' && pedido.estado !== 'CANCELADO' && (
            <button
              onClick={() => onActualizarEstado(pedido.id, 'CANCELADO')}
              disabled={procesando}
              className="bg-red-50 dark:bg-red-950/20 hover:bg-red-100 dark:hover:bg-red-900/30 text-red-500 dark:text-red-400 border border-red-200 dark:border-red-900/50 px-4 py-2 rounded-xl text-xs font-bold transition-all disabled:opacity-50 flex items-center gap-1.5 active:scale-95 duration-150"
            >
              {procesando ? <CargadorSpinner size="xs" color="border-red-500" /> : <X size={14} />} Cancelar compra
            </button>
          )}
        </div>
      </div>

      {/* Contenido Detalle */}
      <div className="flex-1 overflow-y-auto p-6 space-y-5 text-left">
        {/* Info del Cliente */}
        <div className="bg-slate-50 dark:bg-slate-900/40 p-5 rounded-2xl border border-slate-100 dark:border-slate-700/60 space-y-4">
          <div className="flex items-center gap-2 border-b border-slate-100 dark:border-slate-700/60 pb-2">
            <User size={15} className="text-slate-450 dark:text-slate-500" />
            <h4 className="font-bold text-slate-800 dark:text-slate-100 text-xs tracking-wide">
              Contacto y Entrega
            </h4>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-semibold">
            <div>
              <span className="block text-[9px] text-slate-400 dark:text-slate-500 font-bold uppercase tracking-wider mb-0.5">Correo Registrado</span>
              <span className="text-slate-800 dark:text-slate-200 break-all">{pedido.cliente?.correo}</span>
            </div>
            <div>
              <span className="block text-[9px] text-slate-400 dark:text-slate-500 font-bold uppercase tracking-wider mb-0.5">Fecha de Operación</span>
              <span className="text-slate-800 dark:text-slate-200">
                {new Date(pedido.fecha).toLocaleString('es-PE', { dateStyle: 'long', timeStyle: 'short' })}
              </span>
            </div>
          </div>
        </div>

        {/* Info del Carrito */}
        <div className="bg-slate-50 dark:bg-slate-900/40 p-5 rounded-2xl border border-slate-100 dark:border-slate-700/60 space-y-4">
          <div className="flex items-center gap-2 border-b border-slate-100 dark:border-slate-700/60 pb-2">
            <ShoppingBag size={15} className="text-slate-450 dark:text-slate-500" />
            <h4 className="font-bold text-slate-800 dark:text-slate-100 text-xs tracking-wide">
              Artículos Solicitados
            </h4>
          </div>
          
          <div className="divide-y divide-slate-100 dark:divide-slate-700/60">
            {pedido.detalles && pedido.detalles.length > 0 ? (
              pedido.detalles.map((item) => (
                <div key={item.id} className="flex justify-between items-center py-3.5 first:pt-0 last:pb-0">
                  <div className="space-y-1">
                    <p className="text-xs font-bold text-slate-800 dark:text-slate-150">
                      {item.inventario?.producto ? item.inventario.producto.nombre : 'Producto Huesitos'}
                    </p>
                    <p className="text-[10px] text-slate-400 dark:text-slate-500 font-semibold">
                      Cantidad: {item.cantidad} x S/ {item.precioUnitario?.toFixed(2)}
                    </p>
                    {item.inventario?.numeroLote && (
                      <span className="inline-block bg-white dark:bg-slate-700/60 text-[9px] font-black text-slate-600 dark:text-slate-350 px-2 py-0.5 rounded-lg border border-slate-150 dark:border-slate-650 tracking-wide">
                        Lote: {item.inventario.numeroLote}
                      </span>
                    )}
                  </div>
                  <span className="text-xs font-black text-slate-850 dark:text-slate-100">
                    S/ {(item.cantidad * item.precioUnitario)?.toFixed(2)}
                  </span>
                </div>
              ))
            ) : (
              <p className="text-xs text-slate-400 py-2">No se detallan artículos en el pedido.</p>
            )}
          </div>

          <div className="border-t border-slate-200/60 dark:border-slate-700/60 pt-4 flex justify-between items-center">
            <span className="font-bold text-slate-500 dark:text-slate-400 text-xs uppercase tracking-wider">Monto Total</span>
            <span className="text-lg font-black text-slate-900 dark:text-slate-100">
              S/ {pedido.total ? pedido.total.toFixed(2) : '0.00'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DetallePedidoDespacho;
