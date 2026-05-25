import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ServiciosPage from './ServicioPage'; // Importamos tu nuevo módulo
import DashboardAnalytics from '../Modules/admin/pages/DashboardAnaliticas';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [correo] = useState(localStorage.getItem('usuarioCorreo') || 'Admin');
  
  // Estado para controlar qué módulo se muestra en pantalla
  const [vistaActual, setVistaActual] = useState('servicios');

  useEffect(() => {
    const rol = localStorage.getItem('usuarioRol');
    if (rol !== 'ADMINISTRADOR') {
      navigate('/');
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.clear();
    navigate('/');
  };

  // Función para renderizar el componente correcto según el menú
  const renderizarVista = () => {
    switch (vistaActual) {
      case 'servicios':
        return <ServiciosPage />;
      case 'dashboard':
        return <DashboardAnalytics/>
      case 'usuarios':
        return (
          <div className="bg-white p-8 rounded-xl shadow-sm border border-slate-200">
            <h2 className="text-xl font-bold text-slate-800 mb-2">Gestión de Usuarios (RF-03)</h2>
            <p className="text-slate-500">Módulo en construcción...</p>
          </div>
        );
      case 'configuracion':
        return (
          <div className="bg-white p-8 rounded-xl shadow-sm border border-slate-200">
            <h2 className="text-xl font-bold text-slate-800 mb-2">Configuración Dinámica (RF-17)</h2>
            <p className="text-slate-500">Módulo en construcción...</p>
          </div>
        );
      default:
        return null;
    }
  };

  // Clases CSS para los botones del sidebar (activo vs inactivo)
  const baseBtnClass = "w-full text-left px-4 py-3 rounded-lg font-medium transition flex items-center gap-3";
  const activeBtnClass = `${baseBtnClass} bg-blue-600 text-white shadow-md`;
  const inactiveBtnClass = `${baseBtnClass} text-slate-300 hover:bg-slate-800 hover:text-white`;

  return (
    <div className="flex h-screen bg-slate-100 font-sans overflow-hidden">
      
      {/* SIDEBAR LATERAL */}
      <aside className="w-64 bg-[#042C53] text-white flex flex-col shadow-xl z-10">
        <div className="p-6 flex items-center gap-3 border-b border-slate-700 mb-4">
          <div className="w-10 h-10 bg-blue-500 rounded-xl flex items-center justify-center text-xl shadow-inner">💙</div>
          <div>
            <span className="block text-lg font-bold tracking-wide">Huesitos</span>
            <span className="block text-xs text-blue-300 uppercase tracking-wider">Admin Panel</span>
          </div>
        </div>

        <nav className="flex-1 px-4 space-y-2 overflow-y-auto">
          <button onClick={() => setVistaActual('dashboard')} className={vistaActual === 'dashboard' ? activeBtnClass : inactiveBtnClass}>
            <span className="text-xl">📊</span> Dashboard
          </button>
          <button onClick={() => setVistaActual('servicios')} className={vistaActual === 'servicios' ? activeBtnClass : inactiveBtnClass}>
            <span className="text-xl">🩺</span> Servicios
          </button>
          <button onClick={() => setVistaActual('usuarios')} className={vistaActual === 'usuarios' ? activeBtnClass : inactiveBtnClass}>
            <span className="text-xl">👥</span> Usuarios y Roles
          </button>
          <button onClick={() => setVistaActual('configuracion')} className={vistaActual === 'configuracion' ? activeBtnClass : inactiveBtnClass}>
            <span className="text-xl">⚙️</span> Configuración
          </button>
        </nav>

        <div className="p-4 border-t border-slate-700">
          <button onClick={handleLogout} className="w-full bg-red-500/10 text-red-400 hover:bg-red-500 hover:text-white px-4 py-3 rounded-lg font-semibold transition flex justify-center items-center gap-2">
            <span>🚪</span> Cerrar Sesión
          </button>
        </div>
      </aside>

      {/* ÁREA DE CONTENIDO PRINCIPAL */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden">
        {/* HEADER SUPERIOR */}
        <header className="bg-white h-20 px-8 flex justify-between items-center shadow-sm z-0 border-b border-slate-200">
          <h1 className="text-xl font-bold text-slate-800">Centro de Control</h1>
          <div className="flex items-center gap-3">
            <span className="text-sm font-medium text-slate-600">{correo}</span>
            <div className="w-10 h-10 rounded-full bg-slate-200 border-2 border-white shadow-sm flex items-center justify-center text-lg">
              👤
            </div>
          </div>
        </header>

        {/* CONTENEDOR DINÁMICO (Aquí se inyecta el código de ServiciosPage) */}
        <div className="flex-1 p-8 overflow-y-auto bg-slate-50">
          {renderizarVista()}
        </div>
      </main>
      
    </div>
  );
};

export default AdminDashboard;