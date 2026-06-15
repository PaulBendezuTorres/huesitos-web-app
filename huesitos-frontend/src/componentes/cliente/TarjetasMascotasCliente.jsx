import { PawPrint, Eye, Syringe, RefreshCw, Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const TarjetasMascotasCliente = ({ mascotas, recargar }) => {
  const navigate = useNavigate();

  return (
    <div className="space-y-6">
      {/* HEADER CON REFRESH Y NUEVA MASCOTA */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100 tracking-tight transition-colors duration-300">
            Mis mascotas
          </h2>
          <p className="text-sm text-slate-400 dark:text-slate-500 mt-0.5 transition-colors duration-300">
            Gestiona la salud de tus compañeros
          </p>
        </div>
        <div className="flex items-center gap-3 self-start sm:self-auto">
          <button
            onClick={recargar}
            className="flex items-center justify-center gap-2 px-4 py-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-sm font-semibold text-slate-500 dark:text-slate-400 hover:text-sky-600 dark:hover:text-sky-400 hover:border-sky-300 dark:hover:border-sky-500 hover:shadow-md hover:shadow-sky-500/10 dark:hover:shadow-sky-500/5 transition-all duration-300"
          >
            <RefreshCw size={16} />
            Actualizar
          </button>
          <button
            onClick={() => navigate('/cliente/mascotas/nueva')}
            className="flex items-center justify-center gap-2 px-4 py-2.5 bg-gradient-to-r from-sky-500 to-cyan-500 hover:from-sky-600 hover:to-cyan-600 text-white rounded-xl text-sm font-bold transition-all duration-300 shadow-md shadow-sky-500/10"
          >
            <Plus size={16} />
            Registrar mascota
          </button>
        </div>
      </div>

      {/* GRID DE MASCOTAS */}
      {mascotas.length === 0 ? (
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
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          {mascotas.map((mascota) => (
            <div
              key={mascota.id}
              className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/60 dark:border-slate-850 p-5 shadow-sm hover:shadow-lg hover:shadow-sky-500/8 dark:hover:shadow-sky-500/5 hover:border-sky-200 dark:hover:border-sky-900/60 transition-all duration-300 group"
            >
              <div className="flex items-start gap-4">
                {/* Avatar de mascota */}
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-sky-500 to-cyan-400 flex items-center justify-center text-white text-xl font-bold shadow-lg shadow-sky-500/20 shrink-0 group-hover:scale-105 transition-transform duration-300">
                  {mascota.nombre ? mascota.nombre.charAt(0).toUpperCase() : '🐾'}
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="text-base font-bold text-slate-800 dark:text-slate-200 truncate transition-colors duration-300">
                    {mascota.nombre}
                  </h4>
                  <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5 transition-colors duration-300">
                    {mascota.especie}{mascota.raza ? ` · ${mascota.raza}` : ''}
                  </p>
                  <div className="flex items-center gap-2 mt-2 flex-wrap">
                    {mascota.edad && (
                      <span className="inline-flex items-center px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-[11px] font-semibold text-slate-500 dark:text-slate-400 transition-colors duration-300">
                        {mascota.edad}
                      </span>
                    )}
                    {mascota.peso && (
                      <span className="inline-flex items-center px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-[11px] font-semibold text-slate-500 dark:text-slate-400 transition-colors duration-300">
                        {mascota.peso} kg
                      </span>
                    )}
                    {mascota.sexo && (
                      <span className="inline-flex items-center px-2 py-0.5 rounded-md bg-violet-50 dark:bg-violet-950/40 text-[11px] font-semibold text-violet-500 dark:text-violet-400 border border-violet-100 dark:border-violet-900/40 transition-colors duration-300">
                        {mascota.sexo}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Acciones */}
              <div className="flex gap-2 mt-4 pt-4 border-t border-slate-100 dark:border-slate-850 transition-colors duration-300">
                <button
                  onClick={() => navigate(`/cliente/mascota/${mascota.id}`)}
                  className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-sky-50 dark:bg-sky-950/30 text-sky-600 dark:text-sky-400 text-xs font-bold hover:bg-sky-100 dark:hover:bg-sky-900/40 transition-all duration-200"
                >
                  <Eye size={14} />
                  Ver historial
                </button>
                <button
                  onClick={() => navigate(`/cliente/mascota/${mascota.id}`)}
                  className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 text-slate-500 dark:text-slate-400 text-xs font-bold hover:bg-slate-100 dark:hover:bg-slate-700 transition-all duration-200 border border-slate-200/60 dark:border-slate-700"
                >
                  <Syringe size={14} />
                  Vacunas
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default TarjetasMascotasCliente;
