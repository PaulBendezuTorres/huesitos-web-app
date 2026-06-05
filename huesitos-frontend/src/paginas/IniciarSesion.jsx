import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff } from 'lucide-react';
import PanelIzquierdoAutenticacion from '../componentes/PanelIzquierdoAutenticacion';
import BotonVolver from '../componentes/BotonVolver';

const IniciarSesion = () => {
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
  };

  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center p-4 selection:bg-sky-500 selection:text-white font-sans">
      <div className="auth-card">
        
        {/* ======================== PANEL IZQUIERDO ======================== */}
        <PanelIzquierdoAutenticacion
          badgeIcon="🛡️"
          badgeText="Medicina veterinaria de vanguardia"
          titleMain="Excelencia médica para"
          titleHighlight="quienes más amas"
          description="Las consultas médicas nos ayudan a monitorear la salud de tu mascota con tecnología de vanguardia y especialistas certificados."
          chips={[
            { icon: '🔬', label: 'Laboratorio 24h' },
            { icon: '🩺', label: 'Especialistas' },
            { icon: '📞', label: 'Emergencias 24/7' },
          ]}
        />

        {/* ======================== PANEL DERECHO ======================== */}
        <div className="auth-right-panel">

          {/* CABECERA: título + botón volver */}
          <div className="flex items-start justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold text-slate-800">Iniciar sesión</h2>
              <p className="text-xs text-slate-400 mt-1 font-semibold">Bienvenido de nuevo a Huesitos</p>
            </div>
            <BotonVolver />
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

export default IniciarSesion;