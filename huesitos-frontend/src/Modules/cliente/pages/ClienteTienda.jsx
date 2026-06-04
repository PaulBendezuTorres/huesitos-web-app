import { useState, useEffect, useCallback } from 'react';
import {
  Search, ShoppingCart, X, Plus, Minus, Trash2, Package,
  AlertTriangle, Check, Loader2, Tag, Filter,
} from 'lucide-react';
import {
  obtenerProductos,
  buscarProductos,
  obtenerCarrito,
  agregarAlCarrito,
  modificarCantidadCarrito,
  eliminarItemCarrito,
  realizarCheckout,
} from '../../../api/tiendaAPI';

const ClienteTienda = () => {
  // Productos
  const [productos, setProductos] = useState([]);
  const [busqueda, setBusqueda] = useState('');
  const [categoriaFiltro, setCategoriaFiltro] = useState('todos');
  const [cargando, setCargando] = useState(true);

  // Carrito
  const [carrito, setCarrito] = useState([]);
  const [carritoAbierto, setCarritoAbierto] = useState(false);
  const [procesando, setProcesando] = useState(false);
  const [exito, setExito] = useState(false);
  const [error, setError] = useState('');
  const [agregando, setAgregando] = useState(null);

  // Cargar productos
  useEffect(() => {
    const cargar = async () => {
      setCargando(true);
      try {
        const data = await obtenerProductos();
        setProductos(data.filter((p) => p.activo !== false));
      } catch (err) {
        console.error('Error cargando productos:', err);
      } finally {
        setCargando(false);
      }
    };
    cargar();
  }, []);

  // Cargar carrito
  const cargarCarrito = useCallback(async () => {
    try {
      const data = await obtenerCarrito();
      setCarrito(Array.isArray(data) ? data : []);
    } catch {
      setCarrito([]);
    }
  }, []);

  useEffect(() => {
    cargarCarrito();
  }, [cargarCarrito]);

  // Buscar productos
  useEffect(() => {
    const timeout = setTimeout(async () => {
      if (busqueda.trim()) {
        try {
          const data = await buscarProductos(busqueda);
          setProductos(data.filter((p) => p.activo !== false));
        } catch {
          /* no-op */
        }
      } else {
        try {
          const data = await obtenerProductos();
          setProductos(data.filter((p) => p.activo !== false));
        } catch {
          /* no-op */
        }
      }
    }, 400);
    return () => clearTimeout(timeout);
  }, [busqueda]);

  // Filtrar por categoría (frontend)
  const categorias = [...new Set(productos.map((p) => p.categoria?.nombre).filter(Boolean))];
  const productosFiltrados = categoriaFiltro === 'todos'
    ? productos
    : productos.filter((p) => p.categoria?.nombre === categoriaFiltro);

  // Agregar al carrito
  const manejarAgregar = async (productoId) => {
    setAgregando(productoId);
    try {
      await agregarAlCarrito(productoId, 1);
      await cargarCarrito();
    } catch (err) {
      setError(err.response?.data || 'Error al agregar al carrito');
      setTimeout(() => setError(''), 3000);
    } finally {
      setAgregando(null);
    }
  };

  // Modificar cantidad
  const manejarCantidad = async (itemId, nuevaCantidad) => {
    if (nuevaCantidad < 1) {
      await manejarEliminar(itemId);
      return;
    }
    try {
      await modificarCantidadCarrito(itemId, nuevaCantidad);
      await cargarCarrito();
    } catch (err) {
      setError(err.response?.data || 'Error al modificar cantidad');
      setTimeout(() => setError(''), 3000);
    }
  };

  // Eliminar item
  const manejarEliminar = async (itemId) => {
    try {
      await eliminarItemCarrito(itemId);
      await cargarCarrito();
    } catch {
      /* no-op */
    }
  };

  // Checkout
  const manejarCheckout = async () => {
    setProcesando(true);
    setError('');
    try {
      await realizarCheckout();
      setExito(true);
      setCarrito([]);
      setTimeout(() => {
        setExito(false);
        setCarritoAbierto(false);
      }, 3000);
    } catch (err) {
      setError(err.response?.data || 'Error al procesar la compra');
    } finally {
      setProcesando(false);
    }
  };

  // Cálculos
  const totalItems = carrito.reduce((sum, item) => sum + (item.cantidad || 0), 0);
  const subtotal = carrito.reduce((sum, item) => sum + ((item.producto?.precio || 0) * (item.cantidad || 0)), 0);

  // Calcular stock consolidado de un producto
  const obtenerStockConsolidado = (producto) => {
    if (producto.inventarios && Array.isArray(producto.inventarios)) {
      return producto.inventarios.reduce((sum, inv) => sum + (inv.cantidadStock || 0), 0);
    }
    return producto.stockTotal || producto.stock || 0;
  };

  if (cargando) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-sky-500 border-t-transparent rounded-full animate-spin" />
          <span className="text-sm font-semibold text-slate-400">Cargando tienda...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 relative">
      {/* ─── CABECERA + BUSCADOR ─── */}
      <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
        <div>
          <h2 className="text-2xl font-black text-slate-800 tracking-tight">Tienda Online</h2>
          <p className="text-sm text-slate-400 mt-0.5">Alimentos, accesorios y medicinas para tu mascota</p>
        </div>

        <div className="flex items-center gap-3">
          {/* Buscador */}
          <div className="relative">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Buscar productos..."
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              className="pl-9 pr-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:border-sky-400 focus:ring-2 focus:ring-sky-100 outline-none w-56 transition-all"
            />
          </div>

          {/* Botón Carrito */}
          <button
            onClick={() => setCarritoAbierto(true)}
            className="relative flex items-center gap-2 px-4 py-2.5 rounded-xl bg-sky-500 text-white font-bold text-sm hover:bg-sky-600 transition-all shadow-lg shadow-sky-500/20"
          >
            <ShoppingCart size={18} />
            Carrito
            {totalItems > 0 && (
              <span className="absolute -top-2 -right-2 w-5 h-5 bg-red-500 text-white text-[10px] font-black rounded-full flex items-center justify-center shadow-lg">
                {totalItems}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* ─── FILTROS POR CATEGORÍA ─── */}
      <div className="flex gap-2 flex-wrap items-center">
        <Filter size={14} className="text-slate-400" />
        <button
          onClick={() => setCategoriaFiltro('todos')}
          className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
            categoriaFiltro === 'todos'
              ? 'bg-sky-500 text-white shadow-md'
              : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
          }`}
        >
          Todos
        </button>
        {categorias.map((cat) => (
          <button
            key={cat}
            onClick={() => setCategoriaFiltro(cat)}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              categoriaFiltro === cat
                ? 'bg-sky-500 text-white shadow-md'
                : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* ─── GRID DE PRODUCTOS ─── */}
      {productosFiltrados.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200/60 p-12 text-center shadow-sm">
          <Package size={40} className="text-slate-300 mx-auto mb-3" />
          <p className="text-slate-500 font-medium">No se encontraron productos</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {productosFiltrados.map((producto) => {
            const stock = obtenerStockConsolidado(producto);
            const stockBajo = stock > 0 && stock < 3;

            return (
              <div
                key={producto.id}
                className="bg-white rounded-2xl border border-slate-200/60 p-4 shadow-sm hover:shadow-lg hover:border-sky-200 transition-all duration-300 group flex flex-col"
              >
                {/* Imagen placeholder */}
                <div className="w-full h-32 rounded-xl bg-gradient-to-br from-slate-100 to-slate-50 flex items-center justify-center mb-3 group-hover:from-sky-50 group-hover:to-cyan-50 transition-all">
                  <Package size={36} className="text-slate-300 group-hover:text-sky-400 transition-colors" />
                </div>

                {/* Info */}
                <div className="flex-1">
                  {producto.categoria?.nombre && (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-slate-100 text-[10px] font-bold text-slate-500 uppercase mb-1.5">
                      <Tag size={10} /> {producto.categoria.nombre}
                    </span>
                  )}
                  <h4 className="text-sm font-bold text-slate-800 leading-snug mb-1 line-clamp-2">{producto.nombre}</h4>

                  <div className="flex items-center justify-between mt-2">
                    <p className="text-lg font-black text-emerald-600">
                      S/ {Number(producto.precio || 0).toFixed(2)}
                    </p>
                    <span className={`text-[11px] font-semibold ${stock === 0 ? 'text-red-500' : stockBajo ? 'text-amber-500' : 'text-slate-400'}`}>
                      {stock === 0 ? 'Agotado' : `${stock} uds.`}
                    </span>
                  </div>

                  {stockBajo && (
                    <div className="mt-1.5 flex items-center gap-1 text-amber-500">
                      <AlertTriangle size={12} />
                      <span className="text-[10px] font-bold">¡Últimas unidades!</span>
                    </div>
                  )}
                </div>

                {/* Botón agregar */}
                <button
                  onClick={() => manejarAgregar(producto.id)}
                  disabled={stock === 0 || agregando === producto.id}
                  className="w-full mt-3 flex items-center justify-center gap-1.5 py-2.5 rounded-xl bg-sky-50 text-sky-600 text-xs font-bold hover:bg-sky-100 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  {agregando === producto.id ? (
                    <Loader2 size={14} className="animate-spin" />
                  ) : (
                    <ShoppingCart size={14} />
                  )}
                  {stock === 0 ? 'Sin Stock' : 'Añadir al Carrito'}
                </button>
              </div>
            );
          })}
        </div>
      )}

      {/* ─── ERROR FLOTANTE ─── */}
      {error && (
        <div className="fixed bottom-6 right-6 bg-red-50 border border-red-200 rounded-xl p-4 shadow-xl flex items-center gap-3 z-50 animate-fadeIn max-w-sm">
          <AlertTriangle size={18} className="text-red-500 shrink-0" />
          <p className="text-sm text-red-700 font-medium">{error}</p>
        </div>
      )}

      {/* ─── CARRITO LATERAL (DRAWER) ─── */}
      {carritoAbierto && (
        <>
          {/* Overlay */}
          <div
            className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40"
            onClick={() => setCarritoAbierto(false)}
          />

          {/* Drawer */}
          <div className="fixed top-0 right-0 h-full w-full max-w-md bg-white shadow-2xl z-50 flex flex-col animate-slideIn">
            {/* Header */}
            <div className="flex items-center justify-between p-5 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <ShoppingCart size={20} className="text-sky-500" />
                <h3 className="text-lg font-black text-slate-800">Tu Carrito</h3>
                <span className="text-xs font-bold text-slate-400">({totalItems} ítems)</span>
              </div>
              <button
                onClick={() => setCarritoAbierto(false)}
                className="p-2 rounded-xl hover:bg-slate-100 transition-colors"
              >
                <X size={20} className="text-slate-400" />
              </button>
            </div>

            {/* Items */}
            <div className="flex-1 overflow-y-auto p-5 space-y-3">
              {carrito.length === 0 ? (
                <div className="text-center py-16">
                  <ShoppingCart size={40} className="text-slate-200 mx-auto mb-3" />
                  <p className="text-sm text-slate-400 font-medium">Tu carrito está vacío</p>
                </div>
              ) : (
                carrito.map((item) => (
                  <div key={item.id} className="flex items-center gap-3 bg-slate-50 rounded-xl p-3 border border-slate-100">
                    <div className="w-12 h-12 rounded-lg bg-white border border-slate-200 flex items-center justify-center shrink-0">
                      <Package size={18} className="text-slate-300" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-bold text-slate-700 truncate">{item.producto?.nombre || 'Producto'}</p>
                      <p className="text-xs text-emerald-600 font-semibold">S/ {Number(item.producto?.precio || 0).toFixed(2)}</p>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => manejarCantidad(item.id, (item.cantidad || 1) - 1)}
                        className="w-7 h-7 rounded-lg bg-white border border-slate-200 flex items-center justify-center hover:bg-slate-100 transition-colors"
                      >
                        <Minus size={12} />
                      </button>
                      <span className="text-sm font-black text-slate-700 w-6 text-center">{item.cantidad}</span>
                      <button
                        onClick={() => manejarCantidad(item.id, (item.cantidad || 1) + 1)}
                        className="w-7 h-7 rounded-lg bg-white border border-slate-200 flex items-center justify-center hover:bg-slate-100 transition-colors"
                      >
                        <Plus size={12} />
                      </button>
                    </div>
                    <button
                      onClick={() => manejarEliminar(item.id)}
                      className="p-1.5 rounded-lg hover:bg-red-50 text-slate-400 hover:text-red-500 transition-colors"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                ))
              )}
            </div>

            {/* Footer del carrito */}
            {carrito.length > 0 && (
              <div className="p-5 border-t border-slate-100 space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-500 font-medium">Subtotal</span>
                  <span className="font-bold text-slate-700">S/ {subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-base">
                  <span className="font-black text-slate-800">Total</span>
                  <span className="font-black text-emerald-600">S/ {subtotal.toFixed(2)}</span>
                </div>

                {exito && (
                  <div className="flex items-center gap-2 bg-emerald-50 border border-emerald-200 rounded-xl p-3">
                    <Check size={18} className="text-emerald-500" />
                    <p className="text-sm text-emerald-700 font-bold">¡Compra realizada con éxito!</p>
                  </div>
                )}

                <button
                  onClick={manejarCheckout}
                  disabled={procesando || exito}
                  className="w-full py-3 rounded-xl bg-emerald-500 text-white font-bold text-sm hover:bg-emerald-600 transition-all shadow-lg shadow-emerald-500/20 disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {procesando ? (
                    <><Loader2 size={16} className="animate-spin" /> Procesando...</>
                  ) : (
                    <><ShoppingCart size={16} /> Finalizar Compra (Checkout FEFO)</>
                  )}
                </button>
              </div>
            )}
          </div>
        </>
      )}

      {/* Animaciones */}
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(8px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes slideIn {
          from { transform: translateX(100%); }
          to { transform: translateX(0); }
        }
        .animate-fadeIn { animation: fadeIn 0.3s ease-out forwards; }
        .animate-slideIn { animation: slideIn 0.3s ease-out forwards; }
      `}</style>
    </div>
  );
};

export default ClienteTienda;
