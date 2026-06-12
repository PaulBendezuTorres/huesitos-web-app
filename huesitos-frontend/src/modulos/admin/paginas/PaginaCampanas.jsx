import { useState, useEffect, useCallback } from 'react';
import {
  Megaphone,
  Percent,
  Plus,
  Edit2,
  Trash2,
  Calendar,
  Clock,
  X,
  Save,
  AlertTriangle,
  CheckCircle,
  Tag,
  ShoppingBag
} from 'lucide-react';
import CargadorSpinner from '../../../componentes/CargadorSpinner';
import {
  obtenerTodasCampanas,
  registrarCampana,
  actualizarCampana,
  eliminarCampana,
  obtenerTodasOfertas,
  registrarOferta,
  actualizarOferta,
  eliminarOferta
} from '../../../api/marketingApi';
import { obtenerProductos } from '../../../api/tiendaApi';

const PaginaCampanas = () => {
  const [activeTab, setActiveTab] = useState('campanas'); // 'campanas' o 'ofertas'

  // Datos
  const [campanas, setCampanas] = useState([]);
  const [ofertas, setOfertas] = useState([]);
  const [productos, setProductos] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modales
  const [modalCampana, setModalCampana] = useState(false);
  const [modalOferta, setModalOferta] = useState(false);
  const [edicionItem, setEdicionItem] = useState(null); // Para guardar el item en edición (Campaña u Oferta)

  // Formularios
  const [formCampana, setFormCampana] = useState({
    nombre: '',
    descripcion: '',
    fechaInicio: '',
    fechaFin: '',
    imagenUrl: ''
  });
  
  const [formOferta, setFormOferta] = useState({
    titulo: '',
    descripcion: '',
    descuentoPorcentaje: '',
    precioOferta: '',
    productoId: '',
    campanaId: '',
    fechaInicio: '',
    fechaFin: ''
  });

  const [procesando, setProcesando] = useState(false);
  const [errorForm, setErrorForm] = useState('');
  const [mensajeExito, setMensajeExito] = useState('');
  const [mensajeError, setMensajeError] = useState('');

  // Cargar datos
  const cargarDatos = useCallback(async () => {
    setLoading(true);
    setMensajeExito('');
    setMensajeError('');
    try {
      const [campRes, ofRes, prodRes] = await Promise.allSettled([
        obtenerTodasCampanas(),
        obtenerTodasOfertas(),
        obtenerProductos()
      ]);

      setCampanas(campRes.status === 'fulfilled' ? campRes.value : []);
      setOfertas(ofRes.status === 'fulfilled' ? ofRes.value : []);
      setProductos(prodRes.status === 'fulfilled' ? prodRes.value : []);
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
    if (!fechaFinStr) return { texto: 'Sin límite', estilo: 'text-slate-500 bg-slate-100 border-slate-200' };
    
    const hoy = new Date();
    hoy.setHours(0,0,0,0);
    const fin = new Date(fechaFinStr + 'T23:59:59');
    const diffTime = fin.getTime() - hoy.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays < 0) {
      return { texto: 'Expirada', estilo: 'text-red-700 bg-red-50 border-red-200' };
    } else if (diffDays === 0) {
      return { texto: 'Expira hoy', estilo: 'text-amber-700 bg-amber-50 border-amber-200 font-bold animate-pulse' };
    } else if (diffDays === 1) {
      return { texto: 'Último día', estilo: 'text-amber-700 bg-amber-50 border-amber-200 font-bold' };
    } else if (diffDays <= 7) {
      return { texto: `${diffDays} días rest.`, estilo: 'text-amber-700 bg-amber-50 border-amber-200' };
    } else {
      return { texto: `${diffDays} días rest.`, estilo: 'text-emerald-700 bg-emerald-50 border-emerald-200' };
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
  const abrirNuevaCampana = () => {
    setEdicionItem(null);
    setFormCampana({ nombre: '', descripcion: '', fechaInicio: '', fechaFin: '', imagenUrl: '/uploads/defecto-campana.png' });
    setErrorForm('');
    setModalCampana(true);
  };

  const abrirEditarCampana = (campana) => {
    setEdicionItem(campana);
    setFormCampana({
      nombre: campana.nombre,
      descripcion: campana.descripcion || '',
      fechaInicio: campana.fechaInicio,
      fechaFin: campana.fechaFin,
      imagenUrl: campana.imagenUrl || '/uploads/defecto-campana.png'
    });
    setErrorForm('');
    setModalCampana(true);
  };

  const handleCampanaSubmit = async (e) => {
    e.preventDefault();
    setProcesando(true);
    setErrorForm('');
    try {
      if (formCampana.fechaInicio > formCampana.fechaFin) {
        throw new Error('La fecha de inicio no puede ser posterior a la fecha de fin.');
      }

      if (edicionItem) {
        await actualizarCampana(edicionItem.id, { ...formCampana, activo: edicionItem.activo });
        alert('Campaña actualizada con éxito.');
      } else {
        await registrarCampana({ ...formCampana, activo: true });
        alert('Campaña creada con éxito.');
      }
      
      setModalCampana(false);
      cargarDatos();
    } catch (err) {
      const msg = err.response?.data || err.message || 'Error al guardar campaña.';
      setErrorForm(typeof msg === 'string' ? msg : JSON.stringify(msg));
    } finally {
      setProcesando(false);
    }
  };

  const handleToggleActivoCampana = async (campana) => {
    const confirm = window.confirm(`¿Estás seguro de que deseas ${campana.activo ? 'desactivar' : 'activar'} esta campaña?`);
    if (!confirm) return;

    try {
      if (campana.activo) {
        // En backend, el DELETE desactiva la campaña
        await eliminarCampana(campana.id);
      } else {
        // Para activar, volvemos a guardar con activo: true
        await actualizarCampana(campana.id, { ...campana, activo: true });
      }
      alert('Estado de la campaña modificado con éxito.');
      cargarDatos();
    } catch (err) {
      alert('Error al modificar el estado: ' + (err.response?.data || err.message));
    }
  };

  // --- CRUD OFERTAS ---
  const abrirNuevaOferta = () => {
    setEdicionItem(null);
    setFormOferta({
      titulo: '',
      descripcion: '',
      descuentoPorcentaje: '',
      precioOferta: '',
      productoId: '',
      campanaId: '',
      fechaInicio: '',
      fechaFin: ''
    });
    setErrorForm('');
    setModalOferta(true);
  };

  const abrirEditarOferta = (oferta) => {
    setEdicionItem(oferta);
    setFormOferta({
      titulo: oferta.titulo,
      descripcion: oferta.descripcion || '',
      descuentoPorcentaje: oferta.descuentoPorcentaje || '',
      precioOferta: oferta.precioOferta || '',
      productoId: oferta.producto?.id || '',
      campanaId: oferta.campana?.id || '',
      fechaInicio: oferta.fechaInicio,
      fechaFin: oferta.fechaFin
    });
    setErrorForm('');
    setModalOferta(true);
  };

  const handleOfertaSubmit = async (e) => {
    e.preventDefault();
    setProcesando(true);
    setErrorForm('');
    try {
      if (formOferta.fechaInicio > formOferta.fechaFin) {
        throw new Error('La fecha de inicio no puede ser posterior a la fecha de fin.');
      }
      if (!formOferta.productoId) {
        throw new Error('El producto es obligatorio.');
      }
      if (!formOferta.descuentoPorcentaje && !formOferta.precioOferta) {
        throw new Error('Debes ingresar al menos el porcentaje de descuento o el precio de oferta.');
      }

      const payload = {
        titulo: formOferta.titulo,
        descripcion: formOferta.descripcion,
        descuentoPorcentaje: formOferta.descuentoPorcentaje ? Number(formOferta.descuentoPorcentaje) : null,
        precioOferta: formOferta.precioOferta ? Number(formOferta.precioOferta) : null,
        producto: { id: Number(formOferta.productoId) },
        fechaInicio: formOferta.fechaInicio,
        fechaFin: formOferta.fechaFin
      };

      if (formOferta.campanaId) {
        payload.campana = { id: Number(formOferta.campanaId) };
      }

      if (edicionItem) {
        await actualizarOferta(edicionItem.id, { ...payload, activo: edicionItem.activo });
        alert('Oferta actualizada con éxito.');
      } else {
        await registrarOferta({ ...payload, activo: true });
        alert('Oferta creada con éxito.');
      }

      setModalOferta(false);
      cargarDatos();
    } catch (err) {
      const msg = err.response?.data || err.message || 'Error al guardar la oferta.';
      setErrorForm(typeof msg === 'string' ? msg : JSON.stringify(msg));
    } finally {
      setProcesando(false);
    }
  };

  const handleToggleActivoOferta = async (oferta) => {
    const confirm = window.confirm(`¿Estás seguro de que deseas ${oferta.activo ? 'desactivar' : 'activar'} esta oferta de descuento?`);
    if (!confirm) return;

    try {
      if (oferta.activo) {
        await eliminarOferta(oferta.id);
      } else {
        await actualizarOferta(oferta.id, { ...oferta, activo: true });
      }
      alert('Estado de la oferta modificado con éxito.');
      cargarDatos();
    } catch (err) {
      alert('Error al modificar el estado de la oferta: ' + (err.response?.data || err.message));
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      
      {/* Selector de pestañas */}
      <div className="bg-white rounded-2xl border border-slate-200/60 p-4 shadow-sm flex flex-col sm:flex-row justify-between items-center gap-4">
        <div className="flex gap-2">
          <button
            onClick={() => setActiveTab('campanas')}
            className={`px-5 py-2.5 rounded-xl text-xs font-bold transition-all uppercase tracking-wide flex items-center gap-2 border ${
              activeTab === 'campanas'
                ? 'bg-sky-500 text-white border-sky-500 shadow-md shadow-sky-500/15'
                : 'bg-white border-slate-200 text-slate-500 hover:bg-slate-50'
            }`}
          >
            <Megaphone size={14} /> Campañas Publicitarias
          </button>
          
          <button
            onClick={() => setActiveTab('ofertas')}
            className={`px-5 py-2.5 rounded-xl text-xs font-bold transition-all uppercase tracking-wide flex items-center gap-2 border ${
              activeTab === 'ofertas'
                ? 'bg-sky-500 text-white border-sky-500 shadow-md shadow-sky-500/15'
                : 'bg-white border-slate-200 text-slate-500 hover:bg-slate-50'
            }`}
          >
            <Percent size={14} /> Ofertas de Productos
          </button>
        </div>

        {activeTab === 'campanas' ? (
          <button
            onClick={abrirNuevaCampana}
            className="px-4 py-2.5 bg-sky-50 text-sky-600 hover:bg-sky-500 hover:text-white rounded-xl border border-sky-100 hover:border-sky-300 text-xs font-bold transition-all flex items-center gap-1.5 shadow-sm"
          >
            <Plus size={14} /> Nueva Campaña
          </button>
        ) : (
          <button
            onClick={abrirNuevaOferta}
            className="px-4 py-2.5 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shadow-lg shadow-emerald-500/20"
          >
            <Plus size={14} /> Nueva Oferta de Descuento
          </button>
        )}
      </div>

      {/* MENSAJES DE OPERACIÓN */}
      {mensajeExito && (
        <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 flex items-center gap-3">
          <CheckCircle size={18} className="text-emerald-500 shrink-0" />
          <p className="text-xs text-emerald-700 font-semibold">{mensajeExito}</p>
        </div>
      )}
      {mensajeError && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-center gap-3">
          <AlertTriangle size={18} className="text-red-500 shrink-0" />
          <p className="text-xs text-red-700 font-semibold">{mensajeError}</p>
        </div>
      )}

      {/* GRILLAS PRINCIPALES */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 bg-white rounded-2xl border border-slate-200/60 shadow-sm gap-3">
          <CargadorSpinner size="lg" />
          <span className="text-sm font-bold text-slate-400 font-semibold">Consultando datos de marketing...</span>
        </div>
      ) : activeTab === 'campanas' ? (
        /* ─── PESTAÑA: CAMPAÑAS ─── */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {campanas.length === 0 ? (
            <div className="col-span-full py-16 text-center text-slate-400 font-bold bg-white rounded-2xl border border-slate-200/60 shadow-sm">
              No hay campañas de marketing registradas.
            </div>
          ) : (
            campanas.map((c) => {
              const expiracion = calcularExpiracion(c.fechaFin);
              return (
                <div
                  key={c.id}
                  className={`bg-white rounded-2xl border ${
                    c.activo ? 'border-slate-200/60 hover:border-sky-300' : 'border-slate-200 bg-slate-50/50'
                  } shadow-sm p-5 transition-all duration-300 flex flex-col justify-between min-h-[220px] relative hover:shadow-md hover:shadow-sky-500/5`}
                >
                  <div className="space-y-3">
                    <div className="flex justify-between items-start">
                      <span className={`text-[9px] font-black px-2 py-0.5 rounded-full border ${expiracion.estilo}`}>
                        {expiracion.texto}
                      </span>
                      <span className={`text-[9px] font-extrabold px-2 py-0.5 rounded-full border ${
                        c.activo 
                          ? 'bg-emerald-50 border-emerald-200 text-emerald-700' 
                          : 'bg-red-50 border-red-200 text-red-700'
                      }`}>
                        {c.activo ? 'ACTIVA' : 'INACTIVA'}
                      </span>
                    </div>

                    <div>
                      <h3 className="font-black text-slate-800 text-sm tracking-tight leading-tight group-hover:text-sky-600 transition-colors">
                        {c.nombre}
                      </h3>
                      <p className="text-[11px] text-slate-500 font-medium leading-relaxed mt-1">{c.descripcion}</p>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-[10px] text-slate-400 font-semibold mt-4">
                    <div className="flex items-center gap-1.5">
                      <Calendar size={12} />
                      <span>{formatarFecha(c.fechaInicio)} — {formatarFecha(c.fechaFin)}</span>
                    </div>

                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => abrirEditarCampana(c)}
                        className="p-1.5 hover:bg-sky-50 text-sky-600 rounded-lg border border-transparent hover:border-sky-100 transition-all"
                        title="Editar campaña"
                      >
                        <Edit2 size={12} />
                      </button>
                      <button
                        onClick={() => handleToggleActivoCampana(c)}
                        className={`p-1.5 rounded-lg border border-transparent transition-all ${
                          c.activo 
                            ? 'hover:bg-red-50 text-red-500 hover:border-red-100' 
                            : 'hover:bg-emerald-50 text-emerald-500 hover:border-emerald-100'
                        }`}
                        title={c.activo ? 'Desactivar campaña' : 'Activar campaña'}
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
      ) : (
        /* ─── PESTAÑA: OFERTAS ─── */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {ofertas.length === 0 ? (
            <div className="col-span-full py-16 text-center text-slate-400 font-bold bg-white rounded-2xl border border-slate-200/60 shadow-sm">
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
                  className={`bg-white rounded-2xl border ${
                    o.activo ? 'border-slate-200/60 hover:border-emerald-300' : 'border-slate-200 bg-slate-50/50'
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
                      <h3 className="font-black text-slate-800 text-sm tracking-tight leading-tight">
                        {o.titulo}
                      </h3>
                      <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider flex items-center gap-1.5 mt-1">
                        <ShoppingBag size={12} className="text-slate-400" />
                        Producto: {o.producto?.nombre}
                      </p>
                      <p className="text-[11px] text-slate-500 font-medium leading-relaxed mt-2">{o.descripcion}</p>
                    </div>

                    {/* Precios y descuento */}
                    <div className="flex items-center gap-4 bg-emerald-50/40 border border-emerald-100 p-3 rounded-xl">
                      <div className="w-10 h-10 bg-emerald-500 rounded-lg flex flex-col items-center justify-center text-white font-black shrink-0 shadow-sm shadow-emerald-500/10">
                        <span className="text-[10px] uppercase font-bold leading-none">%</span>
                        <span className="text-sm leading-none mt-0.5">-{o.descuentoPorcentaje ? Math.round(o.descuentoPorcentaje) : Math.round((1 - precioDescuento/precioOrig)*100)}</span>
                      </div>
                      <div>
                        <span className="text-[9px] font-black text-slate-400 uppercase block leading-none mb-1">Precio Oferta</span>
                        <div className="flex items-baseline gap-1.5">
                          <span className="text-base font-black text-emerald-700">S/ {precioDescuento.toFixed(2)}</span>
                          <span className="text-[10px] font-bold text-slate-400 line-through">S/ {precioOrig.toFixed(2)}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-[10px] text-slate-400 font-semibold mt-4">
                    <div className="flex items-center gap-1.5">
                      <Clock size={12} />
                      <span>{formatarFecha(o.fechaInicio)} — {formatarFecha(o.fechaFin)}</span>
                    </div>

                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => abrirEditarOferta(o)}
                        className="p-1.5 hover:bg-sky-50 text-sky-600 rounded-lg border border-transparent hover:border-sky-100 transition-all"
                        title="Editar oferta"
                      >
                        <Edit2 size={12} />
                      </button>
                      <button
                        onClick={() => handleToggleActivoOferta(o)}
                        className={`p-1.5 rounded-lg border border-transparent transition-all ${
                          o.activo 
                            ? 'hover:bg-red-50 text-red-500 hover:border-red-100' 
                            : 'hover:bg-emerald-50 text-emerald-500 hover:border-emerald-100'
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

      {/* ─── MODAL CREAR/EDITAR CAMPAÑA ─── */}
      {modalCampana && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl max-w-md w-full border border-slate-200 shadow-2xl overflow-hidden">
            <div className="p-5 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
              <h3 className="font-black text-slate-800 text-sm uppercase tracking-wide">
                {edicionItem ? 'Editar Campaña Publicitaria' : 'Nueva Campaña Publicitaria'}
              </h3>
              <button onClick={() => setModalCampana(false)} className="p-1.5 rounded-lg hover:bg-slate-200 text-slate-400 transition-all">
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleCampanaSubmit} className="p-5 space-y-4 text-xs font-semibold">
              <div className="space-y-1">
                <label className="block text-slate-500 uppercase">Nombre de la Campaña</label>
                <input
                  type="text"
                  required
                  value={formCampana.nombre}
                  onChange={(e) => setFormCampana({ ...formCampana, nombre: e.target.value })}
                  placeholder="Ej: Descuento Navideño, Campaña de Desparasitación"
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg outline-none focus:border-sky-400 transition-all"
                />
              </div>

              <div className="space-y-1">
                <label className="block text-slate-500 uppercase">Descripción</label>
                <textarea
                  required
                  value={formCampana.descripcion}
                  onChange={(e) => setFormCampana({ ...formCampana, descripcion: e.target.value })}
                  placeholder="Mensaje o términos de la campaña de marketing..."
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg outline-none focus:border-sky-400 transition-all h-24"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="block text-slate-500 uppercase">Fecha de Inicio</label>
                  <input
                    type="date"
                    required
                    value={formCampana.fechaInicio}
                    onChange={(e) => setFormCampana({ ...formCampana, fechaInicio: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg outline-none focus:border-sky-400 transition-all"
                  />
                </div>

                <div className="space-y-1">
                  <label className="block text-slate-500 uppercase">Fecha de Término</label>
                  <input
                    type="date"
                    required
                    value={formCampana.fechaFin}
                    onChange={(e) => setFormCampana({ ...formCampana, fechaFin: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg outline-none focus:border-sky-400 transition-all"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="block text-slate-500 uppercase">Enlace de Imagen</label>
                <input
                  type="text"
                  value={formCampana.imagenUrl}
                  onChange={(e) => setFormCampana({ ...formCampana, imagenUrl: e.target.value })}
                  placeholder="/uploads/defecto-campana.png"
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg outline-none focus:border-sky-400 transition-all"
                />
              </div>

              {errorForm && (
                <div className="bg-red-50 border border-red-200 rounded-xl p-3 flex items-center gap-2 text-[11px] text-red-700">
                  <AlertTriangle size={14} className="shrink-0" />
                  <p>{errorForm}</p>
                </div>
              )}

              <div className="pt-3 border-t border-slate-100 flex justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setModalCampana(false)}
                  className="px-4 py-2 rounded-lg border border-slate-200 text-slate-500 hover:bg-slate-100 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={procesando}
                  className="px-5 py-2 bg-sky-500 hover:bg-sky-600 text-white rounded-lg transition-colors flex items-center gap-1.5 disabled:opacity-50"
                >
                  {procesando ? <CargadorSpinner size="xs" color="border-white" /> : <Save size={12} />}
                  Guardar Campaña
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ─── MODAL CREAR/EDITAR OFERTA ─── */}
      {modalOferta && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl max-w-md w-full border border-slate-200 shadow-2xl overflow-hidden">
            <div className="p-5 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
              <h3 className="font-black text-slate-800 text-sm uppercase tracking-wide">
                {edicionItem ? 'Editar Oferta de Descuento' : 'Nueva Oferta de Descuento'}
              </h3>
              <button onClick={() => setModalOferta(false)} className="p-1.5 rounded-lg hover:bg-slate-200 text-slate-400 transition-all">
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleOfertaSubmit} className="p-5 space-y-4 text-xs font-semibold">
              <div className="space-y-1">
                <label className="block text-slate-500 uppercase">Título de la Oferta</label>
                <input
                  type="text"
                  required
                  value={formOferta.titulo}
                  onChange={(e) => setFormOferta({ ...formOferta, titulo: e.target.value })}
                  placeholder="Ej: Descuento 20% en Correas, Oferta Especial de Champú"
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg outline-none focus:border-sky-400 transition-all"
                />
              </div>

              <div className="space-y-1">
                <label className="block text-slate-500 uppercase">Descripción</label>
                <textarea
                  value={formOferta.descripcion}
                  onChange={(e) => setFormOferta({ ...formOferta, descripcion: e.target.value })}
                  placeholder="Detalles adicionales sobre el descuento de la oferta..."
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg outline-none focus:border-sky-400 transition-all h-20"
                />
              </div>

              <div className="space-y-1">
                <label className="block text-slate-500 uppercase">Producto Asociado</label>
                <select
                  required
                  value={formOferta.productoId}
                  onChange={(e) => setFormOferta({ ...formOferta, productoId: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg outline-none focus:border-sky-400 transition-all bg-white"
                >
                  <option value="">Seleccionar Producto</option>
                  {productos.map((prod) => (
                    <option key={prod.id} value={prod.id}>
                      {prod.nombre} (S/ {prod.precio?.toFixed(2)})
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="block text-slate-500 uppercase">Descuento (%)</label>
                  <input
                    type="number"
                    max="100"
                    min="1"
                    value={formOferta.descuentoPorcentaje}
                    onChange={(e) => setFormOferta({ ...formOferta, descuentoPorcentaje: e.target.value })}
                    placeholder="20"
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg outline-none focus:border-sky-400 transition-all"
                  />
                </div>

                <div className="space-y-1">
                  <label className="block text-slate-500 uppercase">Precio Fijo Especial (S/)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={formOferta.precioOferta}
                    onChange={(e) => setFormOferta({ ...formOferta, precioOferta: e.target.value })}
                    placeholder="Opcional"
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg outline-none focus:border-sky-400 transition-all"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="block text-slate-500 uppercase">Campaña Vinculada (Opcional)</label>
                <select
                  value={formOferta.campanaId}
                  onChange={(e) => setFormOferta({ ...formOferta, campanaId: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg outline-none focus:border-sky-400 transition-all bg-white"
                >
                  <option value="">Ninguna campaña</option>
                  {campanas.filter((c) => c.activo).map((camp) => (
                    <option key={camp.id} value={camp.id}>
                      {camp.nombre}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="block text-slate-500 uppercase">Fecha de Inicio</label>
                  <input
                    type="date"
                    required
                    value={formOferta.fechaInicio}
                    onChange={(e) => setFormOferta({ ...formOferta, fechaInicio: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg outline-none focus:border-sky-400 transition-all"
                  />
                </div>

                <div className="space-y-1">
                  <label className="block text-slate-500 uppercase">Fecha de Término</label>
                  <input
                    type="date"
                    required
                    value={formOferta.fechaFin}
                    onChange={(e) => setFormOferta({ ...formOferta, fechaFin: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg outline-none focus:border-sky-400 transition-all"
                  />
                </div>
              </div>

              {errorForm && (
                <div className="bg-red-50 border border-red-200 rounded-xl p-3 flex items-center gap-2 text-[11px] text-red-700">
                  <AlertTriangle size={14} className="shrink-0" />
                  <p>{errorForm}</p>
                </div>
              )}

              <div className="pt-3 border-t border-slate-100 flex justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setModalOferta(false)}
                  className="px-4 py-2 rounded-lg border border-slate-200 text-slate-500 hover:bg-slate-100 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={procesando}
                  className="px-5 py-2 bg-sky-500 hover:bg-sky-600 text-white rounded-lg transition-colors flex items-center gap-1.5 disabled:opacity-50"
                >
                  {procesando ? <CargadorSpinner size="xs" color="border-white" /> : <Save size={12} />}
                  Guardar Oferta
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

export default PaginaCampanas;
