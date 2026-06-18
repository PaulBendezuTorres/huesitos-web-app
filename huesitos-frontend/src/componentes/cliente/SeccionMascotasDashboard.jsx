import { useNavigate } from 'react-router-dom';
import { Plus, PawPrint } from 'lucide-react';
import TarjetaMascota from './TarjetaMascota';

/**
 * SeccionMascotasDashboard
 * Muestra un resumen de las mascotas del cliente en el dashboard
 */
const SeccionMascotasDashboard = ({ mascotas, recargar }) => {
  const navigate = useNavigate();

  if (!mascotas || mascotas.length === 0) {
    return (
      <div className="bg-gradient-to-br from-sky-50 to-cyan-50 dark:from-slate-900/50 dark:to-slate-800/30 rounded-2xl border border-sky-200 dark:border-slate-700/50 p-8 text-center shadow-sm transition-all duration-300">
        <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-sky-100 dark:bg-sky-950/40 mb-4 transition-colors">
          <PawPrint size={28} className="text-sky-500 dark:text-sky-400" />
        </div>
        <h3 className="text-lg font-bold text-slate-800 dark:text-slate-200 mb-1 transition-colors">
          Aún no tienes mascotas registradas
        </h3>
        <p className="text-sm text-slate-500 dark:text-slate-400 mb-6 transition-colors">
          Comienza registrando a tu primer compañero peludo
        </p>
        <button
          onClick={() => navigate('/cliente/mascotas/nueva')}
          className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-gradient-to-r from-sky-500 to-cyan-500 hover:from-sky-600 hover:to-cyan-600 text-white rounded-xl text-sm font-bold transition-all duration-300 shadow-lg shadow-sky-500/20 hover:shadow-xl hover:shadow-sky-500/30"
        >
          <Plus size={16} />
          Registrar mi mascota
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between px-1">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <PawPrint size={24} className="text-sky-500 dark:text-sky-400" />
            <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100 tracking-tight transition-colors duration-300">
              Mis mascotas
            </h2>
          </div>
          <p className="text-sm text-slate-500 dark:text-slate-400 transition-colors duration-300">
            {mascotas.length} mascota{mascotas.length !== 1 ? 's' : ''} registrada{mascotas.length !== 1 ? 's' : ''}
          </p>
        </div>
        {mascotas.length > 0 && (
          <button
            onClick={() => navigate('/cliente/mascotas')}
            className="text-sm font-bold text-sky-600 dark:text-sky-400 hover:text-sky-700 dark:hover:text-sky-300 hover:underline transition-colors"
          >
            Ver todas →
          </button>
        )}
      </div>

      {/* Grid de mascotas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {mascotas.slice(0, 3).map((mascota) => (
          <TarjetaMascota
            key={mascota.id}
            mascota={mascota}
            onEditar={() => navigate(`/cliente/mascotas/${mascota.id}/editar`)}
            onEliminar={() => console.log('eliminar', mascota.id)}
          />
        ))}
      </div>

      {mascotas.length > 3 && (
        <button
          onClick={() => navigate('/cliente/mascotas')}
          className="w-full py-3 text-center text-sm font-semibold text-sky-600 dark:text-sky-400 border-2 border-sky-200 dark:border-sky-900/50 rounded-xl hover:bg-sky-50 dark:hover:bg-sky-950/30 hover:border-sky-400 dark:hover:border-sky-700 transition-all duration-300"
        >
          Ver {mascotas.length - 3} más...
        </button>
      )}
    </div>
  );
};

export default SeccionMascotasDashboard;
