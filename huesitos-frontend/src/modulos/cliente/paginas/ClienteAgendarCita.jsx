import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  PawPrint, Stethoscope, UserRound, CalendarClock,
  ChevronRight, ChevronLeft, Check, AlertTriangle,
  Clock, CircleDollarSign, Loader2,
} from 'lucide-react';
import { obtenerMascotasPorDueno } from '../../../api/clienteApi';
import {
  agendarCita,
  obtenerCitasPorDia,
  obtenerServiciosActivos,
  obtenerUsuarios,
  obtenerHorariosVeterinario,
} from '../../../api/citaApi';

const PASOS = [
  { num: 1, label: 'Mascota', icono: PawPrint },
  { num: 2, label: 'Servicio', icono: Stethoscope },
  { num: 3, label: 'Profesional', icono: UserRound },
  { num: 4, label: 'Horario', icono: CalendarClock },
];

const HORARIOS_BASE = [
  '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
  '12:00', '14:00', '14:30', '15:00', '15:30',
  '16:00', '16:30', '17:00', '17:30',
];

const ClienteAgendarCita = () => {
  const navigate = useNavigate();
  const [pasoActual, setPasoActual] = useState(1);

  // Datos cargados
  const [mascotas, setMascotas] = useState([]);
  const [servicios, setServicios] = useState([]);
  const [veterinarios, setVeterinarios] = useState([]);
  const [citasDelDia, setCitasDelDia] = useState([]);
  const [horariosVet, setHorariosVet] = useState([]);

  // Selecciones del usuario
  const [mascotaSeleccionada, setMascotaSeleccionada] = useState(null);
  const [servicioSeleccionado, setServicioSeleccionado] = useState(null);
  const [veterinarioSeleccionado, setVeterinarioSeleccionado] = useState(null);
  const [fechaSeleccionada, setFechaSeleccionada] = useState('');
  const [horaSeleccionada, setHoraSeleccionada] = useState('');

  // UI
  const [cargando, setCargando] = useState(true);
  const [enviando, setEnviando] = useState(false);
  const [error, setError] = useState('');
  const [exito, setExito] = useState(false);

  // Cargar mascotas y servicios al montar
  useEffect(() => {
    const cargar = async () => {
      setCargando(true);
      try {
        const duenoId = localStorage.getItem('duenoId');
        const [mascotasRes, serviciosRes] = await Promise.allSettled([
          duenoId ? obtenerMascotasPorDueno(duenoId) : Promise.resolve([]),
          obtenerServiciosActivos(),
        ]);
        setMascotas(mascotasRes.status === 'fulfilled' ? mascotasRes.value : []);
        const serviciosActivos = serviciosRes.status === 'fulfilled' ? serviciosRes.value : [];
        setServicios(serviciosActivos.filter((s) => s.activo !== false));
      } catch (err) {
        console.error('Error cargando datos:', err);
      } finally {
        setCargando(false);
      }
    };
    cargar();
  }, []);

  // Cargar veterinarios al avanzar al paso 3
  useEffect(() => {
    if (pasoActual === 3 && veterinarios.length === 0) {
      const cargarVets = async () => {
        try {
          const usuarios = await obtenerUsuarios();
          const vets = usuarios.filter((u) => u.rol === 'VETERINARIO' && u.activo !== false);
          setVeterinarios(vets);
        } catch (err) {
          // Si no tiene permisos de admin, permitir sin selección de vet
          setVeterinarios([]);
        }
      };
      cargarVets();
    }
  }, [pasoActual, veterinarios.length]);

  // Cargar horarios del veterinario seleccionado
  useEffect(() => {
    if (veterinarioSeleccionado) {
      const cargarHorarios = async () => {
        try {
          const horarios = await obtenerHorariosVeterinario(veterinarioSeleccionado.id);
          setHorariosVet(horarios);
        } catch {
          setHorariosVet([]);
        }
      };
      cargarHorarios();
    }
  }, [veterinarioSeleccionado]);

  // Cargar citas del día seleccionado
  const cargarDisponibilidad = useCallback(async (fecha) => {
    if (!fecha) return;
    try {
      const citas = await obtenerCitasPorDia(fecha);
      setCitasDelDia(citas);
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

  // Horarios disponibles filtrados
  const horariosDisponibles = HORARIOS_BASE.filter((hora) => {
    // Filtrar horas ocupadas del veterinario
    if (veterinarioSeleccionado && citasDelDia.length > 0) {
      const ocupado = citasDelDia.some((c) => {
        if (c.veterinario?.id !== veterinarioSeleccionado.id) return false;
        if (c.estado === 'CANCELADA') return false;
        const horaCita = c.fechaHora ? c.fechaHora.substring(11, 16) : '';
        return horaCita === hora;
      });
      if (ocupado) return false;
    }

    // Filtrar por fechas bloqueadas (excepciones/vacaciones)
    if (veterinarioSeleccionado && fechaSeleccionada) {
      const blockedData = localStorage.getItem(`excepciones_horario_${veterinarioSeleccionado.id}`);
      if (blockedData) {
        const list = JSON.parse(blockedData);
        if (list.some((ex) => ex.fecha === fechaSeleccionada)) {
          return false;
        }
      }
    }

    // Filtrar por horario laboral del veterinario
    if (horariosVet.length > 0 && fechaSeleccionada) {
      const diaSemana = new Date(fechaSeleccionada + 'T12:00:00').getDay();
      const diaMap = { 0: 7, 1: 1, 2: 2, 3: 3, 4: 4, 5: 5, 6: 6 };
      const horarioDia = horariosVet.find((h) => h.diaSemana === diaMap[diaSemana] && h.activo);
      if (!horarioDia) return false;
      if (hora < horarioDia.horaEntrada || hora >= horarioDia.horaSalida) return false;
    }

    return true;
  });

  // Fecha mínima: mañana
  const fechaMinima = (() => {
    const manana = new Date();
    manana.setDate(manana.getDate() + 1);
    return manana.toISOString().split('T')[0];
  })();

  // Validar paso actual
  const puedeAvanzar = () => {
    if (pasoActual === 1) return mascotaSeleccionada !== null;
    if (pasoActual === 2) return servicioSeleccionado !== null;
    if (pasoActual === 3) return true; // Veterinario es opcional
    if (pasoActual === 4) return fechaSeleccionada && horaSeleccionada;
    return false;
  };

  // Enviar cita
  const enviarCita = async () => {
    setEnviando(true);
    setError('');
    try {
      const fechaHora = `${fechaSeleccionada}T${horaSeleccionada}:00`;
      const payload = {
        mascota: { id: mascotaSeleccionada.id },
        servicio: { id: servicioSeleccionado.id },
        fechaHora,
      };
      if (veterinarioSeleccionado) {
        payload.veterinario = { id: veterinarioSeleccionado.id };
      }
      await agendarCita(payload);
      setExito(true);
    } catch (err) {
      const msg = err.response?.data || 'Error al agendar la cita. Intenta de nuevo.';
      setError(typeof msg === 'string' ? msg : JSON.stringify(msg));
    } finally {
      setEnviando(false);
    }
  };

  // Pantalla de éxito
  if (exito) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="bg-white rounded-2xl border border-slate-200/60 p-10 text-center shadow-lg max-w-md animate-fadeIn">
          <div className="w-16 h-16 bg-emerald-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Check size={32} className="text-emerald-500" />
          </div>
          <h2 className="text-2xl font-bold text-slate-800 mb-2">¡Cita agendada!</h2>
          <p className="text-sm text-slate-500 mb-1">Tu cita ha sido registrada exitosamente.</p>
          <p className="text-sm text-slate-400 mb-6">Recibirás una confirmación una vez procesado el pago.</p>
          <div className="bg-slate-50 rounded-xl p-4 mb-6 text-left space-y-1.5">
            <p className="text-xs text-slate-500"><span className="font-semibold">Mascota:</span> {mascotaSeleccionada?.nombre}</p>
            <p className="text-xs text-slate-500"><span className="font-semibold">Servicio:</span> {servicioSeleccionado?.nombre}</p>
            {veterinarioSeleccionado && (
              <p className="text-xs text-slate-500"><span className="font-semibold">Veterinario:</span> {veterinarioSeleccionado.correo}</p>
            )}
            <p className="text-xs text-slate-500"><span className="font-semibold">Fecha:</span> {new Date(fechaSeleccionada + 'T12:00:00').toLocaleDateString('es-PE', { weekday: 'long', day: '2-digit', month: 'long', year: 'numeric' })}</p>
            <p className="text-xs text-slate-500"><span className="font-semibold">Hora:</span> {horaSeleccionada}</p>
          </div>
          <button
            onClick={() => navigate('/cliente')}
            className="w-full px-6 py-3 bg-sky-500 text-white font-semibold rounded-xl hover:bg-sky-600 transition-colors shadow-lg shadow-sky-500/20"
          >
            Volver al panel
          </button>
        </div>
      </div>
    );
  }

  if (cargando) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-sky-500 border-t-transparent rounded-full animate-spin" />
          <span className="text-sm font-semibold text-slate-400">Cargando formulario...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      {/* ─── STEPPER ─── */}
      <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-200/60">
        <div className="flex items-center justify-between">
          {PASOS.map((paso, i) => {
            const Icono = paso.icono;
            const esActivo = pasoActual === paso.num;
            const esCompletado = pasoActual > paso.num;
            return (
              <div key={paso.num} className="flex items-center flex-1">
                <div className="flex flex-col items-center flex-1">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-300 ${
                    esActivo ? 'bg-sky-500 text-white shadow-lg shadow-sky-500/30 scale-110' :
                    esCompletado ? 'bg-emerald-100 text-emerald-600' :
                    'bg-slate-100 text-slate-400'
                  }`}>
                    {esCompletado ? <Check size={18} /> : <Icono size={18} />}
                  </div>
                  <span className={`text-[10px] sm:text-xs font-semibold mt-1.5 transition-colors ${
                    esActivo ? 'text-sky-600' : esCompletado ? 'text-emerald-600' : 'text-slate-400'
                  }`}>
                    {paso.label}
                  </span>
                </div>
                {i < PASOS.length - 1 && (
                  <div className={`h-0.5 w-full mx-2 rounded transition-colors duration-300 ${
                    pasoActual > paso.num ? 'bg-emerald-300' : 'bg-slate-200'
                  }`} />
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* ─── CONTENIDO DEL PASO ─── */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200/60 min-h-[340px]">

        {/* PASO 1: Mascota */}
        {pasoActual === 1 && (
          <div className="animate-fadeIn">
            <h3 className="text-lg font-bold text-slate-800 mb-1">Selecciona tu mascota</h3>
            <p className="text-sm text-slate-400 mb-5">¿Para quién es la cita?</p>
            {mascotas.length === 0 ? (
              <div className="text-center py-10">
                <PawPrint size={40} className="text-slate-300 mx-auto mb-3" />
                <p className="text-slate-500 font-medium">No tienes mascotas registradas</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {mascotas.map((m) => (
                  <button
                    key={m.id}
                    onClick={() => setMascotaSeleccionada(m)}
                    className={`flex items-center gap-3 p-4 rounded-xl border-2 transition-all duration-200 text-left ${
                      mascotaSeleccionada?.id === m.id
                        ? 'border-sky-500 bg-sky-50 shadow-md shadow-sky-500/10'
                        : 'border-slate-200 hover:border-sky-300 hover:bg-slate-50'
                    }`}
                  >
                    <div className="w-11 h-11 rounded-xl bg-gradient-to-tr from-sky-500 to-cyan-400 flex items-center justify-center text-white font-bold shadow-sm shrink-0">
                      {m.nombre?.charAt(0).toUpperCase() || '🐾'}
                    </div>
                    <div>
                      <p className="font-bold text-slate-800 text-sm">{m.nombre}</p>
                      <p className="text-xs text-slate-400">{m.especie}{m.raza ? ` · ${m.raza}` : ''}</p>
                    </div>
                    {mascotaSeleccionada?.id === m.id && (
                      <Check size={18} className="text-sky-500 ml-auto" />
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>
        )}

        {/* PASO 2: Servicio */}
        {pasoActual === 2 && (
          <div className="animate-fadeIn">
            <h3 className="text-lg font-bold text-slate-800 mb-1">Elige el servicio</h3>
            <p className="text-sm text-slate-400 mb-5">¿Qué tipo de atención necesita {mascotaSeleccionada?.nombre}?</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-[350px] overflow-y-auto pr-1">
              {servicios.map((s) => (
                <button
                  key={s.id}
                  onClick={() => setServicioSeleccionado(s)}
                  className={`flex items-center gap-3 p-4 rounded-xl border-2 transition-all duration-200 text-left ${
                    servicioSeleccionado?.id === s.id
                      ? 'border-sky-500 bg-sky-50 shadow-md shadow-sky-500/10'
                      : 'border-slate-200 hover:border-sky-300 hover:bg-slate-50'
                  }`}
                >
                  <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center shrink-0">
                    <Stethoscope size={18} className="text-emerald-500" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-slate-800 text-sm truncate">{s.nombre}</p>
                    {s.descripcion && <p className="text-[11px] text-slate-400 truncate">{s.descripcion}</p>}
                  </div>
                  <div className="text-right shrink-0">
                    <p className="text-sm font-bold text-emerald-600">S/ {Number(s.precioRegular || s.precio || 0).toFixed(2)}</p>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* PASO 3: Veterinario (Opcional) */}
        {pasoActual === 3 && (
          <div className="animate-fadeIn">
            <h3 className="text-lg font-bold text-slate-800 mb-1">Selecciona un profesional</h3>
            <p className="text-sm text-slate-400 mb-5">Opcional — puedes dejar que la recepcionista asigne uno</p>

            <button
              onClick={() => setVeterinarioSeleccionado(null)}
              className={`w-full flex items-center gap-3 p-4 rounded-xl border-2 transition-all duration-200 text-left mb-3 ${
                veterinarioSeleccionado === null
                  ? 'border-sky-500 bg-sky-50 shadow-md shadow-sky-500/10'
                  : 'border-slate-200 hover:border-sky-300 hover:bg-slate-50'
              }`}
            >
              <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center shrink-0">
                <UserRound size={18} className="text-slate-400" />
              </div>
              <div>
                <p className="font-bold text-slate-800 text-sm">Sin preferencia</p>
                <p className="text-[11px] text-slate-400">La clínica asignará al profesional disponible</p>
              </div>
              {veterinarioSeleccionado === null && <Check size={18} className="text-sky-500 ml-auto" />}
            </button>

            {veterinarios.length > 0 && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {veterinarios.map((v) => (
                  <button
                    key={v.id}
                    onClick={() => setVeterinarioSeleccionado(v)}
                    className={`flex items-center gap-3 p-4 rounded-xl border-2 transition-all duration-200 text-left ${
                      veterinarioSeleccionado?.id === v.id
                        ? 'border-sky-500 bg-sky-50 shadow-md shadow-sky-500/10'
                        : 'border-slate-200 hover:border-sky-300 hover:bg-slate-50'
                    }`}
                  >
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-violet-500 to-purple-400 flex items-center justify-center text-white font-bold text-sm shadow-sm shrink-0">
                      {v.correo?.charAt(0).toUpperCase() || 'V'}
                    </div>
                    <div className="min-w-0">
                      <p className="font-bold text-slate-800 text-sm truncate">{v.nombre || v.correo}</p>
                      <p className="text-[11px] text-slate-400">Veterinario</p>
                    </div>
                    {veterinarioSeleccionado?.id === v.id && <Check size={18} className="text-sky-500 ml-auto" />}
                  </button>
                ))}
              </div>
            )}

            {veterinarios.length === 0 && (
              <p className="text-xs text-slate-400 text-center mt-4">No se pudieron cargar los veterinarios. La clínica asignará uno.</p>
            )}
          </div>
        )}

        {/* PASO 4: Fecha y Hora */}
        {pasoActual === 4 && (
          <div className="animate-fadeIn">
            <h3 className="text-lg font-bold text-slate-800 mb-1">Elige fecha y hora</h3>
            <p className="text-sm text-slate-400 mb-5">Selecciona el día y horario de tu cita</p>

            {/* Selector de fecha */}
            <div className="mb-5">
              <label className="text-xs font-semibold text-slate-600 tracking-wide mb-2 block">Fecha</label>
              <input
                type="date"
                value={fechaSeleccionada}
                min={fechaMinima}
                onChange={(e) => setFechaSeleccionada(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm text-slate-700 focus:border-sky-400 focus:ring-2 focus:ring-sky-100 outline-none transition-all"
              />
            </div>

            {/* Grid de horarios */}
            {fechaSeleccionada && (
              <div>
                <label className="text-xs font-semibold text-slate-600 tracking-wide mb-2 block">
                  Horarios disponibles
                </label>
                {horariosDisponibles.length === 0 ? (
                  <div className="text-center py-8 bg-slate-50 rounded-xl border border-slate-200">
                    <Clock size={28} className="text-slate-300 mx-auto mb-2" />
                    <p className="text-sm text-slate-500 font-medium">No hay horarios disponibles para esta fecha</p>
                    <p className="text-xs text-slate-400 mt-1">Intenta con otro día o profesional</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
                    {horariosDisponibles.map((hora) => (
                      <button
                        key={hora}
                        onClick={() => setHoraSeleccionada(hora)}
                        className={`py-2.5 px-3 rounded-xl text-sm font-semibold transition-all duration-200 ${
                          horaSeleccionada === hora
                            ? 'bg-sky-500 text-white shadow-lg shadow-sky-500/20 scale-105'
                            : 'bg-slate-50 text-slate-600 border border-slate-200 hover:border-sky-300 hover:bg-sky-50'
                        }`}
                      >
                        {hora}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>

      {/* ─── RESUMEN + CONTROLES ─── */}
      {pasoActual === 4 && fechaSeleccionada && horaSeleccionada && (
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-200/60 animate-fadeIn">
          <h4 className="text-sm font-semibold text-slate-700 mb-3 tracking-wide">Resumen de tu cita</h4>
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div className="bg-slate-50 rounded-xl p-3">
              <p className="text-[10px] font-semibold text-slate-500">Mascota</p>
              <p className="font-bold text-slate-700">{mascotaSeleccionada?.nombre}</p>
            </div>
            <div className="bg-slate-50 rounded-xl p-3">
              <p className="text-[10px] font-semibold text-slate-500">Servicio</p>
              <p className="font-bold text-slate-700">{servicioSeleccionado?.nombre}</p>
            </div>
            <div className="bg-slate-50 rounded-xl p-3">
              <p className="text-[10px] font-semibold text-slate-500">Fecha y hora</p>
              <p className="font-bold text-slate-700">
                {new Date(fechaSeleccionada + 'T12:00:00').toLocaleDateString('es-PE', { day: '2-digit', month: 'short' })} — {horaSeleccionada}
              </p>
            </div>
            <div className="bg-emerald-50 rounded-xl p-3 border border-emerald-100">
              <p className="text-[10px] font-semibold text-emerald-600">Total</p>
              <p className="font-bold text-emerald-700 flex items-center gap-1">
                <CircleDollarSign size={14} className="text-emerald-500" /> S/ {Number(servicioSeleccionado?.precioRegular || servicioSeleccionado?.precio || 0).toFixed(2)}
              </p>
            </div>
          </div>
          {/* Advertencia de cancelación */}
          <div className="mt-4 flex items-start gap-2 bg-amber-50 rounded-xl p-3 border border-amber-100">
            <AlertTriangle size={16} className="text-amber-500 shrink-0 mt-0.5" />
            <p className="text-xs text-amber-700">
              <span className="font-semibold">Política de cancelación:</span> Las citas deben cancelarse con al menos 24 horas de anticipación.
            </p>
          </div>
        </div>
      )}

      {/* ─── ERROR ─── */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-center gap-3 animate-fadeIn">
          <AlertTriangle size={18} className="text-red-500 shrink-0" />
          <p className="text-sm text-red-700 font-medium">{error}</p>
        </div>
      )}

      {/* ─── BOTONES DE NAVEGACIÓN ─── */}
      <div className="flex justify-between items-center">
        <button
          onClick={() => setPasoActual((p) => Math.max(1, p - 1))}
          disabled={pasoActual === 1}
          className="flex items-center gap-2 px-5 py-3 rounded-xl text-sm font-bold text-slate-500 bg-white border border-slate-200 hover:bg-slate-50 transition-all disabled:opacity-30 disabled:cursor-not-allowed"
        >
          <ChevronLeft size={16} /> Anterior
        </button>

        {pasoActual < 4 ? (
          <button
            onClick={() => setPasoActual((p) => Math.min(4, p + 1))}
            disabled={!puedeAvanzar()}
            className="flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-bold text-white bg-sky-500 hover:bg-sky-600 transition-all shadow-lg shadow-sky-500/20 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            Siguiente <ChevronRight size={16} />
          </button>
        ) : (
          <button
            onClick={enviarCita}
            disabled={!puedeAvanzar() || enviando}
            className="flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-bold text-white bg-emerald-500 hover:bg-emerald-600 transition-all shadow-lg shadow-emerald-500/20 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {enviando ? <Loader2 size={16} className="animate-spin" /> : <Check size={16} />}
            {enviando ? 'Agendando...' : 'Confirmar Cita'}
          </button>
        )}
      </div>

      {/* Animación */}
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(8px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out forwards;
        }
      `}</style>
    </div>
  );
};

export default ClienteAgendarCita;
