import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Wallet,
  User,
  LogOut,
  Calendar,
  Truck
} from 'lucide-react';
import logo from '../assets/Logo Huesitos.png';
import GestionPedidos from './GestionPedidos';
import AgendaSemanal from './AgendaSemanal';
import CajaPOS from '../Modules/recepcionista/pages/CajaPOS';

const RecepcionistaDashboard = () => {
  const navigate = useNavigate();
  const [correo] = useState(localStorage.getItem('usuarioCorreo') || 'Recepcionista');
  
  // Pestaña o Vista Principal del Panel
  const [seccionActiva, setSeccionActiva] = useState('caja'); // 'caja', 'pedidos' o 'agenda'

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
    <div className="flex h-screen bg-slate-100 font-sans overflow-hidden">
      
      {/* BARRA LATERAL */}
      <aside className="w-64 bg-slate-950 flex flex-col justify-between border-r border-slate-800 shrink-0">
        <div>
          <div className="h-20 flex items-center px-6 border-b border-slate-800/50">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-tr from-sky-500 to-cyan-300 rounded-xl flex items-center justify-center text-white shadow-lg shadow-sky-500/20">
                <img src={logo} alt="Logo" className="w-8 h-8 object-contain" />
              </div>
              <div className="flex flex-col">
                <span className="text-md font-black text-white tracking-tight leading-tight">Vet.Huesitos</span>
                <span className="text-[9px] font-bold text-sky-400 uppercase tracking-widest">Caja y POS</span>
              </div>
            </div>
          </div>
          
          {/* Navegación Módulos */}
          <nav className="p-4 space-y-2">
            <button
              onClick={() => setSeccionActiva('caja')}
              className={`w-full text-left px-4 py-3 rounded-xl font-bold transition-all duration-300 flex items-center gap-3 text-xs tracking-wider uppercase ${
                seccionActiva === 'caja'
                  ? 'bg-gradient-to-r from-sky-500 to-cyan-400 text-white shadow-md'
                  : 'text-slate-400 hover:bg-slate-900 hover:text-slate-200'
              }`}
            >
              <Wallet size={16} />
              Caja y POS
            </button>
            <button
              onClick={() => setSeccionActiva('pedidos')}
              className={`w-full text-left px-4 py-3 rounded-xl font-bold transition-all duration-300 flex items-center gap-3 text-xs tracking-wider uppercase ${
                seccionActiva === 'pedidos'
                  ? 'bg-gradient-to-r from-sky-500 to-cyan-400 text-white shadow-md'
                  : 'text-slate-400 hover:bg-slate-900 hover:text-slate-200'
              }`}
            >
              <Truck size={16} />
              Despacho Pedidos
            </button>
            <button
              onClick={() => setSeccionActiva('agenda')}
              className={`w-full text-left px-4 py-3 rounded-xl font-bold transition-all duration-300 flex items-center gap-3 text-xs tracking-wider uppercase ${
                seccionActiva === 'agenda'
                  ? 'bg-gradient-to-r from-sky-500 to-cyan-400 text-white shadow-md'
                  : 'text-slate-400 hover:bg-slate-900 hover:text-slate-200'
              }`}
            >
              <Calendar size={16} />
              Agenda Semanal
            </button>
          </nav>
        </div>

        <div className="p-4 border-t border-slate-800/50">
          <div className="bg-slate-900 border border-slate-800 p-3 rounded-xl flex items-center gap-3 mb-4">
            <div className="w-8 h-8 rounded-full bg-sky-500 flex items-center justify-center text-white font-bold shrink-0">
              <User size={14} />
            </div>
            <div className="overflow-hidden">
              <p className="text-[9px] text-slate-505 text-slate-500 font-bold uppercase">Cajero/a</p>
              <p className="text-white text-xs font-bold truncate">{correo}</p>
            </div>
          </div>
          <button 
            onClick={handleLogout}
            className="w-full bg-red-500/10 text-red-400 hover:bg-red-500 hover:text-white px-4 py-3 rounded-xl font-bold text-sm transition-all duration-300 flex items-center justify-center gap-3 border border-red-500/20 shadow-sm"
          >
            <LogOut size={16} />
            Cerrar Sesión
          </button>
        </div>
      </aside>

      {/* CONTENEDOR VISTAS DINÁMICAS */}
      <main className="flex-1 flex overflow-hidden">
        
        {/* 1. SECCIÓN: CAJA Y POS */}
        {seccionActiva === 'caja' && (
          <CajaPOS />
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
  );
};

export default RecepcionistaDashboard;
