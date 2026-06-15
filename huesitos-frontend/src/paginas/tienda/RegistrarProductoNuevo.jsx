import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Camera,
  Save,
  Plus,
  X,
  Tag,
  Package,
  AlertTriangle,
  FolderOpen,
  FileText
} from 'lucide-react';
import {
  registrarProducto,
  subirFotoProducto,
  obtenerCategorias
} from '@/api/tiendaApi';
import Combobox from '@/componentes/comun/Combobox';
import CargadorSpinner from '@/componentes/comun/CargadorSpinner';
import ModalCrearCategoria from '@/componentes/tienda/ModalCrearCategoria';

const RegistrarProductoNuevo = () => {
  const navigate = useNavigate();

  // Estados del formulario
  const [nombre, setNombre] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [precio, setPrecio] = useState('');
  const [stockMinimo, setStockMinimo] = useState(5);
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState(null); // Objeto completo { id, label }
  const [categoriaTexto, setCategoriaTexto] = useState('');

  // Listado de categorías
  const [categorias, setCategorias] = useState([]);
  const [cargandoCategorias, setCargandoCategorias] = useState(false);

  // Estados de Imagen
  const [archivo, setArchivo] = useState(null);
  const [vistaPrevia, setVistaPrevia] = useState(null);
  const [errorImagen, setErrorImagen] = useState('');

  // Estados de Modal Categoría
  const [modalNuevaCat, setModalNuevaCat] = useState(false);

  // Procesamiento global
  const [procesando, setProcesando] = useState(false);
  const [errorForm, setErrorForm] = useState('');

  // Cargar categorías al inicio
  const cargarCategorias = async () => {
    setCargandoCategorias(true);
    try {
      const datos = await obtenerCategorias();
      setCategorias(datos);
    } catch (err) {
      console.error('Error al cargar categorías:', err);
    } finally {
      setCargandoCategorias(false);
    }
  };

  useEffect(() => {
    cargarCategorias();
  }, []);

  // Manejar cambio de archivo (Imagen)
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setErrorImagen('');
    if (!file) return;

    // Validación de peso (máximo 5MB)
    const limite = 5 * 1024 * 1024;
    if (file.size > limite) {
      setErrorImagen('El archivo supera el límite de 5MB permitido.');
      e.target.value = '';
      setArchivo(null);
      setVistaPrevia(null);
      return;
    }

    // Validación de tipo de archivo
    if (!file.type.startsWith('image/')) {
      setErrorImagen('Por favor selecciona un archivo de imagen válido.');
      e.target.value = '';
      setArchivo(null);
      setVistaPrevia(null);
      return;
    }

    setArchivo(file);
    setVistaPrevia(URL.createObjectURL(file));
  };



  // Envío del Formulario de Producto
  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorForm('');
    
    if (!nombre.trim()) {
      setErrorForm('El nombre del producto es obligatorio.');
      return;
    }
    if (descripcion && descripcion.length > 350) {
      setErrorForm('La descripción del producto no puede superar los 350 caracteres.');
      return;
    }
    if (!precio || Number(precio) < 0) {
      setErrorForm('El precio debe ser un número igual o mayor a cero.');
      return;
    }
    if (!categoriaSeleccionada) {
      setErrorForm('Debe seleccionar una categoría para el producto.');
      return;
    }

    setProcesando(true);

    try {
      const productoPayload = {
        nombre: nombre.trim(),
        descripcion: descripcion.trim() || null,
        precio: Number(precio),
        stockMinimo: Number(stockMinimo),
        categoria: { id: categoriaSeleccionada.id }
      };

      // 1. Guardar el producto
      const productoRegistrado = await registrarProducto(productoPayload);

      // 2. Si hay imagen seleccionada, subirla
      if (archivo) {
        try {
          await subirFotoProducto(productoRegistrado.id, archivo);
        } catch (imgErr) {
          console.error('Error al subir la imagen del producto:', imgErr);
          alert('El producto se guardó, pero hubo un error al subir la foto.');
        }
      }

      alert('Producto registrado con éxito.');
      navigate('/admin/inventario');
    } catch (err) {
      const msg = err.response?.data || err.message || 'Error al guardar el producto.';
      setErrorForm(typeof msg === 'string' ? msg : JSON.stringify(msg));
    } finally {
      setProcesando(false);
    }
  };

  return (
    <div className="w-full space-y-6 animate-in fade-in duration-300 font-sans text-slate-700 pb-10">
      
      {/* Cabecera / Retorno */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate('/admin/inventario')}
            className="p-2 bg-white dark:bg-slate-700 hover:bg-slate-50 dark:hover:bg-slate-650 text-slate-500 dark:text-slate-200 border border-slate-200 dark:border-slate-600 rounded-lg transition-colors shadow-sm"
            title="Volver al Inventario"
          >
            <ArrowLeft size={16} />
          </button>
          <div>
            <h2 className="text-xl md:text-2xl font-black text-slate-800 dark:text-slate-100 tracking-tight">
              Registrar Producto Nuevo
            </h2>
            <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mt-0.5">Tienda y Productos</p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Columna Izquierda: Carga de Imagen */}
        <div className="lg:col-span-1 space-y-4">
          <div className="bg-white dark:bg-slate-800 p-5 rounded-2xl border border-slate-200/60 dark:border-slate-700/60 shadow-sm flex flex-col items-center text-center">
            <span className="block text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wide mb-4 self-start">
              Imagen del Producto
            </span>

            {/* Vista Previa de Foto */}
            <div className="w-48 h-48 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 overflow-hidden flex items-center justify-center text-slate-300 shadow-inner relative group transition-all duration-300 hover:border-sky-400">
              {vistaPrevia ? (
                <img
                  src={vistaPrevia}
                  alt="Vista previa"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="flex flex-col items-center gap-2 text-slate-400">
                  <Package size={48} className="text-slate-300 dark:text-slate-700" />
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Sin Imagen</span>
                </div>
              )}
              {procesando && (
                <div className="absolute inset-0 bg-slate-950/20 backdrop-blur-[1px] flex items-center justify-center">
                  <CargadorSpinner size="sm" />
                </div>
              )}
            </div>

            {/* Selector de Archivo */}
            <div className="mt-4 w-full">
              <label
                className={`w-full inline-flex items-center justify-center gap-2 bg-slate-50 dark:bg-slate-700 hover:bg-slate-100 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-200 border border-slate-300 dark:border-slate-600 px-4 py-2.5 rounded-xl text-xs font-bold transition-all shadow-sm cursor-pointer ${
                  procesando ? 'opacity-50 cursor-not-allowed' : ''
                }`}
              >
                <Camera size={15} />
                {archivo ? 'Cambiar imagen' : 'Seleccionar imagen'}
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="hidden"
                  disabled={procesando}
                />
              </label>
              <span className="text-[10px] text-slate-400 dark:text-slate-500 block mt-2 font-semibold">
                Límite de tamaño: 5MB. Formatos JPG, PNG, WEBP.
              </span>
            </div>

            {errorImagen && (
              <div className="mt-3 bg-red-50 border border-red-200 rounded-xl p-2.5 flex items-center gap-2 text-[10px] text-red-700">
                <AlertTriangle size={14} className="shrink-0" />
                <p className="font-semibold text-left">{errorImagen}</p>
              </div>
            )}
          </div>
        </div>

        {/* Columna Derecha: Formulario de Datos */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200/60 dark:border-slate-700/60 shadow-sm space-y-5">
            <span className="block text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wide">
              Información Básica del Producto
            </span>

            {/* Nombre */}
            <div className="space-y-1 text-xs font-bold uppercase tracking-wider">
              <label className="block text-slate-500 dark:text-slate-400">Nombre del Producto</label>
              <input
                type="text"
                required
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                placeholder="Ej: Champú Premium Huesitos 500ml"
                className="w-full px-4 py-3 border border-slate-200 dark:border-slate-600 rounded-xl text-slate-800 dark:text-slate-100 outline-none focus:ring-2 focus:ring-sky-100 focus:border-sky-400 transition-all bg-slate-50 dark:bg-slate-700 focus:bg-white dark:focus:bg-slate-650"
                disabled={procesando}
              />
            </div>

            {/* Descripción */}
            <div className="space-y-1 text-xs font-bold uppercase tracking-wider">
              <div className="flex justify-between items-center">
                <label className="block text-slate-500 dark:text-slate-400">Descripción</label>
                <span className={`text-[10px] lowercase font-semibold tracking-normal ${descripcion.length > 350 ? 'text-red-500' : 'text-slate-400 dark:text-slate-500'}`}>
                  {descripcion.length}/350 caracteres
                </span>
              </div>
              <textarea
                value={descripcion}
                onChange={(e) => setDescripcion(e.target.value)}
                maxLength={350}
                placeholder="Ingresa los componentes, modo de uso o información relevante del producto..."
                className="w-full px-4 py-3 border border-slate-200 dark:border-slate-600 rounded-xl text-slate-800 dark:text-slate-100 outline-none focus:ring-2 focus:ring-sky-100 focus:border-sky-400 transition-all h-24 bg-slate-50 dark:bg-slate-700 focus:bg-white dark:focus:bg-slate-650 resize-none"
                disabled={procesando}
              />
            </div>

            {/* Precio y Stock Mínimo */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1 text-xs font-bold uppercase tracking-wider">
                <label className="block text-slate-500 dark:text-slate-400">Precio Unitario (S/)</label>
                <div className="relative">
                  <Tag className="absolute left-3.5 top-3.5 text-slate-400" size={16} />
                  <input
                    type="number"
                    step="0.01"
                    required
                    value={precio}
                    onChange={(e) => setPrecio(e.target.value)}
                    placeholder="0.00"
                    className="w-full pl-10 pr-4 py-3 border border-slate-200 dark:border-slate-600 rounded-xl text-slate-800 dark:text-slate-100 outline-none focus:ring-2 focus:ring-sky-100 focus:border-sky-400 transition-all bg-slate-50 dark:bg-slate-700 focus:bg-white dark:focus:bg-slate-650 font-bold"
                    disabled={procesando}
                  />
                </div>
              </div>

              <div className="space-y-1 text-xs font-bold uppercase tracking-wider">
                <label className="block text-slate-500 dark:text-slate-400">Stock de Alerta Mínimo</label>
                <input
                  type="number"
                  required
                  value={stockMinimo}
                  onChange={(e) => setStockMinimo(e.target.value)}
                  placeholder="5"
                  className="w-full px-4 py-3 border border-slate-200 dark:border-slate-600 rounded-xl text-slate-800 dark:text-slate-100 outline-none focus:ring-2 focus:ring-sky-100 focus:border-sky-400 transition-all bg-slate-50 dark:bg-slate-700 focus:bg-white dark:focus:bg-slate-650 font-bold"
                  disabled={procesando}
                />
              </div>
            </div>

            {/* Categorías con Combobox */}
            <div className="space-y-1 text-xs font-bold uppercase tracking-wider">
              <label className="block text-slate-500 dark:text-slate-400 mb-1">Categoría</label>
              <div className="flex items-center gap-3">
                <div className="flex-1 relative">
                  {cargandoCategorias ? (
                    <div className="flex items-center gap-2 py-3 px-4 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-xl">
                      <CargadorSpinner size="xs" />
                      <span className="text-slate-400 text-xs font-semibold lowercase">Cargando categorías...</span>
                    </div>
                  ) : (
                    <Combobox
                      value={categoriaTexto}
                      onChange={(label, _, opcCompleto) => {
                        setCategoriaTexto(label);
                        if (opcCompleto) {
                          setCategoriaSeleccionada({ id: opcCompleto.id, label: opcCompleto.label });
                        } else {
                          // Si borra o escribe algo manual, buscamos si coincide exactamente con alguna
                          const coincidencia = categorias.find(c => c.nombre.toLowerCase() === label.toLowerCase());
                          if (coincidencia) {
                            setCategoriaSeleccionada({ id: coincidencia.id, label: coincidencia.nombre });
                          } else {
                            setCategoriaSeleccionada(null);
                          }
                        }
                      }}
                      opciones={categorias.map((cat) => ({
                        id: cat.id,
                        label: cat.nombre,
                        categoria: 'Categorías de la Tienda'
                      }))}
                      placeholder="Seleccionar o buscar categoría..."
                      icono={FolderOpen}
                    />
                  )}
                </div>

                <button
                  type="button"
                  onClick={() => setModalNuevaCat(true)}
                  className="p-3 bg-sky-50 dark:bg-sky-900/30 hover:bg-sky-100 dark:hover:bg-sky-900/50 text-sky-650 dark:text-sky-400 border border-sky-200/60 dark:border-sky-700/60 rounded-xl transition-all shadow-sm active:scale-95 shrink-0"
                  title="Crear nueva categoría"
                  disabled={procesando}
                >
                  <Plus size={18} />
                </button>
              </div>
            </div>

            {errorForm && (
              <div className="bg-red-50 border border-red-200 rounded-2xl p-4 flex items-center gap-2.5 text-xs text-red-750 font-semibold shadow-sm">
                <AlertTriangle size={16} className="shrink-0 text-red-500" />
                <p className="text-left leading-relaxed">{errorForm}</p>
              </div>
            )}

            {/* Acciones */}
            <div className="pt-4 border-t border-slate-100 dark:border-slate-700 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => navigate('/admin/inventario')}
                className="px-5 py-3 rounded-xl border border-slate-200 dark:border-slate-600 text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700 font-bold transition-all text-xs"
                disabled={procesando}
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={procesando}
                className="px-6 py-3 bg-slate-900 dark:bg-slate-100 hover:bg-slate-800 dark:hover:bg-slate-200 text-white dark:text-slate-900 rounded-xl transition-all flex items-center gap-1.5 font-bold disabled:opacity-50 text-xs shadow-md shadow-slate-900/10 dark:shadow-none"
              >
                {procesando ? (
                  <CargadorSpinner size="xs" color="border-white dark:border-slate-900" />
                ) : (
                  <Save size={14} />
                )}
                Guardar Producto
              </button>
            </div>
          </div>
        </div>
      </form>

      {/* ─── MODAL CREAR NUEVA CATEGORÍA RÁPIDA (DESACOPLADO) ─── */}
      <ModalCrearCategoria
        isOpen={modalNuevaCat}
        onClose={() => setModalNuevaCat(false)}
        onCreated={async (catCreada) => {
          await cargarCategorias();
          setCategoriaSeleccionada({ id: catCreada.id, label: catCreada.nombre });
          setCategoriaTexto(catCreada.nombre);
        }}
      />
    </div>
  );
};

export default RegistrarProductoNuevo;
