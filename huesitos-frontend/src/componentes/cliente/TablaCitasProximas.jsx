import { useState, useEffect } from 'react';
import {
  Calendar, Stethoscope, CreditCard, Loader2, Trash2,
  Copy, Landmark, Store, Smartphone, FileText, X, Check, AlertTriangle, CalendarClock
} from 'lucide-react';
import { obtenerTransaccionPorCita, crearPreferenciaPago } from '@/api/mercadoPagoApi';
import { simularPagoPagoEfectivo } from '@/api/pagoEfectivoApi';
import { cancelarCita } from '@/api/citaApi';
import ModalConfirmacion from '@/componentes/comun/ModalConfirmacion';

const FilaCita = ({ cita, badgeEstado, formatearEstado, onCitaCancelada }) => {
  const [transaccion, setTransaccion] = useState(null);
  const [cargando, setCargando] = useState(true);
  const [pagando, setPagando] = useState(false);
  const [modalCipAbierto, setModalCipAbierto] = useState(false);
  const [modalCancelarAbierto, setModalCancelarAbierto] = useState(false);
  const [cancelando, setCancelando] = useState(false);
  const [tabInstrucciones, setTabInstrucciones] = useState('BANCA'); // 'BANCA' o 'EFECTIVO'
  const [copiado, setCopiado] = useState(false);
  const [simulandoPago, setSimulandoPago] = useState(false);
  const [pagoSimuladoExitoso, setPagoSimuladoExitoso] = useState(false);

  useEffect(() => {
    let activo = true;
    const fetchTransaccion = async () => {
      try {
        const data = await obtenerTransaccionPorCita(cita.id);
        if (activo) {
          setTransaccion(data);
        }
      } catch (err) {
        console.error('Error al obtener la transacción para la cita:', cita.id, err);
      } finally {
        if (activo) {
          setCargando(false);
        }
      }
    };
    fetchTransaccion();
    return () => {
      activo = false;
    };
  }, [cita.id]);

  const handlePagar = async () => {
    if (!transaccion) return;
    try {
      setPagando(true);
      const res = await crearPreferenciaPago(transaccion.id);
      if (res.initPoint) {
        window.location.href = res.initPoint;
      } else {
        alert('No se recibió el enlace de pago de Mercado Pago');
        setPagando(false);
      }
    } catch (err) {
      console.error('Error al generar la preferencia de pago:', err);
      alert('Hubo un error al procesar el pago con Mercado Pago. Por favor, inténtelo de nuevo.');
      setPagando(false);
    }
  };

  const handleCopiarCip = () => {
    if (transaccion?.referenciaPago) {
      navigator.clipboard.writeText(transaccion.referenciaPago);
      setCopiado(true);
      setTimeout(() => setCopiado(false), 2000);
    }
  };

  const handleSimularPago = async () => {
    if (!transaccion?.referenciaPago) return;
    setSimulandoPago(true);
    try {
      await simularPagoPagoEfectivo(transaccion.referenciaPago);
      setPagoSimuladoExitoso(true);
      setTransaccion((prev) => ({ ...prev, estadoPago: 'APROBADO' }));
      setTimeout(() => {
        setModalCipAbierto(false);
        setPagoSimuladoExitoso(false);
      }, 1500);
    } catch (err) {
      console.error('Error al simular pago:', err);
      alert('Error al simular el pago: ' + (err.response?.data?.mensaje || err.message));
    } finally {
      setSimulandoPago(false);
    }
  };

  const handleCancelar = async () => {
    setCancelando(true);
    try {
      await cancelarCita(cita.id);
      setModalCancelarAbierto(false);
      if (onCitaCancelada) {
        onCitaCancelada();
      }
    } catch (err) {
      console.error('Error al cancelar la cita:', err);
      alert('Error al cancelar la cita: ' + (err.response?.data || err.message));
    } finally {
      setCancelando(false);
    }
  };

  const fecha = cita.fechaHora
    ? new Date(cita.fechaHora).toLocaleDateString('es-PE', { day: '2-digit', month: 'short', year: 'numeric' })
    : '—';
  const hora = cita.fechaHora
    ? new Date(cita.fechaHora).toLocaleTimeString('es-PE', { hour: '2-digit', minute: '2-digit' })
    : '';

  const badgeEstadoPago = (estado) => {
    const estilos = {
      PENDIENTE: 'bg-amber-50 text-amber-700 border-amber-100 dark:bg-amber-950/20 dark:text-amber-400 dark:border-amber-900/30',
      APROBADO: 'bg-emerald-50 text-emerald-700 border-emerald-100 dark:bg-emerald-950/20 dark:text-emerald-400 dark:border-emerald-900/30',
      RECHAZADO: 'bg-rose-50 text-rose-700 border-rose-100 dark:bg-rose-950/20 dark:text-rose-400 dark:border-rose-900/30',
      REEMBOLSADO: 'bg-blue-50 text-blue-700 border-blue-100 dark:bg-blue-950/20 dark:text-blue-400 dark:border-blue-900/30',
    };
    return estilos[estado] || 'bg-slate-50 text-slate-500 border-slate-100 dark:bg-slate-800/30 dark:text-slate-400';
  };

  const formatearEstadoPago = (estado) => {
    const nombres = {
      PENDIENTE: 'Pendiente',
      APROBADO: 'Pagado',
      RECHAZADO: 'Rechazado',
      REEMBOLSADO: 'Reembolsado',
    };
    return nombres[estado] || estado;
  };

  return (
    <>
      <tr className="border-b border-slate-50 dark:border-slate-850 last:border-0 hover:bg-slate-50/60 dark:hover:bg-slate-850/40 transition-colors duration-200">
      <td className="px-6 py-4">
        <p className="text-sm font-bold text-slate-700 dark:text-slate-200 transition-colors duration-300">{fecha}</p>
        <p className="text-xs text-slate-400 dark:text-slate-500 transition-colors duration-300">{hora}</p>
      </td>
      <td className="px-6 py-4">
        <div className="flex items-center gap-2">
          <Stethoscope size={16} className="text-sky-500 dark:text-sky-400 shrink-0" />
          <span className="text-sm font-semibold text-slate-600 dark:text-slate-300 transition-colors duration-300">
            {cita.servicio?.nombre || 'Consulta'}
          </span>
        </div>
      </td>
      <td className="px-6 py-4">
        <span className="text-sm text-slate-600 dark:text-slate-300 transition-colors duration-300">
          {cita.mascota?.nombre || '—'}
        </span>
      </td>
      <td className="px-6 py-4">
        <span className={`inline-flex items-center px-2.5 py-1 rounded-lg text-[11px] font-semibold border ${badgeEstado(cita.estado)}`}>
          {formatearEstado(cita.estado)}
        </span>
      </td>
      <td className="px-6 py-4">
        <span className="text-sm font-bold text-slate-700 dark:text-slate-200">
          {cargando ? (
            <span className="text-xs text-slate-400">...</span>
          ) : transaccion ? (
            `S/ ${parseFloat(transaccion.monto).toFixed(2)}`
          ) : (
            '—'
          )}
        </span>
      </td>
      <td className="px-6 py-4">
        {cargando ? (
          <span className="text-xs text-slate-400">Cargando...</span>
        ) : transaccion ? (
          <span className={`inline-flex items-center px-2.5 py-1 rounded-lg text-[11px] font-semibold border ${badgeEstadoPago(transaccion.estadoPago)}`}>
            {formatearEstadoPago(transaccion.estadoPago)}
          </span>
        ) : (
          <span className="text-xs text-slate-400">—</span>
        )}
      </td>
      <td className="px-6 py-4">
        {!cargando && transaccion && cita.estado === 'PENDIENTE' && transaccion.estadoPago === 'PENDIENTE' && (
          <div className="flex items-center gap-2">
            {transaccion.medioPago === 'PAGO_EFECTIVO' ? (
              <button
                onClick={() => setModalCipAbierto(true)}
                className="bg-[#F7C600] hover:bg-[#e0b400] text-slate-900 font-bold py-1.5 px-3 rounded-lg flex items-center gap-1.5 text-xs transition-colors duration-200 whitespace-nowrap"
              >
                <FileText size={13} />
                <span>Ver código CIP</span>
              </button>
            ) : (
              <button
                onClick={handlePagar}
                disabled={pagando}
                className="bg-[#009EE3] hover:bg-[#0081bb] disabled:bg-slate-300 dark:disabled:bg-slate-800 disabled:text-slate-500 text-white font-bold py-1.5 px-3 rounded-lg flex items-center gap-1.5 text-xs transition-colors duration-200 whitespace-nowrap"
              >
                {pagando ? (
                  <>
                    <Loader2 size={13} className="animate-spin" />
                    <span>Procesando...</span>
                  </>
                ) : (
                  <>
                    <CreditCard size={13} />
                    <span>Pagar</span>
                  </>
                )}
              </button>
            )}

            <button
              onClick={() => setModalCancelarAbierto(true)}
              disabled={cancelando}
              className="bg-rose-50 dark:bg-rose-950/20 text-rose-600 dark:text-rose-400 border border-rose-100 dark:border-rose-900/30 hover:bg-rose-500 hover:text-white dark:hover:bg-rose-500 font-bold py-1.5 px-3 rounded-lg flex items-center gap-1.5 text-xs transition-colors duration-200"
              title="Cancelar Cita"
            >
              {cancelando ? <Loader2 size={13} className="animate-spin" /> : <Trash2 size={13} />}
              <span>Cancelar</span>
            </button>
          </div>
        )}
      </td>
    </tr>

    {modalCipAbierto && transaccion && (
      <tr className="bg-slate-50/10 dark:bg-slate-950/10">
        <td colSpan="7" className="p-0 border-0">
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
            <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-lg w-full border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden animate-in slide-in-from-bottom-4 duration-300 text-left">
              {/* Header */}
              <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center bg-slate-50/50 dark:bg-slate-950/20">
                <h3 className="font-bold text-slate-850 dark:text-slate-100 flex items-center gap-2">
                  <FileText className="text-amber-500" size={18} />
                  <span>Instrucciones de PagoEfectivo</span>
                </h3>
                <button
                  onClick={() => setModalCipAbierto(false)}
                  className="p-1 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-all"
                >
                  <X size={18} />
                </button>
              </div>

              {/* Body */}
              <div className="p-6 space-y-5">
                {/* Tarjeta CIP */}
                <div className="bg-slate-50 dark:bg-slate-950/60 border border-slate-150 dark:border-slate-850 rounded-xl p-5">
                  <div className="flex justify-between items-center border-b border-slate-200/60 dark:border-slate-800 pb-4">
                    <div>
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Código CIP</span>
                      <div className="flex items-center gap-1.5 mt-0.5">
                        <span className="text-xl font-black text-slate-800 dark:text-slate-100 tracking-wider">
                          {transaccion.referenciaPago}
                        </span>
                        <button
                          onClick={handleCopiarCip}
                          className="p-1 hover:bg-slate-200/50 dark:hover:bg-slate-800 rounded text-slate-400 transition-colors"
                          title="Copiar"
                        >
                          {copiado ? <span className="text-[10px] font-bold text-emerald-500">¡Copiado!</span> : <Copy size={13} />}
                        </button>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Total</span>
                      <span className="text-xl font-black text-emerald-650 dark:text-emerald-450 block mt-0.5">
                        S/ {parseFloat(transaccion.monto).toFixed(2)}
                      </span>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2 mt-4 text-xs text-slate-550 dark:text-slate-400">
                    <CalendarClock size={14} className="text-amber-500" />
                    <span>
                      Límite de pago: {transaccion.fechaCreacion 
                        ? new Date(new Date(transaccion.fechaCreacion).getTime() + 24*60*60*1000).toLocaleString('es-PE', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' })
                        : '24 horas desde la reserva'}
                    </span>
                  </div>
                </div>

                {/* Pestañas */}
                <div>
                  <div className="flex border-b border-slate-200 dark:border-slate-800 mb-3.5">
                    <button
                      onClick={() => setTabInstrucciones('BANCA')}
                      className={`flex items-center gap-1.5 pb-2 px-3 font-bold text-xs border-b-2 transition-all ${tabInstrucciones === 'BANCA' ? 'border-sky-500 text-sky-500' : 'border-transparent text-slate-450 hover:text-slate-600 dark:hover:text-slate-350'}`}
                    >
                      <Landmark size={13} />
                      Banca Móvil
                    </button>
                    <button
                      onClick={() => setTabInstrucciones('EFECTIVO')}
                      className={`flex items-center gap-1.5 pb-2 px-3 font-bold text-xs border-b-2 transition-all ${tabInstrucciones === 'EFECTIVO' ? 'border-sky-500 text-sky-500' : 'border-transparent text-slate-455 hover:text-slate-600 dark:hover:text-slate-350'}`}
                    >
                      <Store size={13} />
                      Agentes
                    </button>
                  </div>

                  <div className="text-xs space-y-3">
                    {tabInstrucciones === 'BANCA' ? (
                      <>
                        <p className="text-slate-400 dark:text-slate-450">Instrucciones bancarias:</p>
                        <div className="grid grid-cols-2 gap-2 text-[10px]">
                          {[
                            { b: 'BCP', p: 'Pago servicios > PagoEfectivo Soles' },
                            { b: 'BBVA', p: 'Pago servicios > PagoEfectivo Soles' },
                            { b: 'Interbank', p: 'Pago recibos > Buscar PagoEfectivo' },
                            { b: 'Scotiabank', p: 'Servicios > Buscar PagoEfectivo' },
                          ].map((x) => (
                            <div key={x.b} className="bg-slate-50 dark:bg-slate-950/40 p-2 rounded-lg border border-slate-100 dark:border-slate-850">
                              <span className="font-bold text-slate-700 dark:text-slate-300 block">{x.b}</span>
                              <span className="text-slate-500 dark:text-slate-450 mt-0.5 block">{x.p}</span>
                            </div>
                          ))}
                        </div>
                      </>
                    ) : (
                      <>
                        <p className="text-slate-400 dark:text-slate-450">Puedes depositar en efectivo indicando el código CIP en:</p>
                        <div className="flex flex-wrap gap-1.5">
                          {['Agentes BCP', 'Agentes BBVA', 'Agentes Interbank', 'Agentes KasNet', 'Red Digital', 'Western Union'].map((a) => (
                            <span key={a} className="px-2 py-0.5 rounded bg-slate-50 dark:bg-slate-850 border border-slate-100 dark:border-slate-800 text-[10px] text-slate-500 dark:text-slate-400 font-semibold">
                              {a}
                            </span>
                          ))}
                        </div>
                      </>
                    )}
                  </div>
                </div>

                {/* Simulación */}
                <div className="bg-amber-500/5 dark:bg-amber-500/10 border border-amber-500/20 dark:border-amber-500/30 rounded-xl p-4">
                  <div className="flex gap-2">
                    <AlertTriangle size={15} className="text-amber-500 shrink-0 mt-0.5" />
                    <div className="space-y-2.5">
                      <span className="text-[11px] font-bold text-amber-800 dark:text-amber-400 block">Desarrollo local: Simular Aprobación</span>
                      {pagoSimuladoExitoso ? (
                        <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-450 block">
                          ✓ ¡Pago aprobado simulado!
                        </span>
                      ) : (
                        <button
                          onClick={handleSimularPago}
                          disabled={simulandoPago}
                          className="px-3 py-1.5 bg-amber-500 hover:bg-amber-600 text-slate-900 font-bold text-[10px] rounded-lg transition-colors disabled:opacity-40"
                        >
                          {simulandoPago ? 'Procesando...' : 'Aprobar Pago CIP'}
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </td>
      </tr>
    )}

    {modalCancelarAbierto && (
      <ModalConfirmacion
        isOpen={modalCancelarAbierto}
        onClose={() => setModalCancelarAbierto(false)}
        onConfirm={handleCancelar}
        titulo="Cancelar cita médica"
        mensaje="¿Estás seguro de que deseas cancelar esta cita? Esta acción no se puede deshacer y liberará el horario de atención."
        textoConfirmar="Sí, cancelar cita"
        textoCancelar="No, mantener cita"
        tipo="danger"
      />
    )}
    </>
  );
};

const TablaCitasProximas = ({ citas, onCitaCancelada }) => {
  // Filtrar citas pendientes/confirmadas/en espera (próximas)
  const citasProximas = citas.filter(
    (c) => c.estado === 'PENDIENTE' || c.estado === 'CONFIRMADA' || c.estado === 'EN_ESPERA'
  );

  const badgeEstado = (estado) => {
    const estilos = {
      PENDIENTE: 'bg-amber-50 text-amber-700 border-amber-100 dark:bg-amber-950/20 dark:text-amber-400 dark:border-amber-900/30',
      CONFIRMADA: 'bg-emerald-50 text-emerald-700 border-emerald-100 dark:bg-emerald-950/20 dark:text-emerald-400 dark:border-emerald-900/30',
      EN_ESPERA: 'bg-sky-50 text-sky-700 border-sky-100 dark:bg-sky-950/20 dark:text-sky-400 dark:border-sky-900/30',
      COMPLETADA: 'bg-slate-50 text-slate-500 border-slate-100 dark:bg-slate-800/30 dark:text-slate-400 dark:border-slate-700/30',
      CANCELADA: 'bg-red-50 text-red-600 border-red-100 dark:bg-red-950/20 dark:text-red-400 dark:border-red-900/30',
    };
    return estilos[estado] || 'bg-slate-50 text-slate-500 border-slate-100 dark:bg-slate-800/30 dark:text-slate-400 dark:border-slate-750';
  };

  const formatearEstado = (estado) => {
    const nombres = {
      PENDIENTE: 'Pendiente',
      CONFIRMADA: 'Confirmada',
      EN_ESPERA: 'En espera',
      COMPLETADA: 'Completada',
      CANCELADA: 'Cancelada',
    };
    return nombres[estado] || estado;
  };

  return (
    <div>
      <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100 tracking-tight mb-1 transition-colors duration-300">
        Próximas citas
      </h2>
      <p className="text-sm text-slate-400 dark:text-slate-500 mb-5 transition-colors duration-300">
        Tus citas agendadas y confirmadas
      </p>

      {citasProximas.length === 0 ? (
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/60 dark:border-slate-800 p-10 text-center shadow-sm transition-all duration-300">
          <div className="w-14 h-14 bg-emerald-50 dark:bg-emerald-950/30 rounded-2xl flex items-center justify-center mx-auto mb-3 transition-colors duration-300">
            <Calendar size={24} className="text-emerald-500 dark:text-emerald-400" />
          </div>
          <h3 className="text-base font-bold text-slate-700 dark:text-slate-200 mb-1 transition-colors duration-300">
            No tienes citas pendientes
          </h3>
          <p className="text-sm text-slate-400 dark:text-slate-500 transition-colors duration-300">
            Agenda una cita desde el menú lateral.
          </p>
        </div>
      ) : (
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/60 dark:border-slate-800 shadow-sm overflow-hidden transition-all duration-300">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-100 dark:border-slate-850 bg-slate-50/50 dark:bg-slate-950/50 transition-colors duration-300">
                  <th className="text-left px-6 py-3.5 text-xs font-semibold text-slate-500 dark:text-slate-400 tracking-wider">Fecha / hora</th>
                  <th className="text-left px-6 py-3.5 text-xs font-semibold text-slate-500 dark:text-slate-400 tracking-wider">Servicio</th>
                  <th className="text-left px-6 py-3.5 text-xs font-semibold text-slate-500 dark:text-slate-400 tracking-wider">Mascota</th>
                  <th className="text-left px-6 py-3.5 text-xs font-semibold text-slate-500 dark:text-slate-400 tracking-wider">Estado Cita</th>
                  <th className="text-left px-6 py-3.5 text-xs font-semibold text-slate-500 dark:text-slate-400 tracking-wider">Total</th>
                  <th className="text-left px-6 py-3.5 text-xs font-semibold text-slate-500 dark:text-slate-400 tracking-wider">Estado Pago</th>
                  <th className="text-left px-6 py-3.5 text-xs font-semibold text-slate-500 dark:text-slate-400 tracking-wider">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {citasProximas.map((cita) => (
                  <FilaCita
                    key={cita.id}
                    cita={cita}
                    badgeEstado={badgeEstado}
                    formatearEstado={formatearEstado}
                    onCitaCancelada={onCitaCancelada}
                  />
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default TablaCitasProximas;

