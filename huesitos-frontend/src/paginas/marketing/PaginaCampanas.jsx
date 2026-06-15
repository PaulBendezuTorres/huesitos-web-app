import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Megaphone,
  Percent,
  Plus,
  Edit2,
  Trash2,
  Calendar,
  Clock,
  AlertTriangle,
  CheckCircle,
  ShoppingBag
} from 'lucide-react';
import CargadorSpinner from '@/componentes/comun/CargadorSpinner';
import {
  obtenerTodasCampanas,
  eliminarCampana,
  actualizarCampana,
  obtenerTodasOfertas,
  eliminarOferta,
  actualizarOferta
} from '@/api/marketingApi';

const PaginaCampanas = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('campanas'); // 'campanas' o 'ofertas'

  // Datos
  const [campanas, setCampanas] = useState([]);
  const [ofertas, setOfertas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [mensajeExito, setMensajeExito] = useState('');
  const [mensajeError, setMensajeError] = useState('');

  // Cargar datos
  const cargarDatos = useCallback(async () => {
    setLoading(true);
    setMensajeExito('');
    setMensajeError('');
    try {
      const [campRes, ofRes] = await Promise.allSettled([
        obtenerTodasCampanas(),
        obtenerTodasOfertas()
      ]);

      setCampanas(campRes.status === 'fulfilled' ? campRes.value : []);
      setOfertas(ofRes.status === 'fulfilled' ? ofRes.value : []);
    } catch (err) {
      console.error('Error al cargar datos de marketing:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    cargarDatos();
  }, [cargarDatos]);

  // --- CONTADORES DE EXPIRACIÓN ---
  const calcularExpiracion = (fechaFinStr) => {
    if (!fechaFinStr) return { texto: 'Sin límite', estilo: 'text-slate-500 bg-slate-100 border-slate-200 dark:bg-slate-700 dark:border-slate-600 dark:text-slate-300' };
    
    const hoy = new Date();
    hoy.setHours(0,0,0,0);
    const fin = new Date(fechaFinStr + 'T23:59:59');
    const diffTime = fin.getTime() - hoy.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays < 0) {
      return { texto: 'Expirada', estilo: 'text-red-700 bg-red-50 border-red-200 dark:bg-red-950/20 dark:border-red-900/40 dark:text-red-400' };
    } else if (diffDays === 0) {
      return { texto: 'Expira hoy', estilo: 'text-amber-700 bg-amber-50 border-amber-200 font-bold animate-pulse dark:bg-amber-950/20 dark:border-amber-900/40 dark:text-amber-400' };
    } else if (diffDays === 1) {
      return { texto: 'Último día', estilo: 'text-amber-700 bg-amber-50 border-amber-200 font-bold dark:bg-amber-950/20 dark:border-amber-900/40 dark:text-amber-400' };
    } else if (diffDays <= 7) {
      return { texto: `${diffDays} días rest.`, estilo: 'text-amber-700 bg-amber-50 border-amber-200 dark:bg-amber-950/20 dark:border-amber-900/40 dark:text-amber-400' };
    } else {
      return { texto: `${diffDays} días rest.`, estilo: 'text-emerald-700 bg-emerald-50 border-emerald-200 dark:bg-emerald-950/20 dark:border-emerald-900/40 dark:text-emerald-400' };
    }
  };

  // Formato de fechas
  const formatarFecha = (fechaStr) => {
    if (!fechaStr) return 'N/A';
    return new Date(fechaStr + 'T12:00:00').toLocaleDateString('es-PE', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  };

  // --- CRUD CAMPAÑAS ---
  const handleToggleActivoCampana = async (campana) => {
    const confirm = window.confirm(`¿Estás seguro de que deseas ${campana.activo ? 'desactivar' : 'activar'} esta campaña?`);
    if (!confirm) return;

    try {
      if (campana.activo) {
        await eliminarCampana(campana.id);
      } else {
        await actualizarCampana(campana.id, { ...campana, activo: true });
      }
      setMensajeExito('Estado de la campaña modificado con éxito.');
      cargarDatos();
    } catch (err) {
      setMensajeError('Error al modificar el estado: ' + (err.response?.data || err.message));
    }
  };

  // --- CRUD OFERTAS ---
  const handleToggleActivoOferta = async (oferta) => {
    const confirm = window.confirm(`¿Estás seguro de que deseas ${oferta.activo ? 'desactivar' : 'activar'} esta oferta de descuento?`);
    if (!confirm) return;

    try {
      if (oferta.activo) {
        await eliminarOferta(oferta.id);
      } else {
        await actualizarOferta(oferta.id, { ...oferta, activo: true });
      }
      setMensajeExito('Estado de la oferta modificado con éxito.');
      cargarDatos();
    } catch (err) {
      setMensajeError('Error al modificar el estado de la oferta: ' + (err.response?.data || err.message));
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      
      {/* Selector de pestañas */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200/60 dark:border-slate-700/60 p-4 shadow-sm flex flex-col sm:flex-row justify-between items-center gap-4">
        <div className="flex gap-2">
          <button
            onClick={() => setActiveTab('campanas')}
            className={`px-5 py-2.5 rounded-xl text-xs font-bold transition-all uppercase tracking-wide flex items-center gap-2 border ${
              activeTab === 'campanas'
                ? 'bg-sky-500 text-white border-sky-500 shadow-md shadow-sky-500/15'
                : 'bg-white dark:bg-slate-700 border-slate-200 dark:border-slate-600 text-slate-500 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-600'
            }`}
          >
            <Megaphone size={14} /> Campañas Publicitarias
          </button>
          
          <button
            onClick={() => setActiveTab('ofertas')}
            className={`px-5 py-2.5 rounded-xl text-xs font-bold transition-all uppercase tracking-wide flex items-center gap-2 border ${
              activeTab === 'ofertas'
                ? 'bg-sky-500 text-white border-sky-500 shadow-md shadow-sky-500/15'
                : 'bg-white dark:bg-slate-700 border-slate-200 dark:border-slate-600 text-slate-500 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-600'
            }`}
          >
            <Percent size={14} /> Ofertas de Productos
          </button>
        </div>

        {activeTab === 'campanas' ? (
          <button
            onClick={() => navigate('/admin/campanas/nueva')}
            className="px-4 py-2.5 bg-sky-50 text-sky-600 hover:bg-sky-500 hover:text-white rounded-xl border border-sky-100 hover:border-sky-300 text-xs font-bold transition-all flex items-center gap-1.5 shadow-sm dark:bg-slate-700 dark:text-sky-350 dark:border-slate-650"
          >
            <Plus size={14} /> Nueva Campaña
          </button>
        ) : (
          <button
            onClick={() => navigate('/admin/campanas/oferta/nueva')}
            className="px-4 py-2.5 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shadow-lg shadow-emerald-500/20"
          >
            <Plus size={14} /> Nueva Oferta de Descuento
          </button>
        )}
      </div>

      {/* MENSAJES DE OPERACIÓN */}
      {mensajeExito && (
        <div className="bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-100 dark:border-emerald-900/30 rounded-xl p-4 flex items-center gap-3">
          <CheckCircle size={18} className="text-emerald-500 shrink-0" />
          <p className="text-xs text-emerald-700 dark:text-emerald-400 font-semibold">{mensajeExito}</p>
        </div>
      )}
      {mensajeError && (
        <div className="bg-red-50 dark:bg-red-950/20 border border-red-100 dark:border-red-900/30 rounded-xl p-4 flex items-center gap-3">
          <AlertTriangle size={18} className="text-red-500 shrink-0" />
          <p className="text-xs text-red-750 dark:text-red-450 font-semibold">{mensajeError}</p>
        </div>
      )}

      {/* GRILLAS PRINCIPALES */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 bg-white dark:bg-slate-800 rounded-2xl border border-slate-200/60 dark:border-slate-700/60 shadow-sm gap-3 animate-pulse">
          <CargadorSpinner size="lg" />
          <span className="text-sm font-bold text-slate-400 dark:text-slate-500">Consultando datos de marketing...</span>
        </div>
      ) : activeTab === 'campanas' ? (
        /* ─── PESTAÑA: CAMPAÑAS ─── */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-in fade-in duration-200">
          {campanas.length === 0 ? (
            <div className="col-span-full py-16 text-center text-slate-400 dark:text-slate-500 font-bold bg-white dark:bg-slate-800 rounded-2xl border border-slate-200/60 dark:border-slate-700/60 shadow-sm">
              No hay campañas de marketing registradas.
            </div>
          ) : (
            campanas.map((c) => {
              const expiracion = calcularExpiracion(c.fechaFin);
              return (
                <div
                  key={c.id}
                  className={`bg-white dark:bg-slate-800 rounded-3xl border overflow-hidden transition-all duration-300 flex flex-col justify-between min-h-[360px] relative hover:shadow-xl hover:shadow-sky-500/5 group ${
                    c.activo ? 'border-slate-200/60 dark:border-slate-700/60 hover:border-sky-300' : 'border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-900/30'
                  }`}
                >
                  {/* Banner superior de la campaña */}
                  <div className="h-40 relative bg-slate-100 dark:bg-slate-900 flex-shrink-0 overflow-hidden">
                    {c.imagenUrl ? (
                      <img
                        src={`http://localhost:8080${c.imagenUrl}`}
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
                          <span className="text-sm font-black text-sky-700 dark:text-sky-450">
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
                    <div className="pt-3 border-t border-slate-100 dark:border-slate-700 flex items-center justify-between text-[10px] text-slate-400 dark:text-slate-500 font-semibold">
                      <div className="flex items-center gap-1.5">
                        <Calendar size={12} />
                        <span>{formatarFecha(c.fechaInicio)} — {formatarFecha(c.fechaFin)}</span>
                      </div>

                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => navigate(`/admin/campanas/editar/${c.id}`)}
                          className="p-1.5 hover:bg-sky-50 dark:hover:bg-slate-700 text-sky-600 dark:text-sky-400 rounded-lg border border-transparent hover:border-sky-100 dark:hover:border-slate-650 transition-all"
                          title="Editar campaña"
                        >
                          <Edit2 size={12} />
                        </button>
                        <button
                          onClick={() => handleToggleActivoCampana(c)}
                          className={`p-1.5 rounded-lg border border-transparent transition-all ${
                            c.activo 
                              ? 'hover:bg-red-50 dark:hover:bg-red-950/30 text-red-500 hover:border-red-100 dark:hover:border-red-900/30' 
                              : 'hover:bg-emerald-50 dark:hover:bg-emerald-950/30 text-emerald-500 hover:border-emerald-100 dark:hover:border-emerald-900/30'
                          }`}
                          title={c.activo ? 'Desactivar campaña' : 'Activar campaña'}
                        >
                          <Trash2 size={12} />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      ) : (
        /* ─── PESTAÑA: OFERTAS ─── */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-in fade-in duration-200">
          {ofertas.length === 0 ? (
            <div className="col-span-full py-16 text-center text-slate-400 dark:text-slate-500 font-bold bg-white dark:bg-slate-800 rounded-2xl border border-slate-200/60 dark:border-slate-700/60 shadow-sm">
              No hay ofertas de productos activas.
            </div>
          ) : (
            ofertas.map((o) => {
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
                      <p className="text-[10px] text-slate-400 dark:text-slate-500 font-bold uppercase tracking-wider flex items-center gap-1.5 mt-1">
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

                  <div className="pt-4 border-t border-slate-100 dark:border-slate-700 flex items-center justify-between text-[10px] text-slate-400 dark:text-slate-500 font-semibold mt-4">
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
                        onClick={() => handleToggleActivoOferta(o)}
                        className={`p-1.5 rounded-lg border border-transparent transition-all ${
                          o.activo 
                            ? 'hover:bg-red-50 dark:hover:bg-red-950/30 text-red-500 hover:border-red-100 dark:hover:border-red-900/30' 
                            : 'hover:bg-emerald-50 dark:hover:bg-emerald-950/30 text-emerald-500 hover:border-emerald-100 dark:hover:border-emerald-900/30'
                        }`}
                        title={o.activo ? 'Desactivar oferta' : 'Activar oferta'}
                      >
                        <Trash2 size={12} />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      )}
    </div>
  );
};

export default PaginaCampanas;
