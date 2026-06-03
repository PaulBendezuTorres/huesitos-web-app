import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import logo from '../assets/Logo Huesitos.png';

const VetRegister = () => {
  const [nombreCompleto, setNombreCompleto] = useState('');
  const [telefono, setTelefono] = useState('');
  const [direccion, setDireccion] = useState('Marcona, Ica, Perú');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [aceptaTerminos, setAceptaTerminos] = useState(false);
  const [showPass, setShowPass] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

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

    if (!nombreCompleto || !telefono || !direccion || !email || !password || !confirmPassword) {
      setErrorMsg('Todos los campos son obligatorios');
      return;
    }

    if (password !== confirmPassword) {
      setErrorMsg('Las contraseñas no coinciden');
      return;
    }

    if (!aceptaTerminos) {
      setErrorMsg('Debes aceptar los términos y condiciones');
      return;
    }

    try {
      const response = await fetch('http://localhost:8080/api/autenticacion/registro', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          nombreCompleto: nombreCompleto,
          telefono: telefono,
          direccion: direccion,
          usuario: {
            correo: email,
            contrasena: password
          }
        }),
      });

      if (response.ok) {
        setSuccessMsg('Cuenta creada correctamente. Redirigiendo al inicio de sesión...');
        setTimeout(() => {
          navigate('/login');
        }, 2000);
      } else {
        const errorText = await response.text();
        setErrorMsg(errorText || 'Error al registrar la cuenta');
      }
    } catch (error) {
      console.error('Error de red:', error);
      setErrorMsg('Error de conexión con el servidor.');
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
        maxWidth: '920px',
        borderRadius: '20px',
        overflow: 'hidden',
        border: '1px solid #e2e8f0',
        boxShadow: '0 4px 32px rgba(0,0,0,0.10)',
        position: 'relative',
      }}>

        {/* ======================== PANEL IZQUIERDO (GRADIENT) ======================== */}
        <div style={{
          width: '45%',
          position: 'relative',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: "space-between",
          overflow: 'hidden',
          minHeight: '620px',
          background: `linear-gradient(135deg, ${colors.blue600} 0%, ${colors.blue900} 100%)`,
        }}>
          <div style={{ position: 'absolute', inset: 0, background: `linear-gradient(160deg, rgba(4,44,83,0.55) 0%, rgba(4,44,83,0.82) 50%, rgba(4,44,83,0.97) 100%)`, zIndex: 1 }} />

          <div style={{ position: 'relative', zIndex: 2, padding: '2.5rem 2rem 0' }}>
            <div className="w-14 h-14 bg-gradient-to-tr from-sky-500 to-cyan-300 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-sky-400/30">
              <img src={logo} alt="Logo de la clínica" />
            </div>
          </div>

          <div style={{ position: 'relative', zIndex: 2, padding: '0 2rem 2.5rem', marginBottom: '4rem' }}>
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: '8px',
              background: 'rgba(55,138,221,0.18)', border: '1px solid rgba(133,183,235,0.3)',
              borderRadius: '999px', padding: '5px 14px', marginBottom: '1rem',
            }}>
              <span style={{ fontSize: '14px' }}>🐶</span>
              <span style={{ fontSize: '11px', color: colors.blue200, fontWeight: 500, letterSpacing: '0.04em' }}>Únete a la familia Huesitos</span>
            </div>
            <h2 style={{ fontSize: '24px', fontWeight: 700, color: '#fff', lineHeight: 1.3, marginBottom: '10px' }}>
              La salud de tu mascota en <span style={{ color: colors.blue200 }}>buenas manos</span>
            </h2>
            <p style={{ fontSize: '13px', color: colors.blue100, lineHeight: 1.6, marginBottom: '1.25rem', maxWidth: '280px' }}>
              Crea una cuenta para agendar citas médicas, acceder al historial clínico y comprar en nuestra tienda online.
            </p>
          </div>
        </div>

        {/* ======================== PANEL DERECHO (FORMULARIO) ======================== */}
        <div style={{
          width: '55%', background: '#fff', padding: '2.5rem 2.5rem', display: 'flex',
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

          <div style={{ marginBottom: '1.5rem', marginTop: '1rem' }}>
            <h2 style={{ fontSize: '21px', fontWeight: 700, color: '#0f172a', marginBottom: '3px' }}>Crea tu cuenta</h2>
            <p style={{ fontSize: '13px', color: '#64748b' }}>Registra tus datos como dueño de mascota</p>
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
            <div style={{ display: 'flex', gap: '15px', marginBottom: '1rem' }}>
              <div style={{ flex: 1 }}>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#475569', marginBottom: '5px' }}>Nombre completo</label>
                <input
                  type="text" value={nombreCompleto} onChange={e => setNombreCompleto(e.target.value)} placeholder="Juan Pérez" required
                  style={{
                    width: '100%', padding: '0 12px', height: '40px', borderRadius: '10px', border: '1px solid #e2e8f0',
                    background: '#f8fafc', fontSize: '13px', color: '#0f172a', outline: 'none', boxSizing: 'border-box',
                  }}
                />
              </div>
              <div style={{ width: '130px' }}>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#475569', marginBottom: '5px' }}>Teléfono móvil</label>
                <input
                  type="tel" value={telefono} onChange={e => setTelefono(e.target.value)} placeholder="999888777" required
                  style={{
                    width: '100%', padding: '0 12px', height: '40px', borderRadius: '10px', border: '1px solid #e2e8f0',
                    background: '#f8fafc', fontSize: '13px', color: '#0f172a', outline: 'none', boxSizing: 'border-box',
                  }}
                />
              </div>
            </div>

            <div style={{ marginBottom: '1rem' }}>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#475569', marginBottom: '5px' }}>Dirección (Marcona, Ica)</label>
              <input
                type="text" value={direccion} onChange={e => setDireccion(e.target.value)} placeholder="Av. Bolognesi 123" required
                style={{
                  width: '100%', padding: '0 12px', height: '40px', borderRadius: '10px', border: '1px solid #e2e8f0',
                  background: '#f8fafc', fontSize: '13px', color: '#0f172a', outline: 'none', boxSizing: 'border-box',
                }}
              />
            </div>

            <div style={{ marginBottom: '1rem' }}>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#475569', marginBottom: '5px' }}>Correo electrónico</label>
              <input
                type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="correo@ejemplo.com" required
                style={{
                  width: '100%', padding: '0 12px', height: '40px', borderRadius: '10px', border: '1px solid #e2e8f0',
                  background: '#f8fafc', fontSize: '13px', color: '#0f172a', outline: 'none', boxSizing: 'border-box',
                }}
              />
            </div>

            <div style={{ display: 'flex', gap: '15px', marginBottom: '1.25rem' }}>
              <div style={{ flex: 1 }}>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#475569', marginBottom: '5px' }}>Contraseña</label>
                <div style={{ position: 'relative' }}>
                  <input
                    type={showPass ? 'text' : 'password'} value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••••" required
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
              <div style={{ flex: 1 }}>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#475569', marginBottom: '5px' }}>Confirmar Contraseña</label>
                <input
                  type={showPass ? 'text' : 'password'} value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} placeholder="••••••••" required
                  style={{
                    width: '100%', padding: '0 12px', height: '40px', borderRadius: '10px', border: '1px solid #e2e8f0',
                    background: '#f8fafc', fontSize: '13px', color: '#0f172a', outline: 'none', boxSizing: 'border-box',
                  }}
                />
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '1.5rem' }}>
              <input
                type="checkbox" id="terminos" checked={aceptaTerminos} onChange={e => setAceptaTerminos(e.target.checked)}
                style={{ cursor: 'pointer' }}
              />
              <label htmlFor="terminos" style={{ fontSize: '12px', color: '#64748b', cursor: 'pointer' }}>
                Acepto los términos y condiciones de privacidad de datos personales.
              </label>
            </div>

            <button
              type="submit"
              style={{
                width: '100%', height: '44px', background: colors.blue600, color: '#fff', border: 'none', borderRadius: '10px',
                fontSize: '14px', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', transition: 'background 0.15s',
              }}
            >
              Crear Cuenta
            </button>
          </form>

        </div>
      </div>
    </div>
  );
};

export default VetRegister;
