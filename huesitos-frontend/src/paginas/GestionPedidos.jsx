import { useState, useEffect } from 'react';
import { ShoppingBag, Truck, Check, X, ChevronLeft } from 'lucide-react';
import { obtenerTodosLosPedidos, cambiarEstadoPedido } from '../api/tiendaApi';

const GestionPedidos = () => {
  const [pedidos, setPedidos] = useState([]);
  const [loadingPedidos, setLoadingPedidos] = useState(true);
  const [filtroEstadoPedido, setFiltroEstadoPedido] = useState('TODOS'); // TODOS, PENDIENTE, PAGADO, ENTREGADO, CANCELADO
  const [pedidoSeleccionado, setPedidoSeleccionado] = useState(null);
  const [procesandoDespacho, setProcesandoDespacho] = useState(false);

  const fetchPedidos = async () => {
    setLoadingPedidos(true);
    try {
      const data = await obtenerTodosLosPedidos();
      setPedidos(data);
    } catch (error) {
      console.error("Error al obtener los pedidos de la tienda online:", error);
    } finally {
      setLoadingPedidos(false);
    }
  };

  useEffect(() => {
    fetchPedidos();
  }, []);

  const actualizarEstadoPedido = async (pedidoId, nuevoEstado) => {
    setProcesandoDespacho(true);
    try {
      await cambiarEstadoPedido(pedidoId, nuevoEstado);
      alert(`Pedido ${pedidoId} actualizado a ${nuevoEstado} con éxito.`);
      setPedidoSeleccionado(null);
      fetchPedidos();
    } catch (error) {
      console.error(error);
      alert("Error al actualizar el estado del pedido: " + (error.response?.data || error.message));
    } finally {
      setProcesandoDespacho(false);
    }
  };

  const pedidosFiltrados = pedidos.filter(p => {
    if (filtroEstadoPedido === 'TODOS') return true;
    return p.estado === filtroEstadoPedido;
  });

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

  return (
    <div className="flex-1 flex flex-col lg:flex-row overflow-hidden h-full bg-slate-50 w-full">
      {/* PANEL IZQUIERDO: Listado de pedidos */}
      <section className={`w-full lg:w-[40%] lg:max-w-md bg-white border-b lg:border-b-0 lg:border-r border-slate-200 flex flex-col overflow-hidden animate-in fade-in duration-200 shrink-0 ${
        pedidoSeleccionado ? 'hidden lg:flex' : 'flex'
      }`}>
        <div className="p-4 border-b border-slate-100 bg-slate-50/50 shrink-0">
          <div className="flex justify-between items-center mb-3">
            <div className="flex items-center gap-2">
              <ShoppingBag size={16} className="text-sky-500" />
              <h2 className="font-bold text-slate-800 text-sm tracking-tight">Pedidos de tienda online</h2>
            </div>
            <span className="bg-sky-100 text-sky-700 text-[10px] font-bold px-2 py-0.5 rounded-full">
              {pedidosFiltrados.length} total
            </span>
          </div>

          {/* Filtros por estado */}
          <div className="flex gap-1 overflow-x-auto pb-1 scrollbar-none">
            {['TODOS', 'PENDIENTE', 'PAGADO', 'ENTREGADO', 'CANCELADO'].map(estado => (
              <button
                key={estado}
                onClick={() => setFiltroEstadoPedido(estado)}
                className={`px-3 py-1.5 rounded-lg font-semibold text-[10px] tracking-wide border transition-all shrink-0 ${
                  filtroEstadoPedido === estado
                    ? 'bg-sky-500 text-white border-sky-500 shadow-md shadow-sky-500/15'
                    : 'bg-white border-slate-200 text-slate-500 hover:bg-slate-50'
                }`}
              >
                {formatEstado(estado)}
              </button>
            ))}
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {loadingPedidos ? (
            <div className="text-center py-10 text-xs font-bold text-slate-400 animate-pulse">
              Consultando pedidos entrantes...
            </div>
          ) : pedidosFiltrados.length === 0 ? (
            <div className="text-center py-10 text-slate-400 text-xs font-semibold">
              No se encontraron pedidos con el estado seleccionado.
            </div>
          ) : (
            pedidosFiltrados.map((pedido) => {
              const colorEstado = {
                PENDIENTE: 'bg-amber-50 text-amber-600 border-amber-200',
                PAGADO: 'bg-blue-50 text-blue-600 border-blue-200',
                ENTREGADO: 'bg-emerald-50 text-emerald-600 border-emerald-200',
                CANCELADO: 'bg-red-50 text-red-600 border-red-200'
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
                      ? 'border-sky-500 bg-sky-50/50 shadow-md shadow-sky-500/5'
                      : 'border-slate-200 hover:bg-slate-50/50'
                  }`}
                  onClick={() => setPedidoSeleccionado(pedido)}
                >
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <span className="text-[10px] text-slate-400 font-semibold">Pedido #{pedido.id}</span>
                      <h4 className="font-bold text-slate-800 text-sm tracking-tight mt-0.5">
                        {pedido.cliente ? pedido.cliente.correo : 'Cliente Huesitos'}
                      </h4>
                    </div>
                    <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full border ${colorEstado}`}>
                      {labelEstado}
                    </span>
                  </div>

                  <div className="flex justify-between items-center text-xs pt-1">
                    <span className="text-slate-400 font-semibold">
                      {new Date(pedido.fecha).toLocaleDateString('es-PE')}
                    </span>
                    <span className="font-bold text-slate-800">
                      S/ {pedido.total ? pedido.total.toFixed(2) : '0.00'}
                    </span>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </section>

      {/* PANEL DERECHO: Detalle del pedido seleccionado */}
      <section className={`flex-1 bg-slate-50 flex flex-col overflow-hidden animate-in fade-in duration-200 ${
        pedidoSeleccionado ? 'flex' : 'hidden lg:flex'
      }`}>
        {pedidoSeleccionado ? (
          <>
            <div className="bg-white p-5 border-b border-slate-200 flex justify-between items-center shrink-0">
              <div className="flex items-center">
                {/* Botón Volver para móviles */}
                <button
                  onClick={() => setPedidoSeleccionado(null)}
                  className="lg:hidden p-1.5 rounded-lg text-slate-500 hover:bg-slate-100 hover:text-slate-700 transition-colors mr-2 flex items-center justify-center"
                  title="Volver al listado"
                >
                  <ChevronLeft size={20} />
                </button>
                <div>
                  <span className="text-[10px] text-slate-400 font-bold tracking-wider">Detalles de compra</span>
                  <h3 className="text-base font-bold text-slate-800 tracking-tight mt-0.5">
                    Pedido #{pedidoSeleccionado.id}
                  </h3>
                </div>
              </div>
              
              {/* Botones de acción según el estado actual */}
              <div className="flex gap-2">
                {pedidoSeleccionado.estado === 'PENDIENTE' && (
                  <button
                    onClick={() => actualizarEstadoPedido(pedidoSeleccionado.id, 'PAGADO')}
                    disabled={procesandoDespacho}
                    className="bg-sky-500 hover:bg-sky-600 text-white px-4 py-2 rounded-xl text-xs font-bold shadow-md shadow-sky-500/10 transition-colors disabled:opacity-50"
                  >
                    Confirmar pago
                  </button>
                )}
                {pedidoSeleccionado.estado === 'PAGADO' && (
                  <button
                    onClick={() => actualizarEstadoPedido(pedidoSeleccionado.id, 'ENTREGADO')}
                    disabled={procesandoDespacho}
                    className="bg-emerald-500 hover:bg-emerald-600 text-white px-4 py-2 rounded-xl text-xs font-bold shadow-md shadow-emerald-500/10 transition-colors disabled:opacity-50 flex items-center gap-1.5"
                  >
                    <Check size={14} /> Marcar como entregado
                  </button>
                )}
                {pedidoSeleccionado.estado !== 'ENTREGADO' && pedidoSeleccionado.estado !== 'CANCELADO' && (
                  <button
                    onClick={() => actualizarEstadoPedido(pedidoSeleccionado.id, 'CANCELADO')}
                    disabled={procesandoDespacho}
                    className="bg-red-50 hover:bg-red-150 text-red-500 border border-red-200 px-4 py-2 rounded-xl text-xs font-bold transition-colors disabled:opacity-50"
                  >
                    Cancelar compra
                  </button>
                )}
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {/* Tarjeta de información del cliente */}
              <div className="bg-white p-5 rounded-2xl border border-slate-200/60 shadow-sm space-y-4">
                <h4 className="font-bold text-slate-800 text-xs tracking-wide border-b border-slate-100 pb-2">
                  Contacto y entrega
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-medium">
                  <div>
                    <span className="block text-[9px] text-slate-400 font-semibold mb-0.5">Correo registrado</span>
                    <span className="text-slate-800">{pedidoSeleccionado.cliente?.correo}</span>
                  </div>
                  <div>
                    <span className="block text-[9px] text-slate-400 font-semibold mb-0.5">Fecha de operación</span>
                    <span className="text-slate-800">
                      {new Date(pedidoSeleccionado.fecha).toLocaleString('es-PE')}
                    </span>
                  </div>
                </div>
              </div>

              {/* Desglose de productos comprados */}
              <div className="bg-white p-5 rounded-2xl border border-slate-200/60 shadow-sm space-y-4">
                <h4 className="font-bold text-slate-800 text-xs tracking-wide border-b border-slate-100 pb-2">
                  Artículos del carrito
                </h4>
                
                <div className="divide-y divide-slate-100">
                  {pedidoSeleccionado.detalles && pedidoSeleccionado.detalles.length > 0 ? (
                    pedidoSeleccionado.detalles.map((item) => (
                      <div key={item.id} className="flex justify-between items-center py-3 first:pt-0 last:pb-0">
                        <div>
                          <p className="text-xs font-bold text-slate-800">
                            {item.inventario?.producto ? item.inventario.producto.nombre : 'Producto Huesitos'}
                          </p>
                          <p className="text-[10px] text-slate-400 mt-0.5">
                            Cant: {item.cantidad} x S/ {item.precioUnitario?.toFixed(2)}
                          </p>
                          {item.inventario?.numeroLote && (
                            <span className="inline-block bg-slate-100 text-[9px] font-bold text-slate-600 px-2 py-0.5 rounded-md mt-1 border border-slate-200">
                              Descuento FEFO - Lote: {item.inventario.numeroLote}
                            </span>
                          )}
                        </div>
                        <span className="text-xs font-bold text-slate-800">
                          S/ {(item.cantidad * item.precioUnitario)?.toFixed(2)}
                        </span>
                      </div>
                    ))
                  ) : (
                    <p className="text-xs text-slate-400 py-2">No se detallan artículos en el pedido.</p>
                  )}
                </div>

                <div className="border-t border-slate-100 pt-4 flex justify-between items-center">
                  <span className="font-semibold text-slate-600 text-xs tracking-wider">Monto total</span>
                  <span className="text-base font-bold text-slate-850">
                    S/ {pedidoSeleccionado.total ? pedidoSeleccionado.total.toFixed(2) : '0.00'}
                  </span>
                </div>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex flex-col justify-center items-center p-8 text-center text-slate-500 select-none">
            <div className="w-16 h-16 bg-slate-200/50 rounded-full flex items-center justify-center text-slate-400 mb-4 animate-pulse">
              <Truck size={32} />
            </div>
            <h3 className="text-base font-bold text-slate-800 tracking-tight">Despacho de pedidos</h3>
            <p className="text-xs text-slate-400 max-w-sm mt-1 font-medium">
              Selecciona un pedido entrante de la lista para gestionar su estado de pago, control de inventario FEFO y despacho físico del producto.
            </p>
          </div>
        )}
      </section>
    </div>
  );
};

export default GestionPedidos;
