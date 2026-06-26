import { useNavigate } from 'react-router-dom';
import { Clock, Edit2, Trash2, ShoppingBag, Power } from 'lucide-react';

const ListaOfertasProductos = ({ ofertas, onToggleActivo, onEliminarFisico, calcularExpiracion, formatarFecha }) => {
  const navigate = useNavigate();

  if (ofertas.length === 0) {
    return (
      <div className="py-16 text-center text-slate-400 dark:text-slate-550 font-bold bg-white dark:bg-slate-800 rounded-2xl border border-slate-200/60 dark:border-slate-700/60 shadow-sm">
        No hay ofertas de productos activas.
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-in fade-in duration-200">
      {ofertas.map((o) => {
        const expiracion = calcularExpiracion(o.fechaFin);
        const precioOrig = o.producto?.precio || 0;
        const precioDescuento = o.precioOferta || (precioOrig * (1 - (o.descuentoPorcentaje || 0) / 100));

        return (
          <div
            key={o.id}
            className={`bg-white dark:bg-slate-800 rounded-3xl border ${
              o.activo ? 'border-slate-200/60 dark:border-slate-700/60 hover:border-emerald-300' : 'border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-900/30'
            } shadow-sm p-5 transition-all duration-300 flex flex-col justify-between min-h-[260px] relative hover:shadow-md hover:shadow-emerald-500/5`}
          >
            <div className="space-y-4">
              <div className="flex justify-between items-start">
                <span className={`text-[9px] font-black px-2 py-0.5 rounded-full border ${expiracion.estilo}`}>
                  {expiracion.texto}
                </span>
                <span className={`text-[9px] font-extrabold px-2 py-0.5 rounded-full border ${
                  o.activo 
                    ? 'bg-emerald-50 border-emerald-200 text-emerald-700' 
                    : 'bg-red-50 border-red-200 text-red-700'
                }`}>
                  {o.activo ? 'ACTIVA' : 'INACTIVA'}
                </span>
              </div>

              <div>
                <h3 className="font-black text-slate-800 dark:text-slate-100 text-sm tracking-tight leading-tight">
                  {o.titulo}
                </h3>
                <p className="text-[10px] text-slate-400 dark:text-slate-550 font-bold uppercase tracking-wider flex items-center gap-1.5 mt-1">
                  <ShoppingBag size={12} className="text-slate-400" />
                  Producto: {o.producto?.nombre}
                </p>
                {o.descripcion && (
                  <p className="text-[11px] text-slate-550 dark:text-slate-400 font-medium leading-relaxed mt-2 line-clamp-2">{o.descripcion}</p>
                )}
              </div>

              {/* Precios y descuento */}
              <div className="flex items-center gap-4 bg-emerald-50/40 border border-emerald-100 p-3 rounded-xl dark:bg-emerald-950/20 dark:border-emerald-900/40">
                <div className="w-10 h-10 bg-emerald-500 rounded-lg flex flex-col items-center justify-center text-white font-black shrink-0 shadow-sm shadow-emerald-500/10">
                  <span className="text-[10px] uppercase font-bold leading-none">%</span>
                  <span className="text-sm leading-none mt-0.5">-{o.descuentoPorcentaje ? Math.round(o.descuentoPorcentaje) : Math.round((1 - precioDescuento/precioOrig)*100)}</span>
                </div>
                <div>
                  <span className="text-[9px] font-black text-slate-400 uppercase block leading-none mb-1">Precio Oferta</span>
                  <div className="flex items-baseline gap-1.5">
                    <span className="text-base font-black text-emerald-750 dark:text-emerald-400">S/ {precioDescuento.toFixed(2)}</span>
                    <span className="text-[10px] font-bold text-slate-400 line-through">S/ {precioOrig.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100 dark:border-slate-700 flex items-center justify-between text-[10px] text-slate-400 dark:text-slate-550 font-semibold mt-4">
              <div className="flex items-center gap-1.5">
                <Clock size={12} />
                <span>{formatarFecha(o.fechaInicio)} — {formatarFecha(o.fechaFin)}</span>
              </div>

              <div className="flex items-center gap-1">
                <button
                  onClick={() => navigate(`/admin/campanas/oferta/editar/${o.id}`)}
                  className="p-1.5 hover:bg-sky-50 dark:hover:bg-slate-700 text-sky-650 dark:text-sky-400 rounded-lg border border-transparent hover:border-sky-100 dark:hover:border-slate-650 transition-all"
                  title="Editar oferta"
                >
                  <Edit2 size={12} />
                </button>
                <button
                  onClick={() => onToggleActivo(o)}
                  className={`p-1.5 rounded-lg border border-transparent transition-all ${
                    o.activo 
                      ? 'hover:bg-amber-50 dark:hover:bg-amber-950/30 text-amber-500 hover:border-amber-100 dark:hover:border-amber-900/30' 
                      : 'hover:bg-emerald-50 dark:hover:bg-emerald-950/30 text-emerald-500 hover:border-emerald-100 dark:hover:border-emerald-900/30'
                  }`}
                  title={o.activo ? 'Desactivar oferta' : 'Activar oferta'}
                >
                  <Power size={12} />
                </button>
                <button
                  onClick={() => onEliminarFisico(o)}
                  className="p-1.5 rounded-lg border border-transparent transition-all hover:bg-red-50 dark:hover:bg-red-950/30 text-red-500 hover:border-red-100 dark:hover:border-red-900/30"
                  title="Eliminar permanentemente de la base de datos"
                >
                  <Trash2 size={12} />
                </button>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default ListaOfertasProductos;
