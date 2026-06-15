import { useState } from 'react';
import { User, ShieldCheck, Search } from 'lucide-react';
import CargadorSpinner from '@/componentes/comun/CargadorSpinner';
import Buscador from '@/componentes/comun/Buscador';

const ListaPersonalClinica = ({ 
  personal = [], 
  empleadoSeleccionado, 
  onSelectEmpleado, 
  cargando 
}) => {
  const [busqueda, setBusqueda] = useState('');

  // Filtrar por búsqueda
  const personalFiltrado = personal.filter((p) => {
    const term = busqueda.toLowerCase().trim();
    if (!term) return true;
    const nombre = (p.nombre || '').toLowerCase();
    const correo = (p.correo || '').toLowerCase();
    const rol = (p.rol || '').toLowerCase();
    return nombre.includes(term) || correo.includes(term) || rol.includes(term);
  });

  return (
    <aside className="w-full md:w-[32%] bg-white dark:bg-slate-800 rounded-2xl border border-slate-200/80 dark:border-slate-700/60 flex flex-col overflow-hidden shadow-sm shrink-0">
      {/* Cabecera */}
      <div className="p-5 border-b border-slate-100 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-900/40 shrink-0">
        <h3 className="text-sm font-bold text-slate-800 dark:text-slate-100 tracking-tight flex items-center gap-2">
          <User size={18} className="text-sky-600 dark:text-sky-400" /> Personal de la Clínica
        </h3>
        <p className="text-xs text-slate-400 dark:text-slate-400 mt-1 font-medium">
          Selecciona un empleado para administrar su jornada.
        </p>
        
        <div className="mt-4">
          <Buscador 
            value={busqueda} 
            onChange={setBusqueda} 
            placeholder="Buscar por nombre, correo o rol..." 
            sinContenedor={true} 
          />
        </div>
      </div>

      {/* Lista */}
      <div className="flex-1 overflow-y-auto p-4 space-y-2.5">
        {cargando ? (
          <div className="flex flex-col items-center justify-center py-12 gap-2">
            <CargadorSpinner size="sm" />
            <span className="text-xs font-semibold text-slate-400 dark:text-slate-500 animate-pulse">Cargando personal...</span>
          </div>
        ) : personalFiltrado.length === 0 ? (
          <div className="text-center py-10 text-slate-400 dark:text-slate-500 text-xs font-semibold">
            No se encontraron empleados en la clínica.
          </div>
        ) : (
          personalFiltrado.map((emp) => {
            const seleccionado = empleadoSeleccionado?.id === emp.id;
            const esVeterinario = emp.rol === 'VETERINARIO';
            
            // Estilos dinámicos premium para el avatar e indicador de rol
            const gradientAvatar = esVeterinario
              ? 'from-emerald-500 to-teal-400 text-white'
              : 'from-sky-500 to-cyan-400 text-white';
              
            const badgeClase = esVeterinario
              ? 'bg-emerald-50 dark:bg-emerald-950/25 text-emerald-600 dark:text-emerald-400 border-emerald-100/80 dark:border-emerald-900/40'
              : 'bg-sky-50 dark:bg-sky-950/25 text-sky-600 dark:text-sky-400 border-sky-100/80 dark:border-sky-900/40';

            const activeCardBorder = seleccionado 
              ? 'border-sky-500/80 bg-sky-50/30 dark:bg-sky-950/10 shadow-sm ring-1 ring-sky-500/30' 
              : 'border-slate-100 dark:border-slate-700/60 bg-transparent hover:border-sky-200 dark:hover:border-slate-650 hover:bg-slate-50/50 dark:hover:bg-slate-700/20';

            return (
              <button
                key={emp.id}
                type="button"
                onClick={() => onSelectEmpleado(emp)}
                className={`w-full flex items-center gap-3.5 p-3 rounded-xl border text-left transition-all duration-300 outline-none ${activeCardBorder}`}
              >
                <div className={`w-10 h-10 rounded-xl bg-gradient-to-tr ${gradientAvatar} flex items-center justify-center font-black text-sm shadow-sm shrink-0`}>
                  {emp.nombre?.charAt(0).toUpperCase() || emp.correo?.charAt(0).toUpperCase() || 'U'}
                </div>
                
                <div className="min-w-0 flex-1">
                  <h4 className="font-semibold text-slate-800 dark:text-slate-150 text-xs truncate flex items-center gap-1.5">
                    {emp.nombre || emp.correo}
                    {seleccionado && <ShieldCheck size={13} className="text-sky-500 shrink-0" />}
                  </h4>
                  <p className="text-[10px] text-slate-400 dark:text-slate-450 truncate mt-0.5">{emp.correo}</p>
                  
                  <div className="flex gap-1.5 mt-2">
                    <span className={`text-[9px] font-black px-2 py-0.5 rounded-full border tracking-wider uppercase ${badgeClase}`}>
                      {esVeterinario ? 'Veterinario' : 'Recepcionista'}
                    </span>
                  </div>
                </div>
              </button>
            );
          })
        )}
      </div>
    </aside>
  );
};

export default ListaPersonalClinica;
