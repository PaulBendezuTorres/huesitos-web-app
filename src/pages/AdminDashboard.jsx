import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const AdminDashboard = () => {
  const navigate = useNavigate();
  
  // SOLUCIÓN: Inicializamos el correo directamente aquí, leyendo el localStorage desde el principio.
  // Así evitamos el doble renderizado que causaba la advertencia.
const [correo] = useState(localStorage.getItem('usuarioCorreo') || 'Admin');

  // Protección de ruta: Verificar que realmente sea un administrador
  useEffect(() => {
    const rol = localStorage.getItem('usuarioRol');
    if (rol !== 'ADMINISTRADOR') {
      navigate('/'); // Lo regresamos al login si intenta entrar a la fuerza
    }
    // (Hemos borrado el setCorreo de aquí)
  }, [navigate]);

  const handleLogout = () => {
    localStorage.clear();
    navigate('/');
  };

  // Paleta de colores de tu marca
  const colors = {
    blue900: '#042C53',
    blue600: '#185FA5',
    bg: '#f1f5f9',
    text: '#0f172a',
    textMuted: '#64748b'
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: colors.bg, fontFamily: 'system-ui, sans-serif' }}>
      
      {/* ==================== SIDEBAR ==================== */}
      <aside style={{ width: '260px', background: colors.blue900, color: 'white', padding: '1.5rem', display: 'flex', flexDirection: 'column' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '2.5rem' }}>
          <div style={{ width: '35px', height: '35px', background: colors.blue600, borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px' }}>
            💙
          </div>
          <span style={{ fontSize: '1.2rem', fontWeight: 700, letterSpacing: '0.02em' }}>Admin Panel</span>
        </div>

        <nav style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', flex: 1 }}>
          <button style={{ textAlign: 'left', background: colors.blue600, color: 'white', padding: '12px 15px', borderRadius: '8px', border: 'none', cursor: 'pointer', fontWeight: 600, display: 'flex', gap: '10px' }}>
            <span>📊</span> Dashboard
          </button>
          <button style={{ textAlign: 'left', background: 'transparent', color: '#B5D4F4', padding: '12px 15px', borderRadius: '8px', border: 'none', cursor: 'pointer', fontWeight: 500, display: 'flex', gap: '10px' }}>
            <span>🩺</span> Servicios
          </button>
          <button style={{ textAlign: 'left', background: 'transparent', color: '#B5D4F4', padding: '12px 15px', borderRadius: '8px', border: 'none', cursor: 'pointer', fontWeight: 500, display: 'flex', gap: '10px' }}>
            <span>👥</span> Usuarios y Roles
          </button>
          <button style={{ textAlign: 'left', background: 'transparent', color: '#B5D4F4', padding: '12px 15px', borderRadius: '8px', border: 'none', cursor: 'pointer', fontWeight: 500, display: 'flex', gap: '10px' }}>
            <span>⚙️</span> Configuración
          </button>
        </nav>

        <button onClick={handleLogout} style={{ background: '#A32D2D', color: 'white', padding: '12px', borderRadius: '8px', border: 'none', cursor: 'pointer', marginTop: 'auto', fontWeight: 600, display: 'flex', justifyContent: 'center', gap: '8px' }}>
          <span>🚪</span> Cerrar Sesión
        </button>
      </aside>

      {/* ==================== ÁREA DE CONTENIDO ==================== */}
      <main style={{ flex: 1, padding: '2rem', display: 'flex', flexDirection: 'column' }}>
        
        {/* HEADER TOPBAR */}
        <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'white', padding: '1rem 2rem', borderRadius: '12px', boxShadow: '0 2px 10px rgba(0,0,0,0.03)', marginBottom: '2rem' }}>
          <h1 style={{ fontSize: '1.25rem', color: colors.text, margin: 0, fontWeight: 700 }}>Resumen del Sistema</h1>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={{ fontSize: '14px', color: colors.textMuted, fontWeight: 500 }}>{correo}</span>
            <div style={{ width: '38px', height: '38px', borderRadius: '50%', background: '#e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              👤
            </div>
          </div>
        </header>

        {/* CONTENIDO DINÁMICO */}
        <div style={{ background: 'white', padding: '2.5rem', borderRadius: '12px', boxShadow: '0 2px 10px rgba(0,0,0,0.03)', flex: 1 }}>
          <h2 style={{ marginTop: 0, color: colors.text, marginBottom: '10px' }}>Bienvenido al centro de control</h2>
          <p style={{ color: colors.textMuted, lineHeight: 1.6, maxWidth: '600px' }}>
            Selecciona una opción en el menú lateral para comenzar. Desde aquí tendrás control total sobre los módulos centrales de Huesitos.
          </p>
          
          <div style={{ marginTop: '3rem', padding: '2rem', border: '2px dashed #e2e8f0', borderRadius: '10px', textAlign: 'center', color: '#94a3b8' }}>
            Área de trabajo <br/> (Aquí se renderizarán los componentes según el botón del menú)
          </div>
        </div>

      </main>
    </div>
  );
};

export default AdminDashboard;