import { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';

const CampoFormulario = ({
  label,
  type = 'text',
  value,
  onChange,
  placeholder,
  required = false,
  icon: Icono,
  disabled = false,
  id,
  name,
  className = ''
}) => {
  const [mostrarPassword, setMostrarPassword] = useState(false);

  const esPassword = type === 'password';
  const tipoInput = esPassword && mostrarPassword ? 'text' : type;

  return (
    <div className={`w-full ${className}`}>
      {label && (
        <label 
          htmlFor={id} 
          className="block text-xs font-semibold text-slate-650 dark:text-slate-300 mb-1.5 tracking-wide transition-colors"
        >
          {label}
        </label>
      )}
      <div className="relative">
        {Icono && (
          <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500 transition-colors">
            <Icono size={16} />
          </span>
        )}
        <input
          id={id}
          name={name}
          type={tipoInput}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          required={required}
          disabled={disabled}
          className={`w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 
            bg-slate-50 dark:bg-slate-800 text-slate-850 dark:text-slate-100 text-sm font-semibold 
            focus:ring-2 focus:ring-sky-100 dark:focus:ring-sky-950/30 focus:border-sky-400 dark:focus:border-sky-500 
            outline-none transition-all focus:bg-white dark:focus:bg-slate-900 disabled:opacity-60 
            ${esPassword ? 'pr-10' : ''}`}
        />
        {esPassword && (
          <button
            type="button"
            onClick={() => setMostrarPassword(!mostrarPassword)}
            disabled={disabled}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-650 dark:text-slate-500 dark:hover:text-slate-300 transition-colors"
          >
            {mostrarPassword ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>
        )}
      </div>
    </div>
  );
};

export default CampoFormulario;
