import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Menu } from 'lucide-react';
import BarraLateral from '../componentes/BarraLateral';
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
        rol="RECEPCIONISTA"
        correo={correo}
        vistaActual={seccionActiva}
        setVistaActual={setSeccionActiva}
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        handleLogout={handleLogout}
      />

      {/* CONTENEDOR PRINCIPAL */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        
        {/* HEADER SUPERIOR responsivo */}
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
              {seccionActiva === 'caja' ? 'Caja y punto de venta' : seccionActiva === 'pedidos' ? 'Despacho de pedidos' : 'Agenda semanal'}
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
