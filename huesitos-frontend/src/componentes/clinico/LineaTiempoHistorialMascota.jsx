import { useParams, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import {
  Stethoscope,
  Syringe,
  FileText,
  Download,
  FlaskConical,
  ArrowLeft,
  Search,
  RefreshCw,
  Calendar,
  Thermometer,
  Weight,
  ClipboardList,
} from 'lucide-react';
import useHistorialClinico from '@/hooks/clinico/useHistorialClinico';
import { descargarRecetaPdf, obtenerRecetasPorConsulta } from '@/api/mascotaApi';
import { obtenerUrlImagen } from '@/servicios/imagenServicio';

const LineaTiempoHistorialMascota = ({ mascotaId: propMascotaId, mostrarCabecera = true, onBack }) => {
  const params = useParams();
  const navigate = useNavigate();
  const mascotaId = propMascotaId || params.mascotaId;
  const { mascota, historial, cargando, error, recargar } = useHistorialClinico(mascotaId);
  const [filtro, setFiltro] = useState('todos');
  const [busqueda, setBusqueda] = useState('');
  const [descargando, setDescargando] = useState(null);

  // Filtrar historial
  const historialFiltrado = historial.filter((item) => {
    const coincideFiltro =
      filtro === 'todos' ||
      (filtro === 'consultas' && item.tipo === 'Consulta') ||
      (filtro === 'vacunas' && item.tipo === 'Vacuna') ||
      (filtro === 'examenes' && item.tipo === 'Archivo') ||
      (filtro === 'recetas' && item.tipo === 'Consulta' && item.consultaId);

    const texto = busqueda.toLowerCase();
    const coincideBusqueda =
      !texto ||
      (item.titulo || '').toLowerCase().includes(texto) ||
      (item.diagnostico || '').toLowerCase().includes(texto) ||
      (item.nombreVacuna || '').toLowerCase().includes(texto) ||
      (item.tratamiento || '').toLowerCase().includes(texto);

    return coincideFiltro && coincideBusqueda;
  });

  // Descargar receta PDF
  const manejarDescargarReceta = async (consultaId) => {
    setDescargando(consultaId);
    try {
      const recetas = await obtenerRecetasPorConsulta(consultaId);
      if (recetas && recetas.length > 0) {
        const blob = await descargarRecetaPdf(recetas[0].id);
        const url = window.URL.createObjectURL(new Blob([blob]));
        const enlace = document.createElement('a');
        enlace.href = url;
        enlace.setAttribute('download', `receta_${recetas[0].id}.pdf`);
        document.body.appendChild(enlace);
        enlace.click();
        enlace.remove();
        window.URL.revokeObjectURL(url);
      }
    } catch (err) {
      console.error('Error descargando receta:', err);
    } finally {
      setDescargando(null);
    }
  };

  // Calcular estado de vacunas
  const calcularEstadoVacunas = () => {
    const vacunas = historial.filter((h) => h.tipo === 'Vacuna');
    if (vacunas.length === 0) return { texto: 'Sin registros', color: 'slate' };
    const proximoRefuerzo = vacunas.find((v) => v.proximoRefuerzo);
    if (proximoRefuerzo) {
      const fechaRef = new Date(proximoRefuerzo.proximoRefuerzo);
      const hoy = new Date();
      const diasRestantes = Math.ceil((fechaRef - hoy) / (1000 * 60 * 60 * 24));
      if (diasRestantes <= 7 && diasRestantes > 0) return { texto: `Refuerzo en ${diasRestantes} días`, color: 'amber' };
      if (diasRestantes <= 0) return { texto: 'Refuerzo vencido', color: 'red' };
    }
    return { texto: 'Vacunas al día', color: 'emerald' };
  };

  const estadoVacunas = calcularEstadoVacunas();

  const coloresBadgeVacunas = {
    emerald: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    amber: 'bg-amber-50 text-amber-700 border-amber-200',
    red: 'bg-red-50 text-red-700 border-red-200',
    slate: 'bg-slate-100 text-slate-500 border-slate-200',
  };

  // Config visual por tipo
  const configTipo = {
    Consulta: { icono: Stethoscope, color: 'sky', borderColor: 'border-sky-400', bgNodo: 'bg-sky-500', bgCard: 'hover:border-sky-200' },
    Vacuna: { icono: Syringe, color: 'emerald', borderColor: 'border-emerald-400', bgNodo: 'bg-emerald-500', bgCard: 'hover:border-emerald-200' },
    Archivo: { icono: FlaskConical, color: 'amber', borderColor: 'border-amber-400', bgNodo: 'bg-amber-500', bgCard: 'hover:border-amber-200' },
  };

  const filtros = [
    { id: 'todos', label: 'Todos' },
    { id: 'consultas', label: 'Consultas' },
    { id: 'vacunas', label: 'Vacunas' },
    { id: 'examenes', label: 'Exámenes' },
    { id: 'recetas', label: 'Recetas' },
  ];

  const formatearFecha = (fechaStr) => {
    if (!fechaStr) return '';
    const fecha = new Date(fechaStr);
    return fecha.toLocaleDateString('es-PE', { day: '2-digit', month: 'short', year: 'numeric' });
  };

  const formatearFechaCorta = (fechaStr) => {
    if (!fechaStr) return '';
    const fecha = new Date(fechaStr);
    return fecha.toLocaleDateString('es-PE', { day: '2-digit', month: 'short' });
  };

  const manejarVolver = () => {
    if (onBack) {
      onBack();
    } else {
      navigate('/cliente');
    }
  };

  if (cargando) {
    return (
      <div className="flex flex-col items-center justify-center py-12 gap-4">
        <div className="w-12 h-12 border-4 border-sky-500 border-t-transparent rounded-full animate-spin" />
        <span className="text-sm font-semibold text-slate-400">Cargando historial clínico...</span>
      </div>
    );
  }

  if (error || !mascota) {
    return (
      <div className="bg-white rounded-2xl border border-slate-200 p-8 text-center shadow-sm max-w-md mx-auto">
        <div className="w-16 h-16 bg-red-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <ClipboardList size={28} className="text-red-400" />
        </div>
        <h2 className="text-xl font-bold text-slate-800 mb-2">No se encontró la mascota</h2>
        <p className="text-sm text-slate-400 mb-6">{error || 'Verifica que la mascota exista y tengas permisos para ver su historial.'}</p>
        {mostrarCabecera && (
          <button
            onClick={manejarVolver}
            className="px-6 py-3 bg-sky-500 text-white font-bold rounded-xl hover:bg-sky-600 transition-colors"
          >
            Volver
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* ─── CABECERA DE LA MASCOTA ─── */}
      {mostrarCabecera && (
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200/60">
          <div className="flex flex-col md:flex-row items-start md:items-center gap-5">
            {/* Avatar con foto */}
            <div className="w-20 h-20 rounded-2xl overflow-hidden bg-gradient-to-tr from-sky-500 to-cyan-400 shadow-xl shadow-sky-500/20 shrink-0 relative">
              {mascota.fotoUrl && !mascota.fotoUrl.includes('defecto-mascota') ? (
                <img
                  src={obtenerUrlImagen(mascota.fotoUrl)}
                  alt={mascota.nombre}
                  className="w-full h-full object-cover"
                  onError={(e) => { e.currentTarget.style.display = 'none'; e.currentTarget.nextSibling.style.display = 'flex'; }}
                />
              ) : null}
              <div
                className="absolute inset-0 flex items-center justify-center text-white text-3xl font-black"
                style={{ display: (mascota.fotoUrl && !mascota.fotoUrl.includes('defecto-mascota')) ? 'none' : 'flex' }}
              >
                {mascota.nombre ? mascota.nombre.charAt(0).toUpperCase() : '🐾'}
              </div>
            </div>

            {/* Info */}
            <div className="flex-1 min-w-0">
              <h1 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight">{mascota.nombre}</h1>
              <p className="text-slate-500 mt-0.5">
                {mascota.especie}{mascota.raza ? ` · ${mascota.raza}` : ''}
              </p>
              <div className="flex flex-wrap items-center gap-2 mt-3">
                {mascota.edad && (
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-100 text-xs font-semibold text-slate-600">
                    <Calendar size={12} /> {mascota.edad}
                  </span>
                )}
                {mascota.peso && (
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-100 text-xs font-semibold text-slate-600">
                    <Weight size={12} /> {mascota.peso} kg
                  </span>
                )}
                <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold border ${coloresBadgeVacunas[estadoVacunas.color]}`}>
                  <Syringe size={12} /> {estadoVacunas.texto}
                </span>
              </div>
            </div>

            {/* Acciones */}
            <div className="flex gap-2 shrink-0">
              <button
                onClick={recargar}
                className="p-2.5 rounded-xl bg-slate-100 text-slate-500 hover:bg-sky-50 hover:text-sky-600 transition-all"
                title="Actualizar"
              >
                <RefreshCw size={18} />
              </button>
              <button
                onClick={manejarVolver}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-100 text-slate-600 font-semibold text-sm hover:bg-slate-200 transition-all"
              >
                <ArrowLeft size={16} /> Volver
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ─── BUSCADOR + FILTROS ─── */}
      <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-200/60">
        <div className="flex flex-col md:flex-row gap-3">
          <div className="flex-1 relative">
            <Search size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Buscar diagnóstico, vacuna, tratamiento..."
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 focus:border-sky-400 focus:ring-2 focus:ring-sky-100 outline-none text-sm text-slate-700 placeholder:text-slate-400 transition-all"
            />
          </div>
          <div className="flex gap-1.5 flex-wrap">
            {filtros.map((f) => (
              <button
                key={f.id}
                onClick={() => setFiltro(f.id)}
                className={`px-4 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 ${
                  filtro === f.id
                    ? 'bg-sky-500 text-white shadow-lg shadow-sky-500/20'
                    : 'bg-slate-50 text-slate-500 hover:bg-slate-100 border border-slate-200'
                }`}
              >
                {f.label}
              </button>
            ))}
            {!mostrarCabecera && (
              <button
                onClick={recargar}
                className="p-2.5 rounded-xl bg-slate-50 text-slate-500 hover:bg-sky-50 hover:text-sky-600 transition-all border border-slate-200"
                title="Actualizar"
              >
                <RefreshCw size={18} />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* ─── LÍNEA DE TIEMPO (TIMELINE) ─── */}
      <div className="relative">
        {historialFiltrado.length === 0 ? (
          <div className="bg-white rounded-2xl border border-slate-200/60 p-14 text-center shadow-sm">
            <div className="w-16 h-16 bg-sky-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <ClipboardList size={28} className="text-sky-400" />
            </div>
            <h3 className="text-lg font-bold text-slate-700 mb-1">No hay registros</h3>
            <p className="text-sm text-slate-400">
              {filtro === 'todos'
                ? 'Esta mascota aún no tiene registros en su historial clínico.'
                : `No se encontraron registros de tipo "${filtros.find(f => f.id === filtro)?.label}".`}
            </p>
          </div>
        ) : (
          <div className="relative pl-8 md:pl-10">
            {/* Línea vertical */}
            <div className="absolute left-3 md:left-4 top-0 bottom-0 w-0.5 bg-gradient-to-b from-sky-300 via-slate-200 to-transparent" />

            {historialFiltrado.map((item, index) => {
              const config = configTipo[item.tipo] || configTipo.Consulta;
              const Icono = config.icono;

              return (
                <div
                  key={`${item.tipo}-${index}`}
                  className="relative mb-6 animate-fadeIn"
                  style={{ animationDelay: `${index * 60}ms` }}
                >
                  {/* Nodo del timeline */}
                  <div className={`absolute -left-8 md:-left-10 top-6 w-7 h-7 rounded-full ${config.bgNodo} flex items-center justify-center shadow-lg ring-4 ring-white`}>
                    <Icono size={14} className="text-white" />
                  </div>

                  {/* Card del evento */}
                  <div className={`bg-white rounded-2xl p-5 shadow-sm border border-slate-200/60 ${config.bgCard} transition-all duration-300 hover:shadow-md`}>
                    {/* Header */}
                    <div className="flex items-start justify-between gap-3 mb-3">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider ${
                            item.tipo === 'Consulta' ? 'bg-sky-50 text-sky-600' :
                            item.tipo === 'Vacuna' ? 'bg-emerald-50 text-emerald-600' :
                            'bg-amber-50 text-amber-600'
                          }`}>
                            {item.tipo}
                          </span>
                          {item.fecha && (
                            <span className="text-xs text-slate-400 font-medium">{formatearFecha(item.fecha)}</span>
                          )}
                        </div>
                        <h3 className="text-base font-bold text-slate-800 leading-snug">{item.titulo}</h3>
                      </div>
                    </div>

                    {/* ── Contenido según tipo ── */}

                    {/* Consulta Médica */}
                    {item.tipo === 'Consulta' && (
                      <div className="space-y-3">
                        {/* Signos vitales */}
                        {(item.temperatura || item.pesoActual) && (
                          <div className="flex gap-3">
                            {item.temperatura && (
                              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-red-50 text-xs font-semibold text-red-600 border border-red-100">
                                <Thermometer size={12} /> {item.temperatura}°C
                              </span>
                            )}
                            {item.pesoActual && (
                              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-violet-50 text-xs font-semibold text-violet-600 border border-violet-100">
                                <Weight size={12} /> {item.pesoActual} kg
                              </span>
                            )}
                          </div>
                        )}

                        {item.diagnostico && (
                          <div className="bg-sky-50/70 rounded-xl p-3 border border-sky-100 text-left">
                            <p className="text-xs font-bold text-sky-600 uppercase tracking-wider mb-1">Diagnóstico</p>
                            <p className="text-sm text-slate-700">{item.diagnostico}</p>
                          </div>
                        )}

                        {item.tratamiento && (
                          <div className="bg-slate-50 rounded-xl p-3 border border-slate-100 text-left">
                            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Tratamiento</p>
                            <p className="text-sm text-slate-700">{item.tratamiento}</p>
                          </div>
                        )}

                        {item.veterinario && (
                          <p className="text-xs text-slate-400 text-left">
                            <span className="font-semibold">Atendido por:</span> {item.veterinario}
                          </p>
                        )}

                        {item.consultaId && (
                          <div className="flex justify-start">
                            <button
                              onClick={() => manejarDescargarReceta(item.consultaId)}
                              disabled={descargando === item.consultaId}
                              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-sky-50 text-sky-600 text-xs font-bold hover:bg-sky-100 transition-colors border border-sky-200/60 disabled:opacity-50"
                            >
                              <FileText size={14} />
                              {descargando === item.consultaId ? 'Descargando...' : 'Ver Receta PDF'}
                            </button>
                          </div>
                        )}
                      </div>
                    )}

                    {/* Vacuna */}
                    {item.tipo === 'Vacuna' && (
                      <div className="space-y-2">
                        <div className="bg-emerald-50/70 rounded-xl p-3 border border-emerald-100">
                          <div className="grid grid-cols-2 gap-2 text-sm text-left">
                            <div>
                              <p className="text-[10px] font-bold text-emerald-500 uppercase tracking-wider">Vacuna</p>
                              <p className="text-slate-700 font-medium">{item.nombreVacuna || '—'}</p>
                            </div>
                            <div>
                              <p className="text-[10px] font-bold text-emerald-500 uppercase tracking-wider">Lote</p>
                              <p className="text-slate-700 font-medium">{item.lote || '—'}</p>
                            </div>
                            {item.laboratorio && (
                              <div>
                                <p className="text-[10px] font-bold text-emerald-500 uppercase tracking-wider">Laboratorio</p>
                                <p className="text-slate-700 font-medium">{item.laboratorio}</p>
                              </div>
                            )}
                            {item.proximoRefuerzo && (
                              <div>
                                <p className="text-[10px] font-bold text-emerald-500 uppercase tracking-wider">Próximo Refuerzo</p>
                                <p className="text-slate-700 font-semibold">{formatearFechaCorta(item.proximoRefuerzo)}</p>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Archivo Clínico */}
                    {item.tipo === 'Archivo' && (
                      <div className="space-y-2 flex flex-col items-start">
                        {item.tipoArchivo && (
                          <span className="inline-flex items-center px-2.5 py-1 rounded-lg bg-amber-50 text-xs font-semibold text-amber-600 border border-amber-100">
                            {item.tipoArchivo}
                          </span>
                        )}
                        {item.urlArchivo && (
                          <button
                            onClick={() => window.open(obtenerUrlImagen(item.urlArchivo), '_blank')}
                            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-amber-50 text-amber-600 text-xs font-bold hover:bg-amber-100 transition-colors border border-amber-200/60"
                          >
                            <Download size={14} />
                            Descargar Archivo
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Animación de entrada */}
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(12px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.4s ease-out forwards;
          opacity: 0;
        }
      `}</style>
    </div>
  );
};

export default LineaTiempoHistorialMascota;
