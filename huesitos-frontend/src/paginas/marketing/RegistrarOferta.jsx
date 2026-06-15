import { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { ArrowLeft, Percent, Save, AlertTriangle, ShoppingBag, Tag, Calendar } from 'lucide-react';
import { registrarOferta, actualizarOferta, obtenerOfertaPorId, registrarOfertaPorCategoria } from '@/api/marketingApi';
import { obtenerProductos, obtenerCategorias } from '@/api/tiendaApi';
import Combobox from '@/componentes/comun/Combobox';
import CargadorSpinner from '@/componentes/comun/CargadorSpinner';

const RegistrarOferta = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const esEdicion = !!id;

  const [form, setForm] = useState({
    tipoOferta: 'producto', // 'producto' o 'categoria'
    productoId: '',
    productoNombre: '', 
    precioOferta: '',
    categoriaId: '',
    categoriaNombre: '',
    descuentoPorcentaje: '',
    fechaInicio: '',
    fechaFin: ''
  });

  const [productos, setProductos] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [cargando, setCargando] = useState(false);
  const [procesando, setProcesando] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    const cargarCatalogosYDatos = async () => {
      setCargando(true);
      setErrorMsg('');
      try {
        const prodList = await obtenerProductos();
        setProductos(prodList || []);

        const catList = await obtenerCategorias();
        setCategorias(catList || []);

        if (esEdicion) {
          const oferta = await obtenerOfertaPorId(id);
          if (oferta) {
            setForm({
              tipoOferta: 'producto',
              productoId: oferta.producto?.id || '',
              productoNombre: oferta.producto?.nombre || '',
              precioOferta: oferta.precioOferta || '',
              categoriaId: '',
              categoriaNombre: '',
              descuentoPorcentaje: '',
              fechaInicio: oferta.fechaInicio,
              fechaFin: oferta.fechaFin
            });
          }
        }
      } catch (err) {
        console.error('Error al inicializar la página de oferta:', err);
        setErrorMsg('Error al cargar los catálogos requeridos.');
      } finally {
        setCargando(false);
      }
    };

    cargarCatalogosYDatos();
  }, [id, esEdicion]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleProductoSelect = (nombreLabel, precioUnitario, objetoCompleto) => {
    if (objetoCompleto) {
      setForm(prev => ({
        ...prev,
        productoId: objetoCompleto.id,
        productoNombre: objetoCompleto.nombre,
        precioOferta: '' // Limpiar precio anterior al cambiar de producto
      }));
    } else {
      setForm(prev => ({
        ...prev,
        productoId: '',
        productoNombre: '',
        precioOferta: ''
      }));
    }
  };

  const handleCategoriaSelect = (nombreLabel, id, objetoCompleto) => {
    if (objetoCompleto) {
      setForm(prev => ({
        ...prev,
        categoriaId: objetoCompleto.id,
        categoriaNombre: objetoCompleto.label
      }));
    } else {
      setForm(prev => ({
        ...prev,
        categoriaId: '',
        categoriaNombre: ''
      }));
    }
  };

  // Obtener producto seleccionado para los cálculos
  const prodSeleccionado = productos.find(p => p.id === Number(form.productoId));
  const precioOriginal = prodSeleccionado?.precio || 0;
  const precioFinal = form.precioOferta ? Number(form.precioOferta) : 0;

  // Calcular el porcentaje de descuento en tiempo real
  let descuentoPorcentajeCalculado = 0;
  if (precioOriginal > 0 && precioFinal > 0 && precioFinal < precioOriginal) {
    descuentoPorcentajeCalculado = Math.round(((precioOriginal - precioFinal) / precioOriginal) * 100);
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setProcesando(true);
    setErrorMsg('');

    try {
      if (form.fechaInicio > form.fechaFin) {
        throw new Error('La fecha de inicio no puede ser posterior a la fecha de término.');
      }

      if (form.tipoOferta === 'producto') {
        if (!form.productoId) {
          throw new Error('El producto de farmacia es obligatorio.');
        }
        if (!form.precioOferta || Number(form.precioOferta) <= 0) {
          throw new Error('Debes ingresar un precio de oferta válido y mayor a 0.');
        }
        if (Number(form.precioOferta) >= precioOriginal) {
          throw new Error('El precio de oferta debe ser menor al precio original del producto.');
        }

        const payload = {
          titulo: `Oferta: ${form.productoNombre}`,
          descripcion: `Descuento especial en ${form.productoNombre}`,
          descuentoPorcentaje: descuentoPorcentajeCalculado,
          precioOferta: precioFinal,
          producto: { id: Number(form.productoId) },
          fechaInicio: form.fechaInicio,
          fechaFin: form.fechaFin,
          activo: true,
          campana: null
        };

        if (esEdicion) {
          await actualizarOferta(id, payload);
        } else {
          await registrarOferta(payload);
        }

        alert(esEdicion ? 'Oferta de descuento actualizada con éxito.' : 'Oferta de descuento creada con éxito.');
      } else {
        if (!form.categoriaId) {
          throw new Error('La categoría de farmacia es obligatoria.');
        }
        if (!form.descuentoPorcentaje || Number(form.descuentoPorcentaje) <= 0 || Number(form.descuentoPorcentaje) >= 100) {
          throw new Error('Debes ingresar un porcentaje de descuento válido (entre 1 y 99).');
        }

        const payload = {
          categoriaId: Number(form.categoriaId),
          descuentoPorcentaje: Number(form.descuentoPorcentaje),
          fechaInicio: form.fechaInicio,
          fechaFin: form.fechaFin
        };

        await registrarOfertaPorCategoria(payload);
        alert('Ofertas de descuento para la categoría creadas con éxito.');
      }

      navigate('/admin/ofertas');
    } catch (err) {
      const msg = err.response?.data || err.message || 'Error al guardar la oferta.';
      setErrorMsg(typeof msg === 'string' ? msg : JSON.stringify(msg));
    } finally {
      setProcesando(false);
    }
  };

  // Opciones para el buscador Combobox
  const opcionesProductos = productos.map(p => ({
    label: p.nombre,
    precio: p.precio,
    id: p.id,
    categoria: p.categoria?.nombre || 'General'
  }));

  const opcionesCategorias = categorias.map(c => ({
    label: c.nombre,
    id: c.id
  }));

  if (cargando) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-3 bg-white dark:bg-slate-800 rounded-3xl border border-slate-200/60 dark:border-slate-700/60 shadow-sm animate-pulse">
        <CargadorSpinner size="lg" />
        <span className="text-sm font-bold text-slate-400 dark:text-slate-500">Cargando catálogo de productos...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200/60 dark:border-slate-700/60 shadow-sm">
        <div className="flex items-center gap-3">
          <Link
            to="/admin/ofertas"
            className="p-2.5 bg-slate-50 hover:bg-slate-100 dark:bg-slate-900/60 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 rounded-xl transition-all border border-slate-200/60 dark:border-slate-700/60"
          >
            <ArrowLeft size={18} />
          </Link>
          <div>
            <h1 className="text-2xl font-black text-slate-850 dark:text-slate-100 tracking-tight leading-none">
              {esEdicion ? 'Editar Oferta de Producto' : 'Nueva Oferta de Producto'}
            </h1>
            <p className="text-slate-500 dark:text-slate-400 text-xs mt-1.5 font-medium">
              Define descuentos exclusivos en productos del inventario y farmacia veterinaria.
            </p>
          </div>
        </div>
      </div>

      {/* Tipo de Oferta Toggle (Solo si no es edición) */}
      {!esEdicion && (
        <div className="flex gap-2 p-1 bg-slate-100 dark:bg-slate-900 rounded-2xl border border-slate-200/50 dark:border-slate-700/50 max-w-md">
          <button
            type="button"
            onClick={() => setForm(prev => ({ ...prev, tipoOferta: 'producto' }))}
            className={`flex-1 py-2.5 px-4 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 ${
              form.tipoOferta === 'producto'
                ? 'bg-white dark:bg-slate-800 text-slate-850 dark:text-slate-100 shadow-sm'
                : 'text-slate-500 hover:text-slate-750 dark:hover:text-slate-350'
            }`}
          >
            <ShoppingBag size={14} />
            Producto Individual
          </button>
          <button
            type="button"
            onClick={() => setForm(prev => ({ ...prev, tipoOferta: 'categoria' }))}
            className={`flex-1 py-2.5 px-4 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 ${
              form.tipoOferta === 'categoria'
                ? 'bg-white dark:bg-slate-800 text-slate-850 dark:text-slate-100 shadow-sm'
                : 'text-slate-500 hover:text-slate-750 dark:hover:text-slate-350'
            }`}
          >
            <Tag size={14} />
            Categoría Completa
          </button>
        </div>
      )}

      {errorMsg && (
        <div className="bg-red-50 dark:bg-red-950/20 text-red-700 dark:text-red-400 border border-red-100 dark:border-red-900/50 rounded-2xl p-4 text-sm font-semibold flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 flex-shrink-0 text-red-500 mt-0.5" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* FORMULARIO */}
      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Panel Izquierdo: Parámetros del Producto */}
        <div className="lg:col-span-8 space-y-6">
          <div className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-200/60 dark:border-slate-700/60 p-6 space-y-5 shadow-sm">
            <h3 className="text-sm font-black text-slate-800 dark:text-slate-100 border-b border-slate-100 dark:border-slate-700 pb-3 flex items-center gap-2 uppercase tracking-wide">
              {form.tipoOferta === 'producto' ? (
                <>
                  <ShoppingBag size={16} className="text-emerald-500" /> Selección de Producto e Inventario
                </>
              ) : (
                <>
                  <Tag size={16} className="text-emerald-500" /> Selección de Categoría y Descuento
                </>
              )}
            </h3>

            <div className="space-y-4">
              {form.tipoOferta === 'producto' ? (
                <>
                  {/* Producto a ofertar */}
                  <div>
                    <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">Producto de Farmacia / Tienda</label>
                    <Combobox
                      value={form.productoNombre}
                      onChange={handleProductoSelect}
                      opciones={opcionesProductos}
                      placeholder="Escribe para buscar un producto..."
                      required={form.tipoOferta === 'producto'}
                      icono={ShoppingBag}
                    />
                  </div>

                  {/* Precios (Inicial y Final) */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                    {/* Precio Inicial (Lectura) */}
                    <div>
                      <label className="block text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-2">Precio Inicial (S/.)</label>
                      <div className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400 text-sm font-bold bg-slate-100 dark:bg-slate-900/60 select-none">
                        {precioOriginal > 0 ? `S/. ${precioOriginal.toFixed(2)}` : 'S/. 0.00'}
                      </div>
                    </div>

                    {/* Precio Final (Precio Oferta) */}
                    <div>
                      <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">Precio Final de Oferta (S/.)</label>
                      <input
                        type="number"
                        step="0.01"
                        name="precioOferta"
                        value={form.precioOferta}
                        onChange={handleChange}
                        required={form.tipoOferta === 'producto'}
                        placeholder="Ej: 15.50 (Ingresa el precio rebajado)"
                        className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-650 text-slate-800 dark:text-slate-100 text-sm font-semibold outline-none focus:ring-2 focus:ring-sky-100 focus:border-sky-400 transition-all bg-slate-50 dark:bg-slate-900 focus:bg-white dark:focus:bg-slate-800 placeholder:text-slate-400 dark:placeholder:text-slate-500"
                      />
                    </div>
                  </div>
                </>
              ) : (
                <>
                  {/* Categoría a ofertar */}
                  <div>
                    <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">Categoría de Farmacia / Tienda</label>
                    <Combobox
                      value={form.categoriaNombre}
                      onChange={handleCategoriaSelect}
                      opciones={opcionesCategorias}
                      placeholder="Escribe para buscar una categoría..."
                      required={form.tipoOferta === 'categoria'}
                      icono={Tag}
                    />
                  </div>

                  {/* Porcentaje de Descuento */}
                  <div>
                    <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">Porcentaje de Descuento a Aplicar (%)</label>
                    <div className="relative">
                      <input
                        type="number"
                        min="1"
                        max="99"
                        name="descuentoPorcentaje"
                        value={form.descuentoPorcentaje}
                        onChange={handleChange}
                        required={form.tipoOferta === 'categoria'}
                        placeholder="Ej: 15 (Se aplicará 15% de descuento a todos los productos)"
                        className="w-full pl-4 pr-10 py-2.5 rounded-xl border border-slate-200 dark:border-slate-650 text-slate-800 dark:text-slate-100 text-sm font-semibold outline-none focus:ring-2 focus:ring-sky-100 focus:border-sky-400 transition-all bg-slate-50 dark:bg-slate-900 focus:bg-white dark:focus:bg-slate-800 placeholder:text-slate-400 dark:placeholder:text-slate-500"
                      />
                      <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none text-slate-400 dark:text-slate-500">
                        <Percent size={16} />
                      </div>
                    </div>
                    <p className="text-[10px] text-slate-400 dark:text-slate-500 mt-1 font-semibold">
                      Nota: Al guardar se generarán ofertas de descuento individuales para cada producto activo dentro de la categoría.
                    </p>
                  </div>
                </>
              )}

              {/* Vigencia / Fechas */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">Vigente Desde</label>
                  <input
                    type="date"
                    name="fechaInicio"
                    value={form.fechaInicio}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-650 text-slate-800 dark:text-slate-100 text-sm font-semibold outline-none focus:ring-2 focus:ring-sky-100 focus:border-sky-400 transition-all bg-slate-50 dark:bg-slate-900 focus:bg-white dark:focus:bg-slate-800"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">Vigente Hasta</label>
                  <input
                    type="date"
                    name="fechaFin"
                    value={form.fechaFin}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-650 text-slate-800 dark:text-slate-100 text-sm font-semibold outline-none focus:ring-2 focus:ring-sky-100 focus:border-sky-400 transition-all bg-slate-50 dark:bg-slate-900 focus:bg-white dark:focus:bg-slate-800"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Panel Derecho: Ahorro y Descuento */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-200/60 dark:border-slate-700/60 p-6 space-y-4 shadow-sm">
            <h3 className="text-sm font-black text-slate-800 dark:text-slate-100 border-b border-slate-100 dark:border-slate-700 pb-3 flex items-center gap-2 uppercase tracking-wide">
              <Tag size={16} className="text-emerald-500" /> Ahorro y Descuento
            </h3>

            <div className="space-y-4">
              {form.tipoOferta === 'producto' ? (
                <>
                  <div className="flex justify-between items-center bg-slate-50 dark:bg-slate-900/50 p-3.5 rounded-xl border border-slate-150 dark:border-slate-750">
                    <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase">Descuento (%)</span>
                    <span className="text-2xl font-black text-emerald-500">
                      {descuentoPorcentajeCalculado}%
                    </span>
                  </div>

                  {precioOriginal > 0 && precioFinal > 0 && precioFinal < precioOriginal ? (
                    <div className="bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-100 dark:border-emerald-900/40 rounded-xl p-3.5 text-center flex flex-col gap-1 shadow-sm">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">¡Tus clientes ahorran!</span>
                      <span className="text-lg font-black text-emerald-650 dark:text-emerald-400">
                        S/. {(precioOriginal - precioFinal).toFixed(2)}
                      </span>
                    </div>
                  ) : (
                    <div className="bg-slate-50 dark:bg-slate-900/40 rounded-xl p-3.5 text-center text-xs italic text-slate-400">
                      Ingresa un precio de oferta para calcular el ahorro.
                    </div>
                  )}
                </>
              ) : (
                <>
                  <div className="flex justify-between items-center bg-slate-50 dark:bg-slate-900/50 p-3.5 rounded-xl border border-slate-150 dark:border-slate-750">
                    <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase">Descuento Categoría</span>
                    <span className="text-2xl font-black text-emerald-500">
                      {form.descuentoPorcentaje ? `${form.descuentoPorcentaje}%` : '0%'}
                    </span>
                  </div>

                  <div className="bg-sky-50/50 dark:bg-sky-950/20 border border-sky-100 dark:border-sky-900/40 rounded-xl p-3.5 text-xs text-sky-750 dark:text-sky-400 font-semibold leading-relaxed">
                    Se aplicará un {form.descuentoPorcentaje || '0'}% de descuento a todos los productos pertenecientes a la categoría "{form.categoriaNombre || 'Categoría no seleccionada'}".
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Botones de acción */}
          <div className="flex justify-end gap-3 pt-2">
            <Link
              to="/admin/ofertas"
              className="px-6 py-3 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-750 text-slate-600 dark:text-slate-300 text-sm font-bold rounded-xl transition-all"
            >
              Cancelar
            </Link>
            <button
              type="submit"
              disabled={procesando}
              className="px-8 py-3 bg-gradient-to-r from-emerald-500 to-teal-400 hover:from-emerald-600 hover:to-teal-500 text-white text-sm font-black rounded-xl shadow-lg shadow-emerald-500/20 transition-all flex items-center gap-2 disabled:opacity-50"
            >
              {procesando ? (
                <>
                  <CargadorSpinner size="xs" color="border-white" />
                  <span>Procesando...</span>
                </>
              ) : (
                <>
                  <Save size={16} />
                  <span>{esEdicion ? 'Guardar Cambios' : 'Lanzar Oferta'}</span>
                </>
              )}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default RegistrarOferta;
