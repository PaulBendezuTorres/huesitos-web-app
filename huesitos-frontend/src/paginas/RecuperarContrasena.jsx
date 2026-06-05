import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail, ArrowLeft } from 'lucide-react';
import PanelIzquierdoAutenticacion from '../componentes/PanelIzquierdoAutenticacion';

const RecuperarContrasena = () => {
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
      <div className="auth-card animate-in fade-in duration-200">
        
        {/* ======================== PANEL IZQUIERDO ======================== */}
        <PanelIzquierdoAutenticacion
          badgeIcon="🔑"
          badgeText="Recuperación de contraseña"
          titleMain="¿Olvidaste tu"
          titleHighlight="contraseña?"
          description="No te preocupes. Ingresa tu correo electrónico registrado y te enviaremos un código de seguridad para restablecer tu acceso."
          chips={[
            { icon: '📧', label: 'Código de 6 dígitos' },
            { icon: '⏱️', label: 'Expira en 15m' },
            { icon: '🛡️', label: 'Acceso protegido' },
          ]}
        />

        {/* ======================== PANEL DERECHO ======================== */}
        <div className="auth-right-panel">
          
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

export default RecuperarContrasena;
