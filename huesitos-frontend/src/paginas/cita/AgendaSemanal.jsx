import { useState, useEffect, useCallback } from 'react';
import {
  Calendar,
  ChevronLeft,
  ChevronRight,
  User,
  Clock,
  AlertTriangle,
  RefreshCw,
  Filter,
  PawPrint
} from 'lucide-react';
import CargadorSpinner from '@/componentes/comun/CargadorSpinner';
import Combobox from '@/componentes/comun/Combobox';
import ModalReprogramarCita from '@/componentes/cita/ModalReprogramarCita';
import {
  obtenerCitasAgenda,
  obtenerUsuarios
} from '@/api/citaApi';

const ESTADOS = [
  { value: 'TODOS', label: 'Todos los estados' },
  { value: 'PENDIENTE', label: 'Pendiente' },
  { value: 'CONFIRMADA', label: 'Confirmada' },
  { value: 'EN_ESPERA', label: 'En Espera' },
  { value: 'COMPLETADA', label: 'Completada' },
  { value: 'CANCELADA', label: 'Cancelada' }
];

const AgendaSemanal = () => {
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

  // Helpers de formato para Sentence case
  const formatEstadoCita = (est) => {
    switch (est) {
      case 'PENDIENTE': return 'Pendiente';
      case 'CONFIRMADA': return 'Confirmada';
      case 'EN_ESPERA': return 'En espera';
      case 'COMPLETADA': return 'Completada';
      case 'CANCELADA': return 'Cancelada';
      default: return est;
    }
  };

  const formatEspecie = (esp) => {
    if (!esp) return '';
    return esp.charAt(0).toUpperCase() + esp.slice(1).toLowerCase();
  };

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
      const { lunes: lunesRango, domingo: domingoRango } = obtenerRangoSemana(offsetSemanas);
      const inicioStr = formatarFechaYMD(lunesRango);
      const finStr = formatarFechaYMD(domingoRango);
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
  }, [offsetSemanas, filtroVeterinario, filtroEstado, obtenerRangoSemana]);

  useEffect(() => {
    fetchCitas();
  }, [fetchCitas]);

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
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300 font-sans text-slate-700 w-full">
      
      {/* SECCIÓN SUPERIOR: CABECERA Y FILTROS */}
      <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200/50 dark:border-slate-700/50 p-4 md:p-5 shadow-sm space-y-4">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h2 className="text-lg md:text-xl font-bold text-slate-800 dark:text-slate-100 tracking-tight flex items-center gap-2">
              <Calendar className="text-sky-500" size={20} />
              Agenda semanal de citas
            </h2>
            <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5 font-medium">
              Consulta, filtra y gestiona la programación semanal de atención veterinaria.
            </p>
          </div>
          
          {/* Navegador de Semanas */}
          <div className="flex items-center gap-1 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-lg p-1 self-start md:self-auto shrink-0">
            <button
              onClick={() => setOffsetSemanas(o => o - 1)}
              className="p-1.5 rounded hover:bg-white dark:hover:bg-slate-600 hover:shadow-sm text-slate-600 dark:text-slate-300 hover:text-sky-500 transition-all"
              title="Semana anterior"
            >
              <ChevronLeft size={14} />
            </button>
            <button
              onClick={() => setOffsetSemanas(0)}
              className={`px-3 py-1 text-xs font-semibold rounded transition-all ${
                offsetSemanas === 0
                  ? 'bg-sky-500 text-white shadow-sm font-bold'
                  : 'text-slate-600 dark:text-slate-300 hover:bg-white dark:hover:bg-slate-600'
              }`}
            >
              Semana actual
            </button>
            <button
              onClick={() => setOffsetSemanas(o => o + 1)}
              className="p-1.5 rounded hover:bg-white dark:hover:bg-slate-600 hover:shadow-sm text-slate-600 dark:text-slate-300 hover:text-sky-500 transition-all"
              title="Semana siguiente"
            >
              <ChevronRight size={14} />
            </button>
          </div>
        </div>
 
        {/* Rango de Fechas e Indicador */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-3 border-t border-slate-100 dark:border-slate-700">
          <div className="text-xs md:text-sm font-bold text-slate-700 dark:text-slate-200">
            {lunes.toLocaleDateString('es-PE', { day: '2-digit', month: 'long' })}
            <span className="font-medium text-slate-400 dark:text-slate-500 mx-1.5">al</span>
            {domingo.toLocaleDateString('es-PE', { day: '2-digit', month: 'long', year: 'numeric' })}
          </div>
 
          {/* Filtros de Veterinario y Estado */}
          <div className="flex flex-wrap items-center gap-2.5 w-full sm:w-auto z-20">
            <div className="w-full sm:w-56 shrink-0">
              <Combobox
                value={filtroVeterinario ? veterinarios.find(v => String(v.id) === String(filtroVeterinario))?.nombre || veterinarios.find(v => String(v.id) === String(filtroVeterinario))?.correo : 'Todos los veterinarios'}
                onChange={(label, _, opcCompleto) => {
                  if (opcCompleto) {
                    setFiltroVeterinario(opcCompleto.id);
                  } else {
                    if (!label || label.toLowerCase() === 'todos los veterinarios'.toLowerCase()) {
                      setFiltroVeterinario('');
                    } else {
                      const coincidencia = veterinarios.find(v => (v.nombre || v.correo).toLowerCase() === label.toLowerCase());
                      setFiltroVeterinario(coincidencia ? coincidencia.id : '');
                    }
                  }
                }}
                opciones={[
                  { id: '', label: 'Todos los veterinarios' },
                  ...veterinarios.map((vet) => ({
                    id: vet.id,
                    label: vet.nombre || vet.correo
                  }))
                ]}
                placeholder="Buscar veterinario..."
                icono={User}
                compacto={true}
              />
            </div>
 
            <div className="w-full sm:w-48 shrink-0">
              <Combobox
                value={ESTADOS.find(e => e.value === filtroEstado)?.label || 'Todos los estados'}
                onChange={(label, _, opcCompleto) => {
                  if (opcCompleto) {
                    setFiltroEstado(opcCompleto.id);
                  } else {
                    const coincidencia = ESTADOS.find(e => e.label.toLowerCase() === label.toLowerCase());
                    setFiltroEstado(coincidencia ? coincidencia.value : 'TODOS');
                  }
                }}
                opciones={ESTADOS.map((est) => ({
                  id: est.value,
                  label: est.label
                }))}
                placeholder="Filtro estado..."
                icono={Filter}
                compacto={true}
              />
            </div>
 
            <button
              onClick={fetchCitas}
              className="p-1.5 bg-white dark:bg-slate-700 hover:bg-slate-50 dark:hover:bg-slate-600 text-slate-650 dark:text-slate-200 hover:text-sky-500 rounded-lg border border-slate-250 dark:border-slate-600 transition-all flex items-center justify-center shadow-sm shrink-0"
              title="Refrescar agenda"
            >
              <RefreshCw size={13} />
            </button>
          </div>
        </div>
      </div>

      {/* MENSAJES DE ERROR */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-center gap-3">
          <AlertTriangle size={18} className="text-red-500 shrink-0" />
          <p className="text-sm text-red-700 font-semibold">{error}</p>
        </div>
      )}

      {/* GRILLA CALENDARIO SEMANAL */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 bg-white dark:bg-slate-800 rounded-2xl border border-slate-200/60 dark:border-slate-700/60 shadow-sm gap-3">
          <CargadorSpinner size="lg" />
          <span className="text-sm font-semibold text-slate-400 dark:text-slate-500">Consultando agenda...</span>
        </div>
      ) : (
        <div className="overflow-x-auto pb-4 -mx-4 px-4 sm:-mx-6 sm:px-6 lg:mx-0 lg:px-0">
          <div className="grid grid-cols-7 gap-4 min-w-[1000px] lg:min-w-0">
            {diasSemana.map((dia) => {
              const citasDia = citasPorDia[dia.fechaStr] || [];
              const esHoy = formatarFechaYMD(new Date()) === dia.fechaStr;
              return (
                <div
                  key={dia.fechaStr}
                  className={`bg-white dark:bg-slate-800 rounded-xl border ${
                    esHoy ? 'border-sky-400 ring-2 ring-sky-100 dark:ring-sky-900' : 'border-slate-200/60 dark:border-slate-700/60'
                  } shadow-sm flex flex-col min-h-[350px] overflow-hidden`}
                >
                  {/* Cabecera del día */}
                  <div className={`p-3 border-b dark:border-slate-700 text-center ${
                    esHoy ? 'bg-sky-50/50 dark:bg-sky-900/20' : 'bg-slate-50/50 dark:bg-slate-900/30'
                  }`}>
                    <p className={`text-[10px] font-bold tracking-wide ${
                      esHoy ? 'text-sky-600' : 'text-slate-500 dark:text-slate-400'
                    }`}>
                      {dia.nombre}
                    </p>
                    <p className={`text-xs font-bold mt-0.5 ${
                      esHoy ? 'text-sky-700' : 'text-slate-700 dark:text-slate-200'
                    }`}>
                      {dia.fechaLabel}
                    </p>
                  </div>

                  {/* Lista de citas */}
                  <div className="p-2 flex-1 space-y-2 overflow-y-auto max-h-[450px]">
                    {citasDia.length === 0 ? (
                      <div className="h-full flex flex-col items-center justify-center py-12 text-center text-slate-350">
                        <PawPrint size={18} className="stroke-[1.5] mb-1.5 opacity-60 text-slate-400" />
                        <span className="text-[9px] font-semibold tracking-wider text-slate-400 dark:text-slate-500">Sin citas</span>
                      </div>
                    ) : (
                      citasDia.map((cita) => {
                        const hora = cita.fechaHora ? cita.fechaHora.substring(11, 16) : '';
                        return (
                          <div
                            key={cita.id}
                            onClick={() => abrirModalReprogramar(cita)}
                            className="group border border-slate-100 dark:border-slate-700 hover:border-sky-200 bg-white dark:bg-slate-800/80 rounded-xl p-2.5 shadow-sm hover:shadow-md hover:shadow-sky-500/5 transition-all duration-200 cursor-pointer text-left relative"
                          >
                            <div className="flex items-center justify-between gap-1 mb-1">
                              <span className="text-[10px] font-bold text-slate-800 dark:text-slate-100 flex items-center gap-1">
                                <Clock size={10} className="text-slate-400" />
                                {hora}
                              </span>
                              <span className={`text-[8.5px] font-bold px-1.5 py-0.5 rounded border ${obtenerEstiloEstado(cita.estado)}`}>
                                {formatEstadoCita(cita.estado)}
                              </span>
                            </div>

                            <h4 className="text-xs font-bold text-slate-800 dark:text-slate-100 tracking-tight group-hover:text-sky-500 transition-colors">
                              {cita.mascota?.nombre}
                            </h4>
                            
                            <p className="text-[9px] font-semibold text-slate-500 dark:text-slate-400 mt-0.5 truncate">
                              {formatEspecie(cita.mascota?.especie)} {cita.mascota?.raza ? `· ${cita.mascota.raza}` : ''}
                            </p>

                            <div className="mt-1.5 pt-1.5 border-t border-slate-50 dark:border-slate-700 space-y-0.5 text-[9px] font-medium">
                              <p className="text-slate-500 dark:text-slate-400 truncate">
                                <span className="font-semibold text-slate-600 dark:text-slate-300">Serv:</span> {cita.servicio?.nombre}
                              </p>
                              <p className="text-slate-500 dark:text-slate-400 truncate">
                                <span className="font-semibold text-slate-600 dark:text-slate-300">Vet:</span> {cita.veterinario ? (cita.veterinario.nombre || cita.veterinario.correo) : 'Sin asignar'}
                              </p>
                              <p className="text-slate-400 dark:text-slate-500 truncate">
                                <span className="font-semibold text-slate-500 dark:text-slate-400">Prop:</span> {cita.mascota?.dueño?.nombreCompleto || 'Cliente'}
                              </p>
                            </div>

                            {/* Hover Overlay indicator */}
                            <div className="absolute right-1.5 bottom-1.5 opacity-0 group-hover:opacity-100 transition-opacity bg-sky-50 p-1 rounded border border-sky-100">
                              <RefreshCw size={9} className="text-sky-500 animate-spin-slow" />
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
        </div>
      )}

      {/* MODAL DE REPROGRAMACIÓN DE CITA */}
      <ModalReprogramarCita
        isOpen={!!citaSeleccionada}
        onClose={() => setCitaSeleccionada(null)}
        cita={citaSeleccionada}
        onReprogramada={fetchCitas}
      />

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

export default AgendaSemanal;
