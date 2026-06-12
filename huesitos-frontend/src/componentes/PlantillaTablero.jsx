import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Menu } from 'lucide-react';
import BarraLateral from './BarraLateral';

const PlantillaTablero = ({
  rol,
  correo,
  vistaActual,
  setVistaActual,
  handleLogout,
  tituloHeader,
  tieneCitaActiva,
  sinPadding,
  children
}) => {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [fotoPerfilUrl, setFotoPerfilUrl] = useState(localStorage.getItem('fotoPerfilUrl') || '');

  useEffect(() => {
    const manejarCambioStorage = () => {
      setFotoPerfilUrl(localStorage.getItem('fotoPerfilUrl') || '');
    };
    window.addEventListener('storage', manejarCambioStorage);
    return () => window.removeEventListener('storage', manejarCambioStorage);
  }, []);
  const selectionClass = rol === 'VETERINARIO' ? 'selection:bg-emerald-500 selection:text-white' : 'selection:bg-sky-500 selection:text-white';

  return (
    <div className={`flex h-screen bg-slate-50 font-sans overflow-hidden ${selectionClass}`}>
      {/* Overlay para móviles */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-30 lg:hidden transition-opacity duration-300"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Barra Lateral Modular Dinámica */}
      <BarraLateral
        rol={rol}
        correo={correo}
        vistaActual={vistaActual}
        setVistaActual={setVistaActual}
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        handleLogout={handleLogout}
        tieneCitaActiva={tieneCitaActiva}
      />

      {/* ÁREA DE CONTENIDO PRINCIPAL */}
      <main className="flex-1 flex flex-col h-full overflow-hidden relative bg-slate-50">
        {/* Header Superior Responsivo */}
        <header className="bg-white/80 backdrop-blur-md h-20 px-4 md:px-6 lg:px-8 flex justify-between items-center shadow-sm z-10 border-b border-slate-200/60 sticky top-0 shrink-0">
          <div className="flex items-center gap-3 min-w-0">
            {/* Botón hamburguesa */}
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2 rounded-lg text-slate-600 hover:bg-slate-100 transition-colors shrink-0"
              aria-label="Abrir menú"
            >
              <Menu size={20} />
            </button>
            <h1 className="text-base sm:text-lg md:text-xl font-black text-slate-800 tracking-tight truncate max-w-[140px] sm:max-w-xs md:max-w-none">
              {tituloHeader}
            </h1>
          </div>

          <div 
            onClick={() => navigate(rol === 'ADMINISTRADOR' ? '/admin/perfil' : '/perfil')}
            className="flex items-center gap-2 bg-slate-50 hover:bg-slate-100/90 border border-slate-200 hover:border-slate-300 p-1 rounded-full md:pr-4 md:gap-3 shrink-0 cursor-pointer active:scale-95 transition-all select-none group"
            title="Ver mi perfil"
          >
            <div className={`w-8 h-8 rounded-full bg-gradient-to-tr ${rol === 'VETERINARIO' ? 'from-emerald-500 to-teal-400' : 'from-sky-500 to-cyan-300'} shadow-sm flex items-center justify-center text-white shrink-0 group-hover:scale-105 transition-transform overflow-hidden`}>
              {fotoPerfilUrl && fotoPerfilUrl !== '/uploads/defecto-usuario.png' ? (
                <img 
                  src={`http://localhost:8080${fotoPerfilUrl}`} 
                  alt="Foto de perfil" 
                  className="w-full h-full object-cover" 
                />
              ) : (
                <User size={16} strokeWidth={2.5} />
              )}
            </div>
            <span className="text-xs md:text-sm font-bold text-slate-650 group-hover:text-slate-800 transition-colors truncate max-w-[80px] sm:max-w-[120px] md:max-w-[200px]" title={correo}>
              {correo}
            </span>
          </div>
        </header>

        {/* CONTENEDOR DINÁMICO DE PÁGINAS */}
        <div className={`flex-1 bg-slate-50 ${sinPadding ? 'p-0 overflow-hidden h-full flex' : 'p-4 lg:p-8 overflow-y-auto'}`}>
          <div className={`${sinPadding ? 'w-full h-full flex' : 'max-w-7xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500'}`}>
            {children}
          </div>
        </div>
      </main>
    </div>
  );
};

export default PlantillaTablero;
