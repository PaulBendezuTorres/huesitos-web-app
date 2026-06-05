import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Wallet,
  User,
  LogOut,
  Calendar,
  Truck,
  Menu,
  X
} from 'lucide-react';
import logo from '../assets/Logo Huesitos.png';
import GestionPedidos from './GestionPedidos';
import AgendaSemanal from './AgendaSemanal';
import CajaVentas from '../modulos/recepcionista/paginas/CajaVentas';

const TableroRecepcionista = () => {
  const navigate = useNavigate();
  const [correo] = useState(localStorage.getItem('usuarioCorreo') || 'Recepcionista');
  
  // Pestaña o Vista Principal del Panel
  const [seccionActiva, setSeccionActiva] = useState('caja'); // 'caja', 'pedidos' o 'agenda'
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    const rol = localStorage.getItem('usuarioRol');
    if (rol !== 'RECEPCIONISTA' && rol !== 'ADMINISTRADOR') {
      navigate('/');
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.clear();
    navigate('/');
  };

  const navItemClass = (active) =>
    `w-full text-left px-4 py-3 rounded-xl font-semibold transition-all duration-300 flex items-center gap-3 text-xs tracking-wide ${
      active
        ? 'bg-gradient-to-r from-sky-500 to-cyan-400 text-white shadow-md shadow-sky-500/10'
        : 'text-slate-400 hover:bg-slate-800/40 hover:text-slate-200'
    }`;

  return (
    <div className="flex h-screen bg-slate-50 font-sans overflow-hidden selection:bg-sky-500 selection:text-white">
      
      {/* Overlay para móviles */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-30 lg:hidden transition-opacity duration-300"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* BARRA LATERAL */}
      <aside className={`fixed inset-y-0 left-0 w-60 bg-slate-900 flex flex-col justify-between border-r border-slate-800/40 z-40 shadow-xl transition-transform duration-300 lg:static lg:translate-x-0 ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        <div>
          <div className="h-20 flex items-center justify-between px-5 border-b border-slate-800/30">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 bg-gradient-to-tr from-sky-500 to-cyan-300 rounded-lg flex items-center justify-center text-white shadow-md shadow-sky-500/15">
                <img src={logo} alt="Logo" className="w-7 h-7 object-contain" />
              </div>
              <div className="flex flex-col">
                <span className="text-base font-bold text-white tracking-tight leading-tight">Vet. Huesitos</span>
                <span className="text-[9px] font-bold text-sky-400 uppercase tracking-widest">Caja y POS</span>
              </div>
            </div>
            {/* Botón de cierre para móvil */}
            <button
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden p-1.5 rounded-lg text-slate-400 hover:bg-slate-800 hover:text-slate-200 transition-colors"
            >
              <X size={18} />
            </button>
          </div>
          
          {/* Navegación Módulos */}
          <nav className="p-3 space-y-1">
            <button
              onClick={() => {
                setSeccionActiva('caja');
                setSidebarOpen(false);
              }}
              className={navItemClass(seccionActiva === 'caja')}
            >
              <Wallet size={16} />
              Caja y POS
            </button>
            <button
              onClick={() => {
                setSeccionActiva('pedidos');
                setSidebarOpen(false);
              }}
              className={navItemClass(seccionActiva === 'pedidos')}
            >
              <Truck size={16} />
              Despacho de pedidos
            </button>
            <button
              onClick={() => {
                setSeccionActiva('agenda');
                setSidebarOpen(false);
              }}
              className={navItemClass(seccionActiva === 'agenda')}
            >
              <Calendar size={16} />
              Agenda semanal
            </button>
          </nav>
        </div>

        <div className="p-3 border-t border-slate-800/30 bg-slate-900/50">
          <div className="bg-slate-950/40 border border-slate-800/40 p-2.5 rounded-xl flex items-center gap-2.5 mb-3">
            <div className="w-7 h-7 rounded-lg bg-sky-500 flex items-center justify-center text-white font-bold shrink-0">
              <User size={12} />
            </div>
            <div className="overflow-hidden">
              <p className="text-[8px] text-slate-500 font-bold uppercase">Cajero/a</p>
              <p className="text-white text-xs font-bold truncate">{correo}</p>
            </div>
          </div>
          <button 
            onClick={handleLogout}
            className="w-full bg-red-500/10 text-red-400 hover:bg-red-500 hover:text-white px-3 py-2.5 rounded-xl font-bold text-xs transition-all duration-300 flex items-center justify-center gap-2 border border-red-500/10 hover:shadow-md hover:shadow-red-500/10"
          >
            <LogOut size={14} />
            Cerrar sesión
          </button>
        </div>
      </aside>

      {/* CONTENEDOR PRINCIPAL */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        
        {/* HEADER SUPERIOR */}
        <header className="bg-white/80 backdrop-blur-md h-20 px-6 flex justify-between items-center shadow-sm z-10 border-b border-slate-200/60 shrink-0">
          <div className="flex items-center gap-3">
            {/* Botón hamburguesa */}
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2 rounded-lg text-slate-600 hover:bg-slate-100 transition-colors"
            >
              <Menu size={20} />
            </button>
            <h1 className="text-xl font-bold text-slate-800 tracking-tight">
              {seccionActiva === 'caja' ? 'Caja y punto de venta' : seccionActiva === 'pedidos' ? 'Despacho de pedidos' : 'Agenda semanal'}
            </h1>
          </div>
          
          <div className="flex items-center gap-4 bg-slate-50 border border-slate-200 px-2 py-1.5 rounded-full pr-5">
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-sky-500 to-cyan-400 shadow-sm flex items-center justify-center text-white">
              <User size={16} strokeWidth={2.5} />
            </div>
            <span className="text-sm font-semibold text-slate-600 truncate max-w-[120px] md:max-w-[200px]">{correo}</span>
          </div>
        </header>

        {/* CONTENEDOR VISTAS DINÁMICAS */}
        <main className="flex-1 flex overflow-hidden bg-slate-50">
          
          {/* 1. SECCIÓN: CAJA Y POS */}
          {seccionActiva === 'caja' && (
            <CajaVentas />
          )}

          {/* 2. SECCIÓN: DESPACHO DE PEDIDOS ONLINE */}
          {seccionActiva === 'pedidos' && (
            <GestionPedidos />
          )}

          {/* 3. SECCIÓN: AGENDA SEMANAL */}
          {seccionActiva === 'agenda' && (
            <section className="flex-1 bg-slate-50 p-6 overflow-y-auto h-full animate-in fade-in duration-200">
              <AgendaSemanal />
            </section>
          )}

        </main>
      </div>

    </div>
  );
};

export default TableroRecepcionista;
