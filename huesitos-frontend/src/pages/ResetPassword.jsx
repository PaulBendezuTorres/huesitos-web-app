import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import logo from '../assets/Logo Huesitos.png';

const VetResetPassword = () => {
  const [searchParams] = useSearchParams();
  const [token, setToken] = useState('');
  const [nuevaContrasena, setNuevaContrasena] = useState('');
  const [confirmarContrasena, setConfirmarContrasena] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  // Leer token desde los parámetros de búsqueda de la URL
  useEffect(() => {
    const tokenParam = searchParams.get('token');
    if (tokenParam) {
      setToken(tokenParam);
    }
  }, [searchParams]);

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    if (!token) {
      setErrorMsg('El token de recuperación es obligatorio');
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
        setSuccessMsg('Contraseña restablecida correctamente. Redirigiendo al inicio de sesión...');
        setTimeout(() => {
          navigate('/login');
        }, 2500);
      } else {
        const errorText = await response.text();
        setErrorMsg(errorText || 'Error al restablecer la contraseña');
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
              Ingresa el token UUID recibido y la nueva contraseña que deseas configurar para tu cuenta de Huesitos.
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
            <h2 style={{ fontSize: '21px', fontWeight: 700, color: '#0f172a', marginBottom: '3px' }}>Nueva Contraseña</h2>
            <p style={{ fontSize: '13px', color: '#64748b' }}>Completa los campos para restablecer tu acceso</p>
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
            <div style={{ marginBottom: '1rem' }}>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#475569', marginBottom: '5px' }}>Token de Recuperación (UUID)</label>
              <input
                type="text" value={token} onChange={e => setToken(e.target.value)} placeholder="Ej: 123e4567-e89b-12d3-a456-426614174000" required
                style={{
                  width: '100%', padding: '0 12px', height: '40px', borderRadius: '10px', border: '1px solid #e2e8f0',
                  background: '#f8fafc', fontSize: '13px', color: '#0f172a', outline: 'none', boxSizing: 'border-box',
                }}
              />
            </div>

            <div style={{ marginBottom: '1rem' }}>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#475569', marginBottom: '5px' }}>Nueva Contraseña</label>
              <div style={{ position: 'relative' }}>
                <input
                  type={showPass ? 'text' : 'password'} value={nuevaContrasena} onChange={e => setNuevaContrasena(e.target.value)} placeholder="••••••••" required
                  style={{
                    width: '100%', padding: '0 35px 0 12px', height: '40px', borderRadius: '10px', border: '1px solid #e2e8f0',
                    background: '#f8fafc', fontSize: '13px', color: '#0f172a', outline: 'none', boxSizing: 'border-box',
                  }}
                />
                <button
                  type="button" onClick={() => setShowPass(!showPass)}
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
                style={{
                  width: '100%', padding: '0 12px', height: '40px', borderRadius: '10px', border: '1px solid #e2e8f0',
                  background: '#f8fafc', fontSize: '13px', color: '#0f172a', outline: 'none', boxSizing: 'border-box',
                }}
              />
            </div>

            <button
              type="submit" disabled={loading}
              style={{
                width: '100%', height: '44px', background: colors.blue600, color: '#fff', border: 'none', borderRadius: '10px',
                fontSize: '14px', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', transition: 'background 0.15s',
                opacity: loading ? 0.7 : 1,
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
