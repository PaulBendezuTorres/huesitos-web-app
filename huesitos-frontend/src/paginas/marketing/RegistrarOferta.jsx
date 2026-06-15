import { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { ArrowLeft, Percent, Save, Clock, AlertTriangle, Tag, ShoppingBag, Calendar } from 'lucide-react';
import { registrarOferta, actualizarOferta, obtenerOfertaPorId, obtenerTodasCampanas } from '@/api/marketingApi';
import { obtenerProductos } from '@/api/tiendaApi';
import Combobox from '@/componentes/comun/Combobox';
import CargadorSpinner from '@/componentes/comun/CargadorSpinner';

const RegistrarOferta = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const esEdicion = !!id;

  const [form, setForm] = useState({
    titulo: '',
    descripcion: '',
    descuentoPorcentaje: '',
    precioOferta: '',
    productoId: '',
    productoNombre: '', // Auxiliar para mostrar el valor seleccionado en el Combobox
    campanaId: '',
    fechaInicio: '',
    fechaFin: ''
  });

  const [productos, setProductos] = useState([]);
  const [campanas, setCampanas] = useState([]);
  const [cargando, setCargando] = useState(false);
  const [procesando, setProcesando] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    const cargarCatalogosYDatos = async () => {
      setCargando(true);
      setErrorMsg('');
      try {
        const [prodList, campList] = await Promise.all([
          obtenerProductos(),
          obtenerTodasCampanas()
        ]);
        setProductos(prodList || []);
        setCampanas(campList?.filter(c => c.activo) || []);

        if (esEdicion) {
          const oferta = await obtenerOfertaPorId(id);
          if (oferta) {
            setForm({
              titulo: oferta.titulo,
              descripcion: oferta.descripcion || '',
              descuentoPorcentaje: oferta.descuentoPorcentaje || '',
              precioOferta: oferta.precioOferta || '',
              productoId: oferta.producto?.id || '',
              productoNombre: oferta.producto?.nombre || '',
              campanaId: oferta.campana?.id || '',
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
        productoNombre: objetoCompleto.nombre
      }));
    } else {
      // Si limpia el buscador
      setForm(prev => ({
        ...prev,
        productoId: '',
        productoNombre: ''
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setProcesando(true);
    setErrorMsg('');

    try {
      if (form.fechaInicio > form.fechaFin) {
        throw new Error('La fecha de inicio no puede ser posterior a la fecha de término.');
      }
      if (!form.productoId) {
        throw new Error('El producto de farmacia es obligatorio.');
      }
      if (!form.descuentoPorcentaje && !form.precioOferta) {
        throw new Error('Debes ingresar al menos el porcentaje de descuento o el precio fijo de oferta.');
      }
      if (form.descripcion.length > 350) {
        throw new Error('La descripción no puede superar los 350 caracteres.');
      }

      const payload = {
        titulo: form.titulo,
        descripcion: form.descripcion,
        descuentoPorcentaje: form.descuentoPorcentaje ? Number(form.descuentoPorcentaje) : null,
        precioOferta: form.precioOferta ? Number(form.precioOferta) : null,
        producto: { id: Number(form.productoId) },
        fechaInicio: form.fechaInicio,
        fechaFin: form.fechaFin,
        activo: true
      };

      if (form.campanaId) {
        payload.campana = { id: Number(form.campanaId) };
      } else {
        payload.campana = null;
      }

      if (esEdicion) {
        await actualizarOferta(id, payload);
      } else {
        await registrarOferta(payload);
      }

      alert(esEdicion ? 'Oferta de descuento actualizada con éxito.' : 'Oferta de descuento creada con éxito.');
      navigate('/admin/ofertas');
    } catch (err) {
      const msg = err.response?.data || err.message || 'Error al guardar la oferta.';
      setErrorMsg(typeof msg === 'string' ? msg : JSON.stringify(msg));
    } finally {
      setProcesando(false);
    }
  };

  // Convertir los productos de farmacia a opciones compatibles con el Combobox
  const opcionesProductos = productos.map(p => ({
    label: p.nombre,
    precio: p.precio,
    id: p.id,
    categoria: p.categoria?.nombre || 'General'
  }));

  if (cargando) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-3 bg-white dark:bg-slate-800 rounded-3xl border border-slate-200/60 dark:border-slate-700/60 shadow-sm animate-pulse">
        <CargadorSpinner size="lg" />
        <span className="text-sm font-bold text-slate-400 dark:text-slate-500">Cargando catálogo de productos...</span>
      </div>
    );
  }

  // Obtener producto seleccionado para cálculos de vista previa
  const prodSeleccionado = productos.find(p => p.id === Number(form.productoId));
  const precioOriginal = prodSeleccionado?.precio || 0;
  let precioFinalCalculado = 0;

  if (form.precioOferta) {
    precioFinalCalculado = Number(form.precioOferta);
  } else if (form.descuentoPorcentaje && precioOriginal > 0) {
    precioFinalCalculado = precioOriginal * (1 - Number(form.descuentoPorcentaje) / 100);
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
              {esEdicion ? 'Editar Oferta de Descuento' : 'Nueva Oferta de Descuento'}
            </h1>
            <p className="text-slate-500 dark:text-slate-400 text-xs mt-1.5 font-medium">
              Aplica descuentos directos o precios especiales a productos del inventario y farmacia.
            </p>
          </div>
        </div>
      </div>

      {errorMsg && (
        <div className="bg-red-50 dark:bg-red-950/20 text-red-700 dark:text-red-400 border border-red-100 dark:border-red-900/50 rounded-2xl p-4 text-sm font-semibold flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 flex-shrink-0 text-red-500 mt-0.5" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* FORMULARIO */}
      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Panel Izquierdo: Formulario */}
        <div className="lg:col-span-8 space-y-6">
          <div className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-200/60 dark:border-slate-700/60 p-6 space-y-5 shadow-sm">
            <h3 className="text-sm font-black text-slate-800 dark:text-slate-100 border-b border-slate-100 dark:border-slate-700 pb-3 flex items-center gap-2 uppercase tracking-wide">
              <Percent size={16} className="text-emerald-500" /> Parámetros del Descuento
            </h3>

            <div className="space-y-4">
              {/* Título de la Oferta */}
              <div>
                <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">Título de la Oferta</label>
                <input
                  type="text"
                  name="titulo"
                  value={form.titulo}
                  onChange={handleChange}
                  required
                  placeholder="Ej: Descuento 20% en Correas, Oferta Especial Champú"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-650 text-slate-800 dark:text-slate-100 text-sm font-semibold outline-none focus:ring-2 focus:ring-sky-100 focus:border-sky-400 transition-all bg-slate-50 dark:bg-slate-900 focus:bg-white dark:focus:bg-slate-800 placeholder:text-slate-400 dark:placeholder:text-slate-500"
                />
              </div>

              {/* Producto Asociado mediante Combobox */}
              <div>
                <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">Producto de Farmacia / Tienda</label>
                <Combobox
                  value={form.productoNombre}
                  onChange={handleProductoSelect}
                  opciones={opcionesProductos}
                  placeholder="Escribe para buscar un producto..."
                  required={true}
                  icono={ShoppingBag}
                />
              </div>

              {/* Descripción */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Términos y Condiciones</label>
                  <span className={`text-[10px] font-bold ${form.descripcion.length > 300 ? 'text-red-500' : 'text-slate-400'}`}>
                    {form.descripcion.length} / 350
                  </span>
                </div>
                <textarea
                  name="descripcion"
                  value={form.descripcion}
                  onChange={handleChange}
                  maxLength={350}
                  placeholder="Detalles opcionales de la promoción, límite de stock por cliente, etc..."
                  className="w-full h-24 px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-650 text-slate-800 dark:text-slate-100 text-sm font-semibold outline-none focus:ring-2 focus:ring-sky-100 focus:border-sky-400 transition-all bg-slate-50 dark:bg-slate-900 focus:bg-white dark:focus:bg-slate-800 placeholder:text-slate-400 dark:placeholder:text-slate-500"
                />
              </div>

              {/* Porcentaje y Precio Fijo */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">Descuento Porcentual (%)</label>
                  <input
                    type="number"
                    name="descuentoPorcentaje"
                    max="100"
                    min="1"
                    value={form.descuentoPorcentaje}
                    onChange={handleChange}
                    placeholder="Ej: 20 (Para descontar el 20%)"
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-650 text-slate-800 dark:text-slate-100 text-sm font-semibold outline-none focus:ring-2 focus:ring-sky-100 focus:border-sky-400 transition-all bg-slate-50 dark:bg-slate-900 focus:bg-white dark:focus:bg-slate-800 placeholder:text-slate-400 dark:placeholder:text-slate-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">Precio Oferta Fijo Especial (S/.)</label>
                  <input
                    type="number"
                    step="0.01"
                    name="precioOferta"
                    value={form.precioOferta}
                    onChange={handleChange}
                    placeholder="Ej: 15.50 (Opcional si usas %)"
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-650 text-slate-800 dark:text-slate-100 text-sm font-semibold outline-none focus:ring-2 focus:ring-sky-100 focus:border-sky-400 transition-all bg-slate-50 dark:bg-slate-900 focus:bg-white dark:focus:bg-slate-800 placeholder:text-slate-400 dark:placeholder:text-slate-500"
                  />
                </div>
              </div>

              {/* Campaña vinculada */}
              <div>
                <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">Vincular a Campaña Activa (Opcional)</label>
                <select
                  name="campanaId"
                  value={form.campanaId}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-650 text-slate-800 dark:text-slate-100 text-sm font-semibold outline-none focus:ring-2 focus:ring-sky-100 focus:border-sky-400 transition-all bg-slate-50 dark:bg-slate-900 focus:bg-white dark:focus:bg-slate-800"
                >
                  <option value="">Ninguna campaña vinculada</option>
                  {campanas.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.nombre}
                    </option>
                  ))}
                </select>
              </div>

              {/* Rango de fechas de la oferta */}
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

        {/* Panel Derecho: Vista previa e información adicional */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-200/60 dark:border-slate-700/60 p-6 space-y-4 shadow-sm">
            <h3 className="text-sm font-black text-slate-800 dark:text-slate-100 border-b border-slate-100 dark:border-slate-700 pb-3 flex items-center gap-2 uppercase tracking-wide">
              <Tag size={16} className="text-emerald-500" /> Resumen Promocional
            </h3>

            <div className="space-y-4">
              <div className="space-y-1">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Producto Seleccionado</span>
                <span className="text-xs font-bold text-slate-800 dark:text-slate-200 block truncate">
                  {form.productoNombre || <span className="text-slate-400 italic">Ningún producto seleccionado</span>}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-4 border-t border-slate-100 dark:border-slate-700 pt-3">
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Precio Base</span>
                  <span className="text-sm font-extrabold text-slate-600 dark:text-slate-400">
                    S/. {precioOriginal.toFixed(2)}
                  </span>
                </div>
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Precio Oferta</span>
                  <span className="text-base font-black text-emerald-600">
                    {precioFinalCalculado > 0 ? `S/. ${precioFinalCalculado.toFixed(2)}` : 'S/. 0.00'}
                  </span>
                </div>
              </div>

              {precioOriginal > 0 && precioFinalCalculado > 0 && (
                <div className="bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-100 dark:border-emerald-900/40 rounded-xl p-3 text-center">
                  <span className="text-[10px] font-bold text-emerald-700 dark:text-emerald-400 uppercase">
                    ¡Ahorro de S/. {(precioOriginal - precioFinalCalculado).toFixed(2)}!
                  </span>
                </div>
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
              className="px-8 py-3 bg-emerald-500 hover:bg-emerald-600 text-white text-sm font-black rounded-xl shadow-lg shadow-emerald-500/20 transition-all flex items-center gap-2 disabled:opacity-50"
            >
              {procesando ? (
                <>
                  <CargadorSpinner size="xs" color="border-white" />
                  <span>Guardando...</span>
                </>
              ) : (
                <>
                  <Save size={16} />
                  <span>{esEdicion ? 'Guardar Cambios' : 'Crear Oferta'}</span>
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
