import { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { RefreshCw } from 'lucide-react';
import PanelIzquierdoAutenticacion from '../componentes/PanelIzquierdoAutenticacion';
import BotonVolver from '../componentes/BotonVolver';

const VerificarCuenta = () => {
  const [codigo, setCodigo] = useState(['', '', '', '', '', '']);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [loading, setLoading] = useState(false);
  const [reenviando, setReenviando] = useState(false);

  // Temporizador de 15 minutos (900 segundos)
  const [timeLeft, setTimeLeft] = useState(900);
  const [timerActive, setTimerActive] = useState(true);

  const navigate = useNavigate();
  const location = useLocation();
  const query = new URLSearchParams(location.search);
  const correo = query.get('correo') || '';

  const inputRefs = [useRef(), useRef(), useRef(), useRef(), useRef(), useRef()];

  // Efecto para el temporizador de cuenta regresiva
  useEffect(() => {
    if (!timerActive || timeLeft <= 0) {
      if (timeLeft <= 0) {
        setErrorMsg('El código de verificación ha expirado. Por favor, solicita uno nuevo.');
      }
      return;
    }

    const interval = setInterval(() => {
      setTimeLeft((prevTime) => prevTime - 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [timeLeft, timerActive]);

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  const handleInputChange = (index, value) => {
    // Solo permitir números
    const cleanValue = value.replace(/\D/g, '');
    if (!cleanValue) {
      const newCodigo = [...codigo];
      newCodigo[index] = '';
      setCodigo(newCodigo);
      return;
    }

    const digit = cleanValue.slice(-1);
    const newCodigo = [...codigo];
    newCodigo[index] = digit;
    setCodigo(newCodigo);

    // Mover foco al siguiente input si existe
    if (index < 5) {
      inputRefs[index + 1].current.focus();
    }
  };

  const handleKeyDown = (index, e) => {
    // Mover foco atrás si presiona backspace en un campo vacío
    if (e.key === 'Backspace' && !codigo[index] && index > 0) {
      inputRefs[index - 1].current.focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    if (pastedData.length > 0) {
      const newCodigo = [...codigo];
      for (let i = 0; i < 6; i++) {
        if (pastedData[i]) {
          newCodigo[i] = pastedData[i];
        }
      }
      setCodigo(newCodigo);
      // Enfocar el último input rellenado o el 5
      const focusIndex = Math.min(pastedData.length, 5);
      inputRefs[focusIndex].current.focus();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    const token = codigo.join('');
    if (token.length !== 6) {
      setErrorMsg('Por favor, ingresa el código de verificación completo de 6 dígitos');
      return;
    }

    if (timeLeft <= 0) {
      setErrorMsg('El código de verificación ha expirado. Por favor, solicita uno nuevo.');
      return;
    }

    if (!correo) {
      setErrorMsg('No se encontró un correo electrónico asociado a la verificación.');
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(
        `http://localhost:8080/api/autenticacion/activar?correo=${encodeURIComponent(correo)}&token=${encodeURIComponent(token)}`,
        {
          method: 'POST',
        }
      );

      if (response.ok) {
        setTimerActive(false);
        setSuccessMsg('¡Cuenta activada correctamente! Redirigiendo al inicio de sesión...');
        setTimeout(() => {
          navigate('/login');
        }, 2500);
      } else {
        const errorText = await response.text();
        setErrorMsg(errorText || 'El código ingresado es incorrecto o ha expirado');
      }
    } catch (error) {
      console.error('Error de red:', error);
      setErrorMsg('Error de conexión con el servidor.');
    } finally {
      setLoading(false);
    }
  };

  const handleReenviarCodigo = async () => {
    if (!correo) {
      setErrorMsg('No se encontró un correo electrónico asociado.');
      return;
    }

    setErrorMsg('');
    setSuccessMsg('');
    setReenviando(true);

    try {
      const response = await fetch(
        `http://localhost:8080/api/autenticacion/reenviar-codigo?correo=${encodeURIComponent(correo)}`,
        {
          method: 'POST',
        }
      );

      if (response.ok) {
        setSuccessMsg('Se ha enviado un nuevo código de activación a tu correo.');
        setTimeLeft(900);
        setTimerActive(true);
        setCodigo(['', '', '', '', '', '']);
      } else {
        const errorText = await response.text();
        setErrorMsg(errorText || 'No se pudo reenviar el código.');
      }
    } catch (error) {
      console.error('Error de red:', error);
      setErrorMsg('Error de conexión con el servidor.');
    } finally {
      setReenviando(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 flex items-start md:items-center justify-center py-6 px-4 selection:bg-sky-500 selection:text-white font-sans">
      <div className="auth-card animate-in fade-in duration-200">
        
        {/* ======================== PANEL IZQUIERDO ======================== */}
        <PanelIzquierdoAutenticacion
          badgeIcon="🛡️"
          badgeText="Activa tu cuenta"
          titleMain="¡Estás a un paso"
          titleHighlight="de comenzar!"
          description="Ingresa el código de 6 dígitos que enviamos a tu correo para activar tu cuenta y acceder a todos nuestros servicios."
          chips={[
            { icon: '📧', label: 'Verificación por correo' },
            { icon: '⚡', label: 'Activación instantánea' },
            { icon: '🔒', label: 'Acceso seguro' },
          ]}
        />

        {/* ======================== PANEL DERECHO ======================== */}
        <div className="auth-right-panel">

          {/* CABECERA: título + botón volver */}
          <div className="flex flex-wrap items-start justify-between gap-2 mb-5">
            <div className="min-w-0">
              <h2 className="text-xl md:text-2xl font-bold text-slate-800">Verifica tu correo</h2>
              <p className="text-xs text-slate-400 mt-1 font-semibold">
                Enviamos un código a: <span className="text-slate-650 font-bold break-all">{correo}</span>
              </p>
            </div>
            <BotonVolver />
          </div>

          {/* Temporizador visual */}
          <div className={`flex items-center gap-2 border rounded-xl p-3 text-xs font-semibold mb-4 ${
            timeLeft > 60 
              ? 'bg-slate-50 border-slate-200 text-slate-600' 
              : 'bg-red-50 border-red-100 text-red-600'
          }`}>
            <span>⏳</span>
            <span>El código expira en: {formatTime(timeLeft)}</span>
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

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Casilleros del código */}
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-2 tracking-wide">
                Código de verificación (6 dígitos)
              </label>
              <div className="flex justify-between gap-1 sm:gap-2">
                {codigo.map((digit, idx) => (
                  <input
                    key={idx}
                    id={`code-input-${idx}`}
                    ref={inputRefs[idx]}
                    type="text"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleInputChange(idx, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(idx, e)}
                    onPaste={idx === 0 ? handlePaste : undefined}
                    disabled={timeLeft <= 0 || loading}
                    className="w-10 h-12 text-center text-lg font-bold rounded-xl border border-slate-200 bg-slate-50 text-slate-800 focus:ring-2 focus:ring-sky-100 focus:border-sky-400 outline-none transition-all"
                  />
                ))}
              </div>
            </div>

            <button
              type="submit"
              disabled={loading || timeLeft <= 0}
              className="w-full py-3 bg-sky-500 hover:bg-sky-600 text-white text-sm font-bold rounded-xl shadow-lg shadow-sky-500/20 transition-all flex items-center justify-center gap-2 disabled:opacity-70"
            >
              {loading ? 'Verificando...' : 'Activar cuenta'}
            </button>
          </form>

          {/* Reenviar código */}
          <div className="mt-6 text-center">
            <p className="text-xs text-slate-400">
              ¿No recibiste el código o expiró?
            </p>
            <button
              type="button"
              onClick={handleReenviarCodigo}
              disabled={reenviando}
              className="mt-2 inline-flex items-center gap-1.5 text-xs font-bold text-sky-600 hover:text-sky-700 transition-colors disabled:opacity-50"
            >
              <RefreshCw size={12} className={reenviando ? 'animate-spin' : ''} />
              {reenviando ? 'Reenviando...' : 'Solicitar un nuevo código'}
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};

export default VerificarCuenta;
