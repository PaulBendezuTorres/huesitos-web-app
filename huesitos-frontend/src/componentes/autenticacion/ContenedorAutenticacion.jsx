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
    <div className="min-h-screen bg-slate-550 dark:bg-oscuro-base flex items-start md:items-center justify-center py-6 px-4 selection:bg-sky-500 selection:text-white font-sans transition-colors duration-200 relative">
      
      {/* Botón flotante para alternar tema */}
      <button
        onClick={alternarTema}
        type="button"
        className="absolute top-4 right-4 p-2.5 rounded-xl border border-slate-200 dark:border-oscuro-borde bg-white dark:bg-oscuro-tarjeta text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-oscuro-borde transition-all shadow-sm z-50"
        title={tema === 'claro' ? 'Cambiar a modo oscuro' : 'Cambiar a modo oscuro'}
      >
        {tema === 'claro' ? <Sun size={18} className="text-amber-500" /> : <Moon size={18} className="text-sky-300" />}
      </button>

      <div className="auth-card bg-white dark:bg-oscuro-secundario border border-slate-200 dark:border-oscuro-borde shadow-2xl dark:shadow-oscuro-base/40 transition-colors duration-200 animate-in fade-in duration-200">
        
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
        <div className="auth-right-panel bg-white dark:bg-oscuro-secundario transition-colors duration-200">
          {children}
        </div>
      </div>
    </div>
  );
};

export default ContenedorAutenticacion;
