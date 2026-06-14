import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { User, Phone, MapPin, Mail, Lock, Save, ArrowLeft, AlertCircle, CheckCircle } from 'lucide-react';
import { crearNuevoDueno, obtenerListaDuenos, actualizarDuenoExistente } from '@/servicios/duenoServicio';
import CargadorSpinner from '@/componentes/comun/CargadorSpinner';

const RegistrarClienteNuevo = () => {
  const navigate = useNavigate();
  const { id } = useParams(); // Para saber si estamos editando
  const editando = !!id;

  const [form, setForm] = useState({
    nombreCompleto: '',
    telefono: '',
    direccion: '',
    correo: '',
    contrasena: '',
  });

  const [cargandoDatos, setCargandoDatos] = useState(false);
  const [procesando, setProcesando] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  useEffect(() => {
    if (!editando) return;

    const cargarDatosCliente = async () => {
      setCargandoDatos(true);
      try {
        const lista = await obtenerListaDuenos();
        const cliente = lista.find(c => c.id === parseInt(id));
        if (cliente) {
          setForm({
            nombreCompleto: cliente.nombreCompleto || '',
            telefono: cliente.telefono || '',
            direccion: cliente.direccion || '',
            correo: cliente.correo || '',
            contrasena: '', // No cargamos la contraseña original por seguridad
          });
        } else {
          setErrorMsg('Cliente no encontrado');
        }
      } catch (error) {
        console.error('Error al obtener datos del cliente:', error);
        setErrorMsg('Error al cargar la información del cliente');
      } finally {
        setCargandoDatos(false);
      }
    };

    cargarDatosCliente();
  }, [id, editando]);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    if (!form.nombreCompleto || !form.telefono || !form.direccion || !form.correo) {
      setErrorMsg('Todos los campos excepto la contraseña (al editar) son obligatorios');
      return;
    }

    if (form.telefono.length !== 9) {
      setErrorMsg('El teléfono móvil debe tener exactamente 9 dígitos');
      return;
    }

    if (!editando && (!form.contrasena || form.contrasena.length < 6)) {
      setErrorMsg('La contraseña es obligatoria para nuevos registros y debe tener al menos 6 caracteres');
      return;
    }

    setProcesando(true);

    try {
      if (editando) {
        await actualizarDuenoExistente(id, form);
        setSuccessMsg('Ficha de cliente actualizada correctamente');
        setTimeout(() => {
          navigate('/admin/clientes');
        }, 1500);
      } else {
        await crearNuevoDueno(form);
        setSuccessMsg('Cliente registrado y activado con éxito. No requiere verificación.');
        setTimeout(() => {
          navigate('/admin/clientes');
        }, 1800);
      }
    } catch (error) {
      console.error('Error al guardar cliente:', error);
      setErrorMsg(error.response?.data || 'Hubo un problema al procesar la solicitud en el servidor');
    } finally {
      setProcesando(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Botón Volver y Cabecera de Ancho Completo */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200/60 dark:border-slate-700/60 shadow-sm">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate('/admin/clientes')}
            className="p-2.5 rounded-xl text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900"
            title="Regresar a la lista de clientes"
          >
            <ArrowLeft size={18} />
          </button>
          <div>
            <h1 className="text-2xl font-black text-slate-800 dark:text-slate-100 tracking-tight">
              {editando ? 'Editar Expediente de Cliente' : 'Registro de Cliente Nuevo'}
            </h1>
            <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">
              {editando ? 'Modifica los datos personales y de acceso del cliente.' : 'Registra y activa un cliente de forma presencial y directa.'}
            </p>
          </div>
        </div>
      </div>


      {cargandoDatos ? (
        <div className="flex justify-center items-center py-12">
          <CargadorSpinner size="lg" />
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-6">
          {errorMsg && (
            <div className="bg-red-50 text-red-700 border border-red-100 dark:bg-red-950/20 dark:text-red-405 dark:border-red-900/30 rounded-2xl p-4 text-sm font-semibold flex items-start gap-3">
              <AlertCircle className="w-5 h-5 flex-shrink-0 text-red-500 mt-0.5" />
              <span>{errorMsg}</span>
            </div>
          )}

          {successMsg && (
            <div className="bg-emerald-50 text-emerald-700 border border-emerald-100 dark:bg-emerald-950/20 dark:text-emerald-405 dark:border-emerald-900/30 rounded-2xl p-4 text-sm font-semibold flex items-start gap-3">
              <CheckCircle className="w-5 h-5 flex-shrink-0 text-emerald-500 mt-0.5" />
              <span>{successMsg}</span>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Datos Personales */}
            <div className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-200/80 dark:border-slate-700 p-6 space-y-5 shadow-sm">
              <h3 className="text-sm font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider border-b border-slate-100 dark:border-slate-700 pb-3 flex items-center gap-2">
                <span className="text-sky-500 font-bold">👤</span> Datos Personales
              </h3>

              <div>
                <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1.5">Nombre Completo</label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400">
                    <User size={16} />
                  </span>
                  <input
                    type="text"
                    name="nombreCompleto"
                    value={form.nombreCompleto}
                    onChange={handleChange}
                    required
                    placeholder="Ej: Juan Pérez Ramos"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-white text-sm font-semibold focus:ring-2 focus:border-sky-500 focus:ring-sky-100 dark:focus:ring-sky-950 outline-none transition-all bg-slate-50 dark:bg-slate-900 focus:bg-white dark:focus:bg-slate-800"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1.5">Teléfono móvil</label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400">
                    <Phone size={16} />
                  </span>
                  <input
                    type="tel"
                    name="telefono"
                    value={form.telefono}
                    onChange={(e) => {
                      e.target.value = e.target.value.replace(/\D/g, '').slice(0, 9);
                      handleChange(e);
                    }}
                    required
                    placeholder="Ej: 999666333"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-white text-sm font-semibold focus:ring-2 focus:border-sky-500 focus:ring-sky-100 dark:focus:ring-sky-950 outline-none transition-all bg-slate-50 dark:bg-slate-900 focus:bg-white dark:focus:bg-slate-800"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1.5">Dirección física</label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400">
                    <MapPin size={16} />
                  </span>
                  <input
                    type="text"
                    name="direccion"
                    value={form.direccion}
                    onChange={handleChange}
                    required
                    placeholder="Ej: Av. Santo Domingo C-22, Ica"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-white text-sm font-semibold focus:ring-2 focus:border-sky-500 focus:ring-sky-100 dark:focus:ring-sky-950 outline-none transition-all bg-slate-50 dark:bg-slate-900 focus:bg-white dark:focus:bg-slate-800"
                  />
                </div>
              </div>
            </div>

            {/* Cuenta de Acceso */}
            <div className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-200/80 dark:border-slate-700 p-6 space-y-5 shadow-sm flex flex-col justify-between">
              <div className="space-y-5">
                <h3 className="text-sm font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider border-b border-slate-100 dark:border-slate-700 pb-3 flex items-center gap-2">
                  <span className="text-sky-500 font-bold">🔑</span> Cuenta de Acceso
                </h3>

                <div>
                  <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1.5">Correo electrónico</label>
                  <div className="relative">
                    <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400">
                      <Mail size={16} />
                    </span>
                    <input
                      type="email"
                      name="correo"
                      value={form.correo}
                      onChange={handleChange}
                      required
                      placeholder="correo@ejemplo.com"
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-white text-sm font-semibold focus:ring-2 focus:border-sky-500 focus:ring-sky-100 dark:focus:ring-sky-950 outline-none transition-all bg-slate-50 dark:bg-slate-900 focus:bg-white dark:focus:bg-slate-800"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1.5 flex justify-between">
                    <span>Contraseña de acceso</span>
                    {editando && <span className="text-[10px] text-slate-400 italic font-semibold">(Opcional)</span>}
                  </label>
                  <div className="relative">
                    <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400">
                      <Lock size={16} />
                    </span>
                    <input
                      type="password"
                      name="contrasena"
                      value={form.contrasena}
                      onChange={handleChange}
                      required={!editando}
                      placeholder={editando ? 'Dejar en blanco para no cambiar' : 'Mínimo 6 caracteres'}
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-white text-sm font-semibold focus:ring-2 focus:border-sky-500 focus:ring-sky-100 dark:focus:ring-sky-950 outline-none transition-all bg-slate-50 dark:bg-slate-900 focus:bg-white dark:focus:bg-slate-800"
                    />
                  </div>
                </div>
              </div>

              {/* Botón de Guardar */}
              <div className="flex justify-end pt-6 md:pt-0">
                <button
                  type="submit"
                  disabled={procesando}
                  className="w-full md:w-auto px-6 py-3 bg-gradient-to-r from-sky-500 to-cyan-400 hover:from-sky-600 hover:to-cyan-500 text-white text-sm font-bold rounded-xl shadow-lg shadow-sky-500/20 transition-all flex items-center justify-center gap-2"
                >
                  {procesando ? (
                    <>
                      <CargadorSpinner size="xs" color="text-white" />
                      <span>{editando ? 'Actualizando...' : 'Guardando...'}</span>
                    </>
                  ) : (
                    <>
                      <Save size={18} />
                      <span>{editando ? 'Guardar Cambios' : 'Registrar Cliente'}</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </form>
      )}
    </div>
  );
};

export default RegistrarClienteNuevo;
