import { useTema } from '@/contextos/ContextoTema';
import { Sun, Moon } from 'lucide-react';
import PanelIzquierdoAutenticacion from './PanelIzquierdoAutenticacion';

const ContenedorAutenticacion = ({
  children,
  badgeIcon,
  badgeText,
  titleMain,
  titleHighlight,
  description,
  chips = []
}) => {
  const { tema, alternarTema } = useTema();

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex items-start md:items-center justify-center py-6 px-4 selection:bg-sky-500 selection:text-white font-sans transition-colors duration-200 relative">
      
      {/* Botón flotante para alternar tema */}
      <button
        onClick={alternarTema}
        type="button"
        className="absolute top-4 right-4 p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all shadow-sm z-50"
        title={tema === 'claro' ? 'Cambiar a modo oscuro' : 'Cambiar a modo claro'}
      >
        {tema === 'claro' ? <Moon size={18} /> : <Sun size={18} />}
      </button>

      <div className="auth-card bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl dark:shadow-slate-950/40 transition-colors duration-200 animate-in fade-in duration-200">
        
        {/* ======================== PANEL IZQUIERDO ======================== */}
        <PanelIzquierdoAutenticacion
          badgeIcon={badgeIcon}
          badgeText={badgeText}
          titleMain={titleMain}
          titleHighlight={titleHighlight}
          description={description}
          chips={chips}
        />

        {/* ======================== PANEL DERECHO ======================== */}
        <div className="auth-right-panel bg-white dark:bg-slate-900 transition-colors duration-200">
          {children}
        </div>
      </div>
    </div>
  );
};

export default ContenedorAutenticacion;
