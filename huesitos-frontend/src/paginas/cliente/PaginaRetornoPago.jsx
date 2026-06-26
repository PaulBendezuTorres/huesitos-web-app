import { useSearchParams, useNavigate } from 'react-router-dom';
import { CheckCircle, XCircle, AlertCircle, ArrowLeft, Calendar } from 'lucide-react';

const PaginaRetornoPago = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const estado = searchParams.get('estado');
  const transaccionId = searchParams.get('transaccionId');
  const paymentId = searchParams.get('payment_id'); // ID que genera Mercado Pago

  const obtenerDetalles = () => {
    switch (estado) {
      case 'exito':
        return {
          titulo: '¡Pago Exitoso!',
          descripcion: 'El pago de tu cita veterinaria ha sido procesado y aprobado correctamente.',
          colorIcono: 'text-emerald-500 dark:text-emerald-400',
          bgIcono: 'bg-emerald-50 dark:bg-emerald-950/30',
          colorTexto: 'text-emerald-800 dark:text-emerald-300',
          borderColor: 'border-emerald-100 dark:border-emerald-900/30',
          bgColor: 'bg-emerald-50/30 dark:bg-emerald-950/10',
          icono: <CheckCircle size={48} className="text-emerald-500 dark:text-emerald-400" />,
        };
      case 'fallo':
        return {
          titulo: 'Pago Fallido',
          descripcion: 'Hubo un problema al procesar la transacción. Tu medio de pago no ha sido debitado.',
          colorIcono: 'text-rose-500 dark:text-rose-400',
          bgIcono: 'bg-rose-50 dark:bg-rose-950/30',
          colorTexto: 'text-rose-800 dark:text-rose-300',
          borderColor: 'border-rose-100 dark:border-rose-900/30',
          bgColor: 'bg-rose-50/30 dark:bg-rose-950/10',
          icono: <XCircle size={48} className="text-rose-500 dark:text-rose-400" />,
        };
      case 'pendiente':
      default:
        return {
          titulo: 'Pago Pendiente',
          descripcion: 'El pago se encuentra en proceso de validación. Te informaremos en tu panel cuando sea aprobado.',
          colorIcono: 'text-amber-500 dark:text-amber-400',
          bgIcono: 'bg-amber-50 dark:bg-amber-950/30',
          colorTexto: 'text-amber-800 dark:text-amber-300',
          borderColor: 'border-amber-100 dark:border-amber-900/30',
          bgColor: 'bg-amber-50/30 dark:bg-amber-950/10',
          icono: <AlertCircle size={48} className="text-amber-500 dark:text-amber-400" />,
        };
    }
  };

  const detalles = obtenerDetalles();

  return (
    <div className="w-full transition-colors duration-300">
      <div className={`w-full rounded-2xl border ${detalles.borderColor} ${detalles.bgColor} p-8 shadow-sm transition-all duration-300`}>
        <div className="flex flex-col md:flex-row items-start gap-6">
          <div className={`w-16 h-16 ${detalles.bgIcono} rounded-2xl flex items-center justify-center shrink-0`}>
            {detalles.icono}
          </div>
          <div className="space-y-4 w-full">
            <div>
              <h1 className="text-3xl font-extrabold text-slate-800 dark:text-slate-100 tracking-tight">
                {detalles.titulo}
              </h1>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                {detalles.descripcion}
              </p>
            </div>

            <div className="border-t border-slate-200/60 dark:border-slate-800 my-4" />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-slate-650 dark:text-slate-350">
              {transaccionId && (
                <div className="bg-white/60 dark:bg-slate-900/50 p-4 rounded-xl border border-slate-100 dark:border-slate-800">
                  <span className="block text-xs font-semibold text-slate-400 uppercase tracking-wider">
                    ID Transacción Huesitos
                  </span>
                  <span className="text-base font-bold text-slate-700 dark:text-slate-200">
                    #{transaccionId}
                  </span>
                </div>
              )}
              {paymentId && (
                <div className="bg-white/60 dark:bg-slate-900/50 p-4 rounded-xl border border-slate-100 dark:border-slate-800">
                  <span className="block text-xs font-semibold text-slate-400 uppercase tracking-wider">
                    ID Pago Mercado Pago
                  </span>
                  <span className="text-base font-bold text-slate-700 dark:text-slate-200">
                    {paymentId}
                  </span>
                </div>
              )}
            </div>

            <div className="pt-4 flex flex-wrap gap-4">
              <button
                onClick={() => navigate('/cliente/dashboard')}
                className="bg-slate-800 hover:bg-slate-900 dark:bg-slate-100 dark:hover:bg-slate-50 text-white dark:text-slate-900 px-5 py-2.5 rounded-xl font-semibold text-sm flex items-center gap-2 transition-all shadow-sm"
              >
                <ArrowLeft size={16} />
                <span>Volver al Inicio</span>
              </button>
              <button
                onClick={() => navigate('/cliente/citas')}
                className="bg-sky-500 hover:bg-sky-600 text-white px-5 py-2.5 rounded-xl font-semibold text-sm flex items-center gap-2 transition-all shadow-sm"
              >
                <Calendar size={16} />
                <span>Mis Citas</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaginaRetornoPago;
