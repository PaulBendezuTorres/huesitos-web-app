import { useState, useEffect } from 'react';
import {
  Wallet,
  DollarSign,
  Printer,
  X,
  CreditCard,
  CheckCircle,
  HelpCircle
} from 'lucide-react';
import {
  obtenerTransacciones,
  procesarPago,
  descargarBoletaPdf
} from '../../../servicios/finanzasServicio';
import WidgetInventarioCritico from '../../../componentes/WidgetInventarioCritico';
import CargadorSpinner from '../../../componentes/CargadorSpinner';

const CajaVentas = () => {
  const [transacciones, setTransacciones] = useState([]);
  const [loadingTransacciones, setLoadingTransacciones] = useState(true);
  const [cobroSeleccionado, setCobroSeleccionado] = useState(null);
  const [medioPago, setMedioPago] = useState('EFECTIVO');
  const [referencia, setReferencia] = useState('');
  const [montoRecibido, setMontoRecibido] = useState('');
  const [vuelto, setVuelto] = useState(0);
  const [procesandoPago, setProcesandoPago] = useState(false);

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

  useEffect(() => {
    fetchDatosCaja();
  }, []);

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
  };  return (
    <div className="flex-1 flex flex-col lg:flex-row h-full overflow-y-auto lg:overflow-hidden w-full">
      {/* PANEL IZQUIERDO: Cuentas por cobrar */}
      <section className="w-full lg:w-[40%] lg:max-w-md bg-white border-b lg:border-b-0 lg:border-r border-slate-200 flex flex-col lg:h-full overflow-visible lg:overflow-hidden animate-in fade-in duration-200 shrink-0">
        <div className="p-4 border-b border-slate-150 bg-slate-50/50 flex justify-between items-center shrink-0">
          <div className="flex items-center gap-2">
            <Wallet size={16} className="text-sky-500" />
            <h2 className="font-bold text-slate-800 text-sm tracking-tight">Cuentas por cobrar</h2>
          </div>
          <span className="bg-sky-100 text-sky-700 text-[10px] font-bold px-2 py-0.5 rounded-full">
            {transacciones.length} pendientes
          </span>
        </div>

        <div className="p-4 space-y-3 overflow-visible lg:flex-1 lg:overflow-y-auto">
          {loadingTransacciones ? (
            <div className="flex flex-col items-center justify-center py-10 gap-2">
              <CargadorSpinner size="sm" />
              <span className="text-xs font-semibold text-slate-400">Consultando transacciones de caja...</span>
            </div>
          ) : transacciones.length === 0 ? (
            <div className="text-center py-10 text-slate-450 text-xs font-semibold text-slate-400">
              No hay órdenes de cobro pendientes.
            </div>
          ) : (
            transacciones.map((tx) => (
              <div 
                key={tx.id} 
                className="p-4 rounded-2xl border border-slate-200 hover:border-sky-350 hover:shadow-md hover:shadow-sky-500/5 transition-all duration-300 space-y-3"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <span className="text-[10px] text-slate-400 font-semibold">Orden #{tx.id}</span>
                    <h4 className="font-bold text-slate-800 text-sm tracking-tight mt-0.5">
                      {tx.cita && tx.cita.mascota ? tx.cita.mascota.nombre : 'Paciente'}
                    </h4>
                    <p className="text-[10px] text-slate-500 font-medium mt-0.5">
                      Propietario: {tx.cita && tx.cita.mascota && tx.cita.mascota.dueño ? tx.cita.mascota.dueño.nombreCompleto : 'Cliente'}
                    </p>
                  </div>
                  <span className="text-sm font-bold text-slate-800">
                    S/ {tx.monto ? tx.monto.toFixed(2) : '0.00'}
                  </span>
                </div>

                <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100 text-xs text-slate-650 font-medium">
                  {tx.cita && tx.cita.servicio ? tx.cita.servicio.nombre : 'Servicio médico'}
                </div>

                <button 
                  onClick={() => abrirCobro(tx)}
                  className="w-full bg-sky-500 hover:bg-sky-600 text-white py-2.5 rounded-xl text-xs font-bold shadow-md shadow-sky-500/10 transition-all flex items-center justify-center gap-2"
                >
                  <DollarSign size={14} /> Registrar cobro
                </button>
              </div>
            ))
          )}
        </div>
      </section>

      {/* PANEL DERECHO: Inventario crítico y políticas */}
      <section className="flex-1 bg-slate-50 flex flex-col lg:h-full overflow-visible lg:overflow-hidden animate-in fade-in duration-200">
        <WidgetInventarioCritico />

        <div className="p-6 pt-0 shrink-0">
          <div className="bg-white p-6 rounded-2xl border border-slate-200/60 shadow-sm space-y-3">
            <div className="flex items-center gap-2 text-slate-800">
              <HelpCircle size={18} className="text-sky-500" />
              <h4 className="font-bold text-sm text-slate-850">Políticas del punto de venta</h4>
            </div>
            <p className="text-xs text-slate-500 leading-relaxed font-medium">
              Todas las citas de atención médica, laboratorios y vacunas se registran y envían de forma automática como transacciones en estado **Pendiente** a este panel.
              Una vez efectuado el cobro físico en caja, selecciona el medio de pago correspondiente para liberar la boleta de venta en formato PDF y actualizar el estado a **Aprobado** en el sistema.
            </p>
          </div>
        </div>
      </section>

      {/* MODAL COBRO TÁCTIL (POS) */}
      {cobroSeleccionado && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 max-w-lg w-full overflow-hidden flex flex-col">
            <div className="px-6 py-5 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
              <h3 className="text-base font-bold text-slate-850 flex items-center gap-2 text-slate-800">
                <DollarSign className="text-sky-500" size={18} /> Registrar cobro en caja
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
                  <span className="block text-[9px] font-bold text-slate-400 uppercase tracking-wider">Paciente</span>
                  <p className="font-bold text-slate-800 text-sm">
                    {cobroSeleccionado.cita && cobroSeleccionado.cita.mascota ? cobroSeleccionado.cita.mascota.nombre : 'Paciente'}
                  </p>
                </div>
                <div className="text-right">
                  <span className="block text-[9px] font-bold text-slate-400 uppercase tracking-wider">Monto a pagar</span>
                  <p className="font-bold text-slate-800 text-lg">
                    S/ {cobroSeleccionado.monto ? cobroSeleccionado.monto.toFixed(2) : '0.00'}
                  </p>
                </div>
              </div>

              {/* Selector Táctil de Medio de Pago */}
              <div>
                <label className="block text-xs font-semibold text-slate-500 mb-2 tracking-wide">
                  Medio de pago
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {[
                    { id: 'EFECTIVO', label: 'Efectivo', icon: DollarSign },
                    { id: 'TARJETA_CREDITO', label: 'Tar. crédito', icon: CreditCard },
                    { id: 'TARJETA_DEBITO', label: 'Tar. débito', icon: CreditCard },
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
                        <span className="text-[10px] font-semibold">{medio.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Efectivo: Vuelto */}
              {medioPago === 'EFECTIVO' && (
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-500 mb-1.5 tracking-wide">Monto recibido (S/)</label>
                    <input
                      type="number"
                      step="0.10"
                      value={montoRecibido}
                      onChange={e => handleMontoRecibidoChange(e.target.value)}
                      placeholder="0.00"
                      required={medioPago === 'EFECTIVO'}
                      className="w-full border border-slate-350 p-2.5 rounded-xl text-slate-800 text-sm font-bold focus:ring-2 focus:ring-sky-100 outline-none transition-all focus:border-sky-400"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-500 mb-1.5 tracking-wide">Vuelto (S/)</label>
                    <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100 text-sm font-bold text-emerald-600 h-[42px] flex items-center">
                      S/ {vuelto.toFixed(2)}
                    </div>
                  </div>
                </div>
              )}

              {/* Referencia (para Yape, Tarjeta o Transferencia) */}
              {medioPago !== 'EFECTIVO' && (
                <div>
                  <label className="block text-xs font-semibold text-slate-500 mb-1.5 tracking-wide">Código de referencia / operación</label>
                  <input
                    type="text"
                    value={referencia}
                    onChange={e => setReferencia(e.target.value)}
                    placeholder="Ej: 123456"
                    className="w-full border border-slate-300 p-2.5 rounded-xl text-slate-800 text-xs focus:ring-2 focus:ring-sky-100 outline-none transition-all bg-slate-50 focus:bg-white focus:border-sky-400"
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
                  {procesandoPago ? <CargadorSpinner size="xs" color="border-white" /> : <Printer size={14} />} {procesandoPago ? 'Procesando...' : 'Confirmar e imprimir boleta'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default CajaVentas;
