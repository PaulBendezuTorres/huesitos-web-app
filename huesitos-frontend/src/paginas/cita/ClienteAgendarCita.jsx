import { useState, useEffect, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  Check, AlertTriangle, ChevronRight, ChevronLeft,
  CircleDollarSign, CalendarClock, CreditCard,
  Copy, Smartphone, Landmark, Store
} from 'lucide-react';
import CargadorSpinner from '@/componentes/comun/CargadorSpinner';
import StepperCita from '@/componentes/cita/StepperCita';
import PasadorMascota from '@/componentes/cita/PasadorMascota';
import PasadorServicio from '@/componentes/cita/PasadorServicio';
import PasadorVeterinario from '@/componentes/cita/PasadorVeterinario';
import PasadorHorario from '@/componentes/cita/PasadorHorario';
import { obtenerMascotasPorDueno, obtenerCampanasActivas, obtenerCitasAgenda } from '@/api/clienteApi';
import {
  agendarCita,
  obtenerCitasPorDia,
  obtenerServiciosActivos,
  obtenerVeterinarios,
  obtenerHorariosVeterinario,
} from '@/api/citaApi';
import { obtenerTransaccionPorCita, crearPreferenciaPago } from '@/api/mercadoPagoApi';
import { generarCipPagoEfectivo, simularPagoPagoEfectivo } from '@/api/pagoEfectivoApi';

const HORARIOS_BASE = [
  '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
  '12:00', '14:00', '14:30', '15:00', '15:30',
  '16:00', '16:30', '17:00', '17:30',
];

const TITULOS_PASO = [
  { titulo: 'Selecciona tu mascota', subtitulo: '¿Para quién es la cita?' },
  { titulo: 'Elige el servicio', subtitulo: null },
  { titulo: 'Selecciona un profesional', subtitulo: 'Opcional — puedes dejar que la recepcionista asigne uno' },
  { titulo: 'Elige fecha y hora', subtitulo: 'Selecciona el día y horario de tu cita' },
];

