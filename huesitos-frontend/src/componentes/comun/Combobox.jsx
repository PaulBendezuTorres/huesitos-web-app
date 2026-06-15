import { useState, useEffect, useRef } from 'react';
import { ChevronDown, Stethoscope, Check } from 'lucide-react';

const Combobox = ({ 
  value, 
  onChange, 
  opciones = [], 
  placeholder = "Escribe o selecciona...", 
  required = false,
  icono: Icono = Stethoscope,
  compacto = false
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [filtro, setFiltro] = useState(value || '');
  const containerRef = useRef(null);

  useEffect(() => {
    setFiltro(value || '');
  }, [value]);

  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setIsOpen(false);
        // Al cerrar, si el filtro no coincide exactamente con el valor anterior,
        // lo guardamos como el valor final (permitiendo texto personalizado)
        if (filtro !== value) {
          onChange(filtro);
        }
      }
    };
    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, [filtro, value, onChange]);

  // Filtrar las opciones basadas en lo que escribe el usuario
  const opcionesFiltradas = opciones.filter((opc) => {
    const term = filtro.toLowerCase().trim();
    if (!term) return true;
    return opc.label.toLowerCase().includes(term) || (opc.categoria && opc.categoria.toLowerCase().includes(term));
  });

  const handleInputChange = (e) => {
    const newVal = e.target.value;
    setFiltro(newVal);
    setIsOpen(true);
    onChange(newVal); // Reporta el cambio inmediatamente
  };

  const handleSeleccionar = (opc) => {
    onChange(opc.label, opc.precio, opc); // Devuelve el nombre, el precio opcional y el objeto completo
    setFiltro(opc.label);
    setIsOpen(false);
  };

  return (
    <div ref={containerRef} className="relative w-full">
      <div className="relative">
        <Icono className={`absolute text-slate-400 pointer-events-none ${compacto ? 'left-3 top-2.5' : 'left-3.5 top-3.5'}`} size={compacto ? 14 : 16} />
        <input
          type="text"
          value={filtro}
          onChange={handleInputChange}
          onFocus={() => setIsOpen(true)}
          required={required}
          placeholder={placeholder}
          className={`w-full pr-10 rounded-xl border border-slate-200 dark:border-slate-600 text-slate-800 dark:text-slate-100 font-semibold focus:ring-2 focus:ring-sky-100 focus:border-sky-400 outline-none transition-all bg-slate-50 dark:bg-slate-700 focus:bg-white dark:focus:bg-slate-600 placeholder:text-slate-400 dark:placeholder:text-slate-500 ${
            compacto ? 'py-1.5 text-xs pl-9' : 'py-3 text-sm pl-10'
          }`}
        />
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className={`absolute text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors ${compacto ? 'right-3 top-2' : 'right-3.5 top-3.5'}`}
        >
          <ChevronDown size={compacto ? 15 : 18} className={`transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
        </button>
      </div>

      {isOpen && (
        <div className="absolute left-0 right-0 mt-2 bg-white dark:bg-slate-800 border border-slate-150 dark:border-slate-700 rounded-2xl shadow-xl z-50 max-h-60 overflow-y-auto animate-in fade-in slide-in-from-top-2 duration-150">
          {opcionesFiltradas.length === 0 ? (
            <div className="px-4 py-3 text-xs text-slate-400 dark:text-slate-500 font-semibold italic">
              Presiona Enter o fuera para guardar "{filtro}"
            </div>
          ) : (
            opcionesFiltradas.map((opc, index) => {
              const esSeleccionado = value?.toLowerCase() === opc.label.toLowerCase();
              return (
                <button
                  key={index}
                  type="button"
                  onClick={() => handleSeleccionar(opc)}
                  className={`w-full text-left px-4 py-2.5 hover:bg-sky-50/50 dark:hover:bg-slate-700 flex items-center justify-between text-xs font-semibold border-b border-slate-50 dark:border-slate-700 last:border-0 transition-colors ${
                    esSeleccionado ? 'bg-sky-50 dark:bg-sky-900/30 text-sky-650 dark:text-sky-400' : 'text-slate-700 dark:text-slate-200'
                  }`}
                >
                  <div className="flex flex-col">
                    <span className="font-bold tracking-tight">{opc.label}</span>
                    {opc.categoria && (
                      <span className="text-[10px] text-slate-400 dark:text-slate-500 font-medium mt-0.5">{opc.categoria}</span>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    {opc.precio && (
                      <span className="text-[10px] bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400 px-2 py-0.5 rounded-md font-bold">
                        S/. {opc.precio.toFixed(2)}
                      </span>
                    )}
                    {esSeleccionado && <Check size={14} className="text-sky-600" />}
                  </div>
                </button>
              );
            })
          )}
        </div>
      )}
    </div>
  );
};

export default Combobox;
