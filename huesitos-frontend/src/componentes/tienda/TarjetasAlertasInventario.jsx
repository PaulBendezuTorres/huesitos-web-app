import { Package, AlertTriangle, Calendar } from 'lucide-react';

const TarjetasAlertasInventario = ({
  totalProductos,
  totalBajoStock,
  totalVencimientos,
  filtroAlerta,
  setFiltroAlerta
}) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      {/* Total Productos */}
      <div 
        onClick={() => setFiltroAlerta('TODOS')}
        className={`p-4 rounded-xl border transition-all duration-200 cursor-pointer ${
          filtroAlerta === 'TODOS'
            ? 'bg-sky-50/50 border-sky-200 shadow-sm'
            : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 hover:border-sky-200'
        }`}
      >
        <div className="flex justify-between items-center">
          <div>
            <span className="block text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
              Productos Activos
            </span>
            <span className="text-xl md:text-2xl font-bold text-slate-800 dark:text-slate-100 mt-0.5 block">
              {totalProductos}
            </span>
          </div>
          <div className="w-9 h-9 rounded-lg bg-sky-50 dark:bg-sky-950/40 text-sky-500 flex items-center justify-center shrink-0">
            <Package size={18} />
          </div>
        </div>
      </div>

      {/* Bajo Stock */}
      <div 
        onClick={() => setFiltroAlerta('BAJO_STOCK')}
        className={`p-4 rounded-xl border transition-all duration-200 cursor-pointer ${
          filtroAlerta === 'BAJO_STOCK'
            ? 'bg-amber-50/50 border-amber-250 shadow-sm'
            : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 hover:border-amber-200'
        }`}
      >
        <div className="flex justify-between items-center">
          <div>
            <span className="block text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
              Bajo Stock
            </span>
            <span className="text-xl md:text-2xl font-bold text-amber-600 mt-0.5 block">
              {totalBajoStock}
            </span>
          </div>
          <div className="w-9 h-9 rounded-lg bg-amber-50 dark:bg-amber-950/40 text-amber-500 flex items-center justify-center shrink-0">
            <AlertTriangle size={18} />
          </div>
        </div>
      </div>

      {/* Lotes próximos a vencer */}
      <div 
        onClick={() => setFiltroAlerta('VENCIMIENTOS')}
        className={`p-4 rounded-xl border transition-all duration-200 cursor-pointer ${
          filtroAlerta === 'VENCIMIENTOS'
            ? 'bg-rose-50/55 border-rose-250 shadow-sm'
            : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 hover:border-rose-250'
        }`}
      >
        <div className="flex justify-between items-center">
          <div>
            <span className="block text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
              Próximos a Vencer
            </span>
            <span className="text-xl md:text-2xl font-bold text-rose-600 mt-0.5 block">
              {totalVencimientos}
            </span>
          </div>
          <div className="w-9 h-9 rounded-lg bg-rose-50 dark:bg-rose-950/40 text-rose-500 flex items-center justify-center shrink-0">
            <Calendar size={18} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default TarjetasAlertasInventario;
