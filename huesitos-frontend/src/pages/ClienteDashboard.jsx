import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  PawPrint,
  CalendarPlus,
  ShoppingBag,
  FileText,
  Receipt,
  LogOut,
  User,
  Menu,
  X,
} from 'lucide-react';

import ClienteInicio from '../Modules/cliente/pages/ClienteInicio';
import ClienteMascotas from '../Modules/cliente/pages/ClienteMascotas';
import ClienteAgendarCita from '../Modules/cliente/pages/ClienteAgendarCita';
import ClienteTienda from '../Modules/cliente/pages/ClienteTienda';
import logo from '../assets/Logo Huesitos.png';

const ClienteDashboard = () => {
  const navigate = useNavigate();
  const [correo] = useState(localStorage.getItem('usuarioCorreo') || 'Cliente');
  const [vistaActual, setVistaActual] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    const rol = localStorage.getItem('usuarioRol');
    if (rol !== 'CLIENTE') {
      navigate('/');
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.clear();
    navigate('/');
  };

  const renderizarVista = () => {
    switch (vistaActual) {
      case 'dashboard': return <ClienteInicio />;
      case 'mascotas': return <ClienteMascotas />;
      case 'citas': return <ClienteAgendarCita />;
      case 'tienda': return <ClienteTienda />;
      case 'recetas': return <PlaceholderVista titulo="Mis recetas" descripcion="Próximamente: descarga de recetas PDF." />;
      case 'facturacion': return <PlaceholderVista titulo="Facturación" descripcion="Próximamente: historial de pagos." />;
      default: return <ClienteInicio />;
    }
  };

  const baseBtnClass = "w-full text-left px-3.5 py-2.5 rounded-lg font-semibold transition-all duration-300 flex items-center gap-3 text-xs tracking-wide group";
  const activeBtnClass = `${baseBtnClass} bg-gradient-to-r from-sky-500 to-cyan-500 text-white shadow-md shadow-sky-500/10 translate-x-0.5`;
  const inactiveBtnClass = `${baseBtnClass} text-slate-400 hover:bg-slate-800/40 hover:text-slate-200`;

  const menuItems = [
    { id: 'dashboard', label: 'Mi panel', icon: LayoutDashboard, seccion: null },
    { id: 'mascotas', label: 'Mis mascotas', icon: PawPrint, seccion: 'Servicios' },
    { id: 'citas', label: 'Reservar cita', icon: CalendarPlus, seccion: null },
    { id: 'tienda', label: 'Tienda online', icon: ShoppingBag, seccion: 'Compras' },
    { id: 'recetas', label: 'Mis recetas', icon: FileText, seccion: null },
    { id: 'facturacion', label: 'Facturación', icon: Receipt, seccion: null },
  ];

  // Agrupar por secciones
  const renderMenu = () => {
    let ultimaSeccion = null;
    return menuItems.map((item) => {
      const elementos = [];

      if (item.seccion && item.seccion !== ultimaSeccion) {
        ultimaSeccion = item.seccion;
        elementos.push(
          <div key={`sec-${item.seccion}`} className="pt-3 pb-1.5">
            <p className="px-3.5 text-[9px] font-bold text-slate-600 tracking-widest">{item.seccion}</p>
          </div>
        );
      }

      const Icono = item.icon;
      elementos.push(
        <button
          key={item.id}
          onClick={() => {
            setVistaActual(item.id);
            setSidebarOpen(false);
          }}
          className={vistaActual === item.id ? activeBtnClass : inactiveBtnClass}
        >
          <Icono
            size={16}
            className={vistaActual === item.id ? 'text-white' : 'text-slate-500 group-hover:text-sky-400 transition-colors'}
          />
          {item.label}
        </button>
      );

      return elementos;
    });
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

      {/* SIDEBAR LATERAL */}
      <aside className={`fixed inset-y-0 left-0 w-60 bg-slate-900 flex flex-col border-r border-slate-800/40 z-40 shadow-xl transition-transform duration-300 lg:static lg:translate-x-0 ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        {/* Logo */}
        <div className="h-20 flex items-center justify-between px-5 border-b border-slate-800/30">
          <div className="flex items-center gap-2.5 cursor-pointer">
            <div className="w-9 h-9 bg-gradient-to-tr from-sky-500 to-cyan-300 rounded-lg flex items-center justify-center text-white shadow-md shadow-sky-500/15">
              <img src={logo} alt="Logo de la clínica" className="w-7 h-7 object-contain" />
            </div>
            <div className="flex flex-col">
              <span className="text-base font-bold text-white tracking-tight leading-tight">Vet.Huesitos</span>
              <span className="text-[9px] font-bold text-sky-400 uppercase tracking-widest">Portal cliente</span>
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

        {/* Menú */}
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          {renderMenu()}
        </nav>

        {/* Cerrar Sesión */}
        <div className="p-3 border-t border-slate-800/30 bg-slate-900/50">
          <button
            onClick={handleLogout}
            className="w-full bg-red-500/10 text-red-400 hover:bg-red-500 hover:text-white px-3 py-2.5 rounded-lg font-bold text-xs transition-all duration-200 flex items-center justify-center gap-2 border border-red-500/10 hover:shadow-md hover:shadow-red-500/10"
          >
            <LogOut size={14} />
            Cerrar sesión
          </button>
        </div>
      </aside>

      {/* ÁREA DE CONTENIDO */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden relative">
        {/* HEADER */}
        <header className="bg-white/80 backdrop-blur-md h-20 px-6 lg:px-8 flex justify-between items-center shadow-sm z-10 border-b border-slate-200/60 sticky top-0">
          <div className="flex items-center gap-3">
            {/* Botón hamburguesa */}
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2 rounded-lg text-slate-600 hover:bg-slate-100 transition-colors"
            >
              <Menu size={20} />
            </button>
            <h1 className="text-xl font-bold text-slate-800 tracking-tight">Portal del cliente</h1>
          </div>
          <div className="flex items-center gap-4 bg-slate-50 border border-slate-200 px-2 py-1.5 rounded-full pr-5">
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-sky-500 to-cyan-300 shadow-sm flex items-center justify-center text-white">
              <User size={16} strokeWidth={2.5} />
            </div>
            <span className="text-sm font-semibold text-slate-600 truncate max-w-[120px] md:max-w-[200px]">{correo}</span>
          </div>
        </header>

        {/* CONTENIDO DINÁMICO */}
        <div className="flex-1 p-4 lg:p-8 overflow-y-auto bg-slate-50">
          <div className="max-w-7xl mx-auto">
            {renderizarVista()}
          </div>
        </div>
      </main>
    </div>
  );
};

const PlaceholderVista = ({ titulo, descripcion }) => (
  <div className="flex items-center justify-center h-64">
    <div className="text-center">
      <h2 className="text-2xl font-bold text-slate-300 mb-2">{titulo}</h2>
      <p className="text-sm text-slate-400">{descripcion}</p>
    </div>
  </div>
);

export default ClienteDashboard;
