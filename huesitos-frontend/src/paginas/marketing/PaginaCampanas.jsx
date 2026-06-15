import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Megaphone,
  Percent,
  Plus,
  AlertTriangle,
  CheckCircle
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
import ListaCampanasPublicitarias from '@/componentes/marketing/ListaCampanasPublicitarias';
import ListaOfertasProductos from '@/componentes/marketing/ListaOfertasProductos';

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
        <ListaCampanasPublicitarias
          campanas={campanas}
          onToggleActivo={handleToggleActivoCampana}
          calcularExpiracion={calcularExpiracion}
          formatarFecha={formatarFecha}
        />
      ) : (
        <ListaOfertasProductos
          ofertas={ofertas}
          onToggleActivo={handleToggleActivoOferta}
          calcularExpiracion={calcularExpiracion}
          formatarFecha={formatarFecha}
        />
      )}
    </div>
  );
};

export default PaginaCampanas;
