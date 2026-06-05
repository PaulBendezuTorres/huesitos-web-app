import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Menu } from 'lucide-react';

import ClienteInicio from '../modulos/cliente/paginas/ClienteInicio';
import ClienteMascotas from '../modulos/cliente/paginas/ClienteMascotas';
import ClienteAgendarCita from '../modulos/cliente/paginas/ClienteAgendarCita';
import ClienteTienda from '../modulos/cliente/paginas/ClienteTienda';
import BarraLateral from '../componentes/BarraLateral';

const TableroCliente = () => {
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
      <BarraLateral
        rol="CLIENTE"
        correo={correo}
        vistaActual={vistaActual}
        setVistaActual={setVistaActual}
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        handleLogout={handleLogout}
      />

      {/* ÁREA DE CONTENIDO */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden relative">
        {/* HEADER */}
        <header className="bg-white/80 backdrop-blur-md h-20 px-4 md:px-6 lg:px-8 flex justify-between items-center shadow-sm z-10 border-b border-slate-200/60 sticky top-0 shrink-0">
          <div className="flex items-center gap-3 min-w-0">
            {/* Botón hamburguesa */}
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2 rounded-lg text-slate-600 hover:bg-slate-100 transition-colors shrink-0"
            >
              <Menu size={20} />
            </button>
            <h1 className="text-base sm:text-lg md:text-xl font-bold text-slate-800 tracking-tight truncate max-w-[140px] sm:max-w-xs md:max-w-none">
              Portal del cliente
            </h1>
          </div>
          <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 p-1 rounded-full md:pr-4 md:gap-3 shrink-0">
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-sky-500 to-cyan-300 shadow-sm flex items-center justify-center text-white shrink-0">
              <User size={16} strokeWidth={2.5} />
            </div>
            <span className="text-xs md:text-sm font-semibold text-slate-600 truncate max-w-[80px] sm:max-w-[120px] md:max-w-[200px]" title={correo}>
              {correo}
            </span>
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

export default TableroCliente;
