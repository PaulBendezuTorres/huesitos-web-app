import { useState, useEffect } from 'react';
import { Megaphone, Calendar, Stethoscope } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { obtenerUrlImagen } from '@/servicios/imagenServicio';

const CarruselCampanas = ({ campanas }) => {
  const navigate = useNavigate();
  const [indiceCampana, setIndiceCampana] = useState(0);

  useEffect(() => {
    if (!campanas || campanas.length <= 1) return;
    const intervalo = setInterval(() => {
      setIndiceCampana((prev) => (prev + 1) % campanas.length);
    }, 6000);
    return () => clearInterval(intervalo);
  }, [campanas]);

  if (!campanas || campanas.length === 0) return null;

  return (
    <div className="relative overflow-hidden rounded-2xl border border-slate-200/60 dark:border-slate-800 shadow-lg bg-slate-900 dark:bg-slate-950 group">
      <div className="w-full h-[420px] md:h-[340px] lg:h-[400px] xl:h-[460px] relative overflow-hidden">
        {campanas.map((campana, index) => {
          const activa = index === indiceCampana;
          const tieneImagen = !!campana.imagenUrl;
          const urlImagen = tieneImagen ? obtenerUrlImagen(campana.imagenUrl) : '';

          return (
            <div
              key={campana.id}
              className={`absolute inset-0 transition-opacity duration-1000 ease-in-out flex ${
                activa ? 'opacity-100 z-10 pointer-events-auto' : 'opacity-0 z-0 pointer-events-none'
              } ${tieneImagen ? 'flex-col md:flex-row' : 'items-center'}`}
            >
              {tieneImagen ? (
                <>
                  {/* Imagen 75% */}
                  <div className="w-full md:w-[75%] h-[220px] md:h-full relative overflow-hidden shrink-0 bg-slate-950">
                    <img
                      src={urlImagen}
                      alt={campana.nombre}
                      className="absolute inset-0 w-full h-full object-cover select-none"
                    />
                  </div>

                  {/* Panel de información 25% */}
                  <div className="w-full md:w-[25%] bg-white dark:bg-slate-950 p-4 md:p-5 flex flex-col justify-between text-slate-800 dark:text-white md:border-l border-slate-200/60 dark:border-slate-850 overflow-y-auto h-full shrink-0 transition-colors duration-300">
                    <div className="space-y-2">
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-sky-50 dark:bg-sky-500/10 text-sky-600 dark:text-sky-300 text-[9px] font-black uppercase tracking-wider border border-sky-200 dark:border-sky-400/25 w-fit">
                        <Megaphone size={9} className="animate-pulse" /> Campaña
                      </span>
                      <h3 className="text-sm md:text-base font-black tracking-tight leading-tight text-slate-800 dark:text-white line-clamp-2">
                        {campana.nombre}
                      </h3>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-2 md:line-clamp-3 leading-relaxed">
                        {campana.descripcion}
                      </p>
                    </div>

                    <div className="mt-3 flex flex-col gap-2.5">
                      <div className="flex items-center justify-between gap-2 border-t border-slate-100 dark:border-slate-850 pt-2.5">
                        {campana.precioPromocional && (
                          <div>
                            <span className="text-[8px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider block leading-none mb-0.5">Precio Paquete</span>
                            <span className="text-sm font-black text-emerald-600 dark:text-emerald-400">
                              S/. {campana.precioPromocional.toFixed(2)}
                            </span>
                          </div>
                        )}
                        {campana.servicios && campana.servicios.length > 0 && (
                          <div className="flex items-center gap-1 text-[9px] font-bold text-slate-600 dark:text-slate-300 bg-slate-50 dark:bg-slate-900 px-2 py-1 rounded-lg border border-slate-200 dark:border-slate-800 select-none">
                            <Stethoscope size={9} className="text-sky-500 dark:text-sky-400" />
                            <span>{campana.servicios.length} {campana.servicios.length === 1 ? 'Servicio' : 'Servicios'}</span>
                          </div>
                        )}
                      </div>
                      <button
                        onClick={() => navigate('/cliente/reservar-cita')}
                        className="w-full py-2 bg-gradient-to-r from-sky-500 to-cyan-500 hover:from-sky-600 hover:to-cyan-600 text-white rounded-xl text-xs font-bold transition-all duration-300 shadow-md shadow-sky-500/10 flex items-center justify-center gap-1.5"
                      >
                        <Calendar size={12} /> Adquiere tu Promo
                      </button>
                    </div>
                  </div>
                </>
              ) : (
                <>
                  {/* Degradado premium alternativo si no hay foto */}
                  <div className="absolute inset-0 bg-gradient-to-r from-sky-500 via-cyan-500 to-emerald-500 dark:from-sky-900 dark:via-cyan-950 dark:to-emerald-900 z-10 transition-colors duration-300" />
                  <div className="relative z-20 px-8 sm:px-12 md:px-16 py-6 md:py-8 flex flex-col justify-center h-full max-w-xl md:max-w-2xl text-white">
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-white/20 dark:bg-sky-500/20 text-white dark:text-sky-300 text-[10px] font-black uppercase tracking-wider border border-white/30 dark:border-sky-400/30 w-fit mb-2">
                      <Megaphone size={10} className="animate-pulse" /> Campaña
                    </span>
                    <h3 className="text-lg sm:text-2xl font-black tracking-tight leading-tight mb-2 drop-shadow-sm text-white">
                      {campana.nombre}
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-100 dark:text-slate-200 line-clamp-2 mb-3 leading-relaxed drop-shadow">
                      {campana.descripcion}
                    </p>
                    <div className="flex flex-wrap items-center gap-3">
                      {campana.precioPromocional && (
                        <div className="px-3.5 py-1 rounded-xl bg-emerald-500 text-white text-xs sm:text-sm font-black shadow-md shadow-emerald-500/20 flex items-center gap-1 border border-emerald-400/30">
                          <span>Precio Especial: S/. {campana.precioPromocional}</span>
                        </div>
                      )}
                      {campana.servicios && campana.servicios.length > 0 && (
                        <div className="flex items-center gap-1 text-[11px] font-bold text-slate-200 dark:text-slate-300 bg-black/20 dark:bg-slate-850/85 backdrop-blur-md px-2.5 py-1 rounded-lg border border-white/10 dark:border-slate-700">
                          <Stethoscope size={12} className="text-sky-300 dark:text-sky-400" />
                          <span>{campana.servicios.length} {campana.servicios.length === 1 ? 'Servicio' : 'Servicios'}</span>
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

      {/* Controles del carrusel */}
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
  );
};

export default CarruselCampanas;
