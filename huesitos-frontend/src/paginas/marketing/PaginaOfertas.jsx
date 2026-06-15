import { useState, useEffect, useCallback } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Percent, Plus, AlertTriangle, CheckCircle, ArrowLeft } from 'lucide-react';
import CargadorSpinner from '@/componentes/comun/CargadorSpinner';
import {
  obtenerTodasOfertas,
  eliminarOferta,
  eliminarOfertaFisico,
  actualizarOferta
} from '@/api/marketingApi';
import ListaOfertasProductos from '@/componentes/marketing/ListaOfertasProductos';

const PaginaOfertas = () => {
  const navigate = useNavigate();
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
      const ofRes = await obtenerTodasOfertas();
      setOfertas(ofRes || []);
    } catch (err) {
      console.error('Error al cargar datos de ofertas:', err);
      setMensajeError('No se pudieron obtener las ofertas.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    cargarDatos();
  }, [cargarDatos]);

  // --- CONTADORES DE EXPIRACIÓN ---
  const calcularExpiracion = (fechaFinStr) => {
    if (!fechaFinStr) return { 
      texto: 'Sin límite', 
      estilo: 'text-slate-500 bg-slate-100 border-slate-200 dark:bg-slate-700 dark:border-slate-600 dark:text-slate-300' 
    };
    
    const hoy = new Date();
    hoy.setHours(0,0,0,0);
    const fin = new Date(fechaFinStr + 'T23:59:59');
    const diffTime = fin.getTime() - hoy.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays < 0) {
      return { 
        texto: 'Expirada', 
        estilo: 'text-red-700 bg-red-50 border-red-200 dark:bg-red-950/20 dark:border-red-900/40 dark:text-red-400' 
      };
    } else if (diffDays === 0) {
      return { 
        texto: 'Expira hoy', 
        estilo: 'text-amber-700 bg-amber-50 border-amber-200 font-bold animate-pulse dark:bg-amber-950/20 dark:border-amber-900/40 dark:text-amber-400' 
      };
    } else if (diffDays === 1) {
      return { 
        texto: 'Último día', 
        estilo: 'text-amber-700 bg-amber-50 border-amber-200 font-bold dark:bg-amber-950/20 dark:border-amber-900/40 dark:text-amber-400' 
      };
    } else if (diffDays <= 7) {
      return { 
        texto: `${diffDays} días rest.`, 
        estilo: 'text-amber-700 bg-amber-50 border-amber-200 dark:bg-amber-950/20 dark:border-amber-900/40 dark:text-amber-400' 
      };
    } else {
      return { 
        texto: `${diffDays} días rest.`, 
        estilo: 'text-emerald-700 bg-emerald-50 border-emerald-200 dark:bg-emerald-950/20 dark:border-emerald-900/40 dark:text-emerald-400' 
      };
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

  // --- CRUD OFERTAS ---
  const handleToggleActivo = async (oferta) => {
    const accion = oferta.activo ? 'desactivar' : 'activar';
    const confirm = window.confirm(`¿Estás seguro de que deseas ${accion} la oferta "${oferta.titulo}"?`);
    if (!confirm) return;

    try {
      if (oferta.activo) {
        await eliminarOferta(oferta.id);
      } else {
        await actualizarOferta(oferta.id, { ...oferta, activo: true });
      }
      setMensajeExito(`Oferta ${accion}da con éxito.`);
      cargarDatos();
    } catch (err) {
      setMensajeError(`Error al ${accion} la oferta: ` + (err.response?.data || err.message));
    }
  };

  const handleEliminarFisico = async (oferta) => {
    const confirm = window.confirm(`¿Estás seguro de que deseas ELIMINAR COMPLETAMENTE la oferta "${oferta.titulo}" de la base de datos?\nEsta acción es irreversible.`);
    if (!confirm) return;

    try {
      await eliminarOfertaFisico(oferta.id);
      setMensajeExito('Oferta eliminada permanentemente con éxito.');
      cargarDatos();
    } catch (err) {
      setMensajeError('Error al eliminar la oferta permanentemente: ' + (err.response?.data || err.message));
    }
  };


  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Encabezado */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200/60 dark:border-slate-700/60 shadow-sm">
        <div className="flex items-center gap-3">
          <Link
            to="/admin"
            className="p-2.5 bg-slate-50 hover:bg-slate-100 dark:bg-slate-900/60 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 rounded-xl transition-all border border-slate-200/60 dark:border-slate-700/60"
          >
            <ArrowLeft size={18} />
          </Link>
          <div>
            <h1 className="text-2xl font-black text-slate-850 dark:text-slate-100 tracking-tight leading-none">
              Ofertas de Descuento
            </h1>
            <p className="text-slate-500 dark:text-slate-400 text-xs mt-1.5 font-medium">
              Gestiona campañas de descuento exclusivas para los productos de la farmacia veterinaria.
            </p>
          </div>
        </div>

        <button
          onClick={() => navigate('/admin/ofertas/nueva')}
          className="px-4 py-2.5 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shadow-lg shadow-emerald-500/20"
        >
          <Plus size={14} /> Nueva Oferta de Descuento
        </button>
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
          <span className="text-sm font-bold text-slate-400 dark:text-slate-550">Consultando ofertas de farmacia...</span>
        </div>
      ) : (
        <ListaOfertasProductos
          ofertas={ofertas}
          onToggleActivo={handleToggleActivo}
          onEliminarFisico={handleEliminarFisico}
          calcularExpiracion={calcularExpiracion}
          formatarFecha={formatarFecha}
        />
      )}
    </div>
  );
};

export default PaginaOfertas;
