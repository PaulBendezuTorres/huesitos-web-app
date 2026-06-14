import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { RefreshCw } from 'lucide-react';
import ContenedorAutenticacion from '@/componentes/autenticacion/ContenedorAutenticacion';
import CasillerosCodigo from '@/componentes/autenticacion/CasillerosCodigo';
import BotonVolver from '@/componentes/comun/BotonVolver';

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
    <ContenedorAutenticacion
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
    >
      {/* CABECERA: título + botón volver */}
      <div className="flex flex-wrap items-start justify-between gap-2 mb-5">
        <div className="min-w-0">
          <h2 className="text-xl md:text-2xl font-bold text-slate-800 dark:text-slate-100 transition-colors">
            Verifica tu correo
          </h2>
          <p className="text-xs text-slate-400 dark:text-slate-500 mt-1 font-semibold transition-colors">
            Enviamos un código a: <span className="text-slate-650 dark:text-slate-300 font-bold break-all">{correo}</span>
          </p>
        </div>
        <BotonVolver />
      </div>

      {/* Temporizador visual */}
      <div className={`flex items-center gap-2 border rounded-xl p-3 text-xs font-semibold mb-4 transition-colors ${
        timeLeft > 60 
          ? 'bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400' 
          : 'bg-red-50 dark:bg-red-950/20 border-red-100 dark:border-red-900/30 text-red-600 dark:text-red-400'
      }`}>
        <span>⏳</span>
        <span>El código expira en: {formatTime(timeLeft)}</span>
      </div>

      {/* Mensajes de error/éxito */}
      {errorMsg && (
        <div className="bg-red-50 dark:bg-red-950/20 text-red-650 dark:text-red-405 border border-red-100 dark:border-red-900/30 rounded-xl p-3 text-xs font-semibold mb-4 transition-colors">
          {errorMsg}
        </div>
      )}

      {successMsg && (
        <div className="bg-emerald-50 dark:bg-emerald-950/20 text-emerald-650 dark:text-emerald-405 border border-emerald-100 dark:border-emerald-900/30 rounded-xl p-3 text-xs font-semibold mb-4 transition-colors">
          {successMsg}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Casilleros del código */}
        <div className="space-y-2">
          <label className="block text-xs font-semibold text-slate-650 dark:text-slate-350 mb-2 tracking-wide transition-colors">
            Código de verificación (6 dígitos)
          </label>
          <CasillerosCodigo
            codigo={codigo}
            setCodigo={setCodigo}
            timeLeft={timeLeft}
            loading={loading}
            idPrefix="verificar-code"
          />
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
        <p className="text-xs text-slate-400 dark:text-slate-500 transition-colors">
          ¿No recibiste el código o expiró?
        </p>
        <button
          type="button"
          onClick={handleReenviarCodigo}
          disabled={reenviando}
          className="mt-2 inline-flex items-center gap-1.5 text-xs font-bold text-sky-600 hover:text-sky-700 dark:text-sky-400 dark:hover:text-sky-300 transition-colors disabled:opacity-50"
        >
          <RefreshCw size={12} className={reenviando ? 'animate-spin' : ''} />
          {reenviando ? 'Reenviando...' : 'Solicitar un nuevo código'}
        </button>
      </div>
    </ContenedorAutenticacion>
  );
};

export default VerificarCuenta;
