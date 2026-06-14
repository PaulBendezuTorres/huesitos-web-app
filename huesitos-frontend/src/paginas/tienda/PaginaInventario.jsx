import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Filter, Plus } from 'lucide-react';
import CargadorSpinner from '@/componentes/comun/CargadorSpinner';
import Buscador from '@/componentes/comun/Buscador';
import Paginacion from '@/componentes/comun/Paginacion';

// Componentes Modularizados
import TarjetasAlertasInventario from '@/componentes/tienda/TarjetasAlertasInventario';
import TablaInventario from '@/componentes/tienda/TablaInventario';
import ModalIngresoLote from '@/componentes/tienda/ModalIngresoLote';
import ModalAjusteStockLote from '@/componentes/tienda/ModalAjusteStockLote';

import {
  obtenerProductos,
  obtenerCategorias,
  obtenerLotes,
  desactivarLote,
  desactivarProducto
} from '@/api/tiendaApi';
import {
  obtenerAlertasBajoStock,
  obtenerAlertasVencimientos
} from '@/servicios/finanzasServicio';

const PaginaInventario = () => {
  const navigate = useNavigate();

  // Datos
  const [productos, setProductos] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [lotes, setLotes] = useState([]);
  const [alertasBajoStock, setAlertasBajoStock] = useState([]);
  const [alertasVencimiento, setAlertasVencimiento] = useState([]);

  // UI y Carga
  const [loading, setLoading] = useState(true);
  const [busqueda, setBusqueda] = useState('');
  const [filtroCategoria, setFiltroCategoria] = useState('');
  const [filtroAlerta, setFiltroAlerta] = useState('TODOS'); // 'TODOS', 'BAJO_STOCK', 'VENCIMIENTOS'
  const [productoExpandido, setProductoExpandido] = useState(null);

  // Estados de Paginación
  const [paginaActual, setPaginaActual] = useState(1);
  const [itemsPorPagina, setItemsPorPagina] = useState(10);

  // Modales
  const [modalLote, setModalLote] = useState(false);
  const [modalAjuste, setModalAjuste] = useState(null); // Contendrá el lote a ajustar

  // Resetear paginación al cambiar filtros
  useEffect(() => {
    setPaginaActual(1);
  }, [busqueda, filtroCategoria, filtroAlerta]);

  // Cargar datos del backend
  const cargarDatos = useCallback(async () => {
    setLoading(true);
    try {
      const [prodsRes, catsRes, lotesRes, bajoStockRes, vencimientosRes] = await Promise.allSettled([
        obtenerProductos(),
        obtenerCategorias(),
        obtenerLotes(),
        obtenerAlertasBajoStock(),
        obtenerAlertasVencimientos(30)
      ]);

      setProductos(prodsRes.status === 'fulfilled' ? prodsRes.value : []);
      setCategorias(catsRes.status === 'fulfilled' ? catsRes.value : []);
      setLotes(lotesRes.status === 'fulfilled' ? lotesRes.value : []);
      setAlertasBajoStock(bajoStockRes.status === 'fulfilled' ? bajoStockRes.value : []);
      setAlertasVencimiento(vencimientosRes.status === 'fulfilled' ? vencimientosRes.value : []);
    } catch (err) {
      console.error('Error al cargar datos de inventario:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    cargarDatos();
  }, [cargarDatos]);

  // Filtrar productos
  const productosFiltrados = productos.filter((p) => {
    const matchesSearch = p.nombre.toLowerCase().includes(busqueda.toLowerCase()) || 
                          (p.descripcion && p.descripcion.toLowerCase().includes(busqueda.toLowerCase()));
    const matchesCategory = filtroCategoria === '' || p.categoria?.id === Number(filtroCategoria);

    let matchesAlerta = true;
    if (filtroAlerta === 'BAJO_STOCK') {
      matchesAlerta = alertasBajoStock.some((b) => b.id === p.id);
    } else if (filtroAlerta === 'VENCIMIENTOS') {
      matchesAlerta = lotes.some((l) => l.producto?.id === p.id && alertasVencimiento.some((v) => v.id === l.id));
    }

    return matchesSearch && matchesCategory && matchesAlerta;
  });

  // Calcular stock total disponible por producto sumando los lotes
  const calcularStockProducto = (productoId) => {
    return lotes
      .filter((l) => l.producto?.id === productoId && l.activo)
      .reduce((sum, l) => sum + (l.stock || 0), 0);
  };

  // Desactivar un producto
  const handleDesactivarProducto = async (id) => {
    if (!window.confirm('¿Estás seguro de que deseas desactivar este producto?')) return;
    try {
      await desactivarProducto(id);
      alert('Producto desactivado con éxito.');
      cargarDatos();
    } catch (err) {
      alert('Error al desactivar el producto: ' + (err.response?.data || err.message));
    }
  };

  // Desactivar un lote
  const handleDesactivarLote = async (id) => {
    if (!window.confirm('¿Estás seguro de desactivar este lote de inventario?')) return;
    try {
      await desactivarLote(id);
      alert('Lote desactivado con éxito.');
      cargarDatos();
    } catch (err) {
      alert('Error al desactivar el lote: ' + (err.response?.data || err.message));
    }
  };

  // Formato de fechas
  const formatarFecha = (fechaStr) => {
    if (!fechaStr) return 'Sin vencimiento (N/A)';
    return new Date(fechaStr + 'T12:00:00').toLocaleDateString('es-PE', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  };

  // Obtener badge/estilo de vencimiento de un lote
  const obtenerBadgeVencimiento = (lote) => {
    if (!lote.fechaVencimiento) return 'bg-slate-100 text-slate-700 border-slate-200';
    
    const hoy = new Date();
    const vencimiento = new Date(lote.fechaVencimiento + 'T00:00:00');
    const diffTime = vencimiento.getTime() - hoy.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays <= 0) {
      return 'bg-red-100 text-red-800 border-red-200 font-extrabold';
    } else if (diffDays <= 30) {
      return 'bg-amber-100 text-amber-800 border-amber-200 font-bold';
    } else {
      return 'bg-emerald-100 text-emerald-800 border-emerald-200';
    }
  };

  // Paginación lógica
  const totalItems = productosFiltrados.length;
  const productosPaginados = productosFiltrados.slice(
    (paginaActual - 1) * itemsPorPagina,
    paginaActual * itemsPorPagina
  );

  return (
    <div className="space-y-6 animate-in fade-in duration-300 font-sans text-slate-700 pb-10">
      
      {/* ─── TARJETAS DE ALERTAS CRÍTICAS ─── */}
      <TarjetasAlertasInventario
        totalProductos={productos.length}
        totalBajoStock={alertasBajoStock.length}
        totalVencimientos={alertasVencimiento.length}
        filtroAlerta={filtroAlerta}
        setFiltroAlerta={setFiltroAlerta}
      />

      {/* ─── FILTROS Y ACCIONES ─── */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200/60 dark:border-slate-700/60 p-4 md:p-5 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 flex-1 max-w-2xl">
          <Buscador 
            value={busqueda} 
            onChange={setBusqueda} 
            placeholder="Buscar producto por nombre..." 
            sinContenedor={true} 
          />

          <div className="flex items-center gap-2 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-lg px-3 py-2 shrink-0">
            <Filter size={13} className="text-slate-400" />
            <select
              value={filtroCategoria}
              onChange={(e) => setFiltroCategoria(e.target.value)}
              className="bg-transparent text-xs font-semibold text-slate-650 dark:text-slate-200 outline-none cursor-pointer w-full"
            >
              <option value="">Todas las categorías</option>
              {categorias.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.nombre}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-2 w-full md:w-auto">
          <button
            onClick={() => navigate('/admin/inventario/registrar-producto')}
            className="w-full sm:w-auto px-4 py-2.5 bg-white dark:bg-slate-700 hover:bg-slate-50 dark:hover:bg-slate-650 text-slate-650 dark:text-slate-200 rounded-lg border border-slate-250/65 dark:border-slate-600 text-xs font-bold transition-all flex items-center justify-center gap-1.5 shadow-sm"
          >
            <Plus size={14} /> Registrar Producto
          </button>
          <button
            onClick={() => setModalLote(true)}
            className="w-full sm:w-auto px-4 py-2.5 bg-slate-900 dark:bg-sky-500 hover:bg-slate-850 dark:hover:bg-sky-400 text-white dark:text-slate-950 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 shadow-sm active:scale-95 duration-200"
          >
            <Plus size={14} /> Ingresar Lote
          </button>
        </div>
      </div>

      {/* ─── TABLA PRINCIPAL Y LOTES EXPANDIBLES ─── */}
      {loading ? (
        <div className="flex flex-col items-center justify-center min-h-[400px] bg-white dark:bg-slate-800 rounded-2xl border border-slate-200/60 dark:border-slate-700/60 shadow-sm gap-3">
          <CargadorSpinner size="lg" />
          <span className="text-sm font-bold text-slate-400 dark:text-slate-500">Consultando stock e inventarios...</span>
        </div>
      ) : (
        <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200/50 dark:border-slate-700/50 shadow-sm overflow-hidden flex flex-col justify-between">
          
          <TablaInventario
            productosPaginados={productosPaginados}
            lotes={lotes}
            alertasBajoStock={alertasBajoStock}
            alertasVencimiento={alertasVencimiento}
            productoExpandido={productoExpandido}
            setProductoExpandido={setProductoExpandido}
            calcularStockProducto={calcularStockProducto}
            handleDesactivarProducto={handleDesactivarProducto}
            handleDesactivarLote={handleDesactivarLote}
            setModalAjuste={setModalAjuste}
            formatarFecha={formatarFecha}
            obtenerBadgeVencimiento={obtenerBadgeVencimiento}
          />

          {/* Componente Paginación */}
          <Paginacion
            paginaActual={paginaActual}
            totalItems={totalItems}
            itemsPorPagina={itemsPorPagina}
            onPaginaChange={setPaginaActual}
            onItemsPorPaginaChange={setItemsPorPagina}
            singularLabel="producto"
            pluralLabel="productos"
          />
        </div>
      )}

      {/* ─── MODAL INGRESAR LOTE ─── */}
      <ModalIngresoLote
        isOpen={modalLote}
        onClose={() => setModalLote(false)}
        productos={productos}
        calcularStockProducto={calcularStockProducto}
        cargarDatos={cargarDatos}
      />

      {/* ─── MODAL AJUSTAR STOCK DE LOTE ─── */}
      <ModalAjusteStockLote
        lote={modalAjuste}
        onClose={() => setModalAjuste(null)}
        cargarDatos={cargarDatos}
      />

    </div>
  );
};

export default PaginaInventario;
