import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff, ArrowLeft } from 'lucide-react';
import logo from '../assets/Logo Huesitos.png';

const VetLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');

    try {
      const response = await fetch('http://localhost:8080/api/autenticacion/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          correo: email, 
          contrasena: password 
        }),
      });

      if (response.ok) {
        const data = await response.json(); 
        
        localStorage.setItem('token', data.token);
        localStorage.setItem('usuarioCorreo', data.correo);
        localStorage.setItem('usuarioRol', data.rol);
        if (data.usuarioId) localStorage.setItem('usuarioId', data.usuarioId);
        if (data.duenoId) localStorage.setItem('duenoId', data.duenoId);

        // Redirección dinámica según el rol
        if (data.rol === 'ADMINISTRADOR') {
          navigate('/admin');
        } else if (data.rol === 'CLIENTE') {
          navigate('/cliente');
        } else if (data.rol === 'VETERINARIO') {
          navigate('/veterinario');
        } else if (data.rol === 'RECEPCIONISTA') {
          navigate('/recepcion');
        } else {
          navigate('/');
        }
      } else {
        const errorText = await response.text();
        setErrorMsg(errorText || 'Credenciales incorrectas');
      }
    } catch (error) {
      console.error('Error de red:', error);
      setErrorMsg('Error de conexión con el servidor.');
    }
  };  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center p-4 selection:bg-sky-500 selection:text-white font-sans">
      <div className="flex flex-col md:flex-row w-full max-w-4xl bg-white rounded-3xl border border-slate-200 shadow-2xl overflow-hidden md:h-[640px] max-h-[90vh] md:max-h-[640px] relative">
        
        {/* ======================== PANEL IZQUIERDO ======================== */}
        <div className="w-full md:w-1/2 bg-gradient-to-tr from-sky-600 to-slate-900 text-white p-6 md:p-8 lg:p-12 flex flex-col relative min-h-[320px] md:min-h-0 shrink-0">
          <div className="absolute inset-0 bg-slate-950/60 z-0" />

          <div className="relative z-10 flex items-center gap-2.5">
            <div className="w-10 h-10 bg-gradient-to-tr from-sky-500 to-cyan-300 rounded-xl flex items-center justify-center text-white shadow-md shadow-sky-500/15">
              <img src={logo} alt="Logo" className="w-8 h-8 object-contain" />
            </div>
            <span className="text-lg font-bold text-white tracking-tight">Vet. Huesitos</span>
          </div>

          <div className="relative z-10 flex-1 flex flex-col justify-center space-y-6 my-auto py-8">
            <div className="inline-flex items-center gap-2 bg-sky-500/15 border border-sky-400/20 rounded-full px-3.5 py-1 text-sky-300 self-start">
              <span className="text-sm">🛡️</span>
              <span className="text-[10px] font-semibold tracking-wider uppercase">Medicina veterinaria de vanguardia</span>
            </div>
            <h2 className="text-2xl md:text-3xl font-bold leading-tight">
              Excelencia médica para <span className="text-sky-300">quienes más amas</span>
            </h2>
            <p className="text-xs leading-relaxed max-w-xs text-slate-300">
              Las consultas médicas nos ayudan a monitorear la salud de tu mascota con tecnología de vanguardia y especialistas certificados.
            </p>
            <div className="flex flex-wrap gap-2 pt-2">
              {[
                { icon: '🔬', label: 'Laboratorio 24h' },
                { icon: '🩺', label: 'Especialistas' },
                { icon: '📞', label: 'Emergencias 24/7' },
              ].map(({ icon, label }) => (
                <div key={label} className="flex items-center gap-1.5 bg-white/5 border border-white/10 rounded-full px-3 py-1 text-[11px] text-slate-200 font-medium">
                  <span>{icon}</span> {label}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ======================== PANEL DERECHO ======================== */}
        <div className="w-full md:w-1/2 bg-white p-6 md:p-8 lg:p-12 flex flex-col justify-center relative md:h-full overflow-y-auto">
          
          {/* BOTÓN VOLVER */}
          <button 
            onClick={() => navigate('/')} 
            className="absolute top-6 right-6 text-slate-400 hover:text-slate-600 transition-colors flex items-center gap-1.5 text-xs font-semibold"
          >
            <ArrowLeft size={14} />
            Volver
          </button>

          <div className="mb-6">
            <h2 className="text-2xl font-bold text-slate-800">Iniciar sesión</h2>
            <p className="text-xs text-slate-400 mt-1 font-semibold">Bienvenido de nuevo a Huesitos</p>
          </div>

          {/* Mensaje de error si falla el login */}
          {errorMsg && (
            <div className="bg-red-50 text-red-650 border border-red-100 rounded-xl p-3 text-xs font-semibold mb-4">
              {errorMsg}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
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

            <div className="text-right">
              <button
                type="button"
                onClick={() => navigate('/olvide-contrasena')}
                className="text-xs font-semibold text-sky-600 hover:text-sky-700 transition-colors"
              >
                ¿Olvidaste tu contraseña?
              </button>
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-sky-500 hover:bg-sky-600 text-white text-sm font-bold rounded-xl shadow-lg shadow-sky-500/20 transition-all flex items-center justify-center gap-2"
            >
              Ingresar
            </button>
          </form>

          <div className="relative flex items-center justify-center my-6">
            <hr className="w-full border-slate-100" />
          </div>

          <p className="text-center text-xs text-slate-500 font-semibold">
            ¿Nuevo aquí?{' '}
            <button
              onClick={() => navigate('/registro')}
              className="font-bold text-sky-600 hover:text-sky-700 transition-colors"
            >
              Crea una cuenta
            </button>
          </p>

        </div>
      </div>
    </div>
  );
};

export default VetLogin;