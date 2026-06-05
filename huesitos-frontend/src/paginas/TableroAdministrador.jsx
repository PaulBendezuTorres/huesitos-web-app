import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Menu } from 'lucide-react';

import PaginaServicios from './PaginaServicios';
import DashboardAnalytics from '../modulos/admin/paginas/TableroAnaliticas';
import ConfiguracionDinamica from '../modulos/admin/paginas/ConfiguracionDinamica';
import PaginaUsuarios from '../modulos/admin/paginas/PaginaUsuarios';
import PaginaFinanzas from '../modulos/admin/paginas/PaginaFinanzas';
import PaginaDuenos from '../modulos/admin/paginas/PaginaDuenos';
import AgendaSemanal from './AgendaSemanal';
import ConfiguracionHorarios from '../modulos/admin/paginas/ConfiguracionHorarios';
import PaginaInventario from '../modulos/admin/paginas/PaginaInventario';
import PaginaCampanas from '../modulos/admin/paginas/PaginaCampanas';
import GestionPedidos from './GestionPedidos';
import BarraLateralAdmin from '../componentes/BarraLateralAdmin';


const TableroAdministrador = () => {
  const navigate = useNavigate();
  const [correo] = useState(localStorage.getItem('usuarioCorreo') || 'Admin');
  const [vistaActual, setVistaActual] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);

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

  const renderizarVista = () => {
    switch (vistaActual) {
      case 'dashboard': return <DashboardAnalytics />;
      case 'servicios': return <PaginaServicios />;
      case 'usuarios': return <PaginaUsuarios />;
      case 'duenos': return <PaginaDuenos />;
      case 'agenda': return <AgendaSemanal />;
      case 'horarios': return <ConfiguracionHorarios />;
      case 'inventario': return <PaginaInventario />;
      case 'finanzas': return <PaginaFinanzas />;
      case 'campanas': return <PaginaCampanas />;
      case 'configuracion': return <ConfiguracionDinamica />;
      case 'pedidos': return <GestionPedidos />;
      default: return <DashboardAnalytics />;
    }
  };

  return (
    <div className="flex h-screen bg-slate-50 font-sans overflow-hidden selection:bg-sky-500 selection:text-white">
      
      {/* Overlay para móviles */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-30 lg:hidden transition-opacity duration-300"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* SIDEBAR LATERAL MODULARIZADO */}
      <BarraLateralAdmin 
        vistaActual={vistaActual}
        setVistaActual={setVistaActual}
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        handleLogout={handleLogout}
      />

      {/* ÁREA DE CONTENIDO PRINCIPAL */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden relative">
        
        {/* HEADER SUPERIOR (Glassmorphism sutil responsivo) */}
        <header className="bg-white/80 backdrop-blur-md h-20 px-4 md:px-6 lg:px-8 flex justify-between items-center shadow-sm z-10 border-b border-slate-200/60 sticky top-0 shrink-0">
          <div className="flex items-center gap-3 min-w-0">
            {/* Botón hamburguesa */}
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2 rounded-lg text-slate-600 hover:bg-slate-100 transition-colors shrink-0"
            >
              <Menu size={20} />
            </button>
            <h1 className="text-base sm:text-lg md:text-xl font-black text-slate-800 tracking-tight truncate max-w-[140px] sm:max-w-xs md:max-w-none">
              Centro de Administración
            </h1>
          </div>
          
          <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 p-1 rounded-full md:pr-4 md:gap-3 shrink-0">
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-sky-500 to-cyan-300 shadow-sm flex items-center justify-center text-white shrink-0">
              <User size={16} strokeWidth={2.5} />
            </div>
            <span className="text-xs md:text-sm font-bold text-slate-650 truncate max-w-[80px] sm:max-w-[120px] md:max-w-[200px]" title={correo}>
              {correo}
            </span>
          </div>
        </header>

        {/* CONTENEDOR DINÁMICO DE PÁGINAS */}
        <div className="flex-1 p-4 lg:p-8 overflow-y-auto bg-slate-50">
          <div className="max-w-7xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
            {renderizarVista()}
          </div>
        </div>
      </main>
      
    </div>
  );
};

export default TableroAdministrador;