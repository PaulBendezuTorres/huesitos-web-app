import { Phone, Clock } from 'lucide-react';

const FormularioContacto = ({ form, onChange }) => {
  return (
    <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200/80 dark:border-slate-700/60 p-6 space-y-5">
      <h3 className="text-base font-bold text-slate-800 dark:text-slate-100 border-b border-slate-100 dark:border-slate-700 pb-3 flex items-center gap-2">
        <Phone size={18} className="text-sky-600 dark:text-sky-400" /> Operaciones y Contacto
      </h3>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-semibold text-slate-600 dark:text-slate-350 mb-1.5 uppercase tracking-wider">Teléfono Regular</label>
          <div className="relative">
            <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400">
              <Phone size={16} />
            </span>
            <input
              type="text"
              name="telefono"
              value={form.telefono || ''}
              onChange={onChange}
              required
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-white text-sm font-semibold focus:ring-2 outline-none transition-all bg-slate-50 dark:bg-slate-900 focus:bg-white dark:focus:bg-slate-800 focus:border-sky-500 focus:ring-sky-100"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-600 dark:text-slate-350 mb-1.5 uppercase tracking-wider">Celular Emergencias (24/7)</label>
          <div className="relative">
            <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400">
              <Phone size={16} />
            </span>
            <input
              type="text"
              name="telefonoEmergencia"
              value={form.telefonoEmergencia || ''}
              onChange={onChange}
              required
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-white text-sm font-semibold focus:ring-2 outline-none transition-all bg-slate-50 dark:bg-slate-900 focus:bg-white dark:focus:bg-slate-800 focus:border-sky-500 focus:ring-sky-100"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-600 dark:text-slate-350 mb-1.5 uppercase tracking-wider">Horario Semana</label>
          <div className="relative">
            <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400">
              <Clock size={16} />
            </span>
            <input
              type="text"
              name="horarioSemana"
              value={form.horarioSemana || ''}
              onChange={onChange}
              required
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-white text-sm font-semibold focus:ring-2 outline-none transition-all bg-slate-50 dark:bg-slate-900 focus:bg-white dark:focus:bg-slate-800 focus:border-sky-500 focus:ring-sky-100"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-600 dark:text-slate-350 mb-1.5 uppercase tracking-wider">Horario Domingo</label>
          <div className="relative">
            <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400">
              <Clock size={16} />
            </span>
            <input
              type="text"
              name="horarioDomingo"
              value={form.horarioDomingo || ''}
              onChange={onChange}
              required
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-white text-sm font-semibold focus:ring-2 outline-none transition-all bg-slate-50 dark:bg-slate-900 focus:bg-white dark:focus:bg-slate-800 focus:border-sky-500 focus:ring-sky-100"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default FormularioContacto;
