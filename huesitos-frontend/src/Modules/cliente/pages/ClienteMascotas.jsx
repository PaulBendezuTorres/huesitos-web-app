import { useNavigate } from 'react-router-dom';
import { PawPrint, Eye, Syringe, RefreshCw } from 'lucide-react';
import useClienteDashboard from '../../../hooks/useClienteDashboard';

const ClienteMascotas = () => {
  const navigate = useNavigate();
  const { mascotas, cargando, recargar } = useClienteDashboard();

  if (cargando) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-sky-500 border-t-transparent rounded-full animate-spin" />
          <span className="text-sm font-semibold text-slate-400">Cargando mascotas...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-black text-slate-800 tracking-tight">Mis Mascotas</h2>
          <p className="text-sm text-slate-400 mt-0.5">Gestiona la salud y el historial de tus compañeros</p>
        </div>
        <button
          onClick={recargar}
          className="flex items-center gap-2 px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm font-semibold text-slate-500 hover:text-sky-600 hover:border-sky-300 hover:shadow-md hover:shadow-sky-500/10 transition-all duration-300"
        >
          <RefreshCw size={16} />
          Actualizar
        </button>
      </div>

      {/* Grid de Mascotas */}
      {mascotas.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200/60 p-12 text-center shadow-sm">
          <div className="w-16 h-16 bg-sky-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <PawPrint size={28} className="text-sky-400" />
          </div>
          <h3 className="text-lg font-bold text-slate-700 mb-1">Aún no tienes mascotas registradas</h3>
          <p className="text-sm text-slate-400">Visita la clínica para registrar a tu compañero peludo.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          {mascotas.map((mascota) => (
            <div
              key={mascota.id}
              className="bg-white rounded-2xl border border-slate-200/60 p-5 shadow-sm hover:shadow-lg hover:shadow-sky-500/8 hover:border-sky-200 transition-all duration-300 group"
            >
              <div className="flex items-start gap-4">
                {/* Avatar */}
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-sky-500 to-cyan-400 flex items-center justify-center text-white text-xl font-black shadow-lg shadow-sky-500/20 shrink-0 group-hover:scale-105 transition-transform duration-300">
                  {mascota.nombre ? mascota.nombre.charAt(0).toUpperCase() : '🐾'}
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="text-base font-bold text-slate-800 truncate">{mascota.nombre}</h4>
                  <p className="text-xs text-slate-400 mt-0.5">
                    {mascota.especie}{mascota.raza ? ` · ${mascota.raza}` : ''}
                  </p>
                  <div className="flex items-center gap-2 mt-2 flex-wrap">
                    {mascota.edad && (
                      <span className="inline-flex items-center px-2 py-0.5 rounded-md bg-slate-100 text-[11px] font-semibold text-slate-500">
                        {mascota.edad}
                      </span>
                    )}
                    {mascota.peso && (
                      <span className="inline-flex items-center px-2 py-0.5 rounded-md bg-slate-100 text-[11px] font-semibold text-slate-500">
                        {mascota.peso} kg
                      </span>
                    )}
                    {mascota.sexo && (
                      <span className="inline-flex items-center px-2 py-0.5 rounded-md bg-violet-50 text-[11px] font-semibold text-violet-500 border border-violet-100">
                        {mascota.sexo}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Acciones */}
              <div className="flex gap-2 mt-4 pt-4 border-t border-slate-100">
                <button
                  onClick={() => navigate(`/cliente/mascota/${mascota.id}`)}
                  className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-xl bg-sky-50 text-sky-600 text-xs font-bold hover:bg-sky-100 transition-colors duration-200"
                >
                  <Eye size={14} />
                  Ver Historial
                </button>
                <button
                  onClick={() => navigate(`/cliente/mascota/${mascota.id}`)}
                  className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-xl bg-slate-50 text-slate-500 text-xs font-bold hover:bg-slate-100 transition-colors duration-200 border border-slate-200/60"
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

export default ClienteMascotas;
