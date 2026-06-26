import { PawPrint, Eye, Syringe, RefreshCw, Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { obtenerUrlImagen } from '@/servicios/imagenServicio';

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
          <p className="text-sm text-slate-450 dark:text-slate-500 mt-0.5 transition-colors duration-300">
            Gestiona la salud y el historial de tus compañeros
          </p>
        </div>
        {mascotas.length > 0 && (
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
        )}
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
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
          {mascotas.map((mascota) => (
            <TarjetaMascotaCliente
              key={mascota.id}
              mascota={mascota}
              onVerHistorial={() => navigate(`/cliente/mascota/${mascota.id}/historial`)}
              onVacunas={() => navigate(`/cliente/mascotas/${mascota.id}/vacunas`)}
            />
          ))}
        </div>
      )}
    </div>
  );
};

/**
 * TarjetaMascotaCliente
 * Componente de tarjeta individual con foto real, usado en /cliente/dashboard.
 */
const TarjetaMascotaCliente = ({ mascota, onVerHistorial, onVacunas }) => {
  const urlFoto = mascota.fotoUrl || mascota.foto_url || '';
  const tieneFoto = urlFoto && !urlFoto.includes('defecto-mascota');

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/60 dark:border-slate-800 shadow-sm hover:shadow-xl hover:shadow-sky-500/8 dark:hover:shadow-sky-500/5 hover:border-sky-200/80 dark:hover:border-sky-900/60 transition-all duration-300 group overflow-hidden flex flex-col">
      {/* Foto / Avatar */}
      <div className="relative w-full aspect-[4/3] bg-gradient-to-tr from-sky-100 to-cyan-50 dark:from-sky-950/60 dark:to-slate-900 overflow-hidden shrink-0">
        {tieneFoto ? (
          <img
            src={obtenerUrlImagen(urlFoto)}
            alt={mascota.nombre}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            onError={(e) => {
              e.currentTarget.style.display = 'none';
              const fallback = document.createElement('div');
              fallback.className = 'absolute inset-0 flex items-center justify-center';
              fallback.innerHTML = `<span className="text-5xl font-black text-sky-400/60 dark:text-sky-500/40 select-none">${mascota.nombre ? mascota.nombre.charAt(0).toUpperCase() : '🐾'}</span>`;
              e.currentTarget.parentNode.insertBefore(fallback, e.currentTarget.nextSibling);
            }}
          />
        ) : null}

        {/* Fallback inicial */}
        <div className="absolute inset-0 flex items-center justify-center" style={{ display: tieneFoto ? 'none' : 'flex' }}>
          <span className="text-5xl font-black text-sky-400/60 dark:text-sky-500/40 select-none">
            {mascota.nombre ? mascota.nombre.charAt(0).toUpperCase() : '🐾'}
          </span>
        </div>

        {/* Badge peso */}
        {mascota.pesoActual && (
          <div className="absolute bottom-2.5 left-2.5">
            <span className="inline-flex items-center px-2 py-0.5 rounded-lg bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm text-[11px] font-bold text-slate-600 dark:text-slate-300 shadow-sm">
              {mascota.pesoActual} kg
            </span>
          </div>
        )}

        {/* Botones flotantes (ver historial) */}
        <div className="absolute top-2.5 right-2.5 flex gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          <button onClick={onVerHistorial} title="Ver historial" className="w-7 h-7 flex items-center justify-center rounded-lg bg-white/90 dark:bg-slate-800/90 text-sky-500 hover:bg-white dark:hover:bg-slate-700 shadow-md transition-all duration-150 backdrop-blur-sm">
            <Eye size={13} />
          </button>
        </div>
      </div>

      {/* Info + acciones */}
      <div className="p-4 flex flex-col flex-1">
        <div className="mb-3">
          <h4 className="text-base font-bold text-slate-800 dark:text-slate-100 truncate">{mascota.nombre}</h4>
          <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">
            {mascota.especie}{mascota.raza ? ` · ${mascota.raza}` : ''}
          </p>
        </div>

        <div className="flex gap-2 mt-auto">
          <button onClick={onVerHistorial} className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-sky-50 dark:bg-sky-950/30 text-sky-600 dark:text-sky-400 text-xs font-bold hover:bg-sky-100 dark:hover:bg-sky-900/40 transition-all duration-200">
            <Eye size={13} /> Ver historial
          </button>
          <button onClick={onVacunas} className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 text-slate-500 dark:text-slate-400 text-xs font-bold hover:bg-slate-100 dark:hover:bg-slate-700 transition-all duration-200 border border-slate-200/60 dark:border-slate-700">
            <Syringe size={13} /> Vacunas
          </button>
        </div>
      </div>
    </div>
  );
};

export default TarjetasMascotasCliente;
