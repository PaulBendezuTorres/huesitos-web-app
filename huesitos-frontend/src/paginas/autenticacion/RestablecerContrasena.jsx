import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock } from 'lucide-react';
import ContenedorAutenticacion from '@/componentes/autenticacion/ContenedorAutenticacion';
import CampoFormulario from '@/componentes/autenticacion/CampoFormulario';
import CasillerosCodigo from '@/componentes/autenticacion/CasillerosCodigo';
import BotonVolver from '@/componentes/comun/BotonVolver';
import CargadorSpinner from '@/componentes/comun/CargadorSpinner';


const RestablecerContrasena = () => {
  const [codigo, setCodigo] = useState(['', '', '', '', '', '']);
  const [nuevaContrasena, setNuevaContrasena] = useState('');
  const [confirmarContrasena, setConfirmarContrasena] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [loading, setLoading] = useState(false);

  // Temporizador de 15 minutos (900 segundos)
  const [timeLeft, setTimeLeft] = useState(900);
  const [timerActive, setTimerActive] = useState(true);

  const navigate = useNavigate();

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
      setErrorMsg('El código de verificación ha expirado. Por favor, solicita uno nuevo en la página anterior.');
      return;
    }

    if (!nuevaContrasena || !confirmarContrasena) {
      setErrorMsg('Todos los campos son obligatorios');
      return;
    }

    if (nuevaContrasena !== confirmarContrasena) {
      setErrorMsg('Las contraseñas no coinciden');
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(
        `http://localhost:8080/api/autenticacion/restablecer-contrasena?token=${encodeURIComponent(token)}&nuevaContrasena=${encodeURIComponent(nuevaContrasena)}`,
        {
          method: 'POST',
        }
      );

      if (response.ok) {
        setTimerActive(false);
        setSuccessMsg('Contraseña restablecida correctamente. Redirigiendo al inicio de sesión...');
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

  return (
    <ContenedorAutenticacion
      badgeIcon="🛡️"
      badgeText="Restablecer acceso"
      titleMain="Define tu nueva"
      titleHighlight="contraseña"
      description="Ingresa el código de 6 dígitos enviado a tu correo y configura tu nueva clave de acceso para Huesitos."
      chips={[
        { icon: '🔑', label: 'Clave segura' },
        { icon: '✅', label: 'Verificación rápida' },
        { icon: '🛡️', label: 'Cuenta protegida' },
      ]}
    >
      {/* CABECERA: título + botón volver */}
      <div className="flex flex-wrap items-start justify-between gap-2 mb-5">
        <div className="min-w-0">
          <h2 className="text-xl md:text-2xl font-bold text-slate-800 dark:text-slate-100 transition-colors">
            Verifica tu cuenta
          </h2>
          <p className="text-xs text-slate-400 dark:text-slate-500 mt-1 font-semibold transition-colors">
            Ingresa el código de seguridad de 6 dígitos
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

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Casilleros del código */}
        <div className="space-y-1.5">
          <label className="block text-xs font-semibold text-slate-650 dark:text-slate-350 mb-1.5 tracking-wide transition-colors">
            Código de 6 dígitos
          </label>
          <CasillerosCodigo
            codigo={codigo}
            setCodigo={setCodigo}
            timeLeft={timeLeft}
            loading={loading}
            idPrefix="restablecer-code"
          />
        </div>

        <CampoFormulario
          id="nuevaContrasena"
          label="Nueva contraseña"
          type="password"
          value={nuevaContrasena}
          onChange={e => setNuevaContrasena(e.target.value)}
          placeholder="••••••••"
          required
          disabled={timeLeft <= 0}
          icon={Lock}
        />

        <CampoFormulario
          id="confirmarContrasena"
          label="Confirmar nueva contraseña"
          type="password"
          value={confirmarContrasena}
          onChange={e => setConfirmarContrasena(e.target.value)}
          placeholder="••••••••"
          required
          disabled={timeLeft <= 0}
          icon={Lock}
        />

        <button
          type="submit"
          disabled={loading || timeLeft <= 0}
          className="w-full py-3 bg-sky-500 hover:bg-sky-600 disabled:bg-sky-400 text-white text-sm font-bold rounded-xl shadow-lg shadow-sky-500/20 disabled:shadow-none transition-all flex items-center justify-center gap-2"
        >
          {loading ? (
            <>
              <CargadorSpinner size="xs" color="text-white" />
              <span>Restableciendo...</span>
            </>
          ) : (
            'Restablecer contraseña'
          )}
        </button>
      </form>
    </ContenedorAutenticacion>
  );
};

export default RestablecerContrasena;
