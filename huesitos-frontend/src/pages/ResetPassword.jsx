import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock, Eye, EyeOff, ArrowLeft } from 'lucide-react';
import logo from '../assets/Logo Huesitos.png';

const VetResetPassword = () => {
  const [codigo, setCodigo] = useState(['', '', '', '', '', '']);
  const [nuevaContrasena, setNuevaContrasena] = useState('');
  const [confirmarContrasena, setConfirmarContrasena] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [loading, setLoading] = useState(false);

  // Temporizador de 15 minutos (900 segundos)
  const [timeLeft, setTimeLeft] = useState(900);
  const [timerActive, setTimerActive] = useState(true);

  const navigate = useNavigate();
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

  const colors = {
    blue900: '#042C53',
    blue800: '#0C447C',
    blue600: '#185FA5',
    blue400: '#378ADD',
    blue200: '#85B7EB',
    blue100: '#B5D4F4',
    blue50:  '#E6F1FB',
    red100:  '#F7C1C1',
    red600:  '#A32D2D',
    red50:   '#FCEBEB',
    green50: '#ECFDF5',
    green600: '#059669',
    green100: '#A7F3D0'
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
    <div className="min-h-screen bg-slate-100 flex items-center justify-center p-4 selection:bg-sky-500 selection:text-white font-sans">
      <div className="flex flex-col md:flex-row w-full max-w-4xl bg-white rounded-3xl border border-slate-200 shadow-2xl overflow-hidden min-h-[500px] relative animate-in fade-in duration-200">
        
        {/* ======================== PANEL IZQUIERDO ======================== */}
        <div className="w-full md:w-[52%] bg-gradient-to-tr from-sky-600 to-slate-900 text-white p-8 md:p-12 flex flex-col justify-between relative min-h-[300px] md:min-h-0 shrink-0">
          <div className="absolute inset-0 bg-slate-950/60 z-0" />

          <div className="relative z-10 flex items-center gap-2.5">
            <div className="w-10 h-10 bg-gradient-to-tr from-sky-500 to-cyan-300 rounded-xl flex items-center justify-center text-white shadow-md shadow-sky-500/15">
              <img src={logo} alt="Logo" className="w-8 h-8 object-contain" />
            </div>
            <span className="text-lg font-bold text-white tracking-tight">Vet. Huesitos</span>
          </div>

          <div className="relative z-10 space-y-4 mt-auto">
            <div className="inline-flex items-center gap-2 bg-sky-500/15 border border-sky-400/20 rounded-full px-3.5 py-1 text-sky-300">
              <span className="text-sm">🛡️</span>
              <span className="text-[10px] font-semibold tracking-wider uppercase">Restablecer acceso</span>
            </div>
            <h2 className="text-2xl md:text-3xl font-bold leading-tight">
              Define tu nueva <span className="text-sky-300">contraseña</span>
            </h2>
            <p className="text-xs leading-relaxed max-w-xs text-slate-355 text-slate-300">
              Ingresa el código de 6 dígitos enviado a tu correo y configura tu nueva clave de acceso para Huesitos.
            </p>
          </div>
        </div>

        {/* ======================== PANEL DERECHO ======================== */}
        <div className="w-full md:w-[48%] bg-white p-8 md:p-12 flex flex-col justify-center relative">
          
          {/* BOTÓN VOLVER */}
          <button 
            onClick={() => navigate('/login')} 
            className="absolute top-6 right-6 text-slate-400 hover:text-slate-650 transition-colors flex items-center gap-1.5 text-xs font-semibold"
          >
            <ArrowLeft size={14} />
            Volver al login
          </button>

          <div className="mb-6">
            <h2 className="text-2xl font-bold text-slate-800">Verifica tu cuenta</h2>
            <p className="text-xs text-slate-400 mt-1 font-semibold">Ingresa el código de seguridad de 6 dígitos</p>
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

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Casilleros del código */}
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1.5 tracking-wide">
                Código de 6 dígitos
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
                    disabled={timeLeft <= 0}
                    className="w-10 h-12 text-center text-lg font-bold rounded-xl border border-slate-200 bg-slate-50 text-slate-800 focus:ring-2 focus:ring-sky-100 focus:border-sky-400 outline-none transition-all"
                  />
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1.5 tracking-wide">Nueva contraseña</label>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400">
                  <Lock size={16} />
                </span>
                <input
                  type={showPass ? 'text' : 'password'}
                  value={nuevaContrasena}
                  onChange={e => setNuevaContrasena(e.target.value)}
                  placeholder="••••••••"
                  required
                  disabled={timeLeft <= 0}
                  className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-slate-200 text-slate-850 text-sm font-semibold focus:ring-2 focus:ring-sky-100 focus:border-sky-400 outline-none transition-all bg-slate-50 focus:bg-white"
                />
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  disabled={timeLeft <= 0}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-650 transition-colors"
                >
                  {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1.5 tracking-wide">Confirmar nueva contraseña</label>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400">
                  <Lock size={16} />
                </span>
                <input
                  type={showPass ? 'text' : 'password'}
                  value={confirmarContrasena}
                  onChange={e => setConfirmarContrasena(e.target.value)}
                  placeholder="••••••••"
                  required
                  disabled={timeLeft <= 0}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-slate-850 text-sm font-semibold focus:ring-2 focus:ring-sky-100 focus:border-sky-400 outline-none transition-all bg-slate-50 focus:bg-white"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading || timeLeft <= 0}
              className="w-full py-3 bg-sky-500 hover:bg-sky-600 text-white text-sm font-bold rounded-xl shadow-lg shadow-sky-500/20 transition-all flex items-center justify-center gap-2 disabled:opacity-70"
            >
              {loading ? 'Restableciendo...' : 'Restablecer contraseña'}
            </button>
          </form>

        </div>
      </div>
    </div>
  );
};

export default VetResetPassword;
