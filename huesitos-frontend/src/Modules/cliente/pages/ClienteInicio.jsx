import { Megaphone, PawPrint, Calendar, Stethoscope, Syringe, Eye, RefreshCw } from 'lucide-react';
import useClienteDashboard from '../../../hooks/useClienteDashboard';

const ClienteInicio = () => {
  const { mascotas, citas, campanas, cargando, recargar } = useClienteDashboard();

  const campanaActiva = campanas.length > 0 ? campanas[0] : null;

  // Filtrar citas pendientes/confirmadas (próximas)
  const citasProximas = citas.filter(
    (c) => c.estado === 'PENDIENTE' || c.estado === 'CONFIRMADA' || c.estado === 'EN_ESPERA'
  );

  const badgeEstado = (estado) => {
    const estilos = {
      PENDIENTE: 'bg-amber-100 text-amber-700 border-amber-200',
      CONFIRMADA: 'bg-emerald-100 text-emerald-700 border-emerald-200',
      EN_ESPERA: 'bg-sky-100 text-sky-700 border-sky-200',
      COMPLETADA: 'bg-slate-100 text-slate-500 border-slate-200',
      CANCELADA: 'bg-red-100 text-red-600 border-red-200',
    };
    return estilos[estado] || 'bg-slate-100 text-slate-500 border-slate-200';
  };

  if (cargando) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-sky-500 border-t-transparent rounded-full animate-spin" />
          <span className="text-sm font-semibold text-slate-400">Cargando tu panel...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* BANNER DE CAMPAÑA */}
      {campanaActiva && (
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-sky-600 via-cyan-500 to-emerald-400 p-6 shadow-xl shadow-sky-500/15">
          <div className="absolute -right-8 -top-8 w-40 h-40 bg-white/10 rounded-full blur-2xl" />
          <div className="absolute -left-4 -bottom-6 w-28 h-28 bg-white/10 rounded-full blur-xl" />
          <div className="relative z-10 flex items-center gap-4">
            <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center shrink-0">
              <Megaphone size={24} className="text-white" />
            </div>
            <div>
              <p className="text-[11px] font-bold text-white/70 uppercase tracking-widest mb-0.5">Campaña del Mes</p>
              <h3 className="text-lg font-black text-white leading-tight">{campanaActiva.titulo || campanaActiva.nombre}</h3>
              {campanaActiva.descripcion && (
                <p className="text-sm text-white/80 mt-1 max-w-xl">{campanaActiva.descripcion}</p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* HEADER CON REFRESH */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-black text-slate-800 tracking-tight">Mis Mascotas</h2>
          <p className="text-sm text-slate-400 mt-0.5">Gestiona la salud de tus compañeros</p>
        </div>
        <button
          onClick={recargar}
          className="flex items-center gap-2 px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm font-semibold text-slate-500 hover:text-sky-600 hover:border-sky-300 hover:shadow-md hover:shadow-sky-500/10 transition-all duration-300"
        >
          <RefreshCw size={16} />
          Actualizar
        </button>
      </div>

      {/* GRID DE MASCOTAS */}
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
                {/* Avatar de mascota */}
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
                <button className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-sky-50 text-sky-600 text-xs font-bold hover:bg-sky-100 transition-colors duration-200">
                  <Eye size={14} />
                  Ver Historial
                </button>
                <button className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-slate-50 text-slate-500 text-xs font-bold hover:bg-slate-100 transition-colors duration-200 border border-slate-200/60">
                  <Syringe size={14} />
                  Vacunas
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* PRÓXIMAS CITAS */}
      <div>
        <h2 className="text-2xl font-black text-slate-800 tracking-tight mb-1">Próximas Citas</h2>
        <p className="text-sm text-slate-400 mb-5">Tus citas agendadas y confirmadas</p>

        {citasProximas.length === 0 ? (
          <div className="bg-white rounded-2xl border border-slate-200/60 p-10 text-center shadow-sm">
            <div className="w-14 h-14 bg-emerald-50 rounded-2xl flex items-center justify-center mx-auto mb-3">
              <Calendar size={24} className="text-emerald-400" />
            </div>
            <h3 className="text-base font-bold text-slate-700 mb-1">No tienes citas pendientes</h3>
            <p className="text-sm text-slate-400">Agenda una cita desde el menú lateral.</p>
          </div>
        ) : (
          <div className="bg-white rounded-2xl border border-slate-200/60 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-slate-100">
                    <th className="text-left px-6 py-3.5 text-[11px] font-bold text-slate-400 uppercase tracking-wider">Fecha / Hora</th>
                    <th className="text-left px-6 py-3.5 text-[11px] font-bold text-slate-400 uppercase tracking-wider">Servicio</th>
                    <th className="text-left px-6 py-3.5 text-[11px] font-bold text-slate-400 uppercase tracking-wider">Mascota</th>
                    <th className="text-left px-6 py-3.5 text-[11px] font-bold text-slate-400 uppercase tracking-wider">Estado</th>
                  </tr>
                </thead>
                <tbody>
                  {citasProximas.map((cita) => {
                    const fecha = cita.fechaHora
                      ? new Date(cita.fechaHora).toLocaleDateString('es-PE', { day: '2-digit', month: 'short', year: 'numeric' })
                      : '—';
                    const hora = cita.fechaHora
                      ? new Date(cita.fechaHora).toLocaleTimeString('es-PE', { hour: '2-digit', minute: '2-digit' })
                      : '';

                    return (
                      <tr key={cita.id} className="border-b border-slate-50 last:border-0 hover:bg-slate-50/60 transition-colors">
                        <td className="px-6 py-4">
                          <p className="text-sm font-bold text-slate-700">{fecha}</p>
                          <p className="text-xs text-slate-400">{hora}</p>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <Stethoscope size={16} className="text-sky-400 shrink-0" />
                            <span className="text-sm font-semibold text-slate-600">{cita.servicio?.nombre || 'Consulta'}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className="text-sm text-slate-600">{cita.mascota?.nombre || '—'}</span>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`inline-flex items-center px-2.5 py-1 rounded-lg text-[11px] font-bold border ${badgeEstado(cita.estado)}`}>
                            {cita.estado}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ClienteInicio;
