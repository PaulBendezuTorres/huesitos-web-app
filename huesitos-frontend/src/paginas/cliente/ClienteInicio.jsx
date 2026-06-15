import { useState, useEffect } from 'react';
import { Megaphone, PawPrint, Calendar, Stethoscope, Syringe, Eye, RefreshCw } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import useTableroCliente from '@/hooks/useTableroCliente';

const ClienteInicio = () => {
  const navigate = useNavigate();
  const { mascotas, citas, campanas, cargando, recargar } = useTableroCliente();

  const [indiceCampana, setIndiceCampana] = useState(0);

  useEffect(() => {
    if (campanas.length <= 1) return;
    const intervalo = setInterval(() => {
      setIndiceCampana((prev) => (prev + 1) % campanas.length);
    }, 6000);
    return () => clearInterval(intervalo);
  }, [campanas]);

  // Filtrar citas pendientes/confirmadas/en espera (próximas)
  const citasProximas = citas.filter(
    (c) => c.estado === 'PENDIENTE' || c.estado === 'CONFIRMADA' || c.estado === 'EN_ESPERA'
  );

  const badgeEstado = (estado) => {
    const estilos = {
      PENDIENTE: 'bg-amber-50 text-amber-700 border-amber-100',
      CONFIRMADA: 'bg-emerald-50 text-emerald-700 border-emerald-100',
      EN_ESPERA: 'bg-sky-50 text-sky-700 border-sky-100',
      COMPLETADA: 'bg-slate-50 text-slate-500 border-slate-100',
      CANCELADA: 'bg-red-50 text-red-600 border-red-100',
    };
    return estilos[estado] || 'bg-slate-50 text-slate-500 border-slate-100';
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

  if (cargando) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-sky-500 border-t-transparent rounded-full animate-spin" />
          <span className="text-sm font-semibold text-slate-400">Cargando tu panel...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* RULETA/CARRUSEL DE CAMPAÑAS PUBLICITARIAS (16:9) */}
      {campanas && campanas.length > 0 && (
        <div className="relative overflow-hidden rounded-3xl border border-slate-200/60 dark:border-slate-700/60 shadow-lg bg-slate-900 group">
          <div className="aspect-[16/7] md:aspect-[21/7] w-full relative overflow-hidden">
            {campanas.map((campana, index) => {
              const activa = index === indiceCampana;
              const tieneImagen = !!campana.imagenUrl;
              const urlImagen = tieneImagen ? `http://localhost:8080${campana.imagenUrl}` : '';

              return (
                <div
                  key={campana.id}
                  className={`absolute inset-0 transition-opacity duration-1000 ease-in-out flex items-center ${
                    activa ? 'opacity-100 z-10 pointer-events-auto' : 'opacity-0 z-0 pointer-events-none'
                  }`}
                >
                  {/* Fondo: Imagen o Degradado */}
                  {tieneImagen ? (
                    <>
                      <img
                        src={urlImagen}
                        alt={campana.nombre}
                        className="absolute inset-0 w-full h-full object-cover select-none"
                      />
                      <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-900/80 to-transparent z-10" />
                    </>
                  ) : (
                    <div className="absolute inset-0 bg-gradient-to-r from-sky-850 via-cyan-800 to-emerald-700 z-10" />
                  )}

                  {/* Contenido de la campaña */}
                  <div className="relative z-20 px-8 sm:px-12 md:px-16 py-6 md:py-8 flex flex-col justify-center h-full max-w-xl md:max-w-2xl text-white">
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-sky-500/20 text-sky-300 text-[10px] font-black uppercase tracking-wider border border-sky-400/30 w-fit mb-2">
                      <Megaphone size={10} className="animate-pulse" /> Campaña Activa
                    </span>
                    <h3 className="text-lg sm:text-2xl font-black tracking-tight leading-tight mb-2 drop-shadow-sm text-transparent bg-clip-text bg-gradient-to-r from-white via-white to-slate-200">
                      {campana.nombre}
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-200 line-clamp-2 mb-3 leading-relaxed drop-shadow">
                      {campana.descripcion}
                    </p>

                    <div className="flex flex-wrap items-center gap-3">
                      {campana.precioPromocional && (
                        <div className="px-3.5 py-1 rounded-xl bg-emerald-500 text-white text-xs sm:text-sm font-black shadow-md shadow-emerald-500/20 flex items-center gap-1 border border-emerald-400/30">
                          <span>Precio Especial: S/. {campana.precioPromocional}</span>
                        </div>
                      )}
                      
                      {campana.servicios && campana.servicios.length > 0 && (
                        <div className="flex items-center gap-1 text-[11px] font-bold text-slate-300 bg-slate-800/85 backdrop-blur-md px-2.5 py-1 rounded-lg border border-slate-700">
                          <Stethoscope size={12} className="text-sky-400" />
                          <span>{campana.servicios.length} {campana.servicios.length === 1 ? 'Servicio' : 'Servicios'}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Controles de Navegación del Carrusel (Flechas visibles en hover) */}
          {campanas.length > 1 && (
            <>
              <button
                type="button"
                onClick={() => setIndiceCampana((prev) => (prev - 1 + campanas.length) % campanas.length)}
                className="absolute left-3 top-1/2 -translate-y-1/2 w-8 h-8 flex items-center justify-center rounded-xl bg-slate-900/60 hover:bg-slate-900 text-white transition-all opacity-0 group-hover:opacity-100 border border-slate-700/50 backdrop-blur-md z-30"
                title="Anterior"
              >
                &#10094;
              </button>
              <button
                type="button"
                onClick={() => setIndiceCampana((prev) => (prev + 1) % campanas.length)}
                className="absolute right-3 top-1/2 -translate-y-1/2 w-8 h-8 flex items-center justify-center rounded-xl bg-slate-900/60 hover:bg-slate-900 text-white transition-all opacity-0 group-hover:opacity-100 border border-slate-700/50 backdrop-blur-md z-30"
                title="Siguiente"
              >
                &#10095;
              </button>

              {/* Indicadores de puntos */}
              <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex items-center gap-1.5 z-30">
                {campanas.map((_, index) => (
                  <button
                    key={index}
                    type="button"
                    onClick={() => setIndiceCampana(index)}
                    className={`h-1.5 rounded-full transition-all duration-300 ${
                      index === indiceCampana ? 'w-5 bg-sky-500 shadow-sm shadow-sky-500/30' : 'w-1.5 bg-white/40 hover:bg-white/70'
                    }`}
                  />
                ))}
              </div>
            </>
          )}
        </div>
      )}

      {/* HEADER CON REFRESH */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-800 tracking-tight">Mis mascotas</h2>
          <p className="text-sm text-slate-400 mt-0.5">Gestiona la salud de tus compañeros</p>
        </div>
        <button
          onClick={recargar}
          className="flex items-center justify-center gap-2 px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm font-semibold text-slate-500 hover:text-sky-600 hover:border-sky-300 hover:shadow-md hover:shadow-sky-500/10 transition-all duration-300 self-start sm:self-auto"
        >
          <RefreshCw size={16} />
          Actualizar
        </button>
      </div>

      {/* GRID DE MASCOTAS */}
      {mascotas.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200/60 p-12 text-center shadow-sm">
          <div className="w-16 h-16 bg-sky-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <PawPrint size={28} className="text-sky-400" />
          </div>
          <h3 className="text-lg font-bold text-slate-700 mb-1">Aún no tienes mascotas registradas</h3>
          <p className="text-sm text-slate-400">Visita la clínica para registrar a tu compañero peludo.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          {mascotas.map((mascota) => (
            <div
              key={mascota.id}
              className="bg-white rounded-2xl border border-slate-200/60 p-5 shadow-sm hover:shadow-lg hover:shadow-sky-500/8 hover:border-sky-200 transition-all duration-300 group"
            >
              <div className="flex items-start gap-4">
                {/* Avatar de mascota */}
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-sky-500 to-cyan-400 flex items-center justify-center text-white text-xl font-bold shadow-lg shadow-sky-500/20 shrink-0 group-hover:scale-105 transition-transform duration-300">
                  {mascota.nombre ? mascota.nombre.charAt(0).toUpperCase() : '🐾'}
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="text-base font-bold text-slate-800 truncate">{mascota.nombre}</h4>
                  <p className="text-xs text-slate-400 mt-0.5">
                    {mascota.especie}{mascota.raza ? ` · ${mascota.raza}` : ''}
                  </p>
                  <div className="flex items-center gap-2 mt-2 flex-wrap">
                    {mascota.edad && (
                      <span className="inline-flex items-center px-2 py-0.5 rounded-md bg-slate-100 text-[11px] font-semibold text-slate-500">
                        {mascota.edad}
                      </span>
                    )}
                    {mascota.peso && (
                      <span className="inline-flex items-center px-2 py-0.5 rounded-md bg-slate-100 text-[11px] font-semibold text-slate-500">
                        {mascota.peso} kg
                      </span>
                    )}
                    {mascota.sexo && (
                      <span className="inline-flex items-center px-2 py-0.5 rounded-md bg-violet-50 text-[11px] font-semibold text-violet-500 border border-violet-100">
                        {mascota.sexo}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Acciones */}
              <div className="flex gap-2 mt-4 pt-4 border-t border-slate-100">
                <button
                  onClick={() => navigate(`/cliente/mascota/${mascota.id}`)}
                  className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-sky-50 text-sky-600 text-xs font-bold hover:bg-sky-100 transition-colors duration-200"
                >
                  <Eye size={14} />
                  Ver historial
                </button>
                <button
                  onClick={() => navigate(`/cliente/mascota/${mascota.id}`)}
                  className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-slate-50 text-slate-500 text-xs font-bold hover:bg-slate-100 transition-colors duration-200 border border-slate-200/60"
                >
                  <Syringe size={14} />
                  Vacunas
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* PRÓXIMAS CITAS */}
      <div>
        <h2 className="text-2xl font-bold text-slate-800 tracking-tight mb-1">Próximas citas</h2>
        <p className="text-sm text-slate-400 mb-5">Tus citas agendadas y confirmadas</p>

        {citasProximas.length === 0 ? (
          <div className="bg-white rounded-2xl border border-slate-200/60 p-10 text-center shadow-sm">
            <div className="w-14 h-14 bg-emerald-50 rounded-2xl flex items-center justify-center mx-auto mb-3">
              <Calendar size={24} className="text-emerald-400" />
            </div>
            <h3 className="text-base font-bold text-slate-700 mb-1">No tienes citas pendientes</h3>
            <p className="text-sm text-slate-400">Agenda una cita desde el menú lateral.</p>
          </div>
        ) : (
          <div className="bg-white rounded-2xl border border-slate-200/60 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-slate-100 bg-slate-50/50">
                    <th className="text-left px-6 py-3.5 text-xs font-semibold text-slate-500 tracking-wider">Fecha / hora</th>
                    <th className="text-left px-6 py-3.5 text-xs font-semibold text-slate-500 tracking-wider">Servicio</th>
                    <th className="text-left px-6 py-3.5 text-xs font-semibold text-slate-500 tracking-wider">Mascota</th>
                    <th className="text-left px-6 py-3.5 text-xs font-semibold text-slate-500 tracking-wider">Estado</th>
                  </tr>
                </thead>
                <tbody>
                  {citasProximas.map((cita) => {
                    const fecha = cita.fechaHora
                      ? new Date(cita.fechaHora).toLocaleDateString('es-PE', { day: '2-digit', month: 'short', year: 'numeric' })
                      : '—';
                    const hora = cita.fechaHora
                      ? new Date(cita.fechaHora).toLocaleTimeString('es-PE', { hour: '2-digit', minute: '2-digit' })
                      : '';

                    return (
                      <tr key={cita.id} className="border-b border-slate-50 last:border-0 hover:bg-slate-50/60 transition-colors">
                        <td className="px-6 py-4">
                          <p className="text-sm font-bold text-slate-700">{fecha}</p>
                          <p className="text-xs text-slate-400">{hora}</p>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <Stethoscope size={16} className="text-sky-400 shrink-0" />
                            <span className="text-sm font-semibold text-slate-600">{cita.servicio?.nombre || 'Consulta'}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className="text-sm text-slate-600">{cita.mascota?.nombre || '—'}</span>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`inline-flex items-center px-2.5 py-1 rounded-lg text-[11px] font-semibold border ${badgeEstado(cita.estado)}`}>
                            {formatearEstado(cita.estado)}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ClienteInicio;
