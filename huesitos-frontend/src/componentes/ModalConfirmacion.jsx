import { AlertTriangle, Trash2, X } from 'lucide-react';

const ModalConfirmacion = ({
  isOpen,
  onClose,
  onConfirm,
  titulo = "Confirmar acción",
  mensaje = "¿Estás seguro de que deseas realizar esta acción?",
  textoConfirmar = "Confirmar",
  textoCancelar = "Cancelar",
  tipo = "danger" // danger, warning, info
}) => {
  if (!isOpen) return null;

  const colores = {
    danger: {
      icono: <Trash2 size={24} className="text-red-650 animate-bounce" />,
      fondoIcono: "bg-red-50/80 border border-red-100",
      botonConfirmar: "bg-gradient-to-r from-red-500 to-rose-500 hover:from-red-600 hover:to-rose-600 focus:ring-red-400 shadow-red-500/20",
    },
    warning: {
      icono: <AlertTriangle size={24} className="text-amber-600" />,
      fondoIcono: "bg-amber-50 border border-amber-100",
      botonConfirmar: "bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 focus:ring-amber-400 shadow-amber-500/20",
    },
    info: {
      icono: <AlertTriangle size={24} className="text-sky-600" />,
      fondoIcono: "bg-sky-50 border border-sky-100",
      botonConfirmar: "bg-gradient-to-r from-sky-500 to-cyan-500 hover:from-sky-600 hover:to-cyan-600 focus:ring-sky-400 shadow-sky-500/20",
    }
  };

  const estiloActual = colores[tipo] || colores.danger;

  return (
    <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center z-[150] p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 max-w-md w-full overflow-hidden animate-in zoom-in-95 duration-200">
        
        {/* Encabezado e Icono */}
        <div className="p-6 pb-4 flex gap-4 items-start relative">
          <button 
            onClick={onClose}
            className="absolute top-4 right-4 text-slate-400 hover:text-slate-650 p-1 rounded-lg hover:bg-slate-100 transition-all"
            aria-label="Cerrar modal"
          >
            <X size={18} />
          </button>

          <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 shadow-inner ${estiloActual.fondoIcono}`}>
            {estiloActual.icono}
          </div>

          <div className="space-y-1.5 pr-6">
            <h3 className="text-lg font-black text-slate-800 tracking-tight leading-none">
              {titulo}
            </h3>
            <p className="text-sm text-slate-500 leading-relaxed font-medium">
              {mensaje}
            </p>
          </div>
        </div>

        {/* Acciones */}
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4.5 py-2.5 rounded-xl text-xs sm:text-sm font-bold text-slate-500 hover:text-slate-700 bg-white border border-slate-200 hover:border-slate-350 hover:bg-slate-50 transition-all shadow-sm"
          >
            {textoCancelar}
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className={`px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold text-white shadow-lg focus:ring-2 focus:ring-offset-2 outline-none active:scale-95 transition-all ${estiloActual.botonConfirmar}`}
          >
            {textoConfirmar}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ModalConfirmacion;
