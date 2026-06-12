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
  X,
  User,
  History,
  Truck,
  PawPrint,
  CalendarPlus,
  FileText,
  Receipt
} from 'lucide-react';
import logo from '../assets/Logo Huesitos.png';
import { useNavigate } from 'react-router-dom';

const configsRoles = {
  ADMINISTRADOR: {
    subtitulo: "Panel Admin",
    activeColor: "from-sky-500 to-cyan-500",
    hoverIconColor: "group-hover:text-sky-400",
    badgeRol: "Administrador",
    badgeBg: "bg-sky-500",
    items: [
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
    ]
  },
  VETERINARIO: {
    subtitulo: "Módulo clínico",
    activeColor: "from-emerald-500 to-teal-550",
    hoverIconColor: "group-hover:text-emerald-450",
    badgeRol: "Veterinario",
    badgeBg: "bg-emerald-500",
    items: [
      { id: 'agenda', label: 'Agenda del día', icon: Calendar },
      { id: 'consulta', label: 'Consulta activa', icon: Stethoscope, tienePing: true },
      { id: 'mascotas', label: 'Buscar expedientes', icon: History }
    ]
  },
  RECEPCIONISTA: {
    subtitulo: "Caja y POS",
    activeColor: "from-sky-500 to-cyan-400",
    hoverIconColor: "group-hover:text-sky-400",
    badgeRol: "Cajero/a",
    badgeBg: "bg-sky-500",
    items: [
      { id: 'caja', label: 'Caja y POS', icon: Wallet },
      { id: 'pedidos', label: 'Despacho de pedidos', icon: Truck },
      { id: 'agenda', label: 'Agenda semanal', icon: Calendar }
    ]
  },
  CLIENTE: {
    subtitulo: "Portal cliente",
    activeColor: "from-sky-500 to-cyan-500",
    hoverIconColor: "group-hover:text-sky-400",
    badgeRol: "Cliente",
    badgeBg: "bg-sky-500",
    items: [
      { id: 'dashboard', label: 'Mi panel', icon: LayoutDashboard },
      { id: 'mascotas', label: 'Mis mascotas', icon: PawPrint, seccion: 'Servicios' },
      { id: 'citas', label: 'Reservar cita', icon: CalendarPlus },
      { id: 'tienda', label: 'Tienda online', icon: ShoppingBag, seccion: 'Compras' },
      { id: 'recetas', label: 'Mis recetas', icon: FileText },
      { id: 'facturacion', label: 'Facturación', icon: Receipt }
    ]
  }
};

const BarraLateral = ({ 
  rol, 
  vistaActual, 
  setVistaActual, 
  sidebarOpen, 
  setSidebarOpen, 
  handleLogout, 
  correo, 
  tieneCitaActiva 
}) => {
  const navigate = useNavigate();
  const config = configsRoles[rol] || configsRoles.CLIENTE;

  const baseBtnClass = "w-full text-left px-3.5 py-2.5 rounded-lg font-semibold transition-all duration-200 flex items-center gap-3 text-xs tracking-wide group";
  const shadowColor = rol === 'VETERINARIO' ? 'shadow-emerald-500/10' : 'shadow-sky-500/10';
  const activeBtnClass = `${baseBtnClass} bg-gradient-to-r ${config.activeColor} text-white shadow-md ${shadowColor} translate-x-0.5`;
  const inactiveBtnClass = `${baseBtnClass} text-slate-400 hover:bg-slate-800/40 hover:text-slate-200`;

  const logoBg = rol === 'VETERINARIO' ? 'from-emerald-500 to-teal-400' : 'from-sky-500 to-cyan-300';

  const renderizarMenu = () => {
    let ultimaSeccion = null;
    return config.items.map((item) => {
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
      const estaActivo = vistaActual === item.id;

      elementos.push(
        <button 
          key={item.id}
          onClick={() => { 
            if (item.ruta) {
              navigate(item.ruta);
            } else if (setVistaActual) {
              setVistaActual(item.id);
            } else {
              localStorage.setItem('subvistaDefecto', item.id);
              const rutas = {
                ADMINISTRADOR: '/admin',
                CLIENTE: '/cliente',
                VETERINARIO: '/veterinario',
                RECEPCIONISTA: '/recepcion'
              };
              window.location.href = rutas[rol] || '/';
            }
            setSidebarOpen(false); 
          }} 
          className={estaActivo ? activeBtnClass : inactiveBtnClass}
        >
          <Icono 
            size={16} 
            className={estaActivo ? "text-white" : `text-slate-500 ${config.hoverIconColor} transition-colors`} 
          /> 
          {item.label}
          {item.tienePing && tieneCitaActiva && (
            <span className="ml-auto w-2 h-2 bg-rose-500 rounded-full animate-ping" />
          )}
        </button>
      );

      return elementos;
    });
  };

  return (
    <aside className={`fixed inset-y-0 left-0 w-60 bg-slate-900 flex flex-col border-r border-slate-800/40 z-40 shadow-xl transition-transform duration-300 lg:static lg:h-full lg:translate-x-0 ${
      sidebarOpen ? 'translate-x-0' : '-translate-x-full'
    }`}>
      {/* Logo de la Clínica */}
      <div className="h-20 flex items-center justify-between px-5 border-b border-slate-800/30">
        <div className="flex items-center gap-2.5 cursor-pointer">
          <div className={`w-9 h-9 bg-gradient-to-tr ${logoBg} rounded-lg flex items-center justify-center text-white shadow-md shadow-sky-500/15`}>
            <img 
              src={logo} 
              alt="Logo de la clínica" 
              className="w-7 h-7 object-contain"
            />
          </div>
          <div className="flex flex-col">
            <span className="text-base font-black text-white tracking-tight leading-tight">Vet.Huesitos</span>
            <span className="text-[9px] font-bold text-sky-400 uppercase tracking-widest">{config.subtitulo}</span>
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

      {/* Info del Usuario y Cerrar Sesión */}
      <div className="p-3 border-t border-slate-800/30 bg-slate-900/50">
        <div 
          onClick={() => {
            navigate('/perfil');
          }}
          className={`p-2.5 rounded-lg flex items-center gap-2.5 mb-3 cursor-pointer transition-all border ${
            vistaActual === 'perfil' 
              ? `bg-gradient-to-r ${config.activeColor} text-white border-transparent shadow-md ${shadowColor} translate-x-0.5` 
              : "bg-slate-950/40 border border-slate-800/40 text-slate-400 hover:bg-slate-850/65 hover:border-slate-750 hover:text-slate-200"
          }`}
        >
          <div className={`w-7 h-7 rounded-lg ${vistaActual === 'perfil' ? 'bg-white/20' : config.badgeBg} flex items-center justify-center text-white font-bold shrink-0 shadow-sm`}>
            <User size={12} />
          </div>
          <div className="overflow-hidden">
            <p className={`text-[8px] font-bold uppercase tracking-wider ${vistaActual === 'perfil' ? 'text-white/70' : 'text-slate-500'}`}>{config.badgeRol}</p>
            <p className="text-white text-xs font-bold truncate" title={correo}>{correo}</p>
          </div>
        </div>
        <button onClick={handleLogout} className="w-full bg-red-500/10 text-red-400 hover:bg-red-500 hover:text-white px-3 py-2.5 rounded-lg font-bold text-xs transition-all duration-200 flex items-center justify-center gap-2 border border-red-500/10 hover:shadow-md hover:shadow-red-500/10">
          <LogOut size={14} />
          Cerrar Sesión
        </button>
      </div>
    </aside>
  );
};

export default BarraLateral;
