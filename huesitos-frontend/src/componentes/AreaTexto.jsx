import { FileText } from 'lucide-react';

const AreaTexto = ({
  value = "",
  onChange,
  limite = 250,
  placeholder = "Escribe descripción...",
  rows = 3,
  required = false,
  icon: Icono = FileText
}) => {
  const caracteresRestantes = limite - value.length;
  const porcentaje = (value.length / limite) * 100;

  const handleTextChange = (e) => {
    const text = e.target.value;
    if (text.length <= limite) {
      onChange(text);
    }
  };

  // Determinar colores del contador según el porcentaje de caracteres utilizados
  let colorContador = "text-slate-400";
  if (porcentaje >= 90) {
    colorContador = "text-red-500 font-bold";
  } else if (porcentaje >= 75) {
    colorContador = "text-amber-500 font-bold";
  }

  return (
    <div className="relative w-full">
      <div className="relative">
        {Icono && (
          <span className="absolute left-3.5 top-3.5 text-slate-400 pointer-events-none">
            <Icono size={16} />
          </span>
        )}
        <textarea
          value={value}
          onChange={handleTextChange}
          placeholder={placeholder}
          rows={rows}
          required={required}
          maxLength={limite}
          className={`w-full pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-600 text-slate-800 dark:text-slate-100 text-sm font-semibold focus:ring-2 focus:ring-sky-100 focus:border-sky-400 outline-none transition-all bg-slate-50 dark:bg-slate-700 focus:bg-white dark:focus:bg-slate-600 placeholder:text-slate-400 dark:placeholder:text-slate-500 resize-none ${
            Icono ? "pl-10" : "px-4"
          }`}
        />
      </div>
      
      {/* Contador de caracteres con barra de progreso micro-animada */}
      <div className="flex items-center justify-between mt-1 px-1">
        <div className="flex-1 mr-4 bg-slate-100 dark:bg-slate-700 h-1 rounded-full overflow-hidden">
          <div 
            className={`h-full transition-all duration-150 rounded-full ${
              porcentaje >= 90 ? 'bg-red-500' : porcentaje >= 75 ? 'bg-amber-400' : 'bg-sky-450'
            }`} 
            style={{ width: `${Math.min(porcentaje, 100)}%` }}
          />
        </div>
        <span className={`text-[10px] tracking-wider select-none shrink-0 ${colorContador}`}>
          {value.length} / {limite}
        </span>
      </div>
    </div>
  );
};

export default AreaTexto;
