import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Megaphone, Stethoscope, ChevronLeft, ChevronRight, Calendar } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const SeccionCampanas = ({ campanas, fadeUp }) => {
  const [indice, setIndice] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    if (!campanas || campanas.length <= 1) return;
    const interval = setInterval(() => {
      setIndice((prev) => (prev + 1) % campanas.length);
    }, 6000);
    return () => clearInterval(interval);
  }, [campanas]);

  if (!campanas || campanas.length === 0) return null;

  return (
    <motion.section
      id="campanas"
      className="py-16 bg-white dark:bg-slate-900 border-b border-slate-200/50 dark:border-slate-800/40"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-100px" }}
      variants={fadeUp}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-sky-50 dark:bg-sky-950/40 text-sky-650 dark:text-sky-450 text-xs font-black uppercase tracking-wider border border-sky-100 dark:border-sky-900/40">
            <Megaphone size={12} className="animate-pulse" /> Promociones Exclusivas
          </span>
          <h2 className="text-3xl sm:text-4xl font-black text-slate-850 dark:text-white tracking-tight mt-3">
            Campañas de Salud y Eventos
          </h2>
          <p className="text-sm sm:text-base text-slate-500 dark:text-slate-400 mt-2 font-medium">
            Aprovecha nuestros paquetes de servicios clínicos diseñados especialmente para el bienestar y cuidado preventivo de tu mascota.
          </p>
        </div>

        {/* RULETA / CARRUSEL */}
        <div className="relative overflow-hidden rounded-3xl border border-slate-200/60 dark:border-slate-700/60 shadow-xl bg-slate-950 group max-w-5xl mx-auto">
          <div className="w-full h-[480px] md:h-[340px] relative overflow-hidden">
            {campanas.map((campana, index) => {
              const activo = index === indice;
              const tieneImagen = !!campana.imagenUrl;
              const urlImagen = tieneImagen ? `http://localhost:8080${campana.imagenUrl}` : '';

              return (
                <div
                  key={campana.id}
                  className={`absolute inset-0 transition-all duration-1000 ease-in-out flex ${
                    activo ? 'opacity-100 scale-100 z-10 pointer-events-auto' : 'opacity-0 scale-95 z-0 pointer-events-none'
                  } ${tieneImagen ? 'flex-col md:flex-row' : 'items-center'}`}
                >
                  {tieneImagen ? (
                    <>
                      {/* Banner de imagen */}
                      <div className="w-full md:w-3/5 aspect-video md:aspect-auto md:h-full relative overflow-hidden shrink-0 bg-slate-950">
                        <img
                          src={urlImagen}
                          alt={campana.nombre}
                          className="absolute inset-0 w-full h-full object-cover select-none transition-transform duration-700 hover:scale-105"
                        />
                      </div>

                      {/* Detalle informativo al costado */}
                      <div className="flex-1 bg-slate-900 dark:bg-slate-950 p-5 md:p-6 flex flex-col justify-between text-white md:border-l md:border-slate-800/80 overflow-y-auto h-full">
                        <div className="space-y-2.5">
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-sky-500/20 text-sky-300 text-[9px] font-black uppercase tracking-wider border border-sky-400/30 w-fit">
                            <Megaphone size={9} className="animate-pulse" /> Campaña Activa
                          </span>
                          <h3 className="text-base md:text-lg font-black tracking-tight leading-tight text-white line-clamp-1">
                            {campana.nombre}
                          </h3>
                          <p className="text-xs text-slate-350 line-clamp-2 md:line-clamp-3 leading-relaxed">
                            {campana.descripcion}
                          </p>
                        </div>

                        <div className="mt-4 flex flex-col gap-3">
                          <div className="flex items-center justify-between gap-2 border-t border-slate-800/80 pt-3">
                            {campana.precioPromocional && (
                              <div>
                                <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block leading-none mb-1">Precio Especial</span>
                                <span className="text-base font-black text-emerald-450">
                                  S/. {campana.precioPromocional.toFixed(2)}
                                </span>
                              </div>
                            )}

                            {campana.servicios && campana.servicios.length > 0 && (
                              <div className="flex items-center gap-1 text-[10px] font-bold text-slate-300 bg-slate-800/85 px-2.5 py-1 rounded-lg border border-slate-700 select-none">
                                <Stethoscope size={10} className="text-sky-400" />
                                <span>{campana.servicios.length} {campana.servicios.length === 1 ? 'Servicio' : 'Servicios'}</span>
                              </div>
                            )}
                          </div>

                          <button
                            onClick={() => navigate('/iniciar-sesion')}
                            className="w-full py-2.5 bg-gradient-to-r from-sky-500 to-cyan-500 hover:from-sky-600 hover:to-cyan-600 text-white rounded-xl text-xs font-bold transition-all duration-300 shadow-md shadow-sky-500/10 flex items-center justify-center gap-1.5 hover:shadow-lg hover:shadow-sky-500/20"
                          >
                            <Calendar size={13} /> Reservar Cita Promo
                          </button>
                        </div>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="absolute inset-0 bg-gradient-to-r from-sky-900 via-indigo-900 to-cyan-850 z-10" />
                      
                      {/* Detalle informativo */}
                      <div className="relative z-20 px-6 sm:px-16 py-8 flex flex-col justify-center h-full max-w-lg md:max-w-xl text-white">
                        <h3 className="text-xl sm:text-3xl font-black tracking-tight leading-tight mb-3 text-transparent bg-clip-text bg-gradient-to-r from-white via-white to-slate-200 drop-shadow-sm">
                          {campana.nombre}
                        </h3>
                        <p className="text-xs sm:text-sm text-slate-200 line-clamp-3 mb-5 leading-relaxed drop-shadow">
                          {campana.descripcion}
                        </p>

                        <div className="flex flex-wrap items-center gap-3">
                          {campana.precioPromocional && (
                            <div className="px-4 py-1.5 rounded-xl bg-emerald-500 text-white text-xs sm:text-sm font-black shadow-lg shadow-emerald-500/20 border border-emerald-400/30">
                              <span>Precio Especial: S/. {campana.precioPromocional.toFixed(2)}</span>
                            </div>
                          )}

                          {campana.servicios && campana.servicios.length > 0 && (
                            <div className="flex items-center gap-1.5 text-[11px] font-bold text-slate-300 bg-slate-800/80 backdrop-blur-md px-3 py-1.5 rounded-lg border border-slate-700">
                              <Stethoscope size={12} className="text-sky-400" />
                              <span>{campana.servicios.length} {campana.servicios.length === 1 ? 'Servicio Clínico' : 'Servicios Incluidos'}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </>
                  )}
                </div>
              );
            })}
          </div>


          {/* Botones de control manual */}
          {campanas.length > 1 && (
            <>
              <button
                type="button"
                onClick={() => setIndice((prev) => (prev - 1 + campanas.length) % campanas.length)}
                className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 flex items-center justify-center rounded-xl bg-slate-950/60 hover:bg-slate-900 text-white transition-all opacity-0 group-hover:opacity-100 border border-slate-700/50 backdrop-blur-sm z-30"
                title="Anterior"
              >
                <ChevronLeft size={20} />
              </button>
              <button
                type="button"
                onClick={() => setIndice((prev) => (prev + 1) % campanas.length)}
                className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 flex items-center justify-center rounded-xl bg-slate-950/60 hover:bg-slate-900 text-white transition-all opacity-0 group-hover:opacity-100 border border-slate-700/50 backdrop-blur-sm z-30"
                title="Siguiente"
              >
                <ChevronRight size={20} />
              </button>

              {/* Indicadores de puntos */}
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-2 z-30">
                {campanas.map((_, index) => (
                  <button
                    key={index}
                    type="button"
                    onClick={() => setIndice(index)}
                    className={`h-2 rounded-full transition-all duration-300 ${
                      index === indice ? 'w-6 bg-sky-500 shadow-md shadow-sky-500/30' : 'w-2 bg-white/40 hover:bg-white/70'
                    }`}
                  />
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </motion.section>
  );
};

export default SeccionCampanas;
