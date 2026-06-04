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
  HelpCircle
} from 'lucide-react';
import logo from '../assets/Logo Huesitos.png';
import {
  obtenerTransacciones,
  procesarPago,
  obtenerAlertasBajoStock,
  obtenerAlertasVencimientos,
  descargarBoletaPdf
} from '../services/finanzasService';

const RecepcionistaDashboard = () => {
  const navigate = useNavigate();
  const [correo] = useState(localStorage.getItem('usuarioCorreo') || 'Recepcionista');
  
  // Transacciones
  const [transacciones, setTransacciones] = useState([]);
  const [loadingTransacciones, setLoadingTransacciones] = useState(true);
  
  // Inventario Crítico
  const [bajoStock, setBajoStock] = useState([]);
  const [vencimientos, setVencimientos] = useState([]);
  const [loadingInventario, setLoadingInventario] = useState(true);
  
  // Modal de cobro
  const [cobroSeleccionado, setCobroSeleccionado] = useState(null);
  const [medioPago, setMedioPago] = useState('EFECTIVO');
  const [referencia, setReferencia] = useState('');
  const [montoRecibido, setMontoRecibido] = useState('');
  const [vuelto, setVuelto] = useState(0);
  const [procesandoPago, setProcesandoPago] = useState(false);

  const fetchDatos = async () => {
    setLoadingTransacciones(true);
    setLoadingInventario(true);
    try {
      const [txs, stock, vencs] = await Promise.all([
        obtenerTransacciones(),
        obtenerAlertasBajoStock(),
        obtenerAlertasVencimientos(30)
      ]);
      // Filtrar por transacciones PENDIENTES
      const pendientes = txs.filter(t => t.estadoPago === 'PENDIENTE');
      setTransacciones(pendientes);
      setBajoStock(stock);
      setVencimientos(vencs);
    } catch (error) {
      console.error("Error al sincronizar datos de caja e inventario:", error);
    } finally {
      setLoadingTransacciones(false);
      setLoadingInventario(false);
    }
  };

  useEffect(() => {
    const rol = localStorage.getItem('usuarioRol');
    if (rol !== 'RECEPCIONISTA' && rol !== 'ADMINISTRADOR') {
      navigate('/');
      return;
    }
    fetchDatos();
  }, [navigate]);

  const handleLogout = () => {
    localStorage.clear();
    navigate('/');
  };

  // Abrir modal de cobro
  const abrirCobro = (tx) => {
    setCobroSeleccionado(tx);
    setMedioPago('EFECTIVO');
    setReferencia('');
    setMontoRecibido('');
    setVuelto(0);
  };

  // Manejar cambio de monto recibido para vuelto
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

  // Confirmar y procesar cobro en caja
  const ejecutarCobro = async (e) => {
    e.preventDefault();
    setProcesandoPago(true);
    try {
      const txCobrada = await procesarPago(cobroSeleccionado.id, medioPago, referencia);
      alert("Cobro presencial registrado de manera exitosa.");
      
      // Descargar Boleta PDF de forma automática
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
      fetchDatos();
    } catch (error) {
      console.error(error);
      alert("Error al procesar el pago: " + (error.response?.data || error.message));
    } finally {
      setProcesandoPago(false);
    }
  };

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
                <span className="text-[9px] font-bold text-sky-400 uppercase tracking-widest">Caja POS</span>
              </div>
            </div>
          </div>
          <div className="p-4">
            <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-sky-500 flex items-center justify-center text-white font-bold">
                <User size={16} />
              </div>
              <div className="overflow-hidden">
                <p className="text-xs text-slate-400 font-bold">Cajero/a</p>
                <p className="text-white text-xs font-bold truncate">{correo}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="p-4 border-t border-slate-800/50">
          <button 
            onClick={handleLogout}
            className="w-full bg-red-500/10 text-red-400 hover:bg-red-500 hover:text-white px-4 py-3 rounded-xl font-bold text-sm transition-all duration-300 flex items-center justify-center gap-3 border border-red-500/20 shadow-sm"
          >
            <LogOut size={16} />
            Cerrar Sesión
          </button>
        </div>
      </aside>

      {/* CONTENEDOR SPLIT VIEW TABLET */}
      <main className="flex-1 flex overflow-hidden">
        
        {/* PANEL IZQUIERDO: Transacciones Pendientes / POS (40% de ancho) */}
        <section className="w-[40%] bg-white border-r border-slate-200 flex flex-col overflow-hidden">
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

        {/* PANEL DERECHO: Inventario Crítico & Alertas (60% de ancho) */}
        <section className="flex-1 bg-slate-50 flex flex-col overflow-hidden">
          <div className="p-4 border-b border-slate-200 bg-white flex justify-between items-center shrink-0">
            <div className="flex items-center gap-2">
              <Package size={18} className="text-slate-700" />
              <h2 className="font-black text-slate-800 text-sm tracking-wide uppercase">Inventario Crítico (FEFO)</h2>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            
            {/* Alertas Críticas */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* Alerta de Bajo Stock */}
              <div className="bg-white p-5 rounded-2xl border border-slate-200/60 shadow-sm flex flex-col">
                <div className="flex items-center gap-2 mb-4 border-b border-slate-100 pb-2">
                  <AlertTriangle className="text-red-500" size={18} />
                  <h3 className="font-bold text-slate-800 text-xs uppercase tracking-wide">Stock Crítico</h3>
                </div>

                <div className="flex-1 space-y-3 overflow-y-auto max-h-[220px]">
                  {loadingInventario ? (
                    <p className="text-xs text-slate-400 animate-pulse font-bold text-center">Consultando stock...</p>
                  ) : bajoStock.length === 0 ? (
                    <p className="text-xs text-emerald-600 font-bold text-center py-4">Insumos y productos al día.</p>
                  ) : (
                    bajoStock.map((prod) => (
                      <div key={prod.id} className="flex justify-between items-center p-2.5 rounded-xl bg-red-50/50 border border-red-100 text-xs">
                        <div>
                          <p className="font-bold text-slate-800">{prod.nombre}</p>
                          <p className="text-[10px] text-slate-400">Mínimo: {prod.stockMinimo} unds.</p>
                        </div>
                        <span className="bg-red-100 text-red-700 font-black px-2 py-0.5 rounded-md text-[10px]">
                          Sin Stock
                        </span>
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* Alerta de Vencimientos (FEFO) */}
              <div className="bg-white p-5 rounded-2xl border border-slate-200/60 shadow-sm flex flex-col">
                <div className="flex items-center gap-2 mb-4 border-b border-slate-100 pb-2">
                  <Calendar className="text-amber-500" size={18} />
                  <h3 className="font-bold text-slate-800 text-xs uppercase tracking-wide">Próximos a Vencer</h3>
                </div>

                <div className="flex-1 space-y-3 overflow-y-auto max-h-[220px]">
                  {loadingInventario ? (
                    <p className="text-xs text-slate-400 animate-pulse font-bold text-center">Analizando lotes...</p>
                  ) : vencimientos.length === 0 ? (
                    <p className="text-xs text-emerald-600 font-bold text-center py-4">Lotes en buen estado.</p>
                  ) : (
                    vencimientos.map((lote) => (
                      <div key={lote.id} className="flex justify-between items-center p-2.5 rounded-xl bg-amber-50/50 border border-amber-150 text-xs">
                        <div>
                          <p className="font-bold text-slate-800">{lote.producto ? lote.producto.nombre : 'Producto'}</p>
                          <p className="text-[10px] text-slate-400">Lote: {lote.numeroLote || 'N/A'}</p>
                        </div>
                        <div className="text-right">
                          <span className="bg-amber-100 text-amber-700 font-black px-2 py-0.5 rounded-md text-[9px] uppercase tracking-wider block">
                            Vence
                          </span>
                          <span className="text-[9px] text-slate-500 font-bold mt-1 block">
                            {new Date(lote.fechaVencimiento).toLocaleDateString('es-PE')}
                          </span>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>

            </div>

            {/* Guía informativa de caja */}
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
