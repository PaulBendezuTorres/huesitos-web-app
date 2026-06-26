import { useNavigate } from 'react-router-dom';
import { Megaphone, Calendar, Edit2, Trash2, Power } from 'lucide-react';
import { obtenerUrlImagen } from '@/servicios/imagenServicio';

const ListaCampanasPublicitarias = ({ campanas, onToggleActivo, onEliminarFisico, calcularExpiracion, formatarFecha }) => {
  const navigate = useNavigate();

  if (campanas.length === 0) {
    return (
      <div className="py-16 text-center text-slate-400 dark:text-slate-550 font-bold bg-white dark:bg-slate-800 rounded-2xl border border-slate-200/60 dark:border-slate-700/60 shadow-sm">
        No hay campañas de marketing registradas.
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-in fade-in duration-200">
      {campanas.map((c) => {
        const expiracion = calcularExpiracion(c.fechaFin);
        return (
          <div
            key={c.id}
            className={`bg-white dark:bg-slate-800 rounded-3xl border overflow-hidden transition-all duration-300 flex flex-col justify-between min-h-[360px] relative hover:shadow-xl hover:shadow-sky-500/5 group ${
              c.activo ? 'border-slate-200/60 dark:border-slate-700/60 hover:border-sky-300' : 'border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-900/30'
            }`}
          >
            {/* Banner superior de la campaña */}
            <div className="aspect-video relative bg-slate-100 dark:bg-slate-900 flex-shrink-0 overflow-hidden">
              {c.imagenUrl ? (
                <img
                  src={obtenerUrlImagen(c.imagenUrl)}
                  alt={c.nombre}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-sky-500 to-cyan-400 flex items-center justify-center">
                  <Megaphone size={32} className="text-white opacity-40 animate-pulse" />
                </div>
              )}
              {/* Insignias flotantes en la imagen */}
              <div className="absolute top-3 left-3 flex gap-1.5 z-10">
                <span className={`text-[9px] font-black px-2.5 py-1 rounded-full border shadow-sm backdrop-blur-md ${expiracion.estilo}`}>
                  {expiracion.texto}
                </span>
              </div>
              <div className="absolute top-3 right-3 z-10">
                <span className={`text-[9px] font-black px-2.5 py-1 rounded-full border shadow-sm backdrop-blur-md ${
                  c.activo 
                    ? 'bg-emerald-500 border-emerald-400 text-white' 
                    : 'bg-red-500 border-red-400 text-white'
                }`}>
                  {c.activo ? 'ACTIVA' : 'INACTIVA'}
                </span>
              </div>
            </div>

            <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
              <div className="space-y-2">
                <h3 className="font-black text-slate-850 dark:text-slate-100 text-sm tracking-tight leading-snug group-hover:text-sky-500 transition-colors">
                  {c.nombre}
                </h3>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium leading-relaxed line-clamp-3">
                  {c.descripcion}
                </p>
              </div>

              {/* Precio Promocional de la Campaña */}
              {c.precioPromocional && (
                <div className="flex items-center gap-3 bg-sky-50/50 border border-sky-100 p-2.5 rounded-xl dark:bg-sky-950/20 dark:border-sky-900/40">
                  <div className="w-8 h-8 bg-sky-500 rounded-lg flex items-center justify-center text-white font-black shrink-0 shadow-sm shadow-sky-500/10 text-xs">
                    S/
                  </div>
                  <div>
                    <span className="text-[9px] font-black text-slate-400 uppercase block leading-none mb-1">Precio Paquete Promocional</span>
                    <span className="text-sm font-black text-sky-700 dark:text-sky-455">
                      S/ {c.precioPromocional.toFixed(2)}
                    </span>
                  </div>
                </div>
              )}

              {/* Servicios vinculados */}
              {c.servicios && c.servicios.length > 0 && (
                <div className="space-y-1.5">
                  <span className="text-[9px] uppercase font-black text-slate-400 tracking-wider">Servicios Incluidos:</span>
                  <div className="flex flex-wrap gap-1">
                    {c.servicios.map((s) => (
                      <span
                        key={s.id}
                        className="px-2 py-0.5 bg-sky-50 dark:bg-sky-950/40 text-sky-650 dark:text-sky-300 text-[9px] font-extrabold rounded-lg border border-sky-100 dark:border-sky-900/40"
                      >
                        {s.nombre}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Footer del card */}
              <div className="pt-3 border-t border-slate-100 dark:border-slate-700 flex items-center justify-between text-[10px] text-slate-400 dark:text-slate-550 font-semibold">
                <div className="flex items-center gap-1.5">
                  <Calendar size={12} />
                  <span>{formatarFecha(c.fechaInicio)} — {formatarFecha(c.fechaFin)}</span>
                </div>

                <div className="flex items-center gap-1">
                  <button
                    onClick={() => navigate(`/admin/campanas/editar/${c.id}`)}
                    className="p-1.5 hover:bg-sky-50 dark:hover:bg-slate-700 text-sky-650 dark:text-sky-400 rounded-lg border border-transparent hover:border-sky-100 dark:hover:border-slate-650 transition-all"
                    title="Editar campaña"
                  >
                    <Edit2 size={12} />
                  </button>
                  <button
                    onClick={() => onToggleActivo(c)}
                    className={`p-1.5 rounded-lg border border-transparent transition-all ${
                      c.activo 
                        ? 'hover:bg-amber-50 dark:hover:bg-amber-950/30 text-amber-500 hover:border-amber-100 dark:hover:border-amber-900/30' 
                        : 'hover:bg-emerald-50 dark:hover:bg-emerald-950/30 text-emerald-500 hover:border-emerald-100 dark:hover:border-emerald-900/30'
                    }`}
                    title={c.activo ? 'Desactivar campaña' : 'Activar campaña'}
                  >
                    <Power size={12} />
                  </button>
                  <button
                    onClick={() => onEliminarFisico(c)}
                    className="p-1.5 rounded-lg border border-transparent transition-all hover:bg-red-50 dark:hover:bg-red-950/30 text-red-500 hover:border-red-100 dark:hover:border-red-900/30"
                    title="Eliminar permanentemente de la base de datos"
                  >
                    <Trash2 size={12} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default ListaCampanasPublicitarias;
