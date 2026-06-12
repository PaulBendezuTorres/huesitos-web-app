import { Loader2 } from 'lucide-react';

const Boton = ({ 
  children, 
  onClick, 
  variant = "secondary", // primary, secondary, danger, success
  primary = false, // compatibilidad hacia atrás
  size = "normal", 
  cargando = false,
  icono: Icono,
  className = "",
  type = "button",
  disabled,
  ...props 
}) => {
  // Ajustar variante basada en el prop primary heredado
  const varianteFinal = primary ? "primary" : variant;

  const tamaños = {
    small: "px-3.5 py-1.5 text-xs font-bold rounded-lg gap-1.5",
    normal: "px-5 py-2.5 text-sm font-bold rounded-xl gap-2",
    large: "px-6 py-3 text-base font-extrabold rounded-2xl gap-2.5",
  };

  const variantes = {
    primary: "bg-gradient-to-r from-sky-500 to-cyan-400 hover:from-sky-600 hover:to-cyan-500 text-white shadow-lg shadow-sky-500/20 border border-sky-400/20 active:scale-95",
    secondary: "bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 hover:border-slate-350 shadow-sm active:scale-95",
    danger: "bg-gradient-to-r from-red-500 to-rose-500 hover:from-red-600 hover:to-rose-600 text-white shadow-lg shadow-red-500/20 border border-red-400/20 active:scale-95",
    success: "bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white shadow-lg shadow-emerald-500/20 border border-emerald-400/20 active:scale-95",
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || cargando}
      className={`inline-flex items-center justify-center transition-all duration-200 outline-none select-none ${tamaños[size]} ${variantes[varianteFinal]} ${cargando || disabled ? 'opacity-50 cursor-not-allowed pointer-events-none' : ''} ${className}`}
      {...props}
    >
      {cargando && <Loader2 size={16} className="animate-spin" />}
      {!cargando && Icono && <Icono size={16} />}
      {children}
    </button>
  );
};

export default Boton;