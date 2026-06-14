import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Package,
  AlertTriangle,
  Calendar,
  Filter,
  Plus,
  Edit2,
  Trash2,
  ChevronDown,
  ChevronUp,
  Save,
  X,
  FolderOpen
} from 'lucide-react';
import CargadorSpinner from '@/componentes/comun/CargadorSpinner';
import Buscador from '@/componentes/comun/Buscador';
import Paginacion from '@/componentes/comun/Paginacion';
import {
  obtenerProductos,
  obtenerCategorias,
  obtenerLotes,
  registrarLote,
  ajustarStockLote,
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

  // Modales Lotes e Inventario
  const [modalLote, setModalLote] = useState(false);
  const [modalAjuste, setModalAjuste] = useState(null); // Contendrá el lote a ajustar

  // Formularios
  const [formLote, setFormLote] = useState({
    productoId: '',
    codigoLote: '',
    stock: '',
    fechaVencimiento: ''
  });
  const [nuevoStockAjuste, setNuevoStockAjuste] = useState('');

  const [procesando, setProcesando] = useState(false);
  const [errorForm, setErrorForm] = useState('');

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
    // Filtro de búsqueda
    const matchesSearch = p.nombre.toLowerCase().includes(busqueda.toLowerCase()) || 
                          (p.descripcion && p.descripcion.toLowerCase().includes(busqueda.toLowerCase()));
    
    // Filtro de categoría
    const matchesCategory = filtroCategoria === '' || p.categoria?.id === Number(filtroCategoria);

    // Filtro de alertas
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

  // Crear Lote Submit
  const handleLoteSubmit = async (e) => {
    e.preventDefault();
    setProcesando(true);
    setErrorForm('');
    try {
      if (!formLote.productoId) {
        throw new Error('El producto es obligatorio.');
      }
      const payload = {
        producto: { id: Number(formLote.productoId) },
        codigoLote: formLote.codigoLote,
        stock: Number(formLote.stock),
        fechaVencimiento: formLote.fechaVencimiento || null
      };

      await registrarLote(payload);
      alert('Lote de stock registrado con éxito.');
      setModalLote(false);
      setFormLote({ productoId: '', codigoLote: '', stock: '', fechaVencimiento: '' });
      cargarDatos();
    } catch (err) {
      const msg = err.response?.data || err.message || 'Error al guardar el lote.';
      setErrorForm(typeof msg === 'string' ? msg : JSON.stringify(msg));
    } finally {
      setProcesando(false);
    }
  };

  // Ajustar Stock Submit
  const handleAjusteSubmit = async (e) => {
    e.preventDefault();
    setProcesando(true);
    setErrorForm('');
    try {
      if (nuevoStockAjuste === '' || Number(nuevoStockAjuste) < 0) {
        throw new Error('El stock debe ser un número igual o mayor a cero.');
      }
      await ajustarStockLote(modalAjuste.id, Number(nuevoStockAjuste));
      alert('Stock del lote ajustado con éxito.');
      setModalAjuste(null);
      setNuevoStockAjuste('');
      cargarDatos();
    } catch (err) {
      const msg = err.response?.data || err.message || 'Error al ajustar el stock.';
      setErrorForm(typeof msg === 'string' ? msg : JSON.stringify(msg));
    } finally {
      setProcesando(false);
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
      return 'bg-red-105 text-red-800 border-red-200 font-extrabold';
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
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Total Productos */}
        <div 
          onClick={() => setFiltroAlerta('TODOS')}
          className={`p-4 rounded-xl border transition-all duration-200 cursor-pointer ${
            filtroAlerta === 'TODOS'
              ? 'bg-sky-50/50 border-sky-200 shadow-sm'
              : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 hover:border-sky-200'
          }`}
        >
          <div className="flex justify-between items-center">
            <div>
              <span className="block text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Productos Activos</span>
              <span className="text-xl md:text-2xl font-bold text-slate-800 dark:text-slate-100 mt-0.5 block">{productos.length}</span>
            </div>
            <div className="w-9 h-9 rounded-lg bg-sky-50 text-sky-500 flex items-center justify-center shrink-0">
              <Package size={18} />
            </div>
          </div>
        </div>

        {/* Bajo Stock */}
        <div 
          onClick={() => setFiltroAlerta('BAJO_STOCK')}
          className={`p-4 rounded-xl border transition-all duration-200 cursor-pointer ${
            filtroAlerta === 'BAJO_STOCK'
              ? 'bg-amber-50/50 border-amber-250 shadow-sm'
              : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 hover:border-amber-200'
          }`}
        >
          <div className="flex justify-between items-center">
            <div>
              <span className="block text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Bajo Stock</span>
              <span className="text-xl md:text-2xl font-bold text-amber-600 mt-0.5 block">{alertasBajoStock.length}</span>
            </div>
            <div className="w-9 h-9 rounded-lg bg-amber-50 text-amber-500 flex items-center justify-center shrink-0">
              <AlertTriangle size={18} />
            </div>
          </div>
        </div>

        {/* Lotes próximos a vencer */}
        <div 
          onClick={() => setFiltroAlerta('VENCIMIENTOS')}
          className={`p-4 rounded-xl border transition-all duration-200 cursor-pointer ${
            filtroAlerta === 'VENCIMIENTOS'
              ? 'bg-rose-50/55 border-rose-250 shadow-sm'
              : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 hover:border-rose-250'
          }`}
        >
          <div className="flex justify-between items-center">
            <div>
              <span className="block text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Próximos a Vencer</span>
              <span className="text-xl md:text-2xl font-bold text-rose-600 mt-0.5 block">{alertasVencimiento.length}</span>
            </div>
            <div className="w-9 h-9 rounded-lg bg-rose-50 text-rose-500 flex items-center justify-center shrink-0">
              <Calendar size={18} />
            </div>
          </div>
        </div>
      </div>

      {/* ─── FILTROS Y ACCIONES ─── */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200/60 dark:border-slate-700/60 p-4 md:p-5 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Buscador y categoría */}
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

        {/* Botones de creación */}
        <div className="flex flex-col sm:flex-row items-center gap-2 w-full md:w-auto">
          <button
            onClick={() => navigate('/admin/inventario/registrar-producto')}
            className="w-full sm:w-auto px-4 py-2.5 bg-white dark:bg-slate-700 hover:bg-slate-50 dark:hover:bg-slate-600 text-slate-600 dark:text-slate-200 rounded-lg border border-slate-250/65 dark:border-slate-600 text-xs font-bold transition-all flex items-center justify-center gap-1.5 shadow-sm"
          >
            <Plus size={14} /> Registrar Producto
          </button>
          <button
            onClick={() => setModalLote(true)}
            className="w-full sm:w-auto px-4 py-2.5 bg-slate-900 dark:bg-slate-100 hover:bg-slate-800 dark:hover:bg-slate-200 text-white dark:text-slate-900 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 shadow-sm"
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
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs md:text-sm">
              <thead>
                <tr className="bg-slate-50/50 dark:bg-slate-900/40 border-b border-slate-100 dark:border-slate-700 text-slate-400 dark:text-slate-500 font-bold uppercase tracking-wider text-[10px]">
                  <th className="p-3.5 w-12"></th>
                  <th className="p-3.5">ID</th>
                  <th className="p-3.5">Producto</th>
                  <th className="p-3.5">Categoría</th>
                  <th className="p-3.5 text-right">Precio</th>
                  <th className="p-3.5 text-center">Mínimo</th>
                  <th className="p-3.5 text-center">Disponible</th>
                  <th className="p-3.5 text-center">Estado</th>
                  <th className="p-3.5 text-center">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
                {productosPaginados.length === 0 ? (
                  <tr>
                    <td colSpan="9" className="text-center py-10 text-slate-450 font-bold">
                      No se encontraron productos registrados.
                    </td>
                  </tr>
                ) : (
                  productosPaginados.map((p) => {
                    const stockTotal = calcularStockProducto(p.id);
                    const esBajoStock = stockTotal <= (p.stockMinimo || 5);
                    const expandido = productoExpandido === p.id;
                    const lotesDelProducto = lotes.filter((l) => l.producto?.id === p.id && l.activo);

                    return (
                      <>
                        <tr 
                          key={p.id} 
                          className={`hover:bg-slate-50/20 dark:hover:bg-slate-700/20 transition-colors ${
                            expandido ? 'bg-sky-50/5 dark:bg-sky-900/10' : ''
                          }`}
                        >
                          <td className="p-3.5 text-center">
                            <button
                              onClick={() => setProductoExpandido(expandido ? null : p.id)}
                              className="p-1 rounded hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-500 dark:text-slate-400 transition-colors"
                            >
                              {expandido ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                            </button>
                          </td>
                          <td className="p-3.5 font-bold text-slate-400 dark:text-slate-500">#{p.id}</td>
                          <td className="p-3.5">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 overflow-hidden flex items-center justify-center text-slate-300 shadow-inner shrink-0">
                                {p.fotoUrl ? (
                                  <img 
                                    src={`http://localhost:8080${p.fotoUrl}`} 
                                    alt={p.nombre} 
                                    className="w-full h-full object-cover" 
                                  />
                                ) : (
                                  <Package size={16} className="text-slate-400" />
                                )}
                              </div>
                              <div className="overflow-hidden">
                                <div className="font-bold text-slate-800 dark:text-slate-100 text-xs md:text-sm truncate max-w-xs">{p.nombre}</div>
                                {p.descripcion && <div className="text-[10px] text-slate-400 dark:text-slate-500 truncate max-w-xs mt-0.5">{p.descripcion}</div>}
                              </div>
                            </div>
                          </td>
                          <td className="p-3.5">
                            <span className="bg-slate-100 dark:bg-slate-700 text-slate-650 dark:text-slate-300 px-2 py-0.5 rounded text-[10px] border border-slate-200/50 dark:border-slate-600 font-semibold">
                              {p.categoria?.nombre || 'General'}
                            </span>
                          </td>
                          <td className="p-3.5 text-right font-bold text-slate-700 dark:text-slate-300">S/ {p.precio?.toFixed(2)}</td>
                          <td className="p-3.5 text-center font-semibold text-slate-500 dark:text-slate-400">{p.stockMinimo} unds.</td>
                          <td className="p-3.5 text-center font-bold text-slate-800 dark:text-slate-100">{stockTotal} unds.</td>
                          <td className="p-3.5 text-center">
                            {esBajoStock ? (
                              <span className="bg-red-50 text-red-650 border-red-200/50 text-[9px] font-bold px-2 py-0.5 rounded border">
                                Stock Crítico
                              </span>
                            ) : (
                              <span className="bg-emerald-50 text-emerald-650 border-emerald-200/50 text-[9px] font-bold px-2 py-0.5 rounded border">
                                Abastecido
                              </span>
                            )}
                          </td>
                          <td className="p-3.5 text-center">
                            <button
                              onClick={() => handleDesactivarProducto(p.id)}
                              className="p-1.5 bg-red-50 text-red-500 hover:bg-red-500 hover:text-white rounded-lg border border-red-100/50 transition-all shadow-sm active:scale-95"
                              title="Desactivar producto"
                            >
                              <Trash2 size={13} />
                            </button>
                          </td>
                        </tr>

                        {/* Fila expandida de lotes */}
                        {expandido && (
                          <tr className="bg-slate-50/30 dark:bg-slate-900/30">
                            <td colSpan="9" className="p-3.5">
                              <div className="pl-6 md:pl-12 pr-2 py-1.5 space-y-2.5">
                                <div className="flex justify-between items-center">
                                  <h4 className="font-bold text-slate-750 dark:text-slate-300 text-xs flex items-center gap-1.5">
                                    <FolderOpen size={13} className="text-sky-500" />
                                    Lotes Activos (Lotes con fecha crítica de caducidad)
                                  </h4>
                                </div>

                                {lotesDelProducto.length === 0 ? (
                                  <div className="p-4 text-center text-slate-400 dark:text-slate-500 font-semibold border border-dashed border-slate-200 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-800 text-xs">
                                    No hay lotes de stock registrados para este producto. Registra uno nuevo.
                                  </div>
                                ) : (
                                  <div className="bg-white dark:bg-slate-800 border border-slate-200/50 dark:border-slate-700 rounded-lg overflow-hidden shadow-sm">
                                    <table className="w-full text-left text-xs border-collapse">
                                      <thead>
                                        <tr className="bg-slate-50/50 dark:bg-slate-900/40 border-b border-slate-100 dark:border-slate-700 text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider text-[9px]">
                                          <th className="p-2.5">Código de Lote</th>
                                          <th className="p-2.5">Stock</th>
                                          <th className="p-2.5">Ingreso</th>
                                          <th className="p-2.5">Vencimiento</th>
                                          <th className="p-2.5 text-center">Estado</th>
                                          <th className="p-2.5 text-center">Acciones</th>
                                        </tr>
                                      </thead>
                                      <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
                                        {lotesDelProducto.map((lote) => {
                                          return (
                                            <tr key={lote.id} className="hover:bg-slate-50/30 dark:hover:bg-slate-700/30 transition-colors">
                                              <td className="p-2.5 font-mono font-bold text-slate-750 dark:text-slate-300">{lote.codigoLote}</td>
                                              <td className="p-2.5 font-semibold text-slate-800 dark:text-slate-100">{lote.stock} unds.</td>
                                              <td className="p-2.5 text-slate-400 dark:text-slate-500">{formatarFecha(lote.fechaIngreso)}</td>
                                              <td className="p-2.5 text-slate-600 dark:text-slate-300 font-bold">{formatarFecha(lote.fechaVencimiento)}</td>
                                              <td className="p-2.5 text-center">
                                                <span className={`text-[8.5px] font-bold px-2 py-0.5 rounded border ${obtenerBadgeVencimiento(lote)}`}>
                                                  {lote.fechaVencimiento ? (
                                                    alertasVencimiento.some((v) => v.id === lote.id) ? 'PRÓXIMO A VENCER' : 'VIGENTE'
                                                  ) : 'SIN VENCIMIENTO'}
                                                </span>
                                              </td>
                                              <td className="p-2.5 text-center">
                                                <div className="flex items-center justify-center gap-1">
                                                  <button
                                                    onClick={() => {
                                                      setModalAjuste(lote);
                                                      setNuevoStockAjuste(lote.stock);
                                                    }}
                                                    className="p-1 hover:bg-sky-50 border border-transparent hover:border-sky-200 text-sky-600 rounded transition-colors"
                                                    title="Ajustar stock"
                                                  >
                                                    <Edit2 size={11} />
                                                  </button>
                                                  <button
                                                    onClick={() => handleDesactivarLote(lote.id)}
                                                    className="p-1 hover:bg-red-50 border border-transparent hover:border-red-200 text-red-500 rounded transition-colors"
                                                    title="Desactivar lote"
                                                  >
                                                    <Trash2 size={11} />
                                                  </button>
                                                </div>
                                              </td>
                                            </tr>
                                          );
                                        })}
                                      </tbody>
                                    </table>
                                  </div>
                                )}
                              </div>
                            </td>
                          </tr>
                        )}
                      </>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>

          {/* Componente Paginacion */}
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

      {/* ─── MODAL REGISTRAR LOTE ─── */}
      {modalLote && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white dark:bg-slate-800 rounded-2xl max-w-md w-full border border-slate-200 dark:border-slate-700 shadow-2xl overflow-hidden animate-in slide-in-from-bottom-4 duration-350">
            <div className="p-5 border-b border-slate-100 dark:border-slate-700 flex justify-between items-center bg-slate-50/50 dark:bg-slate-900/40">
              <h3 className="font-black text-slate-800 dark:text-slate-100 text-sm uppercase tracking-wide">Ingresar Lote de Stock</h3>
              <button onClick={() => setModalLote(false)} className="p-1.5 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-400 transition-all">
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleLoteSubmit} className="p-5 space-y-4 text-xs font-semibold">
              <div className="space-y-1">
                <label className="block text-slate-500 dark:text-slate-400 uppercase">Seleccionar Producto</label>
                <select
                  required
                  value={formLote.productoId}
                  onChange={(e) => setFormLote({ ...formLote, productoId: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 dark:border-slate-600 rounded-lg text-slate-800 dark:text-slate-100 outline-none focus:border-sky-400 transition-all bg-white dark:bg-slate-700"
                >
                  <option value="">Seleccionar Producto</option>
                  {productos.map((prod) => (
                    <option key={prod.id} value={prod.id}>
                      {prod.nombre} (Stock: {calcularStockProducto(prod.id)})
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="block text-slate-500 dark:text-slate-400 uppercase">Código del Lote</label>
                  <input
                    type="text"
                    required
                    value={formLote.codigoLote}
                    onChange={(e) => setFormLote({ ...formLote, codigoLote: e.target.value })}
                    placeholder="Ej: LOTE-2026-A"
                    className="w-full px-3 py-2 border border-slate-200 dark:border-slate-600 rounded-lg text-slate-800 dark:text-slate-100 outline-none focus:border-sky-400 transition-all font-mono font-bold bg-white dark:bg-slate-700"
                  />
                </div>

                <div className="space-y-1">
                  <label className="block text-slate-500 dark:text-slate-400 uppercase">Cantidad (Stock)</label>
                  <input
                    type="number"
                    required
                    value={formLote.stock}
                    onChange={(e) => setFormLote({ ...formLote, stock: e.target.value })}
                    placeholder="10"
                    className="w-full px-3 py-2 border border-slate-200 dark:border-slate-600 rounded-lg text-slate-800 dark:text-slate-100 outline-none focus:border-sky-400 transition-all font-bold bg-white dark:bg-slate-700"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="block text-slate-500 dark:text-slate-400 uppercase">Fecha de Vencimiento</label>
                <input
                  type="date"
                  value={formLote.fechaVencimiento}
                  onChange={(e) => setFormLote({ ...formLote, fechaVencimiento: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 dark:border-slate-600 rounded-lg text-slate-800 dark:text-slate-100 outline-none focus:border-sky-400 transition-all bg-white dark:bg-slate-700"
                />
                <span className="text-[10px] text-slate-400 dark:text-slate-500 block mt-1 font-medium">Dejar vacío si el producto no tiene fecha de caducidad.</span>
              </div>

              {errorForm && (
                <div className="bg-red-50 border border-red-200 rounded-xl p-3 flex items-center gap-2 text-[11px] text-red-700">
                  <AlertTriangle size={14} className="shrink-0" />
                  <p>{errorForm}</p>
                </div>
              )}

              <div className="pt-3 border-t border-slate-100 dark:border-slate-700 flex justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setModalLote(false)}
                  className="px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-600 text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={procesando}
                  className="px-5 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg transition-colors flex items-center gap-1.5 disabled:opacity-50"
                >
                  {procesando ? <CargadorSpinner size="xs" color="border-white" /> : <Save size={12} />}
                  Ingresar Stock
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ─── MODAL AJUSTAR STOCK DE LOTE ─── */}
      {modalAjuste && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white dark:bg-slate-800 rounded-2xl max-w-sm w-full border border-slate-200 dark:border-slate-700 shadow-2xl overflow-hidden animate-in slide-in-from-bottom-4 duration-350">
            <div className="p-5 border-b border-slate-100 dark:border-slate-700 flex justify-between items-center bg-slate-50/50 dark:bg-slate-900/40">
              <h3 className="font-black text-slate-800 dark:text-slate-100 text-sm uppercase tracking-wide">Ajustar Stock de Lote</h3>
              <button onClick={() => setModalAjuste(null)} className="p-1.5 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-400 transition-all">
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleAjusteSubmit} className="p-5 space-y-4 text-xs font-semibold">
              <div className="bg-slate-50 dark:bg-slate-900/40 p-3.5 border border-slate-100 dark:border-slate-700 rounded-xl space-y-1.5">
                <p className="text-[10px] text-slate-400 dark:text-slate-500 uppercase tracking-widest font-bold">Lote Seleccionado</p>
                <p className="font-mono font-bold text-slate-800 dark:text-slate-100">{modalAjuste.codigoLote}</p>
                <p className="text-slate-500 dark:text-slate-400">Producto: {modalAjuste.producto?.nombre}</p>
              </div>

              <div className="space-y-1">
                <label className="block text-slate-500 dark:text-slate-400 uppercase">Nueva Cantidad (Stock)</label>
                <input
                  type="number"
                  required
                  value={nuevoStockAjuste}
                  onChange={(e) => setNuevoStockAjuste(e.target.value)}
                  placeholder="0"
                  className="w-full px-3 py-2 border border-slate-200 dark:border-slate-600 rounded-lg text-slate-800 dark:text-slate-100 outline-none focus:border-sky-400 transition-all font-bold bg-white dark:bg-slate-700"
                />
              </div>

              {errorForm && (
                <div className="bg-red-50 border border-red-200 rounded-xl p-3 flex items-center gap-2 text-[11px] text-red-700">
                  <AlertTriangle size={14} className="shrink-0" />
                  <p>{errorForm}</p>
                </div>
              )}

              <div className="pt-3 border-t border-slate-100 dark:border-slate-700 flex justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setModalAjuste(null)}
                  className="px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-600 text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={procesando}
                  className="px-5 py-2 bg-sky-500 hover:bg-sky-650 text-white rounded-lg transition-colors flex items-center gap-1.5 disabled:opacity-50"
                >
                  {procesando ? <CargadorSpinner size="xs" color="border-white" /> : <Save size={12} />}
                  Guardar Ajuste
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

export default PaginaInventario;
