import { useState, useEffect } from 'react';
import { X, User, Clock, AlertTriangle, Check } from 'lucide-react';
import { reprogramarCita, obtenerCitasPorDia, obtenerHorariosVeterinario } from '@/api/citaApi';
import CargadorSpinner from '@/componentes/comun/CargadorSpinner';

const HORARIOS_BASE = [
  '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
  '12:00', '14:00', '14:30', '15:00', '15:30',
  '16:00', '16:30', '17:00', '17:30',
];

const ModalReprogramarCita = ({ isOpen, onClose, cita, onReprogramada }) => {
  const [fechaReprogramar, setFechaReprogramar] = useState('');
  const [horaReprogramar, setHoraReprogramar] = useState('');
  const [cargandoSlots, setCargandoSlots] = useState(false);
  const [citasDelDia, setCitasDelDia] = useState([]);
  const [horariosVet, setHorariosVet] = useState([]);
  const [guardandoReprogramacion, setGuardandoReprogramacion] = useState(false);
  const [errorReprogramar, setErrorReprogramar] = useState('');

  // Formatear fecha como YYYY-MM-DD
  const formatarFechaYMD = (date) => {
    const yyyy = date.getFullYear();
    const mm = String(date.getMonth() + 1).padStart(2, '0');
    const dd = String(date.getDate()).padStart(2, '0');
    return `${yyyy}-${mm}-${dd}`;
  };

  useEffect(() => {
    if (isOpen && cita) {
      if (cita.fechaHora) {
        setFechaReprogramar(cita.fechaHora.substring(0, 10));
        setHoraReprogramar(cita.fechaHora.substring(11, 16));
      } else {
        setFechaReprogramar('');
        setHoraReprogramar('');
      }
      setErrorReprogramar('');
    }
  }, [isOpen, cita]);

  // Cargar disponibilidad para reprogramación cuando cambia la fecha
  useEffect(() => {
    if (fechaReprogramar && cita) {
      const cargarDisponibilidad = async () => {
        setCargandoSlots(true);
        setErrorReprogramar('');
        try {
          const promesas = [obtenerCitasPorDia(fechaReprogramar)];
          if (cita.veterinario?.id) {
            promesas.push(obtenerHorariosVeterinario(cita.veterinario.id));
          }
          const [citasRes, horariosRes] = await Promise.allSettled(promesas);
          
          setCitasDelDia(citasRes.status === 'fulfilled' ? citasRes.value : []);
          setHorariosVet(horariosRes && horariosRes.status === 'fulfilled' ? horariosRes.value : []);
        } catch (err) {
          console.error("Error al cargar disponibilidad:", err);
          setErrorReprogramar('No se pudo verificar la disponibilidad del horario.');
        } finally {
          setCargandoSlots(false);
        }
      };
      cargarDisponibilidad();
      // No reiniciamos hora inmediatamente si coincide con la fecha inicial
      if (cita.fechaHora && cita.fechaHora.substring(0, 10) !== fechaReprogramar) {
        setHoraReprogramar('');
      }
    }
  }, [fechaReprogramar, cita]);

  // Filtrar los horarios de reprogramación disponibles
  const slotsDisponibles = HORARIOS_BASE.filter((hora) => {
    if (cita?.veterinario?.id && citasDelDia.length > 0) {
      const ocupado = citasDelDia.some((c) => {
        if (c.id === cita.id) return false; // Permitir el mismo slot de la cita actual
        if (c.veterinario?.id !== cita.veterinario.id) return false;
        if (c.estado === 'CANCELADA') return false;
        const horaCita = c.fechaHora ? c.fechaHora.substring(11, 16) : '';
        return horaCita === hora;
      });
      if (ocupado) return false;
    }

    // Filtrar por fechas bloqueadas (excepciones/vacaciones)
    if (cita?.veterinario?.id && fechaReprogramar) {
      const blockedData = localStorage.getItem(`excepciones_horario_${cita.veterinario.id}`);
      if (blockedData) {
        const list = JSON.parse(blockedData);
        if (list.some((ex) => ex.fecha === fechaReprogramar)) {
          return false;
        }
      }
    }

    if (horariosVet.length > 0 && fechaReprogramar) {
      const diaSemana = new Date(fechaReprogramar + 'T12:00:00').getDay();
      const diaMap = { 0: 7, 1: 1, 2: 2, 3: 3, 4: 4, 5: 5, 6: 6 };
      const horarioDia = horariosVet.find((h) => h.diaSemana === diaMap[diaSemana] && h.activo);
      if (!horarioDia) return false;
      if (hora < horarioDia.horaEntrada || hora >= horarioDia.horaSalida) return false;
    }

    return true;
  });

  const handleReprogramarSubmit = async (e) => {
    e.preventDefault();
    if (!fechaReprogramar || !horaReprogramar) {
      setErrorReprogramar('Por favor selecciona una fecha y hora válidas.');
      return;
    }

    setGuardandoReprogramacion(true);
    setErrorReprogramar('');
    try {
      const nuevaFechaHora = `${fechaReprogramar}T${horaReprogramar}:00`;
      await reprogramarCita(cita.id, nuevaFechaHora);
      alert('La cita ha sido reprogramada con éxito.');
      onReprogramada();
      onClose();
    } catch (err) {
      const msg = err.response?.data || 'Error al reprogramar la cita.';
      setErrorReprogramar(typeof msg === 'string' ? msg : JSON.stringify(msg));
    } finally {
      setGuardandoReprogramacion(false);
    }
  };

  if (!isOpen || !cita) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="bg-white dark:bg-slate-800 rounded-3xl max-w-md w-full border border-slate-200/60 dark:border-slate-700/60 shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
        {/* Header Modal */}
        <div className="px-6 py-5 border-b border-slate-100 dark:border-slate-700/60 flex justify-between items-center bg-slate-50/50 dark:bg-slate-900/40">
          <div>
            <h3 className="font-black text-slate-800 dark:text-slate-100 text-base tracking-tight">Reprogramar Cita</h3>
            <p className="text-[10px] text-slate-400 dark:text-slate-500 mt-0.5 font-bold uppercase tracking-wider">Identificador: #{cita.id}</p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-slate-200/60 dark:hover:bg-slate-700/60 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 transition-colors"
            disabled={guardandoReprogramacion}
          >
            <X size={20} />
          </button>
        </div>

        {/* Contenido/Formulario */}
        <form onSubmit={handleReprogramarSubmit} className="p-6 space-y-5">
          {/* Resumen cita */}
          <div className="bg-slate-50 dark:bg-slate-900/40 rounded-2xl p-4 border border-slate-100 dark:border-slate-700/60 space-y-3">
            <div className="flex justify-between items-start">
              <div>
                <span className="text-[9px] font-black text-sky-500 uppercase tracking-widest block mb-0.5">Paciente</span>
                <h4 className="font-bold text-slate-800 dark:text-slate-100 text-sm tracking-tight">{cita.mascota?.nombre}</h4>
                <p className="text-[10px] text-slate-400 dark:text-slate-500 font-semibold">{cita.mascota?.dueño?.nombreCompleto || 'Propietario'}</p>
              </div>
              <div className="text-right">
                <span className="text-[9px] font-black text-emerald-500 uppercase tracking-widest block mb-0.5">Servicio</span>
                <p className="font-bold text-slate-800 dark:text-slate-100 text-xs truncate max-w-[120px]">{cita.servicio?.nombre}</p>
              </div>
            </div>

            <div className="pt-2.5 border-t border-slate-200/60 dark:border-slate-700/60 flex justify-between text-[10px] text-slate-500 dark:text-slate-400">
              <span className="flex items-center gap-1 font-bold">
                <User size={12} className="text-slate-400" />
                Vet: {cita.veterinario ? (cita.veterinario.nombre || cita.veterinario.correo) : 'Sin asignar'}
              </span>
              <span className="flex items-center gap-1 font-bold">
                <Clock size={12} className="text-slate-400" />
                Actual: {cita.fechaHora ? new Date(cita.fechaHora).toLocaleString('es-PE', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' }) : ''}
              </span>
            </div>
          </div>

          {/* Selector de nueva Fecha */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-500 dark:text-slate-400 tracking-wide block uppercase">
              Nueva Fecha
            </label>
            <input
              type="date"
              value={fechaReprogramar}
              min={formatarFechaYMD(new Date())}
              onChange={(e) => setFechaReprogramar(e.target.value)}
              required
              className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-600 text-sm text-slate-800 dark:text-slate-100 bg-slate-50 dark:bg-slate-700 focus:bg-white dark:focus:bg-slate-650 focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 outline-none transition-all font-bold"
            />
          </div>

          {/* Selector de nueva Hora (Slots) */}
          {fechaReprogramar && (
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 dark:text-slate-400 tracking-wide block uppercase">
                Horarios Disponibles
              </label>
              
              {cargandoSlots ? (
                <div className="flex items-center justify-center py-6 bg-slate-50 dark:bg-slate-900/40 border border-slate-200/60 dark:border-slate-700/60 rounded-2xl gap-2">
                  <CargadorSpinner size="sm" />
                  <span className="text-xs font-semibold text-slate-400 dark:text-slate-500 animate-pulse">Verificando horarios...</span>
                </div>
              ) : slotsDisponibles.length === 0 ? (
                <div className="text-center py-6 bg-slate-50 dark:bg-slate-900/20 border border-slate-200/60 dark:border-slate-700/60 rounded-2xl">
                  <AlertTriangle size={20} className="text-amber-500 mx-auto mb-1.5" />
                  <p className="text-xs font-bold text-slate-600 dark:text-slate-400">Sin horarios disponibles</p>
                  <p className="text-[10px] text-slate-400 dark:text-slate-500">Intenta seleccionando otro día.</p>
                </div>
              ) : (
                <div className="grid grid-cols-4 gap-2 max-h-[140px] overflow-y-auto pr-1">
                  {slotsDisponibles.map((hora) => (
                    <button
                      key={hora}
                      type="button"
                      onClick={() => setHoraReprogramar(hora)}
                      className={`py-2 rounded-xl text-xs font-bold transition-all border ${
                        horaReprogramar === hora
                          ? 'bg-gradient-to-r from-sky-500 to-cyan-400 text-white border-transparent shadow-md shadow-sky-500/25 scale-105'
                          : 'bg-slate-50 dark:bg-slate-700 text-slate-600 dark:text-slate-350 border-slate-250 dark:border-slate-600 hover:border-sky-300 dark:hover:border-sky-500 hover:bg-sky-50 dark:hover:bg-sky-950/20'
                      }`}
                    >
                      {hora}
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Alertas de error del modal */}
          {errorReprogramar && (
            <div className="bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-900/50 rounded-xl p-3 flex items-start gap-2.5 text-[11px] text-red-700 dark:text-red-400 transition-all">
              <AlertTriangle size={16} className="text-red-500 dark:text-red-400 shrink-0 mt-0.5" />
              <p className="leading-relaxed font-semibold">{errorReprogramar}</p>
            </div>
          )}

          {/* Botones de acción */}
          <div className="pt-4 border-t border-slate-100 dark:border-slate-700 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              disabled={guardandoReprogramacion}
              className="px-5 py-2.5 rounded-xl text-xs font-bold text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700 border border-slate-300 dark:border-slate-600 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={guardandoReprogramacion || !fechaReprogramar || !horaReprogramar}
              className="px-6 py-2.5 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-sky-500 to-cyan-400 hover:from-sky-600 hover:to-cyan-500 transition-all shadow-lg shadow-sky-500/20 flex items-center justify-center gap-2 disabled:opacity-40"
            >
              {guardandoReprogramacion ? (
                <>
                  <CargadorSpinner size="xs" color="border-white" /> Reprogramando...
                </>
              ) : (
                <>
                  <Check size={14} /> Reprogramar cita
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ModalReprogramarCita;
