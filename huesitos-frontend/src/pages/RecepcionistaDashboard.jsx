import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Wallet,
  Clock,
  User,
  ShoppingBag,
  DollarSign,
  Printer,
  X,
  CreditCard,
  Percent,
  CheckCircle,
  LogOut,
  AlertTriangle,
  Package,
  Calendar,
  HelpCircle,
  Check,
  Truck,
  Eye
} from 'lucide-react';
import logo from '../assets/Logo Huesitos.png';
import {
  obtenerTransacciones,
  procesarPago,
  descargarBoletaPdf
} from '../services/finanzasService';
import {
  obtenerTodosLosPedidos,
  cambiarEstadoPedido
} from '../api/tiendaAPI';
import AgendaSemanal from './AgendaSemanal';
import InventarioCriticoWidget from '../components/InventarioCriticoWidget';

const RecepcionistaDashboard = () => {
  const navigate = useNavigate();
  const [correo] = useState(localStorage.getItem('usuarioCorreo') || 'Recepcionista');
  
  // Pestaña o Vista Principal del Panel
  const [seccionActiva, setSeccionActiva] = useState('caja'); // 'caja', 'pedidos' o 'agenda'

  // --- ESTADOS CAJA & POS ---
  const [transacciones, setTransacciones] = useState([]);
  const [loadingTransacciones, setLoadingTransacciones] = useState(true);
  const [cobroSeleccionado, setCobroSeleccionado] = useState(null);
  const [medioPago, setMedioPago] = useState('EFECTIVO');
  const [referencia, setReferencia] = useState('');
  const [montoRecibido, setMontoRecibido] = useState('');
  const [vuelto, setVuelto] = useState(0);
  const [procesandoPago, setProcesandoPago] = useState(false);

  // --- ESTADOS DESPACHO PEDIDOS ---
  const [pedidos, setPedidos] = useState([]);
  const [loadingPedidos, setLoadingPedidos] = useState(true);
  const [filtroEstadoPedido, setFiltroEstadoPedido] = useState('TODOS'); // TODOS, PENDIENTE, PAGADO, ENTREGADO, CANCELADO
  const [pedidoSeleccionado, setPedidoSeleccionado] = useState(null);
  const [procesandoDespacho, setProcesandoDespacho] = useState(false);

  const fetchDatosCaja = async () => {
    setLoadingTransacciones(true);
    try {
      const txs = await obtenerTransacciones();
      const pendientes = txs.filter(t => t.estadoPago === 'PENDIENTE');
      setTransacciones(pendientes);
    } catch (error) {
      console.error("Error al sincronizar datos de caja:", error);
    } finally {
      setLoadingTransacciones(false);
    }
  };

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
    const rol = localStorage.getItem('usuarioRol');
    if (rol !== 'RECEPCIONISTA' && rol !== 'ADMINISTRADOR') {
      navigate('/');
      return;
    }
    if (seccionActiva === 'caja') {
      fetchDatosCaja();
    } else if (seccionActiva === 'pedidos') {
      fetchPedidos();
    }
  }, [seccionActiva, navigate]);

  const handleLogout = () => {
    localStorage.clear();
    navigate('/');
  };

  // --- CAJA LOGIC ---
  const abrirCobro = (tx) => {
    setCobroSeleccionado(tx);
    setMedioPago('EFECTIVO');
    setReferencia('');
    setMontoRecibido('');
    setVuelto(0);
  };

  const handleMontoRecibidoChange = (val) => {
    setMontoRecibido(val);
    const numVal = parseFloat(val);
    if (!isNaN(numVal) && cobroSeleccionado) {
      const res = numVal - cobroSeleccionado.monto;
      setVuelto(res > 0 ? res : 0);
    } else {
      setVuelto(0);
    }
  };

  const ejecutarCobro = async (e) => {
    e.preventDefault();
    setProcesandoPago(true);
    try {
      const txCobrada = await procesarPago(cobroSeleccionado.id, medioPago, referencia);
      alert("Cobro presencial registrado de manera exitosa.");
      
      try {
        const blob = await descargarBoletaPdf(txCobrada.id);
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `boleta_${txCobrada.id}.pdf`;
        document.body.appendChild(a);
        a.click();
        a.remove();
        window.URL.revokeObjectURL(url);
      } catch (pdfErr) {
        console.error("Error al descargar boleta PDF:", pdfErr);
        alert("El cobro se registró, pero no se pudo descargar la boleta automáticamente.");
      }

      setCobroSeleccionado(null);
      fetchDatosCaja();
    } catch (error) {
      console.error(error);
      alert("Error al procesar el pago: " + (error.response?.data || error.message));
    } finally {
      setProcesandoPago(false);
    }
  };

  // --- PEDIDOS LOGIC ---
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

  return (
    <div className="flex h-screen bg-slate-100 font-sans overflow-hidden">
      
      {/* BARRA LATERAL */}
      <aside className="w-64 bg-slate-950 flex flex-col justify-between border-r border-slate-800 shrink-0">
        <div>
          <div className="h-20 flex items-center px-6 border-b border-slate-800/50">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-tr from-sky-500 to-cyan-300 rounded-xl flex items-center justify-center text-white shadow-lg shadow-sky-500/20">
                <img src={logo} alt="Logo" className="w-8 h-8 object-contain" />
              </div>
              <div className="flex flex-col">
                <span className="text-md font-black text-white tracking-tight leading-tight">Vet.Huesitos</span>
                <span className="text-[9px] font-bold text-sky-400 uppercase tracking-widest">Caja y POS</span>
              </div>
            </div>
          </div>
          
          {/* Navegación Módulos */}
          <nav className="p-4 space-y-2">
            <button
              onClick={() => setSeccionActiva('caja')}
              className={`w-full text-left px-4 py-3 rounded-xl font-bold transition-all duration-300 flex items-center gap-3 text-xs tracking-wider uppercase ${
                seccionActiva === 'caja'
                  ? 'bg-gradient-to-r from-sky-500 to-cyan-400 text-white shadow-md'
                  : 'text-slate-400 hover:bg-slate-900 hover:text-slate-200'
              }`}
            >
              <Wallet size={16} />
              Caja y POS
            </button>
            <button
              onClick={() => setSeccionActiva('pedidos')}
              className={`w-full text-left px-4 py-3 rounded-xl font-bold transition-all duration-300 flex items-center gap-3 text-xs tracking-wider uppercase ${
                seccionActiva === 'pedidos'
                  ? 'bg-gradient-to-r from-sky-500 to-cyan-400 text-white shadow-md'
                  : 'text-slate-400 hover:bg-slate-900 hover:text-slate-200'
              }`}
            >
              <Truck size={16} />
              Despacho Pedidos
            </button>
            <button
              onClick={() => setSeccionActiva('agenda')}
              className={`w-full text-left px-4 py-3 rounded-xl font-bold transition-all duration-300 flex items-center gap-3 text-xs tracking-wider uppercase ${
                seccionActiva === 'agenda'
                  ? 'bg-gradient-to-r from-sky-500 to-cyan-400 text-white shadow-md'
                  : 'text-slate-400 hover:bg-slate-900 hover:text-slate-200'
              }`}
            >
              <Calendar size={16} />
              Agenda Semanal
            </button>
          </nav>
        </div>

        <div className="p-4 border-t border-slate-800/50">
          <div className="bg-slate-900 border border-slate-805 p-3 rounded-xl flex items-center gap-3 mb-4">
            <div className="w-8 h-8 rounded-full bg-sky-500 flex items-center justify-center text-white font-bold shrink-0">
              <User size={14} />
            </div>
            <div className="overflow-hidden">
              <p className="text-[9px] text-slate-500 font-bold uppercase">Cajero/a</p>
              <p className="text-white text-xs font-bold truncate">{correo}</p>
            </div>
          </div>
          <button 
            onClick={handleLogout}
            className="w-full bg-red-500/10 text-red-400 hover:bg-red-500 hover:text-white px-4 py-3 rounded-xl font-bold text-sm transition-all duration-300 flex items-center justify-center gap-3 border border-red-500/20 shadow-sm"
          >
            <LogOut size={16} />
            Cerrar Sesión
          </button>
        </div>
      </aside>

      {/* CONTENEDOR VISTAS DINÁMICAS */}
      <main className="flex-1 flex overflow-hidden">
        
        {/* 1. SECCIÓN: CAJA Y POS */}
        {seccionActiva === 'caja' && (
          <>
            {/* PANEL IZQUIERDO (40%) */}
            <section className="w-[40%] bg-white border-r border-slate-200 flex flex-col overflow-hidden animate-in fade-in duration-200">
              <div className="p-4 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center shrink-0">
                <div className="flex items-center gap-2">
                  <Wallet size={18} className="text-sky-500" />
                  <h2 className="font-black text-slate-800 text-sm tracking-wide uppercase">Cuentas por Cobrar</h2>
                </div>
                <span className="bg-sky-100 text-sky-700 text-[10px] font-black px-2 py-0.5 rounded-full">
                  {transacciones.length} Pendientes
                </span>
              </div>

              <div className="flex-1 overflow-y-auto p-4 space-y-3">
                {loadingTransacciones ? (
                  <div className="text-center py-10 text-xs font-bold text-slate-400 animate-pulse">
                    Consultando transacciones de caja...
                  </div>
                ) : transacciones.length === 0 ? (
                  <div className="text-center py-10 text-slate-400 text-xs font-bold">
                    No hay órdenes de cobro pendientes.
                  </div>
                ) : (
                  transacciones.map((tx) => (
                    <div 
                      key={tx.id} 
                      className="p-4 rounded-2xl border border-slate-200 hover:border-sky-300 hover:shadow-md hover:shadow-sky-500/5 transition-all duration-300 space-y-3"
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <span className="text-[10px] text-slate-400 font-bold">ORDEN #{tx.id}</span>
                          <h4 className="font-bold text-slate-800 text-sm tracking-tight mt-0.5">
                            {tx.cita && tx.cita.mascota ? tx.cita.mascota.nombre : 'Paciente'}
                          </h4>
                          <p className="text-[10px] text-slate-500 font-medium mt-0.5">
                            Propietario: {tx.cita && tx.cita.mascota && tx.cita.mascota.dueño ? tx.cita.mascota.dueño.nombreCompleto : 'Cliente'}
                          </p>
                        </div>
                        <span className="text-sm font-black text-slate-800">
                          S/ {tx.monto ? tx.monto.toFixed(2) : '0.00'}
                        </span>
                      </div>

                      <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100 text-xs text-slate-600 font-medium">
                        {tx.cita && tx.cita.servicio ? tx.cita.servicio.nombre : 'Servicio Médico'}
                      </div>

                      <button 
                        onClick={() => abrirCobro(tx)}
                        className="w-full bg-sky-500 hover:bg-sky-600 text-white py-2 rounded-xl text-xs font-bold shadow-md shadow-sky-500/10 transition-all flex items-center justify-center gap-2"
                      >
                        <DollarSign size={14} /> Registrar Cobro
                      </button>
                    </div>
                  ))
                )}
              </div>
            </section>

            {/* PANEL DERECHO (60%) */}
            <section className="flex-1 bg-slate-50 flex flex-col overflow-hidden animate-in fade-in duration-200">
              <InventarioCriticoWidget />

              <div className="p-6 pt-0 shrink-0">
                <div className="bg-white p-6 rounded-2xl border border-slate-200/60 shadow-sm space-y-3">
                  <div className="flex items-center gap-2 text-slate-800">
                    <HelpCircle size={18} className="text-sky-500" />
                    <h4 className="font-bold text-sm">Políticas del Punto de Venta</h4>
                  </div>
                  <p className="text-xs text-slate-500 leading-relaxed">
                    Todas las citas de atención médica, laboratorios y vacunas se registran y envían de forma automática como transacciones en estado **Pendiente** a este panel.
                    Una vez efectuado el cobro físico en caja, selecciona el medio de pago correspondiente para liberar la boleta de venta en formato PDF y actualizar el estado a **Aprobado** en el sistema.
                  </p>
                </div>
              </div>
            </section>
          </>
        )}

        {/* 2. SECCIÓN: DESPACHO DE PEDIDOS ONLINE */}
        {seccionActiva === 'pedidos' && (
          <>
            {/* PANEL IZQUIERDO: Listado de pedidos (45% de ancho) */}
            <section className="w-[45%] bg-white border-r border-slate-200 flex flex-col overflow-hidden animate-in fade-in duration-200">
              <div className="p-4 border-b border-slate-100 bg-slate-50/50 shrink-0">
                <div className="flex justify-between items-center mb-3">
                  <div className="flex items-center gap-2">
                    <ShoppingBag size={18} className="text-sky-500" />
                    <h2 className="font-black text-slate-800 text-sm tracking-wide uppercase">Pedidos Tienda Online</h2>
                  </div>
                  <span className="bg-sky-100 text-sky-700 text-[10px] font-black px-2 py-0.5 rounded-full">
                    {pedidosFiltrados.length} Total
                  </span>
                </div>

                {/* Filtros por estado */}
                <div className="flex gap-1 overflow-x-auto pb-1 scrollbar-none">
                  {['TODOS', 'PENDIENTE', 'PAGADO', 'ENTREGADO', 'CANCELADO'].map(estado => (
                    <button
                      key={estado}
                      onClick={() => setFiltroEstadoPedido(estado)}
                      className={`px-3 py-1.5 rounded-lg font-bold text-[9px] tracking-wider uppercase border transition-all shrink-0 ${
                        filtroEstadoPedido === estado
                          ? 'bg-sky-500 text-white border-sky-500 shadow-md shadow-sky-500/15'
                          : 'bg-white border-slate-200 text-slate-500 hover:bg-slate-50'
                      }`}
                    >
                      {estado}
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
                  <div className="text-center py-10 text-slate-400 text-xs font-bold">
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
                            <span className="text-[10px] text-slate-400 font-bold">PEDIDO #{pedido.id}</span>
                            <h4 className="font-bold text-slate-800 text-sm tracking-tight mt-0.5">
                              {pedido.cliente ? pedido.cliente.correo : 'Cliente Huesitos'}
                            </h4>
                          </div>
                          <span className={`text-[9px] font-black px-2 py-0.5 rounded-full uppercase border ${colorEstado}`}>
                            {pedido.estado}
                          </span>
                        </div>

                        <div className="flex justify-between items-center text-xs pt-1">
                          <span className="text-slate-400 font-medium">
                            {new Date(pedido.fecha).toLocaleDateString('es-PE')}
                          </span>
                          <span className="font-black text-slate-800">
                            S/ {pedido.total ? pedido.total.toFixed(2) : '0.00'}
                          </span>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </section>

            {/* PANEL DERECHO: Detalle del pedido seleccionado (55% de ancho) */}
            <section className="flex-1 bg-slate-50 flex flex-col overflow-hidden animate-in fade-in duration-200">
              {pedidoSeleccionado ? (
                <>
                  <div className="bg-white p-5 border-b border-slate-200 flex justify-between items-center shrink-0">
                    <div>
                      <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Detalles de Compra</span>
                      <h3 className="text-lg font-black text-slate-800 tracking-tight mt-0.5">
                        Pedido #{pedidoSeleccionado.id}
                      </h3>
                    </div>
                    
                    {/* Botones de acción según el estado actual */}
                    <div className="flex gap-2">
                      {pedidoSeleccionado.estado === 'PENDIENTE' && (
                        <button
                          onClick={() => actualizarEstadoPedido(pedidoSeleccionado.id, 'PAGADO')}
                          disabled={procesandoDespacho}
                          className="bg-sky-500 hover:bg-sky-600 text-white px-4 py-2 rounded-xl text-xs font-bold shadow-md shadow-sky-500/10 transition-colors disabled:opacity-50"
                        >
                          Confirmar Pago
                        </button>
                      )}
                      {pedidoSeleccionado.estado === 'PAGADO' && (
                        <button
                          onClick={() => actualizarEstadoPedido(pedidoSeleccionado.id, 'ENTREGADO')}
                          disabled={procesandoDespacho}
                          className="bg-emerald-500 hover:bg-emerald-600 text-white px-4 py-2 rounded-xl text-xs font-bold shadow-md shadow-emerald-500/10 transition-colors disabled:opacity-50 flex items-center gap-1.5"
                        >
                          <Check size={14} /> Marcar como Entregado
                        </button>
                      )}
                      {pedidoSeleccionado.estado !== 'ENTREGADO' && pedidoSeleccionado.estado !== 'CANCELADO' && (
                        <button
                          onClick={() => actualizarEstadoPedido(pedidoSeleccionado.id, 'CANCELA')}
                          disabled={procesandoDespacho}
                          className="bg-red-50 hover:bg-red-100 text-red-500 border border-red-200 px-4 py-2 rounded-xl text-xs font-bold transition-colors disabled:opacity-50"
                        >
                          Cancelar Compra
                        </button>
                      )}
                    </div>
                  </div>

                  <div className="flex-1 overflow-y-auto p-6 space-y-6">
                    {/* Tarjeta de información del cliente */}
                    <div className="bg-white p-5 rounded-2xl border border-slate-200/60 shadow-sm space-y-4">
                      <h4 className="font-bold text-slate-800 text-xs uppercase tracking-wider border-b border-slate-100 pb-2">
                        Contacto y Entrega
                      </h4>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-medium">
                        <div>
                          <span className="block text-[9px] text-slate-400 font-bold uppercase mb-0.5">Correo Registrado</span>
                          <span className="text-slate-800">{pedidoSeleccionado.cliente?.correo}</span>
                        </div>
                        <div>
                          <span className="block text-[9px] text-slate-400 font-bold uppercase mb-0.5">Fecha de Operación</span>
                          <span className="text-slate-800">
                            {new Date(pedidoSeleccionado.fecha).toLocaleString('es-PE')}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Desglose de productos comprados */}
                    <div className="bg-white p-5 rounded-2xl border border-slate-200/60 shadow-sm space-y-4">
                      <h4 className="font-bold text-slate-800 text-xs uppercase tracking-wider border-b border-slate-100 pb-2">
                        Artículos del Carrito
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
                              <span className="text-xs font-black text-slate-800">
                                S/ {(item.cantidad * item.precioUnitario)?.toFixed(2)}
                              </span>
                            </div>
                          ))
                        ) : (
                          <p className="text-xs text-slate-400 py-2">No se detallan artículos en el pedido.</p>
                        )}
                      </div>

                      <div className="border-t border-slate-100 pt-4 flex justify-between items-center">
                        <span className="font-black text-slate-800 text-xs uppercase tracking-wider">Monto Total</span>
                        <span className="text-lg font-black text-slate-850">
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
                  <h3 className="text-lg font-black text-slate-800 tracking-tight">Despacho de Pedidos</h3>
                  <p className="text-xs text-slate-400 max-w-sm mt-1">
                    Selecciona un pedido entrante de la lista para gestionar su estado de pago, control de inventario FEFO y despacho físico del producto.
                  </p>
                </div>
              )}
            </section>
          </>
        )}

        {/* 3. SECCIÓN: AGENDA SEMANAL */}
        {seccionActiva === 'agenda' && (
          <section className="flex-1 bg-slate-50 p-6 overflow-y-auto h-full animate-in fade-in duration-200">
            <AgendaSemanal />
          </section>
        )}

      </main>

      {/* MODAL COBRO TÁCTIL (POS) */}
      {cobroSeleccionado && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 max-w-lg w-full overflow-hidden flex flex-col">
            <div className="px-6 py-5 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
              <h3 className="text-lg font-black text-slate-800 flex items-center gap-2">
                <DollarSign className="text-sky-500" size={20} /> Registrar Cobro en Caja
              </h3>
              <button 
                onClick={() => setCobroSeleccionado(null)}
                className="text-slate-400 hover:text-slate-700 transition-colors"
              >
                <X size={20}/>
              </button>
            </div>

            <form onSubmit={ejecutarCobro} className="p-6 space-y-5">
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 flex justify-between items-center">
                <div>
                  <span className="block text-[9px] font-black text-slate-400 uppercase tracking-widest">Paciente</span>
                  <p className="font-bold text-slate-800 text-sm">
                    {cobroSeleccionado.cita && cobroSeleccionado.cita.mascota ? cobroSeleccionado.cita.mascota.nombre : 'Paciente'}
                  </p>
                </div>
                <div className="text-right">
                  <span className="block text-[9px] font-black text-slate-400 uppercase tracking-widest">Monto a Pagar</span>
                  <p className="font-black text-slate-850 text-xl">
                    S/ {cobroSeleccionado.monto ? cobroSeleccionado.monto.toFixed(2) : '0.00'}
                  </p>
                </div>
              </div>

              {/* Selector Táctil de Medio de Pago */}
              <div>
                <label className="block text-xs font-bold text-slate-500 mb-2.5 uppercase tracking-wide">
                  Medio de Pago
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {[
                    { id: 'EFECTIVO', label: 'Efectivo', icon: DollarSign },
                    { id: 'TARJETA_CREDITO', label: 'Tar. Crédito', icon: CreditCard },
                    { id: 'TARJETA_DEBITO', label: 'Tar. Débito', icon: CreditCard },
                    { id: 'YAPE', label: 'Yape', icon: CheckCircle },
                    { id: 'PLIN', label: 'Plin', icon: CheckCircle },
                    { id: 'TRANSFERENCIA', label: 'Transf.', icon: Wallet }
                  ].map(medio => {
                    const Icon = medio.icon;
                    const seleccionado = medioPago === medio.id;
                    return (
                      <button
                        key={medio.id}
                        type="button"
                        onClick={() => setMedioPago(medio.id)}
                        className={`py-3 px-2 rounded-xl border flex flex-col items-center justify-center gap-1.5 transition-all ${
                          seleccionado 
                            ? 'border-sky-500 bg-sky-50 text-sky-600 font-bold shadow-md shadow-sky-500/5' 
                            : 'border-slate-200 text-slate-500 hover:bg-slate-50'
                        }`}
                      >
                        <Icon size={18} />
                        <span className="text-[10px] font-bold">{medio.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Efectivo: Vuelto */}
              {medioPago === 'EFECTIVO' && (
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-500 mb-1.5 uppercase tracking-wide">Monto Recibido (S/)</label>
                    <input
                      type="number"
                      step="0.10"
                      value={montoRecibido}
                      onChange={e => handleMontoRecibidoChange(e.target.value)}
                      placeholder="0.00"
                      required={medioPago === 'EFECTIVO'}
                      className="w-full border border-slate-300 p-2.5 rounded-xl text-slate-800 text-sm font-bold focus:ring-2 focus:ring-sky-500 outline-none transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-500 mb-1.5 uppercase tracking-wide">Vuelto (S/)</label>
                    <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100 text-sm font-black text-emerald-600 h-[42px] flex items-center">
                      S/ {vuelto.toFixed(2)}
                    </div>
                  </div>
                </div>
              )}

              {/* Referencia (para Yape, Tarjeta o Transferencia) */}
              {medioPago !== 'EFECTIVO' && (
                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-1.5 uppercase tracking-wide">Código de Referencia / Operación</label>
                  <input
                    type="text"
                    value={referencia}
                    onChange={e => setReferencia(e.target.value)}
                    placeholder="Ej: 123456"
                    className="w-full border border-slate-300 p-2.5 rounded-xl text-slate-800 text-xs focus:ring-2 focus:ring-sky-500 outline-none transition-all bg-slate-50 focus:bg-white"
                  />
                </div>
              )}

              <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setCobroSeleccionado(null)}
                  className="px-5 py-2.5 rounded-xl text-xs font-bold text-slate-500 hover:bg-slate-100 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={procesandoPago}
                  className="px-5 py-2.5 bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-bold rounded-xl shadow-lg shadow-emerald-500/20 transition-all flex items-center gap-1.5 disabled:opacity-50"
                >
                  <Printer size={14} /> {procesandoPago ? 'Procesando...' : 'Confirmar e Imprimir Boleta'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

export default RecepcionistaDashboard;
