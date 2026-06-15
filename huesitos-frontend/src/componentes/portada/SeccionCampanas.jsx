import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Megaphone, Stethoscope, ChevronLeft, ChevronRight } from 'lucide-react';

const SeccionCampanas = ({ campanas, fadeUp }) => {
  const [indice, setIndice] = useState(0);

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
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-sky-50 dark:bg-sky-950/40 text-sky-600 dark:text-sky-400 text-xs font-black uppercase tracking-wider border border-sky-100 dark:border-sky-900/40">
            <Megaphone size={12} className="animate-pulse" /> Promociones Exclusivas
          </span>
          <h2 className="text-3xl sm:text-4xl font-black text-slate-850 dark:text-white tracking-tight mt-3">
            Campañas de Salud y Eventos
          </h2>
          <p className="text-sm sm:text-base text-slate-500 dark:text-slate-400 mt-2 font-medium">
            Aprovecha nuestros paquetes de servicios clínicos diseñados especialmente para el bienestar y cuidado preventivo de tu mascota.
          </p>
        </div>

        {/* RULETA / CARRUSEL 16:9 */}
        <div className="relative overflow-hidden rounded-3xl border border-slate-200/60 dark:border-slate-700/60 shadow-xl bg-slate-950 group max-w-5xl mx-auto">
          <div className="aspect-[16/9] md:aspect-[21/9] w-full relative overflow-hidden">
            {campanas.map((campana, index) => {
              const activo = index === indice;
              const tieneImagen = !!campana.imagenUrl;
              const urlImagen = tieneImagen ? `http://localhost:8080${campana.imagenUrl}` : '';

              return (
                <div
                  key={campana.id}
                  className={`absolute inset-0 transition-all duration-1000 ease-in-out flex items-center ${
                    activo ? 'opacity-100 scale-100 z-10 pointer-events-auto' : 'opacity-0 scale-95 z-0 pointer-events-none'
                  }`}
                >
                  {/* Banner de fondo con imagen o degradado con textos */}
                  {tieneImagen ? (
                    <img
                      src={urlImagen}
                      alt={campana.nombre}
                      className="absolute inset-0 w-full h-full object-cover select-none transition-transform duration-700 hover:scale-105"
                    />
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
                              <span>Precio Especial: S/. {campana.precioPromocional}</span>
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
