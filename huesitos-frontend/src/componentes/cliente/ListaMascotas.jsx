import { useNavigate } from 'react-router-dom';
import { PawPrint, Plus, RefreshCw } from 'lucide-react';
import TarjetaMascota from './TarjetaMascota';

/**
 * ListaMascotas
 * Grid de tarjetas de mascotas del cliente.
 *
 * Props:
 *  - mascotas: Mascota[]
 *  - onRecargar: () => void
 *  - onEditar: (mascota) => void
 *  - onEliminar: (mascota) => void
 */
const ListaMascotas = ({ mascotas, onRecargar, onEditar, onEliminar }) => {
  const navigate = useNavigate();

  if (mascotas.length === 0) {
    return (
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/60 dark:border-slate-800 p-12 text-center shadow-sm transition-all duration-300">
        <div className="w-16 h-16 bg-sky-50 dark:bg-sky-950/40 rounded-2xl flex items-center justify-center mx-auto mb-4 transition-colors duration-300">
          <PawPrint size={28} className="text-sky-500 dark:text-sky-400" />
        </div>
        <h3 className="text-lg font-bold text-slate-700 dark:text-slate-200 mb-1 transition-colors duration-300">
          Aún no tienes mascotas registradas
        </h3>
        <p className="text-sm text-slate-400 dark:text-slate-500 mb-5 transition-colors duration-300">
          Comienza registrando a tu primer compañero peludo para gestionar su salud.
        </p>
        <button
          onClick={() => navigate('/cliente/mascotas/nueva')}
          className="mx-auto flex items-center justify-center gap-2 px-5 py-2.5 bg-gradient-to-r from-sky-500 to-cyan-500 hover:from-sky-600 hover:to-cyan-600 text-white rounded-xl text-sm font-bold transition-all duration-300 shadow-md shadow-sky-500/10"
        >
          <Plus size={16} />
          Registrar mi mascota
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      {/* Header del grid */}
      <div className="flex items-center justify-between">
        <p className="text-sm font-semibold text-slate-400 dark:text-slate-500">
          {mascotas.length} {mascotas.length === 1 ? 'mascota registrada' : 'mascotas registradas'}
        </p>
        <div className="flex gap-3">
          <button
            onClick={onRecargar}
            className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-sm font-semibold text-slate-500 dark:text-slate-400 hover:text-sky-600 dark:hover:text-sky-400 hover:border-sky-300 dark:hover:border-sky-500 hover:shadow-md hover:shadow-sky-500/10 transition-all duration-300"
          >
            <RefreshCw size={15} />
            Actualizar
          </button>
          <button
            onClick={() => navigate('/cliente/mascotas/nueva')}
            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-sky-500 to-cyan-500 hover:from-sky-600 hover:to-cyan-600 text-white rounded-xl text-sm font-bold transition-all duration-300 shadow-md shadow-sky-500/10"
          >
            <Plus size={15} />
            Registrar mascota
          </button>
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
        {mascotas.map((mascota) => (
          <TarjetaMascota
            key={mascota.id}
            mascota={mascota}
            onEditar={() => onEditar(mascota)}
            onEliminar={() => onEliminar(mascota)}
          />
        ))}
      </div>
    </div>
  );
};

export default ListaMascotas;
