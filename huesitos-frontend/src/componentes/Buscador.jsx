import { Search } from 'lucide-react';

const Buscador = ({ value, onChange, placeholder = "Buscar..." }) => {
  return (
    <div className="bg-white p-4 rounded-2xl border border-slate-200/60 shadow-sm flex items-center gap-3 w-full">
      <div className="relative flex-1">
        <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400">
          <Search size={18} />
        </span>
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-slate-800 text-sm font-semibold focus:ring-2 focus:ring-sky-100 focus:border-sky-400 outline-none transition-all bg-slate-50 focus:bg-white"
        />
      </div>
      {value && (
        <button 
          type="button"
          onClick={() => onChange('')}
          className="text-xs font-bold text-slate-400 hover:text-slate-600 transition-colors px-3 py-2 hover:bg-slate-100 rounded-lg shrink-0"
        >
          Limpiar
        </button>
      )}
    </div>
  );
};

export default Buscador;
