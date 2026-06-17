import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PawPrint, Eye, Syringe, RefreshCw, Plus, Pencil, Trash2 } from 'lucide-react';
import useTableroCliente from '@/hooks/useTableroCliente';
import ModalEditarMascota from '@/componentes/cliente/ModalEditarMascota';
import ModalEliminarMascota from '@/componentes/cliente/ModalEliminarMascota';

const ClienteMascotas = () => {
  const navigate = useNavigate();
  const { mascotas, cargando, recargar, setMascotas } = useTableroCliente();

  const [mascotaEditando, setMascotaEditando] = useState(null);
  const [mascotaEliminando, setMascotaEliminando] = useState(null);

  const handleEdicionExito = (mascotaActualizada) => {
    setMascotas((prev) =>
      prev.map((m) => (m.id === mascotaActualizada.id ? mascotaActualizada : m))
    );
    setMascotaEditando(null);
  };

  const handleEliminacionExito = (mascotaId) => {
    setMascotas((prev) => prev.filter((m) => m.id !== mascotaId));
    setMascotaEliminando(null);
  };

  if (cargando) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-sky-500 border-t-transparent rounded-full animate-spin" />
          <span className="text-sm font-semibold text-slate-400 dark:text-slate-500">
            Cargando mascotas...
          </span>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100 tracking-tight transition-colors duration-300">
              Mis mascotas
            </h2>
            <p className="text-sm text-slate-450 dark:text-slate-500 mt-0.5 transition-colors duration-300">
              Gestiona la salud y el historial de tus compañeros
            </p>
          </div>
          {mascotas.length > 0 && (
            <div className="flex items-center gap-3 self-start sm:self-auto">
              <button
                onClick={recargar}
                className="flex items-center justify-center gap-2 px-4 py-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-sm font-semibold text-slate-500 dark:text-slate-400 hover:text-sky-600 dark:hover:text-sky-400 hover:border-sky-300 dark:hover:border-sky-500 hover:shadow-md hover:shadow-sky-500/10 transition-all duration-300"
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
          )}
        </div>

        {/* Grid de Mascotas */}
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
                  {/* Avatar */}
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
                      {mascota.pesoActual && (
                        <span className="inline-flex items-center px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-[11px] font-semibold text-slate-500 dark:text-slate-400 transition-colors duration-300">
                          {mascota.pesoActual} kg
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Acciones rápidas (editar y eliminar) */}
                  <div className="flex flex-col gap-1 shrink-0">
                    <button
                      onClick={() => setMascotaEditando(mascota)}
                      title="Editar mascota"
                      className="w-7 h-7 flex items-center justify-center rounded-lg bg-sky-50 dark:bg-sky-950/30 text-sky-500 dark:text-sky-400 hover:bg-sky-100 dark:hover:bg-sky-900/40 transition-all duration-200"
                    >
                      <Pencil size={13} />
                    </button>
                    <button
                      onClick={() => setMascotaEliminando(mascota)}
                      title="Eliminar mascota"
                      className="w-7 h-7 flex items-center justify-center rounded-lg bg-rose-50 dark:bg-rose-950/30 text-rose-400 dark:text-rose-400 hover:bg-rose-100 dark:hover:bg-rose-900/40 transition-all duration-200"
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                </div>

                {/* Acciones principales */}
                <div className="flex gap-2 mt-4 pt-4 border-t border-slate-100 dark:border-slate-850 transition-colors duration-300">
                  <button
                    onClick={() => navigate(`/cliente/mascota/${mascota.id}`)}
                    className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-xl bg-sky-50 dark:bg-sky-950/30 text-sky-600 dark:text-sky-400 text-xs font-bold hover:bg-sky-100 dark:hover:bg-sky-900/40 transition-all duration-200"
                  >
                    <Eye size={14} />
                    Ver historial
                  </button>
                  <button
                    onClick={() => navigate(`/cliente/mascota/${mascota.id}`)}
                    className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 text-slate-500 dark:text-slate-400 text-xs font-bold hover:bg-slate-100 dark:hover:bg-slate-700 transition-all duration-200 border border-slate-200/60 dark:border-slate-700"
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

      {/* Modales */}
      {mascotaEditando && (
        <ModalEditarMascota
          mascota={mascotaEditando}
          onCerrar={() => setMascotaEditando(null)}
          onExito={handleEdicionExito}
        />
      )}
      {mascotaEliminando && (
        <ModalEliminarMascota
          mascota={mascotaEliminando}
          onCerrar={() => setMascotaEliminando(null)}
          onExito={handleEliminacionExito}
        />
      )}
    </>
  );
};

export default ClienteMascotas;
