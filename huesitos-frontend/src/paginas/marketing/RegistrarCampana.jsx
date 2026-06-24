import { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { ArrowLeft, Megaphone, Save, Upload, Calendar, AlertTriangle, Check, X, Stethoscope } from 'lucide-react';
import { registrarCampana, actualizarCampana, obtenerCampanaPorId, subirFotoCampana } from '@/api/marketingApi';
import { listarServicios } from '@/servicios/servicioServicio';
import Combobox from '@/componentes/comun/Combobox';
import CargadorSpinner from '@/componentes/comun/CargadorSpinner';
import { obtenerUrlImagen } from '@/servicios/imagenServicio';

const RegistrarCampana = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const esEdicion = !!id;

  const [form, setForm] = useState({
    nombre: '',
    descripcion: '',
    fechaInicio: '',
    fechaFin: '',
    imagenUrl: '',
    precioPromocional: '',
    servicios: []
  });

  const [todosServicios, setTodosServicios] = useState([]);
  const [imagenArchivo, setImagenArchivo] = useState(null);
  const [vistaPreviaImagen, setVistaPreviaImagen] = useState('');
  const [cargando, setCargando] = useState(false);
  const [procesando, setProcesando] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    const cargarServiciosYDatos = async () => {
      setCargando(true);
      setErrorMsg('');
      try {
        const servicios = await listarServicios();
        setTodosServicios(servicios || []);

        if (esEdicion) {
          const campana = await obtenerCampanaPorId(id);
          if (campana) {
            setForm({
              nombre: campana.nombre,
              descripcion: campana.descripcion || '',
              fechaInicio: campana.fechaInicio,
              fechaFin: campana.fechaFin,
              imagenUrl: campana.imagenUrl || '',
              precioPromocional: campana.precioPromocional || '',
              servicios: campana.servicios ? campana.servicios.map(s => s.id) : []
            });
            if (campana.imagenUrl) {
              setVistaPreviaImagen(obtenerUrlImagen(campana.imagenUrl));
            }
          }
        }
      } catch (err) {
        console.error('Error al inicializar la página de campaña:', err);
        setErrorMsg('Error al cargar la información requerida.');
      } finally {
        setCargando(false);
      }
    };

    cargarServiciosYDatos();
  }, [id, esEdicion]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSeleccionarServicioCombobox = (nombreLabel, precio, objetoCompleto) => {
    if (objetoCompleto && objetoCompleto.id) {
      setForm(prev => {
        if (prev.servicios.includes(objetoCompleto.id)) return prev;
        return { ...prev, servicios: [...prev.servicios, objetoCompleto.id] };
      });
    }
  };

  const removerServicioSeleccionado = (servicioId) => {
    setForm(prev => ({
      ...prev,
      servicios: prev.servicios.filter(id => id !== servicioId)
    }));
  };

  const handleImagenChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert("El banner publicitario no debe superar los 5MB.");
        return;
      }
      setImagenArchivo(file);
      setVistaPreviaImagen(URL.createObjectURL(file));
    }
  };

  const serviciosSeleccionadosObj = form.servicios.map(sid => todosServicios.find(s => s.id === sid)).filter(Boolean);
  const precioOriginalPaquete = serviciosSeleccionadosObj.reduce((sum, s) => sum + (s.precio || 0), 0);
  const precioPromocionalFinal = form.precioPromocional ? Number(form.precioPromocional) : 0;

  let descuentoCalculado = 0;
  if (precioOriginalPaquete > 0 && precioPromocionalFinal > 0 && precioPromocionalFinal < precioOriginalPaquete) {
    descuentoCalculado = Math.round(((precioOriginalPaquete - precioPromocionalFinal) / precioOriginalPaquete) * 100);
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setProcesando(true);
    setErrorMsg('');

    try {
      if (form.fechaInicio > form.fechaFin) {
        throw new Error('La fecha de inicio no puede ser posterior a la fecha de término.');
      }
      if (form.descripcion.length > 500) {
        throw new Error('La descripción no puede superar los 500 caracteres.');
      }

      const payload = {
        nombre: form.nombre,
        descripcion: form.descripcion,
        fechaInicio: form.fechaInicio,
        fechaFin: form.fechaFin,
        imagenUrl: form.imagenUrl,
        precioPromocional: form.precioPromocional ? Number(form.precioPromocional) : null,
        servicios: form.servicios.map(sid => ({ id: sid }))
      };

      let campanaGuardada;
      if (esEdicion) {
        campanaGuardada = await actualizarCampana(id, { ...payload, activo: true });
      } else {
        campanaGuardada = await registrarCampana({ ...payload, activo: true });
      }

      if (imagenArchivo && campanaGuardada && campanaGuardada.id) {
        await subirFotoCampana(campanaGuardada.id, imagenArchivo);
      }

      alert(esEdicion ? 'Campaña de marketing actualizada con éxito.' : 'Campaña de marketing creada con éxito.');
      navigate('/admin/campanas');
    } catch (err) {
      const msg = err.response?.data || err.message || 'Error al procesar la campaña.';
      setErrorMsg(typeof msg === 'string' ? msg : JSON.stringify(msg));
    } finally {
      setProcesando(false);
    }
  };

  if (cargando) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-3 bg-white dark:bg-slate-800 rounded-3xl border border-slate-200/60 dark:border-slate-700/60 shadow-sm animate-pulse">
        <CargadorSpinner size="lg" />
        <span className="text-sm font-bold text-slate-400 dark:text-slate-500">Cargando datos de la campaña...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* HEADER DE LA PÁGINA */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200/60 dark:border-slate-700/60 shadow-sm">
        <div className="flex items-center gap-3">
          <Link
            to="/admin/campanas"
            className="p-2.5 bg-slate-50 hover:bg-slate-100 dark:bg-slate-900/60 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 rounded-xl transition-all border border-slate-200/60 dark:border-slate-700/60"
          >
            <ArrowLeft size={18} />
          </Link>
          <div>
            <h1 className="text-2xl font-black text-slate-850 dark:text-slate-100 tracking-tight leading-none">
              {esEdicion ? 'Editar Campaña Publicitaria' : 'Nueva Campaña Publicitaria'}
            </h1>
            <p className="text-slate-500 dark:text-slate-400 text-xs mt-1.5 font-medium">
              Vincula servicios veterinarios y publica banners destacados en el portal principal.
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

      {/* FORMULARIO Y MAQUETA */}
      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Panel izquierdo: Controles y campos */}
        <div className="lg:col-span-7 space-y-6">
          <div className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-200/60 dark:border-slate-700/60 p-6 space-y-5 shadow-sm">
            <h3 className="text-sm font-black text-slate-800 dark:text-slate-100 border-b border-slate-100 dark:border-slate-700 pb-3 flex items-center gap-2 uppercase tracking-wide">
              <Megaphone size={16} className="text-sky-500" /> Parámetros de Campaña
            </h3>

            <div className="space-y-4">
              {/* Nombre de la Campaña */}
              <div>
                <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">Nombre Comercial del Evento</label>
                <input
                  type="text"
                  name="nombre"
                  value={form.nombre}
                  onChange={handleChange}
                  required
                  placeholder="Ej: Paquete Cachorro Sano, Campaña Esterilización Abril"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-650 text-slate-800 dark:text-slate-100 text-sm font-semibold outline-none focus:ring-2 focus:ring-sky-100 focus:border-sky-400 transition-all bg-slate-50 dark:bg-slate-900 focus:bg-white dark:focus:bg-slate-800 placeholder:text-slate-400 dark:placeholder:text-slate-500"
                />
              </div>

              {/* Descripción */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Detalles y Términos de la Promoción</label>
                  <span className={`text-[10px] font-bold ${form.descripcion.length > 450 ? 'text-red-500' : 'text-slate-400'}`}>
                    {form.descripcion.length} / 500
                  </span>
                </div>
                <textarea
                  name="descripcion"
                  value={form.descripcion}
                  onChange={handleChange}
                  required
                  maxLength={500}
                  placeholder="Describe qué incluye la campaña (ej. Consulta, Vacunación, Test Rápido), precios promocionales e indicaciones..."
                  className="w-full h-32 px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-650 text-slate-800 dark:text-slate-100 text-sm font-semibold outline-none focus:ring-2 focus:ring-sky-100 focus:border-sky-400 transition-all bg-slate-50 dark:bg-slate-900 focus:bg-white dark:focus:bg-slate-800 placeholder:text-slate-400 dark:placeholder:text-slate-500"
                />
              </div>

              {/* Precio Promocional de la Campaña */}
              <div>
                <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">Precio Fijo Promocional Especial (S/.)</label>
                <input
                  type="number"
                  step="0.01"
                  name="precioPromocional"
                  value={form.precioPromocional}
                  onChange={handleChange}
                  placeholder="Ej: 150.00 (Precio final del paquete de la campaña)"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-650 text-slate-800 dark:text-slate-100 text-sm font-semibold outline-none focus:ring-2 focus:ring-sky-100 focus:border-sky-400 transition-all bg-slate-50 dark:bg-slate-900 focus:bg-white dark:focus:bg-slate-800 placeholder:text-slate-400 dark:placeholder:text-slate-500"
                />
              </div>

              {/* Rango de fechas */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">Fecha de Lanzamiento</label>
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
                  <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">Fecha de Finalización</label>
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

          {/* Vinculación de Servicios */}
          <div className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-200/60 dark:border-slate-700/60 p-6 space-y-4 shadow-sm">
            <h3 className="text-sm font-black text-slate-800 dark:text-slate-100 border-b border-slate-100 dark:border-slate-700 pb-3 flex items-center gap-2 uppercase tracking-wide">
              <Check size={16} className="text-emerald-500" /> Servicios Incluidos en el Paquete
            </h3>
            
            <div className="space-y-3">
              <span className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Buscar y Agregar Servicios</span>
              <p className="text-xs text-slate-400 dark:text-slate-500 leading-relaxed">
                Busca y selecciona los servicios clínicos que formarán parte de esta campaña y paquete promocional.
              </p>
              <div className="pt-1">
                <Combobox
                  value=""
                  onChange={handleSeleccionarServicioCombobox}
                  opciones={todosServicios
                    .filter(s => s.activo)
                    .map(s => ({
                      label: s.nombre,
                      precio: s.precio,
                      id: s.id,
                      categoria: `Duración: ${s.duracionMinutos} min`
                    }))
                  }
                  placeholder="Escribe para buscar y seleccionar un servicio..."
                  icono={Stethoscope}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Panel derecho: Subida y Vista Previa */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-200/60 dark:border-slate-700/60 p-6 space-y-5 shadow-sm">
            <h3 className="text-sm font-black text-slate-800 dark:text-slate-100 border-b border-slate-100 dark:border-slate-700 pb-3 flex items-center gap-2 uppercase tracking-wide">
              <Upload size={16} className="text-sky-500" /> Imagen del Banner
            </h3>

            {/* Input de archivo */}
            <div className="space-y-4">
              <div className="flex justify-center">
                <label className="w-full flex flex-col items-center justify-center p-6 border-2 border-dashed border-slate-300 dark:border-slate-600 hover:border-sky-400 dark:hover:border-sky-500 rounded-2xl cursor-pointer transition-all hover:bg-slate-50/50 dark:hover:bg-slate-750">
                  <Upload size={24} className="text-slate-400 mb-2" />
                  <span className="text-xs font-bold text-slate-600 dark:text-slate-300">Seleccionar Banner Promocional</span>
                  <span className="text-[9px] text-slate-400 dark:text-slate-500 mt-1 uppercase font-semibold">Formatos: PNG, JPG, WEBP · Recomendado 16:9 (Máx 5MB)</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImagenChange}
                    className="hidden"
                  />
                </label>
              </div>

              {/* Vista Previa del Banner tipo Hero (16:9 y reducido) */}
              <div className="space-y-2">
                <span className="block text-xs font-bold text-slate-550 uppercase tracking-wider text-center">Vista Previa (16:9)</span>
                <div className="aspect-video max-w-xs mx-auto rounded-2xl border border-slate-200 dark:border-slate-700 overflow-hidden bg-slate-50 dark:bg-slate-900 flex items-center justify-center relative group shadow-sm">
                  {vistaPreviaImagen ? (
                    <img
                      src={vistaPreviaImagen}
                      alt="Banner promocional 16:9"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="text-center p-4">
                      <Megaphone size={28} className="text-slate-300 dark:text-slate-700 mx-auto mb-2 animate-bounce" />
                      <span className="text-[10px] text-slate-400 dark:text-slate-550 font-bold">Ninguna imagen seleccionada.</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Servicios Seleccionados */}
          <div className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-200/60 dark:border-slate-700/60 p-6 space-y-4 shadow-sm animate-in fade-in duration-300">
            <h3 className="text-sm font-black text-slate-800 dark:text-slate-100 border-b border-slate-100 dark:border-slate-700 pb-3 flex items-center gap-2 uppercase tracking-wide">
              <Check size={16} className="text-emerald-500" /> Servicios Seleccionados ({form.servicios.length})
            </h3>
            
            <div className="border border-slate-150 dark:border-slate-700 rounded-2xl p-3 h-[200px] overflow-y-auto space-y-2 bg-slate-50/50 dark:bg-slate-900/30">
              {form.servicios.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full py-4 text-slate-400 dark:text-slate-500">
                  <Stethoscope size={24} className="opacity-40 mb-1" />
                  <p className="text-xs italic text-center">
                    Ningún servicio agregado todavía.
                  </p>
                </div>
              ) : (
                form.servicios.map((id) => {
                  const s = todosServicios.find(item => item.id === id);
                  if (!s) return null;
                  return (
                    <div
                      key={s.id}
                      className="flex items-center justify-between p-2.5 bg-white dark:bg-slate-800 rounded-xl border border-slate-200/60 dark:border-slate-700/60 shadow-sm animate-in fade-in slide-in-from-top-1 duration-200"
                    >
                      <div className="flex flex-col min-w-0 pr-2">
                        <span className="text-xs font-bold text-slate-850 dark:text-slate-150 truncate" title={s.nombre}>
                          {s.nombre}
                        </span>
                        <span className="text-[9px] text-slate-400 dark:text-slate-500 font-medium">
                          Duración: {s.duracionMinutos} min
                        </span>
                      </div>
                      <div className="flex items-center gap-2 flex-shrink-0">
                        <span className="text-xs font-black text-slate-800 dark:text-slate-200">
                          S/. {s.precio?.toFixed(2)}
                        </span>
                        <button
                          type="button"
                          onClick={() => removerServicioSeleccionado(s.id)}
                          className="p-1 text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 rounded-lg transition-colors border border-transparent hover:border-red-150 dark:hover:border-red-900/40"
                          title="Remover servicio"
                        >
                          <X size={12} />
                        </button>
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            {/* Resumen Financiero Calculado */}
            {form.servicios.length > 0 && (
              <div className="pt-3 border-t border-slate-100 dark:border-slate-700 space-y-3">
                <div className="flex justify-between items-center text-xs font-semibold text-slate-500 dark:text-slate-400">
                  <span>Precio Inicial (Suma de Servicios):</span>
                  <span className="font-bold text-slate-700 dark:text-slate-350">
                    S/. {precioOriginalPaquete.toFixed(2)}
                  </span>
                </div>
                
                <div className="flex justify-between items-center text-xs font-semibold text-slate-500 dark:text-slate-400">
                  <span>Precio Promocional:</span>
                  <span className="font-bold text-sky-600 dark:text-sky-400">
                    {precioPromocionalFinal > 0 ? `S/. ${precioPromocionalFinal.toFixed(2)}` : 'S/. 0.00'}
                  </span>
                </div>

                <div className="flex justify-between items-center bg-slate-50 dark:bg-slate-900/50 p-2.5 rounded-xl border border-slate-150 dark:border-slate-750">
                  <span className="text-[11px] font-bold text-slate-550 dark:text-slate-400 uppercase">Descuento</span>
                  <span className="text-lg font-black text-emerald-500">
                    {descuentoCalculado}%
                  </span>
                </div>

                {precioOriginalPaquete > 0 && precioPromocionalFinal > 0 && precioPromocionalFinal < precioOriginalPaquete ? (
                  <div className="bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-100 dark:border-emerald-900/40 rounded-xl p-2.5 text-center flex flex-col gap-0.5 shadow-sm animate-in zoom-in-95 duration-200">
                    <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">¡Ahorro para el Cliente!</span>
                    <span className="text-sm font-black text-emerald-650 dark:text-emerald-400">
                      S/. {(precioOriginalPaquete - precioPromocionalFinal).toFixed(2)}
                    </span>
                  </div>
                ) : precioPromocionalFinal >= precioOriginalPaquete && precioPromocionalFinal > 0 ? (
                  <div className="text-[10px] text-amber-600 dark:text-amber-400 font-semibold text-center bg-amber-50/50 dark:bg-amber-950/20 border border-amber-100 dark:border-amber-900/30 p-2 rounded-xl">
                    El precio promocional debería ser menor a la suma de servicios.
                  </div>
                ) : null}
              </div>
            )}
          </div>

          {/* Botones de acción */}
          <div className="flex justify-end gap-3 pt-2">
            <Link
              to="/admin/campanas"
              className="px-6 py-3 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-750 text-slate-600 dark:text-slate-300 text-sm font-bold rounded-xl transition-all"
            >
              Cancelar
            </Link>
            <button
              type="submit"
              disabled={procesando}
              className="px-8 py-3 bg-gradient-to-r from-sky-500 to-cyan-400 hover:from-sky-600 hover:to-cyan-500 text-white text-sm font-black rounded-xl shadow-lg shadow-sky-500/20 transition-all flex items-center gap-2 disabled:opacity-50"
            >
              {procesando ? (
                <>
                  <CargadorSpinner size="xs" color="border-white" />
                  <span>Procesando...</span>
                </>
              ) : (
                <>
                  <Save size={16} />
                  <span>{esEdicion ? 'Guardar Cambios' : 'Lanzar Campaña'}</span>
                </>
              )}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default RegistrarCampana;
