import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Phone, MapPin, Mail, Lock, Camera, Save, AlertCircle, CheckCircle } from 'lucide-react';
import { obtenerPerfil, actualizarPerfil, subirFotoPerfil } from '@/api/perfilApi';
import PlantillaTablero from '@/componentes/layout/PlantillaTablero';
import CargadorSpinner from '@/componentes/comun/CargadorSpinner';
import { useTema } from '@/contextos/ContextoTema';

const MiPerfil = ({ sinPlantilla = false }) => {
  const navigate = useNavigate();
  const { cambiarTema } = useTema();
  const usuarioId = localStorage.getItem('usuarioId');
  const rol = localStorage.getItem('usuarioRol') || 'CLIENTE';

  const [nombre, setNombre] = useState('');
  const [apellido, setApellido] = useState('');
  const [correo, setCorreo] = useState('');
  const [telefono, setTelefono] = useState('');
  const [direccion, setDireccion] = useState('');
  const [fotoPerfilUrl, setFotoPerfilUrl] = useState('');
  const [temaLocal, setTemaLocal] = useState('claro');
  
  const [contrasenaActual, setContrasenaActual] = useState('');
  const [contrasena, setContrasena] = useState('');
  const [confirmarContrasena, setConfirmarContrasena] = useState('');

  const [cargando, setCargando] = useState(true);
  const [subiendoFoto, setSubiendoFoto] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Adaptar el color del botón según el rol
  const esVeterinario = rol === 'VETERINARIO';
  const colorBoton = esVeterinario 
    ? 'bg-emerald-600 hover:bg-emerald-700 shadow-emerald-600/10 focus:ring-emerald-500' 
    : 'bg-sky-600 hover:bg-sky-700 shadow-sky-600/10 focus:ring-sky-500';

  const colorTexto = esVeterinario ? 'text-emerald-600' : 'text-sky-600';
  const colorBordeFocus = esVeterinario ? 'focus:border-emerald-500 focus:ring-emerald-100' : 'focus:border-sky-500 focus:ring-sky-100';

  useEffect(() => {
    if (!usuarioId) return;
    
    const cargarDatos = async () => {
      try {
        const datos = await obtenerPerfil(usuarioId);
        setNombre(datos.nombre || '');
        setApellido(datos.apellido || '');
        setCorreo(datos.correo || '');
        setFotoPerfilUrl(datos.fotoPerfilUrl || '');
        
        setTelefono(datos.telefono || '');
        setDireccion(datos.direccion || '');
        setTemaLocal(datos.tema || 'claro');
      } catch (error) {
        console.error('Error al cargar datos del perfil:', error);
        setErrorMsg('No se pudo cargar la información de tu perfil');
      } finally {
        setCargando(false);
      }
    };

    cargarDatos();
  }, [usuarioId]);

  const handleSubirFoto = async (e) => {
    if (subiendoFoto) return;
    const archivo = e.target.files[0];
    if (!archivo) return;

    setSubiendoFoto(true);
    setErrorMsg('');
    setSuccessMsg('');

    try {
      const datos = await subirFotoPerfil(usuarioId, archivo);
      setFotoPerfilUrl(datos.fotoPerfilUrl);
      setSuccessMsg('Foto de perfil actualizada correctamente');
      
      // Actualizar la foto en el navbar de forma inmediata si se guarda en algún estado global
      // (Dado que depende de localStorage o recarga, un evento custom o refrescar ayuda)
      localStorage.setItem('fotoPerfilUrl', datos.fotoPerfilUrl);
      window.dispatchEvent(new Event('storage'));
    } catch (error) {
      console.error('Error al subir foto:', error);
      setErrorMsg(error.response?.data || 'Error al subir la imagen');
    } finally {
      setSubiendoFoto(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    if (!nombre || !apellido || !correo) {
      setErrorMsg('Los campos Nombre, Apellido y Correo electrónico son obligatorios');
      return;
    }

    if (contrasena) {
      if (!contrasenaActual) {
        setErrorMsg('Debes ingresar tu contraseña actual para cambiarla');
        return;
      }
      if (contrasena.length < 6) {
        setErrorMsg('La nueva contraseña debe tener al menos 6 caracteres');
        return;
      }
      if (contrasena !== confirmarContrasena) {
        setErrorMsg('Las contraseñas nuevas no coinciden');
        return;
      }
    }

    if (telefono && telefono.length !== 9) {
      setErrorMsg('El teléfono móvil debe tener exactamente 9 dígitos');
      return;
    }

    try {
      const payload = {
        nombre,
        apellido,
        correo,
        contrasenaActual: contrasenaActual || null,
        contrasena: contrasena || null,
        telefono: telefono || null,
        direccion: direccion || null,
        tema: temaLocal,
      };

      await actualizarPerfil(usuarioId, payload);
      setSuccessMsg('Perfil actualizado correctamente');
      alert('¡Perfil actualizado con éxito!');
      setContrasenaActual('');
      setContrasena('');
      setConfirmarContrasena('');
      
      // Actualizar correo en localstorage si cambió
      localStorage.setItem('correo', correo);
    } catch (error) {
      console.error('Error al actualizar perfil:', error);
      setErrorMsg(error.response?.data || 'Error al actualizar el perfil');
      alert(error.response?.data || 'Error al actualizar el perfil');
    }
  };

  const handleCambiarTema = (nuevoTema) => {
    setTemaLocal(nuevoTema);
    cambiarTema(nuevoTema);
  };

  const contenido = (
    <div className="max-w-4xl mx-auto py-6 px-4">
      {/* Cabecera */}
      <div className="mb-8">
        <h1 className="text-2xl md:text-3xl font-bold text-slate-800 dark:text-white">Mi Perfil</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Administra tu información personal y de seguridad</p>
      </div>

      {cargando ? (
        <div className="flex justify-center items-center py-12">
          <CargadorSpinner size="lg" />
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-6">
          {errorMsg && (
            <div className="bg-red-50 text-red-700 border border-red-100 rounded-2xl p-4 text-sm font-semibold flex items-start gap-3">
              <AlertCircle className="w-5 h-5 flex-shrink-0 text-red-500 mt-0.5" />
              <span>{errorMsg}</span>
            </div>
          )}

          {successMsg && (
            <div className="bg-emerald-50 text-emerald-700 border border-emerald-100 rounded-2xl p-4 text-sm font-semibold flex items-start gap-3">
              <CheckCircle className="w-5 h-5 flex-shrink-0 text-emerald-500 mt-0.5" />
              <span>{successMsg}</span>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Foto de Perfil */}
            <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200/80 dark:border-slate-700 p-6 flex flex-col items-center justify-center text-center">
              <div className="relative group mb-4">
                <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-slate-100 dark:border-slate-700 shadow-inner bg-slate-50 dark:bg-slate-900 flex items-center justify-center relative">
                  {fotoPerfilUrl ? (
                    <img 
                      src={`http://localhost:8080${fotoPerfilUrl}`} 
                      alt="Foto de perfil" 
                      className={`w-full h-full object-cover transition-opacity duration-200 ${subiendoFoto ? 'opacity-40' : ''}`} 
                    />
                  ) : (
                    <span className="text-4xl text-slate-350 dark:text-slate-500 font-bold">{nombre.slice(0, 1).toUpperCase()}</span>
                  )}
                  {subiendoFoto && (
                    <div className="absolute inset-0 flex items-center justify-center bg-slate-950/20 backdrop-blur-[1px]">
                      <CargadorSpinner size="sm" />
                    </div>
                  )}
                </div>
                <label className={`absolute bottom-1.5 right-1.5 bg-slate-900 dark:bg-slate-750 text-white p-2 rounded-full shadow-md flex items-center justify-center transition-all ${subiendoFoto ? 'opacity-50 cursor-not-allowed pointer-events-none' : 'cursor-pointer hover:bg-slate-800 dark:hover:bg-slate-700'}`}>
                  <Camera size={16} />
                  <input 
                    type="file" 
                    accept="image/*" 
                    className="hidden" 
                    onChange={handleSubirFoto}
                    disabled={subiendoFoto}
                  />
                </label>
              </div>
              <h2 className="text-lg font-bold text-slate-800 dark:text-slate-100">{`${nombre} ${apellido}`}</h2>
              <span className={`text-xs font-bold px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 mt-1.5 uppercase tracking-wide`}>
                {rol.replace('_', ' ')}
              </span>
              <p className="text-xs text-slate-400 dark:text-slate-400 mt-4 leading-relaxed">
                {subiendoFoto ? (
                  <span className="flex items-center justify-center gap-1.5 text-sky-600 dark:text-sky-400 font-semibold animate-pulse">
                    <CargadorSpinner size="xs" /> Cargando imagen...
                  </span>
                ) : 'Formatos recomendados: JPG o PNG. Tamaño máximo de 2MB.'}
              </p>
            </div>

            {/* Datos Personales */}
            <div className="md:col-span-2 bg-white dark:bg-slate-800 rounded-2xl border border-slate-200/80 dark:border-slate-700 p-6 space-y-5">
              <h3 className="text-base font-bold text-slate-800 dark:text-slate-100 border-b border-slate-100 dark:border-slate-700 pb-3 flex items-center gap-2">
                <User size={18} className={colorTexto} /> Datos Personales
              </h3>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1.5">Nombre</label>
                  <input
                    type="text"
                    value={nombre}
                    onChange={e => setNombre(e.target.value)}
                    required
                    className={`w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-850 dark:text-white text-sm font-semibold focus:ring-2 outline-none transition-all bg-slate-50 dark:bg-slate-900 focus:bg-white dark:focus:bg-slate-800 ${colorBordeFocus}`}
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1.5">Apellido</label>
                  <input
                    type="text"
                    value={apellido}
                    onChange={e => setApellido(e.target.value)}
                    required
                    className={`w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-850 dark:text-white text-sm font-semibold focus:ring-2 outline-none transition-all bg-slate-50 dark:bg-slate-900 focus:bg-white dark:focus:bg-slate-800 ${colorBordeFocus}`}
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-650 dark:text-slate-300 mb-1.5 flex justify-between items-center">
                  <span>Correo electrónico</span>
                  <span className="text-[10px] text-slate-405 dark:text-slate-400 lowercase italic">(No modificable)</span>
                </label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400">
                    <Mail size={16} />
                  </span>
                  <input
                    type="email"
                    value={correo}
                    disabled
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-400 text-sm font-semibold bg-slate-100 dark:bg-slate-900 cursor-not-allowed outline-none transition-all"
                  />
                </div>
              </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-1">
                  <div className="sm:col-span-1">
                    <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1.5">Teléfono móvil</label>
                    <div className="relative">
                      <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400">
                        <Phone size={16} />
                      </span>
                      <input
                        type="tel"
                        value={telefono}
                        onChange={e => setTelefono(e.target.value.replace(/\D/g, '').slice(0, 9))}
                        placeholder="Completar teléfono"
                        className={`w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-850 dark:text-white text-sm font-semibold focus:ring-2 outline-none transition-all bg-slate-50 dark:bg-slate-900 focus:bg-white dark:focus:bg-slate-800 ${colorBordeFocus}`}
                      />
                    </div>
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1.5">Dirección física</label>
                    <div className="relative">
                      <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400">
                        <MapPin size={16} />
                      </span>
                      <input
                        type="text"
                        value={direccion}
                        onChange={e => setDireccion(e.target.value)}
                        placeholder="Completar dirección"
                        className={`w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-850 dark:text-white text-sm font-semibold focus:ring-2 outline-none transition-all bg-slate-50 dark:bg-slate-900 focus:bg-white dark:focus:bg-slate-800 ${colorBordeFocus}`}
                      />
                    </div>
                  </div>
                </div>
            </div>
          </div>

          {/* Seguridad / Contraseña */}
          <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200/80 dark:border-slate-700 p-6 space-y-5">
            <h3 className="text-base font-bold text-slate-800 dark:text-slate-100 border-b border-slate-100 dark:border-slate-700 pb-3 flex items-center gap-2">
              <Lock size={18} className={colorTexto} /> Contraseña y Seguridad
            </h3>
            <p className="text-xs text-slate-400 dark:text-slate-400">Deja estos campos vacíos si no deseas cambiar tu contraseña actual.</p>
            
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1.5">Contraseña actual</label>
                <input
                  type="password"
                  value={contrasenaActual}
                  onChange={e => setContrasenaActual(e.target.value)}
                  placeholder="••••••••"
                  className={`w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-850 dark:text-white text-sm font-semibold focus:ring-2 outline-none transition-all bg-slate-50 dark:bg-slate-900 focus:bg-white dark:focus:bg-slate-800 ${colorBordeFocus}`}
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1.5">Nueva contraseña</label>
                <input
                  type="password"
                  value={contrasena}
                  onChange={e => setContrasena(e.target.value)}
                  placeholder="••••••••"
                  className={`w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-850 dark:text-white text-sm font-semibold focus:ring-2 outline-none transition-all bg-slate-50 dark:bg-slate-900 focus:bg-white dark:focus:bg-slate-800 ${colorBordeFocus}`}
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1.5">Confirmar nueva contraseña</label>
                <input
                  type="password"
                  value={confirmarContrasena}
                  onChange={e => setConfirmarContrasena(e.target.value)}
                  placeholder="••••••••"
                  className={`w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-850 dark:text-white text-sm font-semibold focus:ring-2 outline-none transition-all bg-slate-50 dark:bg-slate-900 focus:bg-white dark:focus:bg-slate-800 ${colorBordeFocus}`}
                />
              </div>
            </div>
          </div>

          {/* Apariencia / Tema */}
          <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200/80 dark:border-slate-700 p-6 space-y-5">
            <h3 className="text-base font-bold text-slate-800 dark:text-slate-100 border-b border-slate-100 dark:border-slate-700 pb-3 flex items-center gap-2">
              <span className="text-sky-600 dark:text-sky-400 font-bold">🎨</span> Apariencia y Visualización
            </h3>
            <p className="text-xs text-slate-400 dark:text-slate-300">Selecciona el tema visual de tu preferencia para la aplicación.</p>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <button
                type="button"
                onClick={() => handleCambiarTema('claro')}
                className={`flex items-center justify-between px-4 py-3 rounded-xl border text-sm font-semibold transition-all ${
                  temaLocal === 'claro'
                    ? 'border-sky-500 bg-sky-50/50 text-sky-700 dark:text-sky-300'
                    : 'border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                <span className="flex items-center gap-2">☀️ Tema Claro</span>
                {temaLocal === 'claro' && <span className="text-xs font-bold uppercase tracking-wider bg-sky-100 dark:bg-sky-950 text-sky-700 dark:text-sky-300 px-2 py-0.5 rounded-full">Activo</span>}
              </button>

              <button
                type="button"
                onClick={() => handleCambiarTema('oscuro')}
                className={`flex items-center justify-between px-4 py-3 rounded-xl border text-sm font-semibold transition-all ${
                  temaLocal === 'oscuro'
                    ? 'border-sky-500 bg-sky-950/20 text-sky-700 dark:text-sky-300'
                    : 'border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                <span className="flex items-center gap-2">🌙 Tema Oscuro</span>
                {temaLocal === 'oscuro' && <span className="text-xs font-bold uppercase tracking-wider bg-sky-100 dark:bg-sky-950 text-sky-700 dark:text-sky-300 px-2 py-0.5 rounded-full">Activo</span>}
              </button>
            </div>
          </div>

          {/* Botones */}
          <div className="flex justify-end pt-2">
            <button
              type="submit"
              className={`px-6 py-3 text-white text-sm font-bold rounded-xl shadow-lg transition-all flex items-center gap-2 focus:ring-2 focus:ring-offset-2 outline-none ${colorBoton}`}
            >
              <Save size={18} /> Guardar cambios
            </button>
          </div>
        </form>
      )}
    </div>
  );

  const handleLogout = () => {
    localStorage.clear();
    navigate('/');
  };

  if (sinPlantilla) {
    return contenido;
  }

  return (
    <PlantillaTablero 
      rol={rol} 
      correo={correo} 
      vistaActual="perfil" 
      handleLogout={handleLogout} 
      tituloHeader="Mi perfil de usuario"
    >
      {contenido}
    </PlantillaTablero>
  );
};

export default MiPerfil;
