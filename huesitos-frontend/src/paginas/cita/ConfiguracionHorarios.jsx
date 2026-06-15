import { useState, useEffect } from 'react';
import {
  Clock,
  User,
  Save,
  Calendar,
  AlertTriangle,
  Plus,
  Trash2,
  CheckCircle,
  HelpCircle
} from 'lucide-react';
import CargadorSpinner from '@/componentes/comun/CargadorSpinner';
import { obtenerUsuarios, obtenerHorariosVeterinario, guardarHorarioPersonal } from '@/api/citaApi';
import ListaPersonalClinica from '@/componentes/cita/ListaPersonalClinica';


const DIAS_MAP = [
  { key: 'MONDAY', label: 'Lunes' },
  { key: 'TUESDAY', label: 'Martes' },
  { key: 'WEDNESDAY', label: 'Miércoles' },
  { key: 'THURSDAY', label: 'Jueves' },
  { key: 'FRIDAY', label: 'Viernes' },
  { key: 'SATURDAY', label: 'Sábado' },
  { key: 'SUNDAY', label: 'Domingo' }
];

const ConfiguracionHorarios = () => {
  // Personal
  const [personal, setPersonal] = useState([]);
  const [empleadoSeleccionado, setEmpleadoSeleccionado] = useState(null);
  const [cargandoPersonal, setCargandoPersonal] = useState(true);


  // Horario del empleado seleccionado
  const [horarios, setHorarios] = useState({});
  const [cargandoHorarios, setCargandoHorarios] = useState(false);
  const [guardando, setGuardando] = useState(false);
  const [mensajeExito, setMensajeExito] = useState('');
  const [mensajeError, setMensajeError] = useState('');

  // Excepciones / Feriados (Simulación local por empleado)
  const [excepciones, setExcepciones] = useState([]);
  const [nuevaExcepcion, setNuevaExcepcion] = useState('');
  const [descExcepcion, setDescExcepcion] = useState('');

  // Cargar lista de empleados (Veterinarios y Recepcionistas)
  useEffect(() => {
    const cargarPersonal = async () => {
      setCargandoPersonal(true);
      try {
        const usuarios = await obtenerUsuarios();
        const filtrados = usuarios.filter(
          (u) => (u.rol === 'VETERINARIO' || u.rol === 'RECEPCIONISTA') && u.activo !== false
        );
        setPersonal(filtrados);
      } catch (err) {
        console.error('Error al cargar personal:', err);
      } finally {
        setCargandoPersonal(false);
      }
    };
    cargarPersonal();
  }, []);

  // Cargar horario y excepciones del empleado seleccionado
  useEffect(() => {
    if (empleadoSeleccionado) {
      const cargarHorarioYExcepciones = async () => {
        setCargandoHorarios(true);
        setMensajeExito('');
        setMensajeError('');
        try {
          const data = await obtenerHorariosVeterinario(empleadoSeleccionado.id);
          
          // Mapear el array devuelto a un objeto indexado por diaSemana
          const mapaHorarios = {};
          DIAS_MAP.forEach((d) => {
            // Buscar si existe horario registrado para este día
            const registrado = data.find((h) => h.diaSemana === d.key);
            mapaHorarios[d.key] = registrado
              ? {
                  id: registrado.id,
                  activo: registrado.activo,
                  horaEntrada: registrado.horaEntrada ? registrado.horaEntrada.substring(0, 5) : '09:00',
                  horaSalida: registrado.horaSalida ? registrado.horaSalida.substring(0, 5) : '18:00',
                }
              : {
                  activo: d.key !== 'SUNDAY', // Domingo inactivo por defecto
                  horaEntrada: '09:00',
                  horaSalida: d.key === 'SATURDAY' ? '13:00' : '18:00',
                };
          });
          setHorarios(mapaHorarios);

          // Cargar excepciones desde localStorage
          const guardadas = localStorage.getItem(`excepciones_horario_${empleadoSeleccionado.id}`);
          setExcepciones(guardadas ? JSON.parse(guardadas) : []);
        } catch (err) {
          console.error('Error al cargar horarios:', err);
          setMensajeError('No se pudieron obtener los horarios de este empleado.');
        } finally {
          setCargandoHorarios(false);
        }
      };
      cargarHorarioYExcepciones();
    }
  }, [empleadoSeleccionado]);


  // Manejar cambio en los campos de horario de un día
  const handleHorarioChange = (dia, campo, valor) => {
    setHorarios((prev) => ({
      ...prev,
      [dia]: {
        ...prev[dia],
        [campo]: valor,
      },
    }));
  };

  // Guardar configuración completa semanal
  const handleGuardarSemana = async (e) => {
    e.preventDefault();
    setGuardando(true);
    setMensajeExito('');
    setMensajeError('');

    try {
      // Validaciones locales antes de enviar
      for (const d of DIAS_MAP) {
        const h = horarios[d.key];
        if (h.activo && (!h.horaEntrada || !h.horaSalida)) {
          throw new Error(`Debes especificar hora de entrada y salida para el día ${d.label}.`);
        }
        if (h.activo && h.horaEntrada >= h.horaSalida) {
          throw new Error(`La hora de entrada debe ser anterior a la salida para el día ${d.label}.`);
        }
      }

      // Enviar las peticiones de actualización al backend en paralelo
      const promesas = DIAS_MAP.map((d) => {
        const h = horarios[d.key];
        const payload = {
          diaSemana: d.key,
          activo: h.activo,
          horaEntrada: h.activo ? `${h.horaEntrada}:00` : null,
          horaSalida: h.activo ? `${h.horaSalida}:00` : null,
        };
        if (h.id) payload.id = h.id;

        return guardarHorarioPersonal(empleadoSeleccionado.id, payload);
      });

      await Promise.all(promesas);

      // Guardar excepciones en localStorage
      localStorage.setItem(`excepciones_horario_${empleadoSeleccionado.id}`, JSON.stringify(excepciones));

      setMensajeExito('Horario semanal de trabajo y excepciones guardados con éxito.');
      
      // Recargar datos actualizados
      const dataActualizada = await obtenerHorariosVeterinario(empleadoSeleccionado.id);
      const mapaHorarios = {};
      DIAS_MAP.forEach((d) => {
        const registrado = dataActualizada.find((h) => h.diaSemana === d.key);
        mapaHorarios[d.key] = registrado
          ? {
              id: registrado.id,
              activo: registrado.activo,
              horaEntrada: registrado.horaEntrada ? registrado.horaEntrada.substring(0, 5) : '09:00',
              horaSalida: registrado.horaSalida ? registrado.horaSalida.substring(0, 5) : '18:00',
            }
          : {
              activo: d.key !== 'SUNDAY',
              horaEntrada: '09:00',
              horaSalida: d.key === 'SATURDAY' ? '13:00' : '18:00',
            };
      });
      setHorarios(mapaHorarios);
    } catch (err) {
      console.error(err);
      setMensajeError(err.message || 'Error al guardar la configuración de horarios en el servidor.');
    } finally {
      setGuardando(false);
    }
  };

  // Agregar excepción (Bloqueo de fecha)
  const handleAddExcepcion = (e) => {
    e.preventDefault();
    if (!nuevaExcepcion) return;

    // Verificar si ya existe esa fecha
    if (excepciones.some((ex) => ex.fecha === nuevaExcepcion)) {
      alert('Esta fecha ya está bloqueada.');
      return;
    }

    const nueva = {
      fecha: nuevaExcepcion,
      descripcion: descExcepcion || 'Vacaciones / Feriado',
    };

    setExcepciones((prev) => [...prev, nueva].sort((a, b) => a.fecha.localeCompare(b.fecha)));
    setNuevaExcepcion('');
    setDescExcepcion('');
  };

  // Eliminar excepción
  const handleRemoveExcepcion = (fecha) => {
    setExcepciones((prev) => prev.filter((ex) => ex.fecha !== fecha));
  };

  return (
    <div className="flex flex-col md:flex-row gap-6 h-[calc(100vh-140px)] overflow-hidden">
      
      {/* PANEL IZQUIERDO: LISTADO DE PERSONAL (32%) */}
      <ListaPersonalClinica
        personal={personal}
        empleadoSeleccionado={empleadoSeleccionado}
        onSelectEmpleado={setEmpleadoSeleccionado}
        cargando={cargandoPersonal}
      />


      {/* PANEL DERECHO: FORMULARIO DE CONFIGURACIÓN (70%) */}
      <main className="flex-1 bg-white dark:bg-slate-800 rounded-2xl border border-slate-200/60 dark:border-slate-700/60 flex flex-col overflow-hidden shadow-sm">
        {empleadoSeleccionado ? (
          <>
            {/* Header del Empleado */}
            <div className="p-4 border-b border-slate-100 dark:border-slate-700 bg-slate-50/30 dark:bg-slate-900/40 flex justify-between items-center shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-sky-500 to-cyan-300 flex items-center justify-center text-white font-black text-base shadow-sm">
                  {empleadoSeleccionado.nombre?.charAt(0).toUpperCase() || empleadoSeleccionado.correo?.charAt(0).toUpperCase()}
                </div>
                <div>
                  <h3 className="font-black text-slate-800 dark:text-slate-100 text-sm tracking-tight leading-tight">
                    {empleadoSeleccionado.nombre || 'Empleado'}
                  </h3>
                  <p className="text-[10px] text-slate-400 dark:text-slate-500 font-bold uppercase mt-0.5">
                    {empleadoSeleccionado.rol} — {empleadoSeleccionado.correo}
                  </p>
                </div>
              </div>
              <span className="bg-emerald-100 text-emerald-800 border-emerald-200 text-[10px] font-extrabold px-2.5 py-0.5 rounded-full border">
                Activo
              </span>
            </div>

            {/* Contenido Configuración */}
            {cargandoHorarios ? (
              <div className="flex-1 flex flex-col items-center justify-center py-20 gap-3">
                <CargadorSpinner size="md" />
                <span className="text-xs font-bold text-slate-400 dark:text-slate-500">Cargando horario...</span>
              </div>
            ) : (
              <form onSubmit={handleGuardarSemana} className="flex-1 flex flex-col overflow-hidden">
                <div className="flex-1 overflow-y-auto p-6 space-y-6">
                  
                  {/* ALERTA MENSAJES */}
                  {mensajeExito && (
                    <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 flex items-center gap-3">
                      <CheckCircle size={18} className="text-emerald-500 shrink-0" />
                      <p className="text-xs text-emerald-700 font-semibold">{mensajeExito}</p>
                    </div>
                  )}
                  {mensajeError && (
                    <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-center gap-3">
                      <AlertTriangle size={18} className="text-red-500 shrink-0" />
                      <p className="text-xs text-red-700 font-semibold">{mensajeError}</p>
                    </div>
                  )}

                  {/* SECCIÓN 1: GRILLA SEMANAL */}
                  <div className="space-y-4">
                    <h4 className="text-xs font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest border-b dark:border-slate-700 pb-2 flex items-center gap-2">
                      <Clock size={14} className="text-sky-500" />
                      Jornada Laboral Semanal
                    </h4>
                    
                    <div className="divide-y divide-slate-100 dark:divide-slate-700 border border-slate-150 dark:border-slate-700 rounded-2xl overflow-hidden bg-white dark:bg-slate-800/50 shadow-sm">
                      {DIAS_MAP.map((d) => {
                        const h = horarios[d.key] || { activo: true, horaEntrada: '09:00', horaSalida: '18:00' };
                        return (
                          <div
                            key={d.key}
                            className={`flex flex-col sm:flex-row sm:items-center justify-between p-4 gap-4 transition-colors ${
                              h.activo ? 'bg-white dark:bg-slate-800/50' : 'bg-slate-50/50 dark:bg-slate-900/30'
                            }`}
                          >
                            <div className="flex items-center gap-4 min-w-[120px]">
                              {/* Switch Toggle */}
                              <label className="relative inline-flex items-center cursor-pointer">
                                <input
                                  type="checkbox"
                                  checked={h.activo}
                                  onChange={(e) => handleHorarioChange(d.key, 'activo', e.target.checked)}
                                  className="sr-only peer"
                                />
                                <div className="w-9 h-5 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-sky-500"></div>
                              </label>
                              <span className="text-xs font-black text-slate-700 dark:text-slate-200">{d.label}</span>
                            </div>

                            {h.activo ? (
                              <div className="flex items-center gap-3">
                                <div>
                                  <label className="block text-[9px] font-bold text-slate-400 dark:text-slate-500 uppercase mb-1">Entrada</label>
                                  <input
                                    type="time"
                                    value={h.horaEntrada}
                                    onChange={(e) => handleHorarioChange(d.key, 'horaEntrada', e.target.value)}
                                    required={h.activo}
                                    className="px-3 py-1.5 border border-slate-200 dark:border-slate-600 rounded-lg text-xs text-slate-800 dark:text-slate-100 outline-none focus:border-sky-400 transition-all font-semibold bg-transparent dark:bg-slate-700"
                                  />
                                </div>
                                <span className="text-slate-300 dark:text-slate-600 text-sm mt-4">—</span>
                                <div>
                                  <label className="block text-[9px] font-bold text-slate-400 dark:text-slate-500 uppercase mb-1">Salida</label>
                                  <input
                                    type="time"
                                    value={h.horaSalida}
                                    onChange={(e) => handleHorarioChange(d.key, 'horaSalida', e.target.value)}
                                    required={h.activo}
                                    className="px-3 py-1.5 border border-slate-200 dark:border-slate-600 rounded-lg text-xs text-slate-800 dark:text-slate-100 outline-none focus:border-sky-400 transition-all font-semibold bg-transparent dark:bg-slate-700"
                                  />
                                </div>
                              </div>
                            ) : (
                              <span className="text-slate-400 dark:text-slate-500 text-xs font-bold uppercase tracking-wider bg-slate-100 dark:bg-slate-700 px-3 py-1.5 rounded-lg border border-slate-200/50 dark:border-slate-600">
                                Día Libre / Inactivo
                              </span>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* SECCIÓN 2: EXCEPCIONES Y VACACIONES */}
                  <div className="space-y-4 pt-2">
                    <h4 className="text-xs font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest border-b dark:border-slate-700 pb-2 flex items-center gap-2">
                      <Calendar size={14} className="text-sky-500" />
                      Excepciones y Fechas Bloqueadas
                    </h4>
                    <p className="text-[11px] text-slate-400 dark:text-slate-500 font-bold leading-normal">
                      Bloquea fechas específicas (vacaciones, feriados o licencias) para evitar que se puedan reservar citas en esos días.
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {/* Formulario Agregar Bloqueo */}
                      <div className="bg-slate-50 dark:bg-slate-900/40 p-4 border border-slate-200/60 dark:border-slate-700 rounded-2xl space-y-3.5">
                        <h5 className="text-xs font-black text-slate-700 dark:text-slate-200">Agregar Bloqueo Temporal</h5>
                        
                        <div className="space-y-1">
                          <label className="block text-[9px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wide">Seleccionar Fecha</label>
                          <input
                            type="date"
                            value={nuevaExcepcion}
                            min={new Date().toISOString().split('T')[0]}
                            onChange={(e) => setNuevaExcepcion(e.target.value)}
                            className="w-full px-3 py-2 border border-slate-200 dark:border-slate-600 rounded-lg text-xs text-slate-800 dark:text-slate-100 outline-none focus:border-sky-400 transition-all font-semibold bg-white dark:bg-slate-700"
                          />
                        </div>

                        <div className="space-y-1">
                          <label className="block text-[9px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wide">Motivo / Descripción</label>
                          <input
                            type="text"
                            placeholder="Ej: Feriado Nacional, Licencia médica..."
                            value={descExcepcion}
                            onChange={(e) => setDescExcepcion(e.target.value)}
                            className="w-full px-3 py-2 border border-slate-200 dark:border-slate-600 rounded-lg text-xs text-slate-800 dark:text-slate-100 outline-none focus:border-sky-400 transition-all font-medium bg-white dark:bg-slate-700 placeholder:text-slate-400 dark:placeholder:text-slate-500"
                          />
                        </div>

                        <button
                          type="button"
                          onClick={handleAddExcepcion}
                          disabled={!nuevaExcepcion}
                          className="w-full bg-sky-50 hover:bg-sky-100 text-sky-600 text-xs font-bold py-2 rounded-xl border border-sky-200 flex items-center justify-center gap-1.5 transition-all disabled:opacity-40"
                        >
                          <Plus size={14} /> Bloquear Fecha
                        </button>
                      </div>

                      {/* Lista de Fechas Bloqueadas */}
                      <div className="bg-white dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700 rounded-2xl p-4 flex flex-col h-[230px]">
                        <h5 className="text-xs font-black text-slate-700 dark:text-slate-200 border-b dark:border-slate-700 pb-2 mb-3">Fechas Inactivas ({excepciones.length})</h5>
                        
                        <div className="flex-1 overflow-y-auto space-y-2">
                          {excepciones.length === 0 ? (
                            <div className="h-full flex flex-col items-center justify-center text-center text-slate-350">
                              <Calendar size={24} className="stroke-[1.5] mb-2 opacity-50" />
                              <span className="text-[10px] font-bold uppercase tracking-wider">Sin bloqueos registrados</span>
                            </div>
                          ) : (
                            excepciones.map((ex) => (
                              <div
                                key={ex.fecha}
                                className="flex justify-between items-center p-2 rounded-lg bg-amber-50/50 border border-amber-100 text-xs"
                              >
                                <div>
                                  <p className="font-bold text-amber-900">
                                    {new Date(ex.fecha + 'T12:00:00').toLocaleDateString('es-PE', { day: '2-digit', month: 'short', year: 'numeric' })}
                                  </p>
                                  <p className="text-[10px] text-amber-700/80 mt-0.5">{ex.descripcion}</p>
                                </div>
                                <button
                                  type="button"
                                  onClick={() => handleRemoveExcepcion(ex.fecha)}
                                  className="p-1 hover:bg-red-100 text-red-500 hover:text-red-700 rounded-md transition-colors"
                                  title="Remover bloqueo"
                                >
                                  <Trash2 size={12} />
                                </button>
                              </div>
                            ))
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* INFO EXTRA */}
                  <div className="bg-slate-50 dark:bg-slate-900/40 p-4 rounded-2xl border border-slate-150 dark:border-slate-700 space-y-2">
                    <div className="flex items-center gap-2 text-slate-800 dark:text-slate-100">
                      <HelpCircle size={16} className="text-sky-500" />
                      <h5 className="font-bold text-xs dark:text-slate-100">Consideración Operativa</h5>
                    </div>
                    <p className="text-[10px] text-slate-500 dark:text-slate-400 leading-relaxed font-medium">
                      Los cambios en la jornada laboral del personal veterinario restringirán inmediatamente la disponibilidad de turnos en el módulo de reservas del cliente y el panel de agendamiento de la recepcionista.
                    </p>
                  </div>

                </div>

                {/* Acciones de pie */}
                <div className="p-4 border-t border-slate-100 dark:border-slate-700 bg-slate-50/45 dark:bg-slate-900/30 flex justify-end shrink-0">
                  <button
                    type="submit"
                    disabled={guardando}
                    className="bg-gradient-to-r from-sky-500 to-cyan-400 hover:from-sky-600 hover:to-cyan-500 text-white px-6 py-2.5 rounded-xl font-bold shadow-lg shadow-sky-500/20 text-xs tracking-wide transition-all flex items-center gap-1.5"
                  >
                    {guardando ? (
                      <>
                        <CargadorSpinner size="xs" color="border-white" /> Guardando...
                      </>
                    ) : (
                      <>
                        <Save size={14} /> Guardar Horario Semanal
                      </>
                    )}
                  </button>
                </div>
              </form>
            )}
          </>
        ) : (
          <div className="flex-1 flex flex-col justify-center items-center p-8 text-center text-slate-500 select-none">
            <div className="w-16 h-16 bg-slate-100 dark:bg-slate-700 rounded-3xl flex items-center justify-center text-slate-400 dark:text-slate-500 mb-4 border border-slate-200/60 dark:border-slate-600 shadow-sm animate-pulse">
              <Clock size={32} />
            </div>
            <h3 className="text-base font-black text-slate-800 dark:text-slate-100 tracking-tight">Configuración de Horarios</h3>
            <p className="text-xs text-slate-400 dark:text-slate-500 max-w-sm mt-1">
              Selecciona un veterinario o recepcionista de la lista para ver, definir o modificar su horario laboral semanal y excepciones de calendario.
            </p>
          </div>
        )}
      </main>

    </div>
  );
};

export default ConfiguracionHorarios;
