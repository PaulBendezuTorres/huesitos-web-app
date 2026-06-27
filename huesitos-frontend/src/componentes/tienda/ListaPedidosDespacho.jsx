import { useState } from 'react';
import { ShoppingBag } from 'lucide-react';
import CargadorSpinner from '@/componentes/comun/CargadorSpinner';
import Paginacion from '@/componentes/comun/Paginacion';

const ListaPedidosDespacho = ({
  pedidosFiltrados = [],
  pedidoSeleccionado,
  onSeleccionarPedido,
  filtroEstadoPedido,
  setFiltroEstadoPedido,
  loadingPedidos
}) => {
  const [paginaActual, setPaginaActual] = useState(1);
  const [itemsPorPagina, setItemsPorPagina] = useState(6);

  const formatEstado = (est) => {
    switch (est) {
      case 'TODOS': return 'Todos';
      case 'PENDIENTE': return 'Pendientes';
      case 'PAGADO': return 'Pagados';
      case 'ENTREGADO': return 'Entregados';
      case 'CANCELADO': return 'Cancelados';
      default: return est;
    }
  };

  // Ajustar la página si los pedidos se reducen
  const totalPaginas = Math.ceil(pedidosFiltrados.length / itemsPorPagina);
  const paginaValida = paginaActual > totalPaginas ? Math.max(1, totalPaginas) : paginaActual;

  const pedidosPaginados = pedidosFiltrados.slice(
    (paginaValida - 1) * itemsPorPagina,
    paginaValida * itemsPorPagina
  );

  return (
    <div className="flex flex-col h-full bg-white dark:bg-slate-800 rounded-3xl border border-slate-200/60 dark:border-slate-700/60 shadow-xl overflow-hidden flex-1 animate-in fade-in duration-300">
      {/* Cabecera del Listado */}
      <div className="p-5 border-b border-slate-100 dark:border-slate-700/60 bg-slate-50/50 dark:bg-slate-900/40 shrink-0">
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-sky-50 dark:bg-sky-950/40 text-sky-500 rounded-xl">
              <ShoppingBag size={18} />
            </div>
            <div>
              <h2 className="font-black text-slate-800 dark:text-slate-100 text-sm tracking-tight">Pedidos Recibidos</h2>
              <p className="text-[10px] text-slate-400 dark:text-slate-500 font-semibold uppercase tracking-wider mt-0.5">Tienda Online</p>
            </div>
          </div>
          <span className="bg-sky-100 dark:bg-sky-900/40 text-sky-700 dark:text-sky-400 text-[10px] font-black px-2.5 py-1 rounded-full border border-sky-200 dark:border-sky-850">
            {pedidosFiltrados.length} en total
          </span>
        </div>

        {/* Filtros por estado */}
        <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-none">
          {['TODOS', 'PENDIENTE', 'PAGADO', 'ENTREGADO', 'CANCELADO'].map(estado => (
            <button
              key={estado}
              onClick={() => {
                setFiltroEstadoPedido(estado);
                setPaginaActual(1);
              }}
              className={`px-3 py-1.5 rounded-xl font-bold text-[10px] tracking-wide border transition-all shrink-0 active:scale-95 duration-150 ${
                filtroEstadoPedido === estado
                  ? 'bg-gradient-to-r from-sky-500 to-cyan-400 text-white border-transparent shadow-md shadow-sky-500/20'
                  : 'bg-white dark:bg-slate-700 border-slate-200 dark:border-slate-650 text-slate-600 dark:text-slate-300 hover:border-slate-350 dark:hover:border-slate-500'
              }`}
            >
              {formatEstado(estado)}
            </button>
          ))}
        </div>
      </div>

      {/* Lista de pedidos */}
      <div className="flex-1 overflow-y-auto p-5 space-y-3">
        {loadingPedidos ? (
          <div className="flex flex-col items-center justify-center py-20 gap-3">
            <CargadorSpinner size="md" />
            <span className="text-xs font-semibold text-slate-450 dark:text-slate-500 animate-pulse">Sincronizando compras...</span>
          </div>
        ) : pedidosFiltrados.length === 0 ? (
          <div className="text-center py-20 text-slate-400 dark:text-slate-500 text-xs font-semibold">
            No se encontraron pedidos con el estado seleccionado.
          </div>
        ) : (
          pedidosPaginados.map((pedido) => {
            const colorEstado = {
              PENDIENTE: 'bg-amber-50 dark:bg-amber-950/20 text-amber-600 dark:text-amber-400 border-amber-200 dark:border-amber-900/50',
              PAGADO: 'bg-sky-50 dark:bg-sky-950/20 text-sky-600 dark:text-sky-400 border-sky-200 dark:border-sky-900/50',
              ENTREGADO: 'bg-emerald-50 dark:bg-emerald-950/20 text-emerald-600 dark:text-emerald-400 border-emerald-200 dark:border-emerald-900/50',
              CANCELADO: 'bg-red-50 dark:bg-red-950/20 text-red-650 dark:text-red-400 border-red-200 dark:border-red-900/50'
            }[pedido.estado];

            const labelEstado = {
              PENDIENTE: 'Pendiente',
              PAGADO: 'Pagado',
              ENTREGADO: 'Entregado',
              CANCELADO: 'Cancelado'
            }[pedido.estado] || pedido.estado;

            return (
              <div 
                key={pedido.id}
                className={`p-4 rounded-2xl border transition-all duration-300 cursor-pointer ${
                  pedidoSeleccionado?.id === pedido.id
                    ? 'border-sky-500 bg-sky-50/40 dark:bg-sky-950/20 shadow-md shadow-sky-500/5 scale-[1.01]'
                    : 'border-slate-150 dark:border-slate-700/60 hover:bg-slate-50/50 dark:hover:bg-slate-700/30'
                }`}
                onClick={() => onSeleccionarPedido(pedido)}
              >
                <div className="flex justify-between items-start mb-2.5">
                  <div>
                    <span className="text-[10px] text-slate-400 dark:text-slate-500 font-bold">PEDIDO #{pedido.id}</span>
                    <h4 className="font-bold text-slate-800 dark:text-slate-100 text-xs tracking-tight mt-0.5 break-all max-w-[200px]">
                      {pedido.cliente ? pedido.cliente.correo : 'Cliente Huesitos'}
                    </h4>
                  </div>
                  <span className={`text-[9px] font-black px-2 py-0.5 rounded-md border tracking-wider uppercase ${colorEstado}`}>
                    {labelEstado}
                  </span>
                </div>

                <div className="flex justify-between items-center text-[10px] pt-1.5 border-t border-slate-100 dark:border-slate-700/40 mt-1">
                  <span className="text-slate-400 dark:text-slate-550 font-semibold">
                    {new Date(pedido.fecha).toLocaleDateString('es-PE')}
                  </span>
                  <span className="font-black text-slate-800 dark:text-slate-200 text-sm">
                    S/ {pedido.total ? pedido.total.toFixed(2) : '0.00'}
                  </span>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Paginación */}
      {!loadingPedidos && pedidosFiltrados.length > 0 && (
        <Paginacion
          paginaActual={paginaValida}
          totalItems={pedidosFiltrados.length}
          itemsPorPagina={itemsPorPagina}
          onPaginaChange={setPaginaActual}
          singularLabel="pedido"
          pluralLabel="pedidos"
        />
      )}
    </div>
  );
};

export default ListaPedidosDespacho;
