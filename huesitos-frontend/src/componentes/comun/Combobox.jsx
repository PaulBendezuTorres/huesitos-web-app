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
  const [activeSuggestedIndex, setActiveSuggestedIndex] = useState(-1);
  const containerRef = useRef(null);

  useEffect(() => {
    setFiltro(value || '');
  }, [value]);

  // Filtrar las opciones basadas en lo que escribe el usuario
  const opcionesFiltradas = opciones.filter((opc) => {
    const term = filtro.toLowerCase().trim();
    if (!term) return true;
    return opc.label.toLowerCase().includes(term) || (opc.categoria && opc.categoria.toLowerCase().includes(term));
  });

  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setIsOpen(false);
        if (filtro !== value) {
          onChange(filtro);
        }
      }
    };
    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, [filtro, value, onChange]);

  const handleInputChange = (e) => {
    const newVal = e.target.value;
    setFiltro(newVal);
    setIsOpen(true);
    setActiveSuggestedIndex(-1);
    onChange(newVal); // Reporta el cambio inmediatamente
  };

  const handleSeleccionar = (opc) => {
    onChange(opc.label, opc.precio, opc); // Devuelve el nombre, el precio opcional y el objeto completo
    setFiltro(opc.label);
    setIsOpen(false);
    setActiveSuggestedIndex(-1);
  };

  const handleKeyDown = (e) => {
    if (!isOpen) {
      if (e.key === 'ArrowDown' || e.key === 'Enter') {
        setIsOpen(true);
      }
      return;
    }

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setActiveSuggestedIndex((prev) => 
          prev < opcionesFiltradas.length - 1 ? prev + 1 : 0
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setActiveSuggestedIndex((prev) => 
          prev > 0 ? prev - 1 : opcionesFiltradas.length - 1
        );
        break;
      case 'Enter':
        e.preventDefault();
        if (activeSuggestedIndex >= 0 && activeSuggestedIndex < opcionesFiltradas.length) {
          handleSeleccionar(opcionesFiltradas[activeSuggestedIndex]);
        } else {
          onChange(filtro);
          setIsOpen(false);
        }
        break;
      case 'Escape':
        e.preventDefault();
        setIsOpen(false);
        setActiveSuggestedIndex(-1);
        break;
      default:
        break;
    }
  };

  return (
    <div ref={containerRef} className="relative w-full">
      <div className="relative">
        <Icono className={`absolute text-slate-400 dark:text-slate-500 pointer-events-none transition-colors duration-200 ${compacto ? 'left-3 top-2.5' : 'left-3.5 top-3.5'}`} size={compacto ? 14 : 16} />
        <input
          type="text"
          value={filtro}
          onChange={handleInputChange}
          onFocus={() => setIsOpen(true)}
          onKeyDown={handleKeyDown}
          required={required}
          placeholder={placeholder}
          className={`w-full pr-10 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-100 font-semibold focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 outline-none transition-all bg-slate-50 dark:bg-slate-950 focus:bg-white dark:focus:bg-slate-900 placeholder:text-slate-450 dark:placeholder:text-slate-600 ${
            compacto ? 'py-1.5 text-xs pl-9' : 'py-3 text-sm pl-10'
          }`}
        />
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className={`absolute text-slate-450 hover:text-slate-650 dark:text-slate-600 dark:hover:text-slate-400 transition-colors ${compacto ? 'right-3 top-2' : 'right-3.5 top-3.5'}`}
        >
          <ChevronDown size={compacto ? 15 : 18} className={`transition-transform duration-250 ${isOpen ? 'rotate-180' : ''}`} />
        </button>
      </div>

      {isOpen && (
        <div className="absolute left-0 right-0 mt-2 bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 rounded-2xl shadow-xl z-50 max-h-60 overflow-y-auto animate-in fade-in slide-in-from-top-2 duration-150">
          {opcionesFiltradas.length === 0 ? (
            <div className="px-4 py-3 text-xs text-slate-400 dark:text-slate-500 font-semibold italic">
              Presiona Enter o fuera para guardar "{filtro}"
            </div>
          ) : (
            opcionesFiltradas.map((opc, index) => {
              const esSeleccionado = value?.toLowerCase() === opc.label.toLowerCase();
              const esActivoTeclado = index === activeSuggestedIndex;
              return (
                <button
                  key={index}
                  type="button"
                  onClick={() => handleSeleccionar(opc)}
                  className={`w-full text-left px-4 py-2.5 flex items-center justify-between text-xs font-semibold border-b border-slate-50 dark:border-slate-850 last:border-0 transition-colors ${
                    esSeleccionado 
                      ? 'bg-sky-50 dark:bg-sky-950/20 text-sky-600 dark:text-sky-400' 
                      : esActivoTeclado
                        ? 'bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white'
                        : 'text-slate-700 dark:text-slate-250 hover:bg-slate-50 dark:hover:bg-slate-850'
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
                      <span className="text-[10px] bg-slate-100 dark:bg-slate-800 text-slate-550 dark:text-slate-400 px-2 py-0.5 rounded-md font-bold">
                        S/. {opc.precio.toFixed(2)}
                      </span>
                    )}
                    {esSeleccionado && <Check size={14} className="text-sky-600 dark:text-sky-400" />}
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
