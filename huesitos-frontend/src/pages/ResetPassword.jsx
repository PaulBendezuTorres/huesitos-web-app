import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
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
    <div style={{
      minHeight: '100vh',
      background: '#f1f5f9',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '2rem 1rem',
      fontFamily: 'system-ui, -apple-system, sans-serif',
    }}>
      <div style={{
        display: 'flex',
        width: '100%',
        maxWidth: '840px',
        borderRadius: '20px',
        overflow: 'hidden',
        border: '1px solid #e2e8f0',
        boxShadow: '0 4px 32px rgba(0,0,0,0.10)',
        position: 'relative',
      }}>

        {/* ======================== PANEL IZQUIERDO (GRADIENT) ======================== */}
        <div style={{
          width: '52%',
          position: 'relative',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: "space-between",
          overflow: 'hidden',
          minHeight: '520px',
          background: `linear-gradient(135deg, ${colors.blue600} 0%, ${colors.blue900} 100%)`,
        }}>
          <div style={{ position: 'absolute', inset: 0, background: `linear-gradient(160deg, rgba(4,44,83,0.55) 0%, rgba(4,44,83,0.82) 50%, rgba(4,44,83,0.97) 100%)`, zIndex: 1 }} />

          <div style={{ position: 'relative', zIndex: 2, padding: '2.5rem 2rem 0' }}>
            <div className="w-14 h-14 bg-gradient-to-tr from-sky-500 to-cyan-300 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-sky-400/30">
              <img src={logo} alt="Logo de la clínica" />
            </div>
          </div>

          <div style={{ position: 'relative', zIndex: 2, padding: '0 2rem 2.5rem', marginBottom: '6rem' }}>
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: '8px',
              background: 'rgba(55,138,221,0.18)', border: '1px solid rgba(133,183,235,0.3)',
              borderRadius: '999px', padding: '5px 14px', marginBottom: '1rem',
            }}>
              <span style={{ fontSize: '14px' }}>🛡️</span>
              <span style={{ fontSize: '11px', color: colors.blue200, fontWeight: 500, letterSpacing: '0.04em' }}>Restablecer Acceso</span>
            </div>
            <h2 style={{ fontSize: '24px', fontWeight: 700, color: '#fff', lineHeight: 1.3, marginBottom: '10px' }}>
              Define tu nueva <span style={{ color: colors.blue200 }}>contraseña</span>
            </h2>
            <p style={{ fontSize: '13px', color: colors.blue100, lineHeight: 1.6, marginBottom: '1.25rem', maxWidth: '280px' }}>
              Ingresa el código de 6 dígitos enviado a tu correo y configura tu nueva clave de acceso para Huesitos.
            </p>
          </div>
        </div>

        {/* ======================== PANEL DERECHO (FORMULARIO) ======================== */}
        <div style={{
          width: '48%', background: '#fff', padding: '2.5rem 2rem', display: 'flex',
          flexDirection: 'column', justifyContent: 'center', position: 'relative'
        }}>
          
          {/* BOTÓN VOLVER */}
          <button 
            onClick={() => navigate('/login')} 
            style={{
              position: 'absolute', top: '20px', right: '20px', background: 'none', border: 'none',
              color: '#64748b', fontSize: '13px', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '5px'
            }}
          >
            ← Volver al login
          </button>

          <div style={{ marginBottom: '1.5rem' }}>
            <h2 style={{ fontSize: '21px', fontWeight: 700, color: '#0f172a', marginBottom: '3px' }}>Verifica tu cuenta</h2>
            <p style={{ fontSize: '13px', color: '#64748b' }}>Ingresa el código de seguridad de 6 dígitos</p>
          </div>

          {/* Temporizador visual */}
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: '8px', 
            background: timeLeft > 60 ? '#f8fafc' : colors.red50, 
            border: `1px solid ${timeLeft > 60 ? '#e2e8f0' : colors.red100}`, 
            padding: '8px 12px', 
            borderRadius: '10px', 
            fontSize: '13px', 
            fontWeight: 600,
            color: timeLeft > 60 ? '#475569' : colors.red600,
            marginBottom: '1.25rem' 
          }}>
            <span>⏳</span>
            <span>El código expira en: {formatTime(timeLeft)}</span>
          </div>

          {/* Mensajes de error/éxito */}
          {errorMsg && (
            <div style={{ background: colors.red50, color: colors.red600, padding: '10px', borderRadius: '8px', fontSize: '12px', marginBottom: '1rem', border: `1px solid ${colors.red100}` }}>
              {errorMsg}
            </div>
          )}

          {successMsg && (
            <div style={{ background: colors.green50, color: colors.green600, padding: '10px', borderRadius: '8px', fontSize: '12px', marginBottom: '1rem', border: `1px solid ${colors.green100}` }}>
              {successMsg}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            {/* Casilleros del código */}
            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#475569', marginBottom: '8px' }}>
                Código de 6 dígitos
              </label>
              <div style={{ display: 'flex', justifyContent: 'space-between', gap: '8px' }}>
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
                    style={{
                      width: '42px',
                      height: '46px',
                      textAlign: 'center',
                      fontSize: '18px',
                      fontWeight: 'bold',
                      borderRadius: '8px',
                      border: '1px solid #e2e8f0',
                      background: '#f8fafc',
                      outline: 'none',
                      color: colors.blue900,
                      boxSizing: 'border-box',
                    }}
                  />
                ))}
              </div>
            </div>

            <div style={{ marginBottom: '1rem' }}>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#475569', marginBottom: '5px' }}>Nueva Contraseña</label>
              <div style={{ position: 'relative' }}>
                <input
                  type={showPass ? 'text' : 'password'} value={nuevaContrasena} onChange={e => setNuevaContrasena(e.target.value)} placeholder="••••••••" required
                  disabled={timeLeft <= 0}
                  style={{
                    width: '100%', padding: '0 35px 0 12px', height: '40px', borderRadius: '10px', border: '1px solid #e2e8f0',
                    background: '#f8fafc', fontSize: '13px', color: '#0f172a', outline: 'none', boxSizing: 'border-box',
                  }}
                />
                <button
                  type="button" onClick={() => setShowPass(!showPass)}
                  disabled={timeLeft <= 0}
                  style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#94a3b8', fontSize: '16px', padding: 0 }}
                >
                  {showPass ? '🙈' : '👁'}
                </button>
              </div>
            </div>

            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#475569', marginBottom: '5px' }}>Confirmar nueva contraseña</label>
              <input
                type={showPass ? 'text' : 'password'} value={confirmarContrasena} onChange={e => setConfirmarContrasena(e.target.value)} placeholder="••••••••" required
                disabled={timeLeft <= 0}
                style={{
                  width: '100%', padding: '0 12px', height: '40px', borderRadius: '10px', border: '1px solid #e2e8f0',
                  background: '#f8fafc', fontSize: '13px', color: '#0f172a', outline: 'none', boxSizing: 'border-box',
                }}
              />
            </div>

            <button
              type="submit" disabled={loading || timeLeft <= 0}
              style={{
                width: '100%', height: '44px', background: colors.blue600, color: '#fff', border: 'none', borderRadius: '10px',
                fontSize: '14px', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', transition: 'background 0.15s',
                opacity: (loading || timeLeft <= 0) ? 0.7 : 1,
              }}
            >
              {loading ? 'Restableciendo...' : 'Restablecer Contraseña'}
            </button>
          </form>

        </div>
      </div>
    </div>
  );
};

export default VetResetPassword;
