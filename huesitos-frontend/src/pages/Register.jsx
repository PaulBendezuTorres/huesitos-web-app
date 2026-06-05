import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Phone, MapPin, Mail, Lock, Eye, EyeOff, ArrowLeft } from 'lucide-react';
import logo from '../assets/Logo Huesitos.png';

const VetRegister = () => {
  const [nombreCompleto, setNombreCompleto] = useState('');
  const [telefono, setTelefono] = useState('');
  const [direccion, setDireccion] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [aceptaTerminos, setAceptaTerminos] = useState(false);
  const [showPass, setShowPass] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    if (!nombreCompleto || !telefono || !direccion || !email || !password || !confirmPassword) {
      setErrorMsg('Todos los campos son obligatorios');
      return;
    }

    if (telefono.length !== 9) {
      setErrorMsg('El teléfono móvil debe tener exactamente 9 dígitos');
      return;
    }

    if (password !== confirmPassword) {
      setErrorMsg('Las contraseñas no coinciden');
      return;
    }

    if (!aceptaTerminos) {
      setErrorMsg('Debes aceptar los términos y condiciones');
      return;
    }

    try {
      const response = await fetch('http://localhost:8080/api/autenticacion/registro', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          nombreCompleto: nombreCompleto,
          telefono: telefono,
          direccion: direccion,
          usuario: {
            correo: email,
            contrasena: password
          }
        }),
      });

      if (response.ok) {
        setSuccessMsg('Cuenta creada correctamente. Redirigiendo al inicio de sesión...');
        setTimeout(() => {
          navigate('/login');
        }, 2000);
      } else {
        const errorText = await response.text();
        setErrorMsg(errorText || 'Error al registrar la cuenta');
      }
    } catch (error) {
      console.error('Error de red:', error);
      setErrorMsg('Error de conexión con el servidor.');
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center p-4 selection:bg-sky-500 selection:text-white font-sans">
      <div className="flex flex-col md:flex-row w-full max-w-4xl bg-white rounded-3xl border border-slate-200 shadow-2xl overflow-hidden md:h-[640px] relative animate-in fade-in duration-200">
        
        {/* ======================== PANEL IZQUIERDO ======================== */}
        <div className="w-full md:w-1/2 bg-gradient-to-tr from-sky-600 to-slate-900 text-white p-8 md:p-12 flex flex-col relative min-h-[320px] md:min-h-0 shrink-0">
          <div className="absolute inset-0 bg-slate-950/60 z-0" />

          <div className="relative z-10 flex items-center gap-2.5">
            <div className="w-10 h-10 bg-gradient-to-tr from-sky-500 to-cyan-300 rounded-xl flex items-center justify-center text-white shadow-md shadow-sky-500/15">
              <img src={logo} alt="Logo" className="w-8 h-8 object-contain" />
            </div>
            <span className="text-lg font-bold text-white tracking-tight">Vet. Huesitos</span>
          </div>

          <div className="relative z-10 flex-1 flex flex-col justify-center space-y-6 my-auto py-8">
            <div className="inline-flex items-center gap-2 bg-sky-500/15 border border-sky-400/20 rounded-full px-3.5 py-1 text-sky-300 self-start">
              <span className="text-sm">🐶</span>
              <span className="text-[10px] font-semibold tracking-wider uppercase">Únete a la familia Huesitos</span>
            </div>
            <h2 className="text-2xl md:text-3xl font-bold leading-tight">
              La salud de tu mascota en <span className="text-sky-300">buenas manos</span>
            </h2>
            <p className="text-xs leading-relaxed max-w-xs text-slate-300">
              Crea una cuenta para agendar citas médicas, acceder al historial clínico y comprar en nuestra tienda online.
            </p>
            <div className="flex flex-wrap gap-2 pt-2">
              {[
                { icon: '📅', label: 'Citas online' },
                { icon: '🛒', label: 'Tienda pet' },
                { icon: '📁', label: 'Historial digital' },
              ].map(({ icon, label }) => (
                <div key={label} className="flex items-center gap-1.5 bg-white/5 border border-white/10 rounded-full px-3 py-1 text-[11px] text-slate-200 font-medium">
                  <span>{icon}</span> {label}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ======================== PANEL DERECHO ======================== */}
        <div className="w-full md:w-1/2 bg-white p-8 md:p-10 flex flex-col justify-center relative">
          
          {/* BOTÓN VOLVER */}
          <button 
            onClick={() => navigate('/login')} 
            className="absolute top-6 right-6 text-slate-400 hover:text-slate-650 transition-colors flex items-center gap-1.5 text-xs font-semibold"
          >
            <ArrowLeft size={14} />
            Volver al login
          </button>

          <div className="mb-6 mt-4">
            <h2 className="text-2xl font-bold text-slate-800">Crea tu cuenta</h2>
            <p className="text-xs text-slate-400 mt-1 font-semibold">Registra tus datos como dueño de mascota</p>
          </div>

          {/* Mensajes de error/éxito */}
          {errorMsg && (
            <div className="bg-red-50 text-red-650 border border-red-100 rounded-xl p-3 text-xs font-semibold mb-4">
              {errorMsg}
            </div>
          )}

          {successMsg && (
            <div className="bg-emerald-50 text-emerald-650 border border-emerald-100 rounded-xl p-3 text-xs font-semibold mb-4">
              {successMsg}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-slate-600 mb-1.5 tracking-wide">Nombre completo</label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400">
                    <User size={16} />
                  </span>
                  <input
                    type="text"
                    value={nombreCompleto}
                    onChange={e => setNombreCompleto(e.target.value)}
                    placeholder="Juan Pérez"
                    required
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-slate-850 text-sm font-semibold focus:ring-2 focus:ring-sky-100 focus:border-sky-400 outline-none transition-all bg-slate-50 focus:bg-white"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1.5 tracking-wide">Teléfono móvil</label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400">
                    <Phone size={16} />
                  </span>
                  <input
                    type="tel"
                    value={telefono}
                    onChange={e => setTelefono(e.target.value.replace(/\D/g, '').slice(0, 9))}
                    placeholder="999888777"
                    required
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-slate-850 text-sm font-semibold focus:ring-2 focus:ring-sky-100 focus:border-sky-400 outline-none transition-all bg-slate-50 focus:bg-white"
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1.5 tracking-wide">Dirección</label>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400">
                  <MapPin size={16} />
                </span>
                <input
                  type="text"
                  value={direccion}
                  onChange={e => setDireccion(e.target.value)}
                  placeholder="Av. Bolognesi 123"
                  required
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-slate-850 text-sm font-semibold focus:ring-2 focus:ring-sky-100 focus:border-sky-400 outline-none transition-all bg-slate-50 focus:bg-white"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1.5 tracking-wide">Correo electrónico</label>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400">
                  <Mail size={16} />
                </span>
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="correo@ejemplo.com"
                  required
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-slate-850 text-sm font-semibold focus:ring-2 focus:ring-sky-100 focus:border-sky-400 outline-none transition-all bg-slate-50 focus:bg-white"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1.5 tracking-wide">Contraseña</label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400">
                    <Lock size={16} />
                  </span>
                  <input
                    type={showPass ? 'text' : 'password'}
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    placeholder="••••••••"
                    required
                    className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-slate-200 text-slate-850 text-sm font-semibold focus:ring-2 focus:ring-sky-100 focus:border-sky-400 outline-none transition-all bg-slate-50 focus:bg-white"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPass(!showPass)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-650 transition-colors"
                  >
                    {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1.5 tracking-wide">Confirmar contraseña</label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400">
                    <Lock size={16} />
                  </span>
                  <input
                    type={showPass ? 'text' : 'password'}
                    value={confirmPassword}
                    onChange={e => setConfirmPassword(e.target.value)}
                    placeholder="••••••••"
                    required
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-slate-850 text-sm font-semibold focus:ring-2 focus:ring-sky-100 focus:border-sky-400 outline-none transition-all bg-slate-50 focus:bg-white"
                  />
                </div>
              </div>
            </div>

            <div className="flex items-start gap-2.5 py-1">
              <input
                type="checkbox"
                id="terminos"
                checked={aceptaTerminos}
                onChange={e => setAceptaTerminos(e.target.checked)}
                className="w-4 h-4 text-sky-500 border-slate-300 rounded focus:ring-sky-400 focus:ring-2 outline-none cursor-pointer mt-0.5"
              />
              <label htmlFor="terminos" className="text-[11px] text-slate-500 font-semibold cursor-pointer select-none leading-relaxed">
                Acepto los términos y condiciones de privacidad de datos personales.
              </label>
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-sky-500 hover:bg-sky-600 text-white text-sm font-bold rounded-xl shadow-lg shadow-sky-500/20 transition-all flex items-center justify-center gap-2"
            >
              Crear cuenta
            </button>
          </form>

        </div>
      </div>
    </div>
  );
};

export default VetRegister;