const ClienteAgendarCita = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [pasoActual, setPasoActual] = useState(1);

  const [mascotas, setMascotas] = useState([]);
  const [servicios, setServicios] = useState([]);
  const [veterinarios, setVeterinarios] = useState([]);
  const [citasDelDia, setCitasDelDia] = useState([]);
  const [horariosVet, setHorariosVet] = useState([]);

  const [mascotaSeleccionada, setMascotaSeleccionada] = useState(null);
  const [servicioSeleccionado, setServicioSeleccionado] = useState(null);
  const [veterinarioSeleccionado, setVeterinarioSeleccionado] = useState(null);
  const [fechaSeleccionada, setFechaSeleccionada] = useState('');
  const [horaSeleccionada, setHoraSeleccionada] = useState('');

  const [cargando, setCargando] = useState(true);
  const [enviando, setEnviando] = useState(false);
  const [error, setError] = useState('');
  const [exito, setExito] = useState(false);
  const [metodoPago, setMetodoPago] = useState('CLINICA');
  const [cipInfo, setCipInfo] = useState(null);
  const [simulandoPago, setSimulandoPago] = useState(false);
  const [pagoSimuladoExitoso, setPagoSimuladoExitoso] = useState(false);
  const [copiado, setCopiado] = useState(false);
  const [tabInstrucciones, setTabInstrucciones] = useState('BANCA'); // 'BANCA' o 'EFECTIVO'

  // Cargar mascotas y servicios al montar
  useEffect(() => {
    const cargar = async () => {
      setCargando(true);
      try {
        const duenoId = localStorage.getItem('duenoId');
        const [mascotasRes, serviciosRes, campanasRes, citasRes] = await Promise.allSettled([
          duenoId ? obtenerMascotasPorDueno(duenoId) : Promise.resolve([]),
          obtenerServiciosActivos(),
          obtenerCampanasActivas(),
          obtenerCitasAgenda(),
        ]);
        setMascotas(mascotasRes.status === 'fulfilled' ? mascotasRes.value : []);
        const srv = serviciosRes.status === 'fulfilled' ? serviciosRes.value : [];
        const campanasActivas = campanasRes.status === 'fulfilled' ? campanasRes.value : [];
        const citasActivas = citasRes.status === 'fulfilled' ? citasRes.value.filter(c => c.estado !== 'CANCELADA') : [];
        
        // Mapear servicios aplicando precios de campañas activas (si no han sido usadas por el cliente)
        const serviciosMapeados = srv.filter((s) => s.activo !== false).map((servicio) => {
          const hoy = new Date();
          const campanaAplicable = campanasActivas.find((campana) => {
            if (!campana.activo) return false;
            const inicio = new Date(campana.fechaInicio + 'T00:00:00');
            const fin = new Date(campana.fechaFin + 'T23:59:59');
            if (hoy < inicio || hoy > fin) return false;
            return campana.servicios?.some((cs) => cs.id === servicio.id);
          });

          if (campanaAplicable && campanaAplicable.precioPromocional) {
            // Un cliente solo puede usar la promoción una vez para este servicio
            const yaUsoCampana = citasActivas.some(c => c.servicio?.id === servicio.id);
            if (!yaUsoCampana) {
              return {
                ...servicio,
                precioOriginal: servicio.precio,
                precio: campanaAplicable.precioPromocional,
                enCampana: true,
                nombreCampana: campanaAplicable.nombre,
              };
            }
          }
          return servicio;
        });

        setServicios(serviciosMapeados);
      } catch (err) {
        console.error('Error cargando datos:', err);
      } finally {
        setCargando(false);
      }
    };
    cargar();
  }, []);

  // Cargar veterinarios al paso 3
  useEffect(() => {
    if (pasoActual === 3 && veterinarios.length === 0) {
      obtenerVeterinarios()
        .then((vets) => setVeterinarios(vets))
        .catch(() => setVeterinarios([]));
    }
  }, [pasoActual, veterinarios.length]);

  // Cargar horarios del veterinario
  useEffect(() => {
    if (veterinarioSeleccionado) {
      obtenerHorariosVeterinario(veterinarioSeleccionado.id)
        .then(setHorariosVet)
        .catch(() => setHorariosVet([]));
    }
  }, [veterinarioSeleccionado]);

  // Disponibilidad del día
  const cargarDisponibilidad = useCallback(async (fecha) => {
    if (!fecha) return;
    try {
      setCitasDelDia(await obtenerCitasPorDia(fecha));
    } catch {
      setCitasDelDia([]);
    }
  }, []);

  useEffect(() => {
    if (fechaSeleccionada) {
      cargarDisponibilidad(fechaSeleccionada);
      setHoraSeleccionada('');
    }
  }, [fechaSeleccionada, cargarDisponibilidad]);

  // Preseleccionar servicio si viene del estado de la navegación
  useEffect(() => {
    if (servicios.length > 0 && location.state?.servicioPreseleccionado) {
      const srvPre = servicios.find(s => s.id === location.state.servicioPreseleccionado.id);
      if (srvPre) {
        setServicioSeleccionado(srvPre);
      }
    }
  }, [servicios, location.state]);

  // Filtrar horarios disponibles
  const horariosDisponibles = HORARIOS_BASE.filter((hora) => {
    if (veterinarioSeleccionado && citasDelDia.length > 0) {
      const ocupado = citasDelDia.some((c) => {
        if (c.veterinario?.id !== veterinarioSeleccionado.id) return false;
        if (c.estado === 'CANCELADA') return false;
        return (c.fechaHora?.substring(11, 16) || '') === hora;
      });
      if (ocupado) return false;
    }
    if (horariosVet.length > 0 && fechaSeleccionada) {
      const diaSemana = new Date(fechaSeleccionada + 'T12:00:00').getDay();
      const diaMap = { 0: 7, 1: 1, 2: 2, 3: 3, 4: 4, 5: 5, 6: 6 };
      const horarioDia = horariosVet.find((h) => h.diaSemana === diaMap[diaSemana] && h.activo);
      if (!horarioDia) return false;
      if (hora < horarioDia.horaEntrada || hora >= horarioDia.horaSalida) return false;

      // Filtrar hora de almuerzo
      if (horarioDia.horaAlmuerzoInicio && horarioDia.horaAlmuerzoFin) {
        const almuerzoInicio = horarioDia.horaAlmuerzoInicio.substring(0, 5);
        const almuerzoFin = horarioDia.horaAlmuerzoFin.substring(0, 5);
        if (hora >= almuerzoInicio && hora < almuerzoFin) return false;
      }
    }
    return true;
  });

  const fechaMinima = (() => {
    const manana = new Date();
    manana.setDate(manana.getDate() + 1);
    return manana.toISOString().split('T')[0];
  })();

  const puedeAvanzar = () => {
    if (pasoActual === 1) return mascotaSeleccionada !== null;
    if (pasoActual === 2) return servicioSeleccionado !== null;
    if (pasoActual === 3) return true;
    if (pasoActual === 4) return fechaSeleccionada && horaSeleccionada;
    return false;
  };

  const enviarCita = async (metodo = 'CLINICA') => {
    setMetodoPago(metodo);
    setEnviando(true);
    setError('');
    try {
      const payload = {
        mascota: { id: mascotaSeleccionada.id },
        servicio: { id: servicioSeleccionado.id },
        fechaHora: `${fechaSeleccionada}T${horaSeleccionada}:00`,
      };
      if (veterinarioSeleccionado) payload.veterinario = { id: veterinarioSeleccionado.id };
      
      const citaNueva = await agendarCita(payload);

      if (metodo === 'MERCADO_PAGO') {
        try {
          const transaccion = await obtenerTransaccionPorCita(citaNueva.id);
          const res = await crearPreferenciaPago(transaccion.id);
          if (res.initPoint) {
            window.location.href = res.initPoint;
            return;
          }
        } catch (errPago) {
          console.error('Error al procesar pago en línea:', errPago);
          alert('Cita agendada, pero hubo un error al abrir Mercado Pago. Puedes realizar el pago en tu panel de citas.');
          navigate('/cliente');
          return;
        }
      }

      if (metodo === 'PAGO_EFECTIVO') {
        try {
          const transaccion = await obtenerTransaccionPorCita(citaNueva.id);
          const resCip = await generarCipPagoEfectivo(transaccion.id);
          setCipInfo(resCip);
        } catch (errCip) {
          console.error('Error al generar código CIP:', errCip);
          alert('Cita agendada, pero hubo un error al generar el código PagoEfectivo. Puedes verlo y pagarlo en tu panel de citas.');
          navigate('/cliente');
          return;
        }
      }

      setExito(true);
    } catch (err) {
      const msg = err.response?.data || 'Error al agendar la cita. Intenta de nuevo.';
      setError(typeof msg === 'string' ? msg : JSON.stringify(msg));
    } finally {
      setEnviando(false);
    }
  };

  const handleCopiarCip = () => {
    if (cipInfo?.cip) {
      navigator.clipboard.writeText(cipInfo.cip);
      setCopiado(true);
      setTimeout(() => setCopiado(false), 2000);
    }
  };

  const handleSimularPago = async () => {
    if (!cipInfo?.cip) return;
    setSimulandoPago(true);
    try {
      await simularPagoPagoEfectivo(cipInfo.cip);
      setPagoSimuladoExitoso(true);
    } catch (err) {
      console.error('Error al simular pago:', err);
      alert('Error al simular el pago: ' + (err.response?.data?.mensaje || err.message));
    } finally {
      setSimulandoPago(false);
    }
  };

  // ── Pantalla de éxito ──
  if (exito) {
    if (metodoPago === 'PAGO_EFECTIVO' && cipInfo) {
      return (
        <div className="space-y-6">
          <div>
            <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100 tracking-tight">Reservar cita</h2>
          </div>
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/60 dark:border-slate-800 p-8 shadow-sm">
            <div className="max-w-2xl mx-auto">
              <div className="text-center mb-6">
                <div className="w-14 h-14 bg-amber-50 dark:bg-amber-950/40 rounded-2xl flex items-center justify-center mx-auto mb-3">
                  <Check size={28} className="text-amber-500" />
                </div>
                <h3 className="text-2xl font-bold text-slate-800 dark:text-slate-100 mb-1">¡Cita registrada con PagoEfectivo!</h3>
                <p className="text-sm text-slate-500 dark:text-slate-400">Paga tu código CIP antes de la fecha límite para confirmar tu cita.</p>
              </div>

              {/* Tarjeta del Código CIP */}
              <div className="bg-slate-50 dark:bg-slate-950/80 border border-slate-200/60 dark:border-slate-850 rounded-2xl p-6 mb-6">
                <div className="flex flex-col sm:flex-row justify-between items-center gap-4 border-b border-slate-200/60 dark:border-slate-800/80 pb-5">
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Código de Pago CIP</span>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-2xl font-black text-slate-800 dark:text-slate-100 tracking-wider">
                        {cipInfo.cip}
                      </span>
                      <button
                        onClick={handleCopiarCip}
                        className="p-1.5 hover:bg-slate-200/60 dark:hover:bg-slate-850 rounded-lg text-slate-500 dark:text-slate-400 transition-colors"
                        title="Copiar código CIP"
                      >
                        {copiado ? <span className="text-[10px] font-bold text-emerald-500">¡Copiado!</span> : <Copy size={15} />}
                      </button>
                    </div>
                  </div>
                  <div className="text-right sm:text-right">
                    <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider block">Total a pagar</span>
                    <span className="text-2xl font-black text-emerald-600 dark:text-emerald-400 mt-1 block">
                      S/ {parseFloat(cipInfo.monto).toFixed(2)}
                    </span>
                  </div>
                </div>

                <div className="flex items-start gap-2.5 mt-5">
                  <CalendarClock size={16} className="text-amber-500 shrink-0 mt-0.5" />
                  <div>
                    <span className="text-xs font-bold text-slate-700 dark:text-slate-350 block">Paga antes de:</span>
                    <span className="text-xs text-slate-500 dark:text-slate-450 block mt-0.5">
                      {new Date(cipInfo.fechaExpiracion).toLocaleString('es-PE', { day: '2-digit', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                </div>
              </div>

              {/* Pestañas de Instrucciones */}
              <div className="mb-6">
                <div className="flex border-b border-slate-200 dark:border-slate-800 mb-4">
                  <button
                    onClick={() => setTabInstrucciones('BANCA')}
                    className={`flex items-center gap-1.5 pb-2.5 px-4 font-bold text-xs border-b-2 transition-all ${tabInstrucciones === 'BANCA' ? 'border-sky-500 text-sky-500' : 'border-transparent text-slate-400 hover:text-slate-600 dark:hover:text-slate-300'}`}
                  >
                    <Landmark size={14} />
                    Banca por Internet / Móvil
                  </button>
                  <button
                    onClick={() => setTabInstrucciones('EFECTIVO')}
                    className={`flex items-center gap-1.5 pb-2.5 px-4 font-bold text-xs border-b-2 transition-all ${tabInstrucciones === 'EFECTIVO' ? 'border-sky-500 text-sky-500' : 'border-transparent text-slate-400 hover:text-slate-600 dark:hover:text-slate-300'}`}
                  >
                    <Store size={14} />
                    Agentes y Bodegas
                  </button>
                </div>

                <div className="p-2 space-y-4">
                  {tabInstrucciones === 'BANCA' ? (
                    <div className="space-y-3">
                      <p className="text-xs text-slate-500 dark:text-slate-400">Paga desde la banca móvil o web de tu banco usando los siguientes pasos:</p>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {[
                          { banco: 'BCP', desc: 'Pago de servicios > Buscar "PagoEfectivo" > PagoEfectivo Soles' },
                          { banco: 'BBVA', desc: 'Pago de servicios > Buscar "PagoEfectivo" > PagoEfectivo Soles' },
                          { banco: 'Interbank', desc: 'Pago de servicios > Pago de recibos > Buscar "PagoEfectivo"' },
                          { banco: 'Scotiabank', desc: 'Pagos > Pago de servicios > Buscar "PagoEfectivo"' },
                        ].map((b) => (
                          <div key={b.banco} className="bg-slate-50/50 dark:bg-slate-950/40 p-3 rounded-xl border border-slate-150 dark:border-slate-850">
                            <span className="font-bold text-xs text-slate-700 dark:text-slate-300 block">{b.banco}</span>
                            <span className="text-[11px] text-slate-500 dark:text-slate-400 block mt-1">{b.desc}</span>
                          </div>
                        ))}
                      </div>
                      <div className="bg-slate-50/50 dark:bg-slate-950/40 p-3 rounded-xl border border-slate-150 dark:border-slate-850 flex gap-2.5 items-start">
                        <Smartphone size={15} className="text-slate-400 dark:text-slate-500 shrink-0 mt-0.5" />
                        <div className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
                          <span className="font-bold text-slate-600 dark:text-slate-350">Instrucciones generales:</span> Ingresa a la app o banca web de tu banco, busca la opción de pagar un servicio bajo el nombre <span className="font-semibold text-slate-700 dark:text-slate-300">PagoEfectivo Soles</span>, coloca tu código CIP y confirma el importe a pagar.
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      <p className="text-xs text-slate-500 dark:text-slate-400">Realiza tu depósito en efectivo en agencias bancarias, agentes autorizados o bodegas asociadas:</p>
                      <div className="flex flex-wrap gap-2.5">
                        {['Agentes BCP', 'Agentes BBVA', 'Agentes Interbank', 'Agentes KasNet', 'Agentes Western Union / Tambo', 'Agentes Red Digital'].map((ag) => (
                          <span key={ag} className="inline-flex items-center px-2.5 py-1 rounded-lg text-[10px] font-bold bg-slate-100 dark:bg-slate-855 text-slate-650 dark:text-slate-400 border border-slate-200/40 dark:border-slate-800">
                            {ag}
                          </span>
                        ))}
                      </div>
                      <div className="bg-slate-50/50 dark:bg-slate-950/40 p-3 rounded-xl border border-slate-150 dark:border-slate-850 flex gap-2.5 items-start">
                        <Store size={15} className="text-slate-400 dark:text-slate-500 shrink-0 mt-0.5" />
                        <div className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
                          <span className="font-bold text-slate-600 dark:text-slate-350">Instrucciones generales:</span> Acércate al agente autorizado de tu preferencia, indica que deseas hacer un pago al servicio <span className="font-semibold text-slate-700 dark:text-slate-300">PagoEfectivo</span>, proporciona el código CIP y cancela el importe total en efectivo.
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Bloque de Simulación Local (Desarrollo) */}
              <div className="bg-amber-500/5 dark:bg-amber-500/10 border border-amber-500/20 dark:border-amber-500/30 rounded-2xl p-5 mb-6">
                <div className="flex items-start gap-3">
                  <AlertTriangle size={18} className="text-amber-500 shrink-0 mt-0.5" />
                  <div className="space-y-3">
                    <div>
                      <span className="text-xs font-bold text-amber-800 dark:text-amber-400 block">Modo Simulación de Desarrollo</span>
                      <span className="text-xs text-amber-700 dark:text-amber-500 leading-relaxed block mt-0.5">
                        Dado que estamos en entorno de desarrollo local, puedes simular la aprobación exitosa del código CIP instantáneamente haciendo clic en el botón de abajo.
                      </span>
                    </div>
                    {pagoSimuladoExitoso ? (
                      <div className="flex items-center gap-2 text-xs text-emerald-600 dark:text-emerald-400 font-bold bg-emerald-500/10 border border-emerald-500/20 p-2 rounded-lg">
                        <Check size={14} />
                        ¡El pago simulado ha sido procesado con éxito y la cita está Pagada!
                      </div>
                    ) : (
                      <button
                        onClick={handleSimularPago}
                        disabled={simulandoPago}
                        className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-slate-900 font-bold text-xs rounded-lg transition-colors flex items-center gap-2"
                      >
                        {simulandoPago ? (
                          <>
                            <CargadorSpinner size="xs" color="border-slate-900" />
                            <span>Procesando pago...</span>
                          </>
                        ) : (
                          <span>Simular Pago Exitoso del CIP</span>
                        )}
                      </button>
                    )}
                  </div>
                </div>
              </div>

              {/* Botón de Retorno */}
              <button
                onClick={() => navigate('/cliente')}
                className="w-full px-6 py-3 bg-sky-500 hover:bg-sky-600 text-white font-bold rounded-xl transition-colors shadow-lg shadow-sky-500/20"
              >
                Ir a mis citas
              </button>
            </div>
          </div>
        </div>
      );
    }

    return (
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100 tracking-tight">Reservar cita</h2>
        </div>
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/60 dark:border-slate-800 p-10 shadow-sm">
          <div className="max-w-md mx-auto text-center">
            <div className="w-16 h-16 bg-emerald-50 dark:bg-emerald-950/40 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Check size={32} className="text-emerald-500" />
            </div>
            <h3 className="text-2xl font-bold text-slate-800 dark:text-slate-100 mb-2">¡Cita agendada!</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 mb-1">Tu cita ha sido registrada exitosamente.</p>
            <p className="text-sm text-slate-400 dark:text-slate-500 mb-6">Recibirás una confirmación una vez procesado el pago.</p>
            <div className="bg-slate-50 dark:bg-slate-950/60 rounded-xl p-4 mb-6 text-left space-y-2 border border-slate-200/60 dark:border-slate-800">
              {[
                { label: 'Mascota', val: mascotaSeleccionada?.nombre },
                { label: 'Servicio', val: servicioSeleccionado?.nombre },
                veterinarioSeleccionado && { label: 'Veterinario', val: `${veterinarioSeleccionado.nombre || ''} ${veterinarioSeleccionado.apellido || ''}`.trim() || veterinarioSeleccionado.correo },
                { label: 'Fecha', val: new Date(fechaSeleccionada + 'T12:00:00').toLocaleDateString('es-PE', { weekday: 'long', day: '2-digit', month: 'long', year: 'numeric' }) },
                { label: 'Hora', val: horaSeleccionada },
              ].filter(Boolean).map(({ label, val }) => (
                <p key={label} className="text-xs text-slate-500 dark:text-slate-400">
                  <span className="font-bold text-slate-700 dark:text-slate-300">{label}:</span> {val}
                </p>
              ))}
            </div>
            <button
              onClick={() => navigate('/cliente')}
              className="w-full px-6 py-3 bg-sky-500 hover:bg-sky-600 text-white font-bold rounded-xl transition-colors shadow-lg shadow-sky-500/20"
            >
              Volver al panel
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (cargando) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="flex flex-col items-center gap-3">
          <CargadorSpinner size="lg" />
          <span className="text-sm font-semibold text-slate-400 dark:text-slate-500">Cargando formulario...</span>
        </div>
      </div>
    );
  }

  const { titulo, subtitulo } = TITULOS_PASO[pasoActual - 1];

  return (
    <div className="space-y-6">
      {/* Encabezado */}
      <div>
        <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100 tracking-tight transition-colors duration-300">
          Reservar cita
        </h2>
        <p className="text-sm text-slate-450 dark:text-slate-500 mt-0.5 transition-colors duration-300">
          Completa los pasos para agendar la atención de tu mascota
        </p>
      </div>

      {/* Stepper */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 shadow-sm border border-slate-200/60 dark:border-slate-800 transition-colors duration-300">
        <StepperCita pasoActual={pasoActual} />
      </div>

      {/* Contenido del paso — full width */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200/60 dark:border-slate-800 transition-colors duration-300 overflow-hidden">
        {/* Sub-header del paso */}
        <div className="px-6 py-5 border-b border-slate-100 dark:border-slate-800">
          <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100">{titulo}</h3>
          {subtitulo && <p className="text-sm text-slate-400 dark:text-slate-500 mt-0.5">{subtitulo}</p>}
          {pasoActual === 2 && mascotaSeleccionada && (
            <p className="text-sm text-slate-400 dark:text-slate-500 mt-0.5">
              ¿Qué tipo de atención necesita <span className="font-semibold text-slate-600 dark:text-slate-300">{mascotaSeleccionada.nombre}</span>?
            </p>
          )}
        </div>

        <div className="p-6">
          {pasoActual === 1 && (
            <PasadorMascota
              mascotas={mascotas}
              mascotaSeleccionada={mascotaSeleccionada}
              onSeleccionar={setMascotaSeleccionada}
            />
          )}
          {pasoActual === 2 && (
            <PasadorServicio
              servicios={servicios}
              servicioSeleccionado={servicioSeleccionado}
              mascota={mascotaSeleccionada}
              onSeleccionar={setServicioSeleccionado}
            />
          )}
          {pasoActual === 3 && (
            <PasadorVeterinario
              veterinarios={veterinarios}
              veterinarioSeleccionado={veterinarioSeleccionado}
              onSeleccionar={setVeterinarioSeleccionado}
            />
          )}
          {pasoActual === 4 && (
            <PasadorHorario
              fechaSeleccionada={fechaSeleccionada}
              horaSeleccionada={horaSeleccionada}
              fechaMinima={fechaMinima}
              horariosDisponibles={horariosDisponibles}
              onFechaChange={setFechaSeleccionada}
              onHoraChange={setHoraSeleccionada}
            />
          )}
        </div>
      </div>

      {/* Resumen — solo en paso 4 con fecha y hora elegidas */}
      {pasoActual === 4 && fechaSeleccionada && horaSeleccionada && (
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 shadow-sm border border-slate-200/60 dark:border-slate-800 transition-colors duration-300">
          <h4 className="text-sm font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider mb-4">
            Resumen de tu cita
          </h4>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { label: 'Mascota', val: mascotaSeleccionada?.nombre },
              { label: 'Servicio', val: servicioSeleccionado?.nombre },
              { label: 'Fecha y hora', val: `${new Date(fechaSeleccionada + 'T12:00:00').toLocaleDateString('es-PE', { day: '2-digit', month: 'short' })} — ${horaSeleccionada}` },
            ].map(({ label, val }) => (
              <div key={label} className="bg-slate-50 dark:bg-slate-950/60 rounded-xl p-3 border border-slate-200/60 dark:border-slate-800">
                <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">{label}</p>
                <p className="font-bold text-slate-700 dark:text-slate-200 text-sm mt-0.5">{val}</p>
              </div>
            ))}
            <div className="bg-emerald-50 dark:bg-emerald-950/30 rounded-xl p-3 border border-emerald-100 dark:border-emerald-900/40">
              <p className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">Total</p>
              <p className="font-bold text-emerald-700 dark:text-emerald-300 flex items-center gap-1 mt-0.5 text-sm">
                <CircleDollarSign size={13} />
                S/ {Number(servicioSeleccionado?.precioRegular || servicioSeleccionado?.precio || 0).toFixed(2)}
              </p>
            </div>
          </div>
          <div className="mt-4 flex items-start gap-2 bg-amber-50 dark:bg-amber-950/20 rounded-xl p-3 border border-amber-100 dark:border-amber-900/30">
            <AlertTriangle size={15} className="text-amber-500 shrink-0 mt-0.5" />
            <p className="text-xs text-amber-700 dark:text-amber-400">
              <span className="font-bold">Política de cancelación:</span> Las citas deben cancelarse con al menos 24 horas de anticipación.
            </p>
          </div>
        </div>
      )}

      {/* Error */}
      {error && (
        <div className="bg-rose-50 dark:bg-rose-950/20 border border-rose-200 dark:border-rose-900/30 rounded-xl p-4 flex items-center gap-3">
          <AlertTriangle size={17} className="text-rose-500 shrink-0" />
          <p className="text-sm text-rose-700 dark:text-rose-400 font-semibold">{error}</p>
        </div>
      )}

      {/* Botones de navegación */}
      <div className="flex justify-between items-center pb-2">
        <button
          onClick={() => setPasoActual((p) => Math.max(1, p - 1))}
          disabled={pasoActual === 1}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold text-slate-500 dark:text-slate-400 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all disabled:opacity-30 disabled:cursor-not-allowed"
        >
          <ChevronLeft size={16} /> Anterior
        </button>

        {pasoActual < 4 ? (
          <button
            onClick={() => setPasoActual((p) => Math.min(4, p + 1))}
            disabled={!puedeAvanzar()}
            className="flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-bold text-white bg-sky-500 hover:bg-sky-600 transition-all shadow-lg shadow-sky-500/20 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            Siguiente <ChevronRight size={16} />
          </button>
        ) : (
          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => enviarCita('CLINICA')}
              disabled={!puedeAvanzar() || enviando}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition-all disabled:opacity-40 disabled:cursor-not-allowed border border-slate-200 dark:border-slate-700"
            >
              {enviando && metodoPago === 'CLINICA' ? (
                <CargadorSpinner size="xs" color="border-slate-700 dark:border-slate-300" />
              ) : (
                <CalendarClock size={16} />
              )}
              {enviando && metodoPago === 'CLINICA' ? 'Agendando...' : 'Reservar y pagar en clínica'}
            </button>
            <button
              onClick={() => enviarCita('PAGO_EFECTIVO')}
              disabled={!puedeAvanzar() || enviando}
              className="flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-bold text-slate-900 bg-[#F7C600] hover:bg-[#e0b400] transition-all shadow-lg shadow-yellow-500/10 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              {enviando && metodoPago === 'PAGO_EFECTIVO' ? (
                <CargadorSpinner size="xs" color="border-slate-900" />
              ) : (
                <CircleDollarSign size={16} />
              )}
              {enviando && metodoPago === 'PAGO_EFECTIVO' ? 'Generando CIP...' : 'Pagar con PagoEfectivo'}
            </button>
            <button
              onClick={() => enviarCita('MERCADO_PAGO')}
              disabled={!puedeAvanzar() || enviando}
              className="flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-bold text-white bg-[#009EE3] hover:bg-[#0081bb] transition-all shadow-lg shadow-sky-500/20 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              {enviando && metodoPago === 'MERCADO_PAGO' ? (
                <CargadorSpinner size="xs" color="border-white" />
              ) : (
                <CreditCard size={16} />
              )}
              {enviando && metodoPago === 'MERCADO_PAGO' ? 'Procesando pago...' : 'Pagar en línea con Mercado Pago'}
            </button>
          </div>
        )}
      </div>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(8px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn { animation: fadeIn 0.3s ease-out forwards; }
      `}</style>
    </div>
  );
};

export default ClienteAgendarCita;
