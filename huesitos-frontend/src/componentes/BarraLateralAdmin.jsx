import { 
  LayoutDashboard, 
  Stethoscope, 
  ShieldCheck, 
  Users, 
  Wallet, 
  Settings, 
  LogOut, 
  Calendar,
  Clock,
  Package,
  Percent,
  ShoppingBag,
  X
} from 'lucide-react';
import logo from '../assets/Logo Huesitos.png';

const BarraLateralAdmin = ({ 
  vistaActual, 
  setVistaActual, 
  sidebarOpen, 
  setSidebarOpen, 
  handleLogout 
}) => {
  const baseBtnClass = "w-full text-left px-3.5 py-2.5 rounded-lg font-semibold transition-all duration-200 flex items-center gap-3 text-xs tracking-wide group";
  const activeBtnClass = `${baseBtnClass} bg-gradient-to-r from-sky-500 to-cyan-500 text-white shadow-md shadow-sky-500/10`;
  const inactiveBtnClass = `${baseBtnClass} text-slate-400 hover:bg-slate-800/40 hover:text-slate-200`;

  const itemsMenu = [
    { id: 'dashboard', label: 'Panel de Control', icon: LayoutDashboard },
    { id: 'servicios', label: 'Servicios Médicos', icon: Stethoscope, seccion: 'Gestión Clínica' },
    { id: 'duenos', label: 'Directorio Clientes', icon: Users },
    { id: 'agenda', label: 'Agenda Semanal', icon: Calendar },
    { id: 'inventario', label: 'Inventario FEFO', icon: Package },
    { id: 'finanzas', label: 'Caja y Finanzas', icon: Wallet, seccion: 'Administración' },
    { id: 'pedidos', label: 'Gestión de Pedidos', icon: ShoppingBag },
    { id: 'usuarios', label: 'Usuarios y Roles', icon: ShieldCheck },
    { id: 'campanas', label: 'Campañas y Ofertas', icon: Percent },
    { id: 'horarios', label: 'Horarios del Personal', icon: Clock },
    { id: 'configuracion', label: 'Configuración Global', icon: Settings }
  ];

  const renderizarMenu = () => {
    let ultimaSeccion = null;
    return itemsMenu.map((item) => {
      const elementos = [];

      if (item.seccion && item.seccion !== ultimaSeccion) {
        ultimaSeccion = item.seccion;
        elementos.push(
          <div key={`sec-${item.seccion}`} className="pt-3 pb-1.5">
            <p className="px-3.5 text-[9px] font-black text-slate-600 uppercase tracking-widest">{item.seccion}</p>
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
            className={vistaActual === item.id ? "text-white" : "text-slate-500 group-hover:text-sky-400 transition-colors"} 
          /> 
          {item.label}
        </button>
      );

      return elementos;
    });
  };

  return (
    <aside className={`fixed inset-y-0 left-0 w-60 bg-slate-900 flex flex-col border-r border-slate-800/40 z-40 shadow-xl transition-transform duration-300 lg:static lg:translate-x-0 ${
      sidebarOpen ? 'translate-x-0' : '-translate-x-full'
    }`}>
      {/* Logo de la Clínica */}
      <div className="h-20 flex items-center justify-between px-5 border-b border-slate-800/30">
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
        {/* Botón de cierre para móvil */}
        <button
          onClick={() => setSidebarOpen(false)}
          className="lg:hidden p-1.5 rounded-lg text-slate-400 hover:bg-slate-800 hover:text-slate-200 transition-colors"
        >
          <X size={18} />
        </button>
      </div>

      {/* Menú de Navegación */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto custom-scrollbar">
        {renderizarMenu()}
      </nav>

      {/* Botón Cerrar Sesión */}
      <div className="p-3 border-t border-slate-800/30 bg-slate-900/50">
        <button onClick={handleLogout} className="w-full bg-red-500/10 text-red-400 hover:bg-red-500 hover:text-white px-3 py-2.5 rounded-lg font-bold text-xs transition-all duration-200 flex items-center justify-center gap-2 border border-red-500/10 hover:shadow-md hover:shadow-red-500/10">
          <LogOut size={14} />
          Cerrar Sesión
        </button>
      </div>
    </aside>
  );
};

export default BarraLateralAdmin;
