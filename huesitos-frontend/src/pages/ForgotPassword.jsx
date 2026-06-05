import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail, ArrowLeft } from 'lucide-react';
import logo from '../assets/Logo Huesitos.png';

const VetForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    if (!email) {
      setErrorMsg('Por favor, ingresa tu correo electrónico');
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(`http://localhost:8080/api/autenticacion/olvide-contrasena?correo=${encodeURIComponent(email)}`, {
        method: 'POST',
      });

      if (response.ok) {
        setSuccessMsg('¡Código enviado! Revisa tu bandeja de entrada (o spam) para obtener tu código de 6 dígitos.');
        // Redirigir rápidamente a la pantalla de ingresar código
        setTimeout(() => {
          navigate('/restablecer-contrasena');
        }, 1500);
      } else {
        const errorText = await response.text();
        setErrorMsg(errorText || 'Error al procesar la solicitud');
      }
    } catch (error) {
      console.error('Error de red:', error);
      setErrorMsg('Error de conexión con el servidor.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center p-4 selection:bg-sky-500 selection:text-white font-sans">
      <div className="flex flex-col md:flex-row w-full max-w-4xl bg-white rounded-3xl border border-slate-200 shadow-2xl overflow-hidden md:h-[640px] max-h-[90vh] md:max-h-[640px] relative animate-in fade-in duration-200">
        
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
              <span className="text-sm">🔑</span>
              <span className="text-[10px] font-semibold tracking-wider uppercase">Recuperación de contraseña</span>
            </div>
            <h2 className="text-2xl md:text-3xl font-bold leading-tight">
              ¿Olvidaste tu <span className="text-sky-300">contraseña?</span>
            </h2>
            <p className="text-xs leading-relaxed max-w-xs text-slate-300">
              No te preocupes. Ingresa tu correo electrónico registrado y te enviaremos un código de seguridad para restablecer tu acceso.
            </p>
            <div className="flex flex-wrap gap-2 pt-2">
              {[
                { icon: '📧', label: 'Código de 6 dígitos' },
                { icon: '⏱️', label: 'Expira en 15m' },
                { icon: '🛡️', label: 'Acceso protegido' },
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
            onClick={() => navigate('/login')} 
            className="absolute top-6 right-6 text-slate-400 hover:text-slate-650 transition-colors flex items-center gap-1.5 text-xs font-semibold"
          >
            <ArrowLeft size={14} />
            Volver al login
          </button>

          <div className="mb-6">
            <h2 className="text-2xl font-bold text-slate-800">Recuperar contraseña</h2>
            <p className="text-xs text-slate-400 mt-1 font-semibold">Solicita tu código de verificación de 6 dígitos</p>
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

          <form onSubmit={handleSubmit} className="space-y-5">
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

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-sky-500 hover:bg-sky-600 text-white text-sm font-bold rounded-xl shadow-lg shadow-sky-500/20 transition-all flex items-center justify-center gap-2 disabled:opacity-70"
            >
              {loading ? 'Enviando...' : 'Enviar código de verificación'}
            </button>
          </form>

        </div>
      </div>
    </div>
  );
};

export default VetForgotPassword;
