import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import logo from '../assets/Logo Huesitos.png';

const VetForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

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
        setSuccessMsg('Enlace de recuperación generado. Si estás en modo desarrollo, revisa la consola de Spring Boot para obtener el token UUID.');
        // También podemos redirigir después de unos segundos a la pantalla de restablecer contraseña
        setTimeout(() => {
          navigate('/restablecer-contrasena');
        }, 5000);
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
          minHeight: '500px',
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
              <span style={{ fontSize: '14px' }}>🔑</span>
              <span style={{ fontSize: '11px', color: colors.blue200, fontWeight: 500, letterSpacing: '0.04em' }}>Seguridad de cuenta</span>
            </div>
            <h2 style={{ fontSize: '24px', fontWeight: 700, color: '#fff', lineHeight: 1.3, marginBottom: '10px' }}>
              Recupera tu acceso de <span style={{ color: colors.blue200 }}>forma segura</span>
            </h2>
            <p style={{ fontSize: '13px', color: colors.blue100, lineHeight: 1.6, marginBottom: '1.25rem', maxWidth: '280px' }}>
              Te enviaremos un token temporal de recuperación que podrás usar para establecer una nueva contraseña de acceso.
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

          <div style={{ marginBottom: '2rem' }}>
            <h2 style={{ fontSize: '21px', fontWeight: 700, color: '#0f172a', marginBottom: '3px' }}>Restablecer contraseña</h2>
            <p style={{ fontSize: '13px', color: '#64748b' }}>Ingresa tu correo para recibir el código de verificación</p>
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
            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#475569', marginBottom: '5px' }}>Correo electrónico</label>
              <div style={{ position: 'relative' }}>
                <span style={{ position: 'absolute', left: '11px', top: '50%', transform: 'translateY(-50%)', fontSize: '16px', color: '#94a3b8' }}>✉</span>
                <input
                  type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="correo@ejemplo.com" required
                  style={{
                    width: '100%', padding: '0 11px 0 35px', height: '42px', borderRadius: '10px', border: '1px solid #e2e8f0',
                    background: '#f8fafc', fontSize: '13px', color: '#0f172a', outline: 'none', boxSizing: 'border-box',
                  }}
                />
              </div>
            </div>

            <button
              type="submit" disabled={loading}
              style={{
                width: '100%', height: '44px', background: colors.blue600, color: '#fff', border: 'none', borderRadius: '10px',
                fontSize: '14px', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', transition: 'background 0.15s',
                opacity: loading ? 0.7 : 1,
              }}
            >
              {loading ? 'Procesando...' : 'Enviar Token de Recuperación'}
            </button>
          </form>

        </div>
      </div>
    </div>
  );
};

export default VetForgotPassword;
