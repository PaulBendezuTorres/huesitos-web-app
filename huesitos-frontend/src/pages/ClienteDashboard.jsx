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
} from 'lucide-react';

import ClienteInicio from '../Modules/cliente/pages/ClienteInicio';
import ClienteMascotas from '../Modules/cliente/pages/ClienteMascotas';
import logo from '../assets/Logo Huesitos.png';

const ClienteDashboard = () => {
  const navigate = useNavigate();
  const [correo] = useState(localStorage.getItem('usuarioCorreo') || 'Cliente');
  const [vistaActual, setVistaActual] = useState('dashboard');

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
      case 'citas': return <PlaceholderVista titulo="Reservar Cita" descripcion="Próximamente: agendamiento en 4 pasos." />;
      case 'tienda': return <PlaceholderVista titulo="Tienda Online" descripcion="Próximamente: catálogo de productos." />;
      case 'recetas': return <PlaceholderVista titulo="Mis Recetas" descripcion="Próximamente: descarga de recetas PDF." />;
      case 'facturacion': return <PlaceholderVista titulo="Facturación" descripcion="Próximamente: historial de pagos." />;
      default: return <ClienteInicio />;
    }
  };

  const baseBtnClass = "w-full text-left px-4 py-3.5 rounded-xl font-semibold transition-all duration-300 flex items-center gap-4 text-sm tracking-wide group";
  const activeBtnClass = `${baseBtnClass} bg-gradient-to-r from-sky-500 to-cyan-400 text-white shadow-lg shadow-sky-500/30 translate-x-1`;
  const inactiveBtnClass = `${baseBtnClass} text-slate-400 hover:bg-slate-800/50 hover:text-slate-100`;

  const menuItems = [
    { id: 'dashboard', label: 'Mi Panel', icon: LayoutDashboard, seccion: null },
    { id: 'mascotas', label: 'Mis Mascotas', icon: PawPrint, seccion: 'Servicios' },
    { id: 'citas', label: 'Reservar Cita', icon: CalendarPlus, seccion: null },
    { id: 'tienda', label: 'Tienda Online', icon: ShoppingBag, seccion: 'Compras' },
    { id: 'recetas', label: 'Mis Recetas', icon: FileText, seccion: null },
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
          <div key={`sec-${item.seccion}`} className="pt-4 pb-2">
            <p className="px-4 text-[10px] font-bold text-slate-600 uppercase tracking-widest">{item.seccion}</p>
          </div>
        );
      }

      const Icono = item.icon;
      elementos.push(
        <button
          key={item.id}
          onClick={() => setVistaActual(item.id)}
          className={vistaActual === item.id ? activeBtnClass : inactiveBtnClass}
        >
          <Icono
            size={20}
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

      {/* SIDEBAR LATERAL */}
      <aside className="w-72 bg-slate-950 flex flex-col border-r border-slate-800 relative z-20 shadow-2xl">
        {/* Logo */}
        <div className="h-24 flex items-center px-8 border-b border-slate-800/50">
          <div className="flex items-center gap-3 cursor-pointer">
            <div className="w-11 h-11 bg-gradient-to-tr from-sky-500 to-cyan-300 rounded-xl flex items-center justify-center text-white shadow-lg shadow-sky-500/20">
              <img src={logo} alt="Logo de la clínica" />
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-black text-white tracking-tight leading-tight">Vet.Huesitos</span>
              <span className="text-[10px] font-bold text-sky-400 uppercase tracking-widest">Portal Cliente</span>
            </div>
          </div>
        </div>

        {/* Menú */}
        <nav className="flex-1 px-4 py-6 space-y-1.5 overflow-y-auto">
          {renderMenu()}
        </nav>

        {/* Cerrar Sesión */}
        <div className="p-4 border-t border-slate-800/50 bg-slate-950/50">
          <button
            onClick={handleLogout}
            className="w-full bg-red-500/10 text-red-400 hover:bg-red-500 hover:text-white px-4 py-3 rounded-xl font-bold text-sm transition-all duration-300 flex items-center justify-center gap-3 border border-red-500/20 hover:shadow-lg hover:shadow-red-500/20"
          >
            <LogOut size={18} />
            Cerrar Sesión
          </button>
        </div>
      </aside>

      {/* ÁREA DE CONTENIDO */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden relative">
        {/* HEADER */}
        <header className="bg-white/80 backdrop-blur-md h-20 px-8 flex justify-between items-center shadow-sm z-10 border-b border-slate-200/60 sticky top-0">
          <h1 className="text-xl font-black text-slate-800 tracking-tight">Portal del Cliente</h1>
          <div className="flex items-center gap-4 bg-slate-50 border border-slate-200 px-2 py-1.5 rounded-full pr-5">
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-sky-500 to-cyan-300 shadow-sm flex items-center justify-center text-white">
              <User size={16} strokeWidth={2.5} />
            </div>
            <span className="text-sm font-bold text-slate-600">{correo}</span>
          </div>
        </header>

        {/* CONTENIDO DINÁMICO */}
        <div className="flex-1 p-8 overflow-y-auto bg-slate-50">
          <div className="max-w-7xl mx-auto">
            {renderizarVista()}
          </div>
        </div>
      </main>
    </div>
  );
};

/** Componente placeholder para vistas no implementadas aún */
const PlaceholderVista = ({ titulo, descripcion }) => (
  <div className="flex items-center justify-center h-64">
    <div className="text-center">
      <h2 className="text-2xl font-black text-slate-300 mb-2">{titulo}</h2>
      <p className="text-sm text-slate-400">{descripcion}</p>
    </div>
  </div>
);

export default ClienteDashboard;
