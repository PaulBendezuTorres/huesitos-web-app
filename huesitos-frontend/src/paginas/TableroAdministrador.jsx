import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Stethoscope, 
  ShieldCheck, 
  Users, 
  Wallet, 
  Settings, 
  LogOut, 
  User,
  Calendar,
  Clock,
  Package,
  Percent,
  ShoppingBag
} from 'lucide-react';

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
import logo from '../assets/Logo Huesitos.png';


const TableroAdministrador = () => {
  const navigate = useNavigate();
  const [correo] = useState(localStorage.getItem('usuarioCorreo') || 'Admin');
  const [vistaActual, setVistaActual] = useState('dashboard');

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

  // Clases CSS extraídas para el menú lateral
  const baseBtnClass = "w-full text-left px-3.5 py-2.5 rounded-lg font-semibold transition-all duration-200 flex items-center gap-3 text-xs tracking-wide group";
  
  // Estilo activo: Usa el mismo gradiente cyan/sky de tu Portada Page
  const activeBtnClass = `${baseBtnClass} bg-gradient-to-r from-sky-500 to-cyan-500 text-white shadow-md shadow-sky-500/10`;
  
  // Estilo inactivo: Transparente con hover suave
  const inactiveBtnClass = `${baseBtnClass} text-slate-400 hover:bg-slate-800/40 hover:text-slate-200`;

  return (
    <div className="flex h-screen bg-slate-50 font-sans overflow-hidden selection:bg-sky-500 selection:text-white">
      
      {/* SIDEBAR LATERAL (Estilo Moderno Clínico Compacto) */}
      <aside className="w-60 bg-slate-900 flex flex-col border-r border-slate-800/40 relative z-20 shadow-xl">
        {/* Logo de la Clínica */}
        <div className="h-20 flex items-center px-5 border-b border-slate-800/30">
          <div className="flex items-center gap-2.5 cursor-pointer">
            <div className="w-9 h-9 bg-gradient-to-tr from-sky-500 to-cyan-300 rounded-lg flex items-center justify-center text-white shadow-md shadow-sky-500/15">
              <img 
                src={logo} 
                alt="Logo de la clínica" 
                className="w-7 h-7 object-contain"
              />
            </div>
            <div className="flex flex-col">
              <span className="text-base font-black text-white tracking-tight leading-tight">Vet.Huesitos</span>
              <span className="text-[9px] font-bold text-sky-400 uppercase tracking-widest">Panel Admin</span>
            </div>
          </div>
        </div>

        {/* Menú de Navegación */}
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto custom-scrollbar">
          <button onClick={() => setVistaActual('dashboard')} className={vistaActual === 'dashboard' ? activeBtnClass : inactiveBtnClass}>
            <LayoutDashboard size={16} className={vistaActual === 'dashboard' ? "text-white" : "text-slate-500 group-hover:text-sky-400 transition-colors"} /> 
            Panel de Control
          </button>
          
          <div className="pt-3 pb-1.5">
            <p className="px-3.5 text-[9px] font-black text-slate-600 uppercase tracking-widest">Gestión Clínica</p>
          </div>
          
          <button onClick={() => setVistaActual('servicios')} className={vistaActual === 'servicios' ? activeBtnClass : inactiveBtnClass}>
            <Stethoscope size={16} className={vistaActual === 'servicios' ? "text-white" : "text-slate-500 group-hover:text-sky-400 transition-colors"} /> 
            Servicios Médicos
          </button>
          
          <button onClick={() => setVistaActual('duenos')} className={vistaActual === 'duenos' ? activeBtnClass : inactiveBtnClass}>
            <Users size={16} className={vistaActual === 'duenos' ? "text-white" : "text-slate-500 group-hover:text-sky-400 transition-colors"} /> 
            Directorio Clientes
          </button>

          <button onClick={() => setVistaActual('agenda')} className={vistaActual === 'agenda' ? activeBtnClass : inactiveBtnClass}>
            <Calendar size={16} className={vistaActual === 'agenda' ? "text-white" : "text-slate-500 group-hover:text-sky-400 transition-colors"} /> 
            Agenda Semanal
          </button>

          <button onClick={() => setVistaActual('inventario')} className={vistaActual === 'inventario' ? activeBtnClass : inactiveBtnClass}>
            <Package size={16} className={vistaActual === 'inventario' ? "text-white" : "text-slate-500 group-hover:text-sky-400 transition-colors"} /> 
            Inventario FEFO
          </button>

          <div className="pt-3 pb-1.5">
            <p className="px-3.5 text-[9px] font-black text-slate-600 uppercase tracking-widest">Administración</p>
          </div>

          <button onClick={() => setVistaActual('finanzas')} className={vistaActual === 'finanzas' ? activeBtnClass : inactiveBtnClass}>
            <Wallet size={16} className={vistaActual === 'finanzas' ? "text-white" : "text-slate-500 group-hover:text-sky-400 transition-colors"} /> 
            Caja y Finanzas
          </button>

          <button onClick={() => setVistaActual('pedidos')} className={vistaActual === 'pedidos' ? activeBtnClass : inactiveBtnClass}>
            <ShoppingBag size={16} className={vistaActual === 'pedidos' ? "text-white" : "text-slate-500 group-hover:text-sky-400 transition-colors"} /> 
            Gestión de Pedidos
          </button>

          <button onClick={() => setVistaActual('usuarios')} className={vistaActual === 'usuarios' ? activeBtnClass : inactiveBtnClass}>
            <ShieldCheck size={16} className={vistaActual === 'usuarios' ? "text-white" : "text-slate-500 group-hover:text-sky-400 transition-colors"} /> 
            Usuarios y Roles
          </button>

          <button onClick={() => setVistaActual('campanas')} className={vistaActual === 'campanas' ? activeBtnClass : inactiveBtnClass}>
            <Percent size={16} className={vistaActual === 'campanas' ? "text-white" : "text-slate-500 group-hover:text-sky-400 transition-colors"} /> 
            Campañas y Ofertas
          </button>

          <button onClick={() => setVistaActual('horarios')} className={vistaActual === 'horarios' ? activeBtnClass : inactiveBtnClass}>
            <Clock size={16} className={vistaActual === 'horarios' ? "text-white" : "text-slate-500 group-hover:text-sky-400 transition-colors"} /> 
            Horarios del Personal
          </button>
          
          <button onClick={() => setVistaActual('configuracion')} className={vistaActual === 'configuracion' ? activeBtnClass : inactiveBtnClass}>
            <Settings size={16} className={vistaActual === 'configuracion' ? "text-white" : "text-slate-500 group-hover:text-sky-400 transition-colors"} /> 
            Configuración Global
          </button>
        </nav>

        {/* Botón Cerrar Sesión */}
        <div className="p-3 border-t border-slate-800/30 bg-slate-900/50">
          <button onClick={handleLogout} className="w-full bg-red-500/10 text-red-400 hover:bg-red-500 hover:text-white px-3 py-2.5 rounded-lg font-bold text-xs transition-all duration-200 flex items-center justify-center gap-2 border border-red-500/10 hover:shadow-md hover:shadow-red-500/10">
            <LogOut size={14} />
            Cerrar Sesión
          </button>
        </div>
      </aside>

      {/* ÁREA DE CONTENIDO PRINCIPAL */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden relative">
        
        {/* HEADER SUPERIOR (Glassmorphism sutil) */}
        <header className="bg-white/80 backdrop-blur-md h-20 px-8 flex justify-between items-center shadow-sm z-10 border-b border-slate-200/60 sticky top-0">
          <h1 className="text-xl font-black text-slate-800 tracking-tight">Centro de Administración</h1>
          
          <div className="flex items-center gap-4 bg-slate-50 border border-slate-200 px-2 py-1.5 rounded-full pr-5">
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-sky-500 to-cyan-300 shadow-sm flex items-center justify-center text-white">
              <User size={16} strokeWidth={2.5} />
            </div>
            <span className="text-sm font-bold text-slate-600">{correo}</span>
          </div>
        </header>

        {/* CONTENEDOR DINÁMICO DE PÁGINAS */}
        <div className="flex-1 p-8 overflow-y-auto bg-slate-50">
          <div className="max-w-7xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
            {renderizarVista()}
          </div>
        </div>
      </main>
      
    </div>
  );
};

export default TableroAdministrador;