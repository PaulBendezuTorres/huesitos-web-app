import { useState, useEffect, useCallback } from 'react';
import {
  Calendar,
  ChevronLeft,
  ChevronRight,
  User,
  Clock,
  Check,
  X,
  AlertTriangle,
  Loader2,
  RefreshCw,
  Filter,
  PawPrint,
  CheckCircle,
  FileText
} from 'lucide-react';
import {
  obtenerCitasAgenda,
  reprogramarCita,
  obtenerUsuarios,
  obtenerCitasPorDia,
  obtenerHorariosVeterinario
} from '../api/citaAPI';

const ESTADOS = [
  { value: 'TODOS', label: 'Todos los estados' },
  { value: 'PENDIENTE', label: 'Pendiente' },
  { value: 'CONFIRMADA', label: 'Confirmada' },
  { value: 'EN_ESPERA', label: 'En Espera' },
  { value: 'COMPLETADA', label: 'Completada' },
  { value: 'CANCELADA', label: 'Cancelada' }
];

const HORARIOS_BASE = [
  '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
  '12:00', '14:00', '14:30', '15:00', '15:30',
  '16:00', '16:30', '17:00', '17:30',
];

const RecepcionistaAgenda = () => {
  // Filtros
  const [offsetSemanas, setOffsetSemanas] = useState(0);
  const [veterinarios, setVeterinarios] = useState([]);
  const [filtroVeterinario, setFiltroVeterinario] = useState('');
  const [filtroEstado, setFiltroEstado] = useState('TODOS');

  // Datos
  const [citas, setCitas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Modal de Reprogramación
  const [citaSeleccionada, setCitaSeleccionada] = useState(null);
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

  // Obtener rango de la semana (Lunes a Domingo) basado en el offset
  const obtenerRangoSemana = useCallback((offset) => {
    const hoy = new Date();
    const diaSemana = hoy.getDay();
    const diffAlLunes = diaSemana === 0 ? -6 : 1 - diaSemana;
    
    const lunes = new Date(hoy);
    lunes.setDate(hoy.getDate() + diffAlLunes + (offset * 7));
    lunes.setHours(0, 0, 0, 0);

    const domingo = new Date(lunes);
    domingo.setDate(lunes.getDate() + 6);
    domingo.setHours(23, 59, 59, 999);

    return { lunes, domingo };
  }, []);

  // Generar los 7 días de la semana con labels
  const obtenerDiasSemana = useCallback((lunes) => {
    const dias = [];
    const nombresDias = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'];
    for (let i = 0; i < 7; i++) {
      const d = new Date(lunes);
      d.setDate(lunes.getDate() + i);
      dias.push({
        nombre: nombresDias[i],
        fechaStr: formatarFechaYMD(d),
        fechaLabel: d.toLocaleDateString('es-PE', { day: '2-digit', month: 'short' }),
        date: d
      });
    }
    return dias;
  }, []);

  const { lunes, domingo } = obtenerRangoSemana(offsetSemanas);
  const diasSemana = obtenerDiasSemana(lunes);

  // Cargar veterinarios al montar
  useEffect(() => {
    const cargarVets = async () => {
      try {
        const usuarios = await obtenerUsuarios();
        const vets = usuarios.filter((u) => u.rol === 'VETERINARIO' && u.activo !== false);
        setVeterinarios(vets);
      } catch (err) {
        console.error("Error al cargar veterinarios:", err);
      }
    };
    cargarVets();
  }, []);

  // Cargar citas de la agenda
  const fetchCitas = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const inicioStr = formatarFechaYMD(lunes);
      const finStr = formatarFechaYMD(domingo);
      const data = await obtenerCitasAgenda(
        inicioStr,
        finStr,
        filtroVeterinario || null,
        filtroEstado === 'TODOS' ? null : filtroEstado
      );
      setCitas(data);
    } catch (err) {
      setError('Error al obtener la agenda de citas. Intenta de nuevo.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [lunes, domingo, filtroVeterinario, filtroEstado]);

  useEffect(() => {
    fetchCitas();
  }, [fetchCitas]);

  // Cargar disponibilidad para reprogramación cuando cambia la fecha o la cita seleccionada
  useEffect(() => {
    if (fechaReprogramar && citaSeleccionada) {
      const cargarDisponibilidad = async () => {
        setCargandoSlots(true);
        setErrorReprogramar('');
        try {
          const promesas = [obtenerCitasPorDia(fechaReprogramar)];
          if (citaSeleccionada.veterinario?.id) {
            promesas.push(obtenerHorariosVeterinario(citaSeleccionada.veterinario.id));
          }
          const [citasRes, horariosRes] = await Promise.allSettled(promesas);
          
          setCitasDelDia(citasRes.status === 'fulfilled' ? citasRes.value : []);
          if (horariosRes) {
            setHorariosVet(horariosRes.status === 'fulfilled' ? horariosRes.value : []);
          } else {
            setHorariosVet([]);
          }
        } catch (err) {
          console.error("Error al cargar disponibilidad:", err);
          setErrorReprogramar('No se pudo verificar la disponibilidad del horario.');
        } finally {
          setCargandoSlots(false);
        }
      };
      cargarDisponibilidad();
      setHoraReprogramar('');
    }
  }, [fechaReprogramar, citaSeleccionada]);

  // Filtrar los horarios de reprogramación disponibles
  const slotsDisponibles = HORARIOS_BASE.filter((hora) => {
    if (citaSeleccionada?.veterinario?.id && citasDelDia.length > 0) {
      const ocupado = citasDelDia.some((c) => {
        if (c.id === citaSeleccionada.id) return false; // Permitir el mismo slot de la cita actual
        if (c.veterinario?.id !== citaSeleccionada.veterinario.id) return false;
        if (c.estado === 'CANCELADA') return false;
        const horaCita = c.fechaHora ? c.fechaHora.substring(11, 16) : '';
        return horaCita === hora;
      });
      if (ocupado) return false;
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

  // Agrupar citas por fecha
  const citasPorDia = {};
  diasSemana.forEach(d => {
    citasPorDia[d.fechaStr] = [];
  });
  citas.forEach(cita => {
    if (cita.fechaHora) {
      const fechaStr = cita.fechaHora.substring(0, 10);
      if (citasPorDia[fechaStr]) {
        citasPorDia[fechaStr].push(cita);
      }
    }
  });

  // Ordenar citas por hora dentro de cada día
  Object.keys(citasPorDia).forEach(fecha => {
    citasPorDia[fecha].sort((a, b) => {
      const horaA = a.fechaHora ? a.fechaHora.substring(11, 16) : '';
      const horaB = b.fechaHora ? b.fechaHora.substring(11, 16) : '';
      return horaA.localeCompare(horaB);
    });
  });

  // Manejar reprogramación
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
      await reprogramarCita(citaSeleccionada.id, nuevaFechaHora);
      alert('La cita ha sido reprogramada con éxito.');
      setCitaSeleccionada(null);
      fetchCitas();
    } catch (err) {
      const msg = err.response?.data || 'Error al reprogramar la cita.';
      setErrorReprogramar(typeof msg === 'string' ? msg : JSON.stringify(msg));
    } finally {
      setGuardandoReprogramacion(false);
    }
  };

  // Clases CSS por estado de cita
  const obtenerEstiloEstado = (estado) => {
    switch (estado) {
      case 'PENDIENTE':
        return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'CONFIRMADA':
        return 'bg-sky-100 text-sky-800 border-sky-200';
      case 'EN_ESPERA':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'COMPLETADA':
        return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      case 'CANCELADA':
        return 'bg-rose-100 text-rose-800 border-rose-200';
      default:
        return 'bg-slate-100 text-slate-800 border-slate-200';
    }
  };

  const abrirModalReprogramar = (cita) => {
    setCitaSeleccionada(cita);
    if (cita.fechaHora) {
      setFechaReprogramar(cita.fechaHora.substring(0, 10));
      setHoraReprogramar(cita.fechaHora.substring(11, 16));
    } else {
      setFechaReprogramar('');
      setHoraReprogramar('');
    }
    setErrorReprogramar('');
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      
      {/* SECCIÓN SUPERIOR: CABECERA Y FILTROS */}
      <div className="bg-white rounded-2xl border border-slate-200/60 p-6 shadow-sm space-y-4">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h2 className="text-xl font-black text-slate-800 tracking-tight flex items-center gap-2">
              <Calendar className="text-sky-500" size={24} />
              Agenda Semanal de Citas
            </h2>
            <p className="text-xs text-slate-500 font-medium">
              Consulta, filtra y gestiona la programación semanal de atención veterinaria.
            </p>
          </div>
          
          {/* Navegador de Semanas */}
          <div className="flex items-center gap-1.5 self-start md:self-auto bg-slate-50 border border-slate-200/80 p-1 rounded-xl">
            <button
              onClick={() => setOffsetSemanas(o => o - 1)}
              className="p-2 rounded-lg hover:bg-white hover:shadow-sm text-slate-600 transition-all"
              title="Semana anterior"
            >
              <ChevronLeft size={16} />
            </button>
            <button
              onClick={() => setOffsetSemanas(0)}
              className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all ${
                offsetSemanas === 0
                  ? 'bg-sky-500 text-white shadow-md shadow-sky-500/10'
                  : 'text-slate-600 hover:bg-white hover:shadow-sm'
              }`}
            >
              Semana Actual
            </button>
            <button
              onClick={() => setOffsetSemanas(o => o + 1)}
              className="p-2 rounded-lg hover:bg-white hover:shadow-sm text-slate-600 transition-all"
              title="Semana siguiente"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>

        {/* Rango de Fechas e Indicador */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2 border-t border-slate-100">
          <div className="text-sm font-black text-slate-700">
            {lunes.toLocaleDateString('es-PE', { day: '2-digit', month: 'long' })}
            <span className="font-medium text-slate-400 mx-2">al</span>
            {domingo.toLocaleDateString('es-PE', { day: '2-digit', month: 'long', year: 'numeric' })}
          </div>

          {/* Filtros de Veterinario y Estado */}
          <div className="flex flex-wrap items-center gap-2.5">
            <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 min-w-[200px]">
              <User size={14} className="text-slate-400" />
              <select
                value={filtroVeterinario}
                onChange={(e) => setFiltroVeterinario(e.target.value)}
                className="bg-transparent text-xs font-bold text-slate-600 outline-none w-full cursor-pointer"
              >
                <option value="">Todos los veterinarios</option>
                {veterinarios.map((vet) => (
                  <option key={vet.id} value={vet.id}>
                    {vet.nombre || vet.correo}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 min-w-[170px]">
              <Filter size={14} className="text-slate-400" />
              <select
                value={filtroEstado}
                onChange={(e) => setFiltroEstado(e.target.value)}
                className="bg-transparent text-xs font-bold text-slate-600 outline-none w-full cursor-pointer"
              >
                {ESTADOS.map((est) => (
                  <option key={est.value} value={est.value}>
                    {est.label}
                  </option>
                ))}
              </select>
            </div>

            <button
              onClick={fetchCitas}
              className="p-2 bg-sky-50 text-sky-600 hover:bg-sky-500 hover:text-white rounded-xl transition-all border border-sky-100 hover:border-sky-400 flex items-center justify-center shadow-sm"
              title="Refrescar agenda"
            >
              <RefreshCw size={14} />
            </button>
          </div>
        </div>
      </div>

      {/* MENSAJES DE ERROR */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-center gap-3">
          <AlertTriangle size={18} className="text-red-500 shrink-0" />
          <p className="text-sm text-red-700 font-medium">{error}</p>
        </div>
      )}

      {/* GRILLA CALENDARIO SEMANAL */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 bg-white rounded-2xl border border-slate-200/60 shadow-sm">
          <Loader2 className="text-sky-500 animate-spin mb-3" size={32} />
          <span className="text-sm font-bold text-slate-400">Consultando agenda...</span>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-7 gap-4">
          {diasSemana.map((dia) => {
            const citasDia = citasPorDia[dia.fechaStr] || [];
            const esHoy = formatarFechaYMD(new Date()) === dia.fechaStr;
            
            return (
              <div
                key={dia.fechaStr}
                className={`bg-white rounded-2xl border ${
                  esHoy ? 'border-sky-400 ring-2 ring-sky-100' : 'border-slate-200/60'
                } shadow-sm flex flex-col min-h-[300px] overflow-hidden`}
              >
                {/* Cabecera del día */}
                <div className={`p-3 border-b text-center ${
                  esHoy ? 'bg-sky-50/55' : 'bg-slate-50/50'
                }`}>
                  <p className={`text-xs font-black uppercase tracking-wider ${
                    esHoy ? 'text-sky-600' : 'text-slate-500'
                  }`}>
                    {dia.nombre}
                  </p>
                  <p className={`text-sm font-bold mt-0.5 ${
                    esHoy ? 'text-sky-700 font-black' : 'text-slate-700'
                  }`}>
                    {dia.fechaLabel}
                  </p>
                </div>

                {/* Lista de citas */}
                <div className="p-2.5 flex-1 space-y-2.5 overflow-y-auto max-h-[450px]">
                  {citasDia.length === 0 ? (
                    <div className="h-full flex flex-col items-center justify-center py-10 text-center text-slate-300">
                      <PawPrint size={20} className="stroke-[1.5] mb-1.5 opacity-60" />
                      <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Sin citas</span>
                    </div>
                  ) : (
                    citasDia.map((cita) => {
                      const hora = cita.fechaHora ? cita.fechaHora.substring(11, 16) : '';
                      return (
                        <div
                          key={cita.id}
                          onClick={() => abrirModalReprogramar(cita)}
                          className="group border border-slate-100 hover:border-sky-300 bg-white rounded-xl p-3 shadow-sm hover:shadow-md hover:shadow-sky-500/5 transition-all duration-300 cursor-pointer text-left relative"
                        >
                          <div className="flex items-center justify-between gap-1.5 mb-1.5">
                            <span className="text-xs font-black text-slate-800 flex items-center gap-1">
                              <Clock size={11} className="text-slate-400" />
                              {hora}
                            </span>
                            <span className={`text-[9px] font-extrabold px-2 py-0.5 rounded-full border ${obtenerEstiloEstado(cita.estado)}`}>
                              {cita.estado}
                            </span>
                          </div>

                          <h4 className="text-xs font-black text-slate-800 tracking-tight group-hover:text-sky-600 transition-colors">
                            {cita.mascota?.nombre}
                          </h4>
                          
                          <p className="text-[9px] font-semibold text-slate-400 uppercase mt-0.5 truncate">
                            {cita.mascota?.especie} {cita.mascota?.raza ? `· ${cita.mascota.raza}` : ''}
                          </p>

                          <div className="mt-2 pt-2 border-t border-slate-50 space-y-1 text-[10px]">
                            <p className="text-slate-500 truncate">
                              <span className="font-bold text-slate-600">Serv:</span> {cita.servicio?.nombre}
                            </p>
                            <p className="text-slate-500 truncate">
                              <span className="font-bold text-slate-600">Vet:</span> {cita.veterinario ? (cita.veterinario.nombre || cita.veterinario.correo) : 'Sin asignar'}
                            </p>
                            <p className="text-slate-400 truncate">
                              <span className="font-bold text-slate-500">Prop:</span> {cita.mascota?.dueño?.nombreCompleto || 'Cliente'}
                            </p>
                          </div>

                          {/* Hover Overlay indicator */}
                          <div className="absolute right-2 bottom-2 opacity-0 group-hover:opacity-100 transition-opacity bg-sky-50 p-1 rounded-lg border border-sky-100">
                            <RefreshCw size={10} className="text-sky-500 animate-spin-slow" />
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* MODAL DE REPROGRAMACIÓN DE CITA */}
      {citaSeleccionada && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl max-w-md w-full border border-slate-200 shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
            {/* Header Modal */}
            <div className="p-5 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
              <div>
                <h3 className="font-black text-slate-800 text-base tracking-tight">Reprogramar Cita</h3>
                <p className="text-xs text-slate-400 mt-0.5">ID Cita: #{citaSeleccionada.id}</p>
              </div>
              <button
                onClick={() => setCitaSeleccionada(null)}
                className="p-1.5 rounded-lg hover:bg-slate-200/60 text-slate-400 hover:text-slate-600 transition-all"
              >
                <X size={18} />
              </button>
            </div>

            {/* Contenido/Formulario */}
            <form onSubmit={handleReprogramarSubmit} className="p-5 space-y-4">
              {/* Resumen cita */}
              <div className="bg-slate-50 rounded-xl p-3.5 border border-slate-100 space-y-2">
                <div className="flex justify-between items-start">
                  <div>
                    <span className="text-[9px] font-bold text-sky-500 uppercase tracking-widest">Paciente</span>
                    <h4 className="font-bold text-slate-800 text-sm">{citaSeleccionada.mascota?.nombre}</h4>
                    <p className="text-[10px] text-slate-400 font-semibold">{citaSeleccionada.mascota?.dueño?.nombreCompleto || 'Propietario'}</p>
                  </div>
                  <div className="text-right">
                    <span className="text-[9px] font-bold text-emerald-500 uppercase tracking-widest">Servicio</span>
                    <p className="font-bold text-slate-800 text-xs">{citaSeleccionada.servicio?.nombre}</p>
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-200/50 flex justify-between text-[10px] text-slate-500">
                  <span className="flex items-center gap-1 font-medium">
                    <User size={12} className="text-slate-400" />
                    Vet: {citaSeleccionada.veterinario ? (citaSeleccionada.veterinario.nombre || citaSeleccionada.veterinario.correo) : 'Sin asignar'}
                  </span>
                  <span className="flex items-center gap-1 font-medium">
                    <Clock size={12} className="text-slate-400" />
                    Actual: {citaSeleccionada.fechaHora ? new Date(citaSeleccionada.fechaHora).toLocaleString('es-PE', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' }) : ''}
                  </span>
                </div>
              </div>

              {/* Selector de nueva Fecha */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-600 uppercase tracking-wider block">
                  Nueva Fecha
                </label>
                <input
                  type="date"
                  value={fechaReprogramar}
                  min={formatarFechaYMD(new Date())}
                  onChange={(e) => setFechaReprogramar(e.target.value)}
                  required
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm text-slate-700 focus:border-sky-400 focus:ring-2 focus:ring-sky-100 outline-none transition-all"
                />
              </div>

              {/* Selector de nueva Hora (Slots) */}
              {fechaReprogramar && (
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-600 uppercase tracking-wider block">
                    Horarios disponibles
                  </label>
                  
                  {cargandoSlots ? (
                    <div className="flex items-center justify-center py-6 bg-slate-50 border border-slate-200 rounded-xl">
                      <Loader2 className="text-sky-500 animate-spin mr-2" size={16} />
                      <span className="text-xs font-bold text-slate-400">Verificando horarios...</span>
                    </div>
                  ) : slotsDisponibles.length === 0 ? (
                    <div className="text-center py-6 bg-slate-50 border border-slate-200 rounded-xl">
                      <AlertTriangle size={20} className="text-amber-500 mx-auto mb-1.5" />
                      <p className="text-xs font-bold text-slate-500">Sin horarios disponibles</p>
                      <p className="text-[10px] text-slate-400">Intenta con otro día.</p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-4 gap-1.5 max-h-[140px] overflow-y-auto pr-1">
                      {slotsDisponibles.map((hora) => (
                        <button
                          key={hora}
                          type="button"
                          onClick={() => setHoraReprogramar(hora)}
                          className={`py-2 rounded-lg text-xs font-bold transition-all ${
                            horaReprogramar === hora
                              ? 'bg-sky-500 text-white shadow-md shadow-sky-500/20 scale-105'
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

              {/* Alertas de error del modal */}
              {errorReprogramar && (
                <div className="bg-red-50 border border-red-200 rounded-xl p-3 flex items-center gap-2">
                  <AlertTriangle size={14} className="text-red-500 shrink-0" />
                  <p className="text-xs text-red-700 font-semibold">{errorReprogramar}</p>
                </div>
              )}

              {/* Botones de acción */}
              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setCitaSeleccionada(null)}
                  disabled={guardandoReprogramacion}
                  className="px-4 py-2.5 rounded-xl text-xs font-bold text-slate-500 hover:bg-slate-100 border border-slate-200 transition-all"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={guardandoReprogramacion || !fechaReprogramar || !horaReprogramar}
                  className="px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-sky-500 hover:bg-sky-600 transition-all shadow-md shadow-sky-500/10 flex items-center justify-center gap-1.5 disabled:opacity-40"
                >
                  {guardandoReprogramacion ? (
                    <>
                      <Loader2 size={12} className="animate-spin" /> Reprogramando...
                    </>
                  ) : (
                    <>
                      <Check size={12} /> Reprogramar Cita
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Estilo para animación lenta */}
      <style>{`
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .animate-spin-slow {
          animation: spin-slow 8s linear infinite;
        }
      `}</style>
    </div>
  );
};

export default RecepcionistaAgenda;
