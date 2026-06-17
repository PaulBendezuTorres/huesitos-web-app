import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Check, AlertTriangle, ChevronRight, ChevronLeft,
  CircleDollarSign, CalendarClock,
} from 'lucide-react';
import CargadorSpinner from '@/componentes/comun/CargadorSpinner';
import StepperCita from '@/componentes/cita/StepperCita';
import PasadorMascota from '@/componentes/cita/PasadorMascota';
import PasadorServicio from '@/componentes/cita/PasadorServicio';
import PasadorVeterinario from '@/componentes/cita/PasadorVeterinario';
import PasadorHorario from '@/componentes/cita/PasadorHorario';
import { obtenerMascotasPorDueno } from '@/api/clienteApi';
import {
  agendarCita,
  obtenerCitasPorDia,
  obtenerServiciosActivos,
  obtenerUsuarios,
  obtenerHorariosVeterinario,
} from '@/api/citaApi';

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
        const srv = serviciosRes.status === 'fulfilled' ? serviciosRes.value : [];
        setServicios(srv.filter((s) => s.activo !== false));
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
      obtenerUsuarios()
        .then((usuarios) => setVeterinarios(usuarios.filter((u) => u.rol === 'VETERINARIO' && u.activo !== false)))
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

  const enviarCita = async () => {
    setEnviando(true);
    setError('');
    try {
      const payload = {
        mascota: { id: mascotaSeleccionada.id },
        servicio: { id: servicioSeleccionado.id },
        fechaHora: `${fechaSeleccionada}T${horaSeleccionada}:00`,
      };
      if (veterinarioSeleccionado) payload.veterinario = { id: veterinarioSeleccionado.id };
      await agendarCita(payload);
      setExito(true);
    } catch (err) {
      const msg = err.response?.data || 'Error al agendar la cita. Intenta de nuevo.';
      setError(typeof msg === 'string' ? msg : JSON.stringify(msg));
    } finally {
      setEnviando(false);
    }
  };

  // ── Pantalla de éxito ──
  if (exito) {
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
          <button
            onClick={enviarCita}
            disabled={!puedeAvanzar() || enviando}
            className="flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-bold text-white bg-emerald-500 hover:bg-emerald-600 transition-all shadow-lg shadow-emerald-500/20 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {enviando ? <CargadorSpinner size="xs" color="border-white" /> : <CalendarClock size={16} />}
            {enviando ? 'Agendando...' : 'Confirmar cita'}
          </button>
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
