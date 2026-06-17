import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Syringe, AlertCircle, RefreshCw, PawPrint, Calendar, FlaskConical, Clock } from 'lucide-react';
import { obtenerVacunasPorMascota, obtenerMascotaPorId } from '@/api/mascotaApi';

const MascotaVacunas = () => {
  const { mascotaId } = useParams();
  const navigate = useNavigate();
  const [vacunas, setVacunas] = useState([]);
  const [mascota, setMascota] = useState(null);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState('');

  const cargar = async () => {
    setCargando(true);
    setError('');
    try {
      const [vacunasData, mascotaData] = await Promise.all([
        obtenerVacunasPorMascota(mascotaId),
        obtenerMascotaPorId(mascotaId),
      ]);
      setVacunas(Array.isArray(vacunasData) ? vacunasData : []);
      setMascota(mascotaData);
    } catch {
      setError('No se pudo cargar el historial de vacunas.');
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => { cargar(); }, [mascotaId]);

  const formatearFecha = (fechaStr) => {
    if (!fechaStr) return '—';
    return new Date(fechaStr).toLocaleDateString('es-PE', { day: '2-digit', month: 'long', year: 'numeric' });
  };

  const estadoRefuerzo = (proximoRefuerzo) => {
    if (!proximoRefuerzo) return null;
    const dias = Math.ceil((new Date(proximoRefuerzo) - new Date()) / (1000 * 60 * 60 * 24));
    if (dias < 0) return { texto: 'Refuerzo vencido', clase: 'bg-rose-50 text-rose-600 border-rose-200 dark:bg-rose-950/30 dark:text-rose-400 dark:border-rose-800' };
    if (dias <= 7) return { texto: `Refuerzo en ${dias} días`, clase: 'bg-amber-50 text-amber-600 border-amber-200 dark:bg-amber-950/30 dark:text-amber-400 dark:border-amber-800' };
    return { texto: `Refuerzo: ${formatearFecha(proximoRefuerzo)}`, clase: 'bg-emerald-50 text-emerald-600 border-emerald-200 dark:bg-emerald-950/30 dark:text-emerald-400 dark:border-emerald-800' };
  };

  return (
    <div className="space-y-5">
      {/* Breadcrumb */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <button
            onClick={() => navigate('/cliente/mascotas')}
            className="flex items-center gap-1.5 text-sm font-semibold text-slate-400 dark:text-slate-500 hover:text-sky-500 dark:hover:text-sky-400 transition-colors"
          >
            <ArrowLeft size={15} />
            Mis mascotas
          </button>
          <span className="text-slate-300 dark:text-slate-700">/</span>
          <div className="flex items-center gap-1.5 text-sm font-semibold text-slate-600 dark:text-slate-300">
            <Syringe size={14} className="text-emerald-500" />
            Vacunas
            {mascota && <span className="text-slate-400 dark:text-slate-500 font-normal">· {mascota.nombre}</span>}
          </div>
        </div>
        <button
          onClick={cargar}
          className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 hover:bg-emerald-50 dark:hover:bg-emerald-950/30 hover:text-emerald-600 dark:hover:text-emerald-400 transition-all"
          title="Actualizar"
        >
          <RefreshCw size={15} />
        </button>
      </div>

      {/* Cargando */}
      {cargando && (
        <div className="flex items-center justify-center h-48">
          <div className="flex flex-col items-center gap-3">
            <div className="w-9 h-9 border-3 border-emerald-500 border-t-transparent rounded-full animate-spin" />
            <span className="text-sm font-semibold text-slate-400 dark:text-slate-500">Cargando vacunas...</span>
          </div>
        </div>
      )}

      {/* Error */}
      {!cargando && error && (
        <div className="flex items-center gap-3 bg-rose-50 dark:bg-rose-950/20 border border-rose-100 dark:border-rose-900/30 rounded-2xl p-5 text-rose-600 dark:text-rose-400">
          <AlertCircle size={18} className="shrink-0" />
          <span className="text-sm font-semibold">{error}</span>
        </div>
      )}

      {/* Vacías */}
      {!cargando && !error && vacunas.length === 0 && (
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/60 dark:border-slate-800 p-12 text-center shadow-sm">
          <div className="w-14 h-14 bg-emerald-50 dark:bg-emerald-950/40 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Syringe size={24} className="text-emerald-400" />
          </div>
          <h3 className="text-base font-bold text-slate-700 dark:text-slate-200 mb-1">Sin registros de vacunas</h3>
          <p className="text-sm text-slate-400 dark:text-slate-500">
            {mascota?.nombre} aún no tiene vacunas registradas en el sistema.
          </p>
        </div>
      )}

      {/* Lista de vacunas */}
      {!cargando && !error && vacunas.length > 0 && (
        <>
          {/* Resumen */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200/60 dark:border-slate-800 p-4 shadow-sm">
              <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-1">Total vacunas</p>
              <p className="text-2xl font-black text-slate-800 dark:text-slate-100">{vacunas.length}</p>
            </div>
            <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200/60 dark:border-slate-800 p-4 shadow-sm">
              <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-1">Última vacuna</p>
              <p className="text-sm font-bold text-slate-700 dark:text-slate-200">
                {formatearFecha(vacunas[vacunas.length - 1]?.fechaAplicacion)}
              </p>
            </div>
            <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200/60 dark:border-slate-800 p-4 shadow-sm col-span-2 sm:col-span-1">
              <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-1">Estado</p>
              {(() => {
                const conRefuerzo = vacunas.find(v => v.proximoRefuerzo);
                const estado = conRefuerzo ? estadoRefuerzo(conRefuerzo.proximoRefuerzo) : null;
                return estado
                  ? <span className={`inline-flex items-center gap-1.5 text-xs font-bold px-2.5 py-1 rounded-lg border ${estado.clase}`}><Clock size={11} />{estado.texto}</span>
                  : <span className="text-sm font-bold text-emerald-600 dark:text-emerald-400">Al día ✓</span>;
              })()}
            </div>
          </div>

          {/* Cards de vacunas */}
          <div className="space-y-3">
            {[...vacunas].reverse().map((vacuna, i) => {
              const refuerzo = estadoRefuerzo(vacuna.proximoRefuerzo);
              return (
                <div
                  key={vacuna.id ?? i}
                  className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/60 dark:border-slate-800 p-5 shadow-sm hover:shadow-md hover:border-emerald-200/80 dark:hover:border-emerald-900/60 transition-all duration-300"
                >
                  <div className="flex items-start gap-4">
                    {/* Ícono */}
                    <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 flex items-center justify-center shrink-0">
                      <Syringe size={18} className="text-emerald-500" />
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-start justify-between gap-2">
                        <div>
                          <h4 className="text-sm font-bold text-slate-800 dark:text-slate-100">
                            {vacuna.nombreVacuna || 'Vacuna'}
                          </h4>
                          <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5 flex items-center gap-1">
                            <Calendar size={11} />
                            {formatearFecha(vacuna.fechaAplicacion)}
                          </p>
                        </div>
                        {refuerzo && (
                          <span className={`inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-1 rounded-lg border shrink-0 ${refuerzo.clase}`}>
                            <Clock size={10} />{refuerzo.texto}
                          </span>
                        )}
                      </div>

                      {/* Detalles */}
                      <div className="mt-3 grid grid-cols-2 sm:grid-cols-3 gap-x-4 gap-y-2">
                        {vacuna.lote && (
                          <div>
                            <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">Lote</p>
                            <p className="text-xs font-semibold text-slate-600 dark:text-slate-300 flex items-center gap-1">
                              <FlaskConical size={10} className="text-emerald-400" />
                              {vacuna.lote}
                            </p>
                          </div>
                        )}
                        {vacuna.laboratorio && (
                          <div>
                            <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">Laboratorio</p>
                            <p className="text-xs font-semibold text-slate-600 dark:text-slate-300">{vacuna.laboratorio}</p>
                          </div>
                        )}
                        {vacuna.veterinario && (
                          <div>
                            <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">Veterinario</p>
                            <p className="text-xs font-semibold text-slate-600 dark:text-slate-300">{vacuna.veterinario}</p>
                          </div>
                        )}
                        {vacuna.dosis && (
                          <div>
                            <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">Dosis</p>
                            <p className="text-xs font-semibold text-slate-600 dark:text-slate-300">{vacuna.dosis}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
};

export default MascotaVacunas;
