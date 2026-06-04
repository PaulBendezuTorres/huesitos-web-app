import { Calendar, Clock, CheckCircle } from 'lucide-react';

const VeterinarioAgenda = ({ citas, loadingCitas, iniciarConsulta, citaActivaId }) => {
  return (
    <div className="space-y-6">
      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div className="bg-white p-5 rounded-2xl border border-slate-200/60 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-500 flex items-center justify-center font-bold">
            <Calendar size={20} />
          </div>
          <div>
            <span className="block text-[10px] text-slate-400 font-bold uppercase">Citas Hoy</span>
            <span className="text-xl font-black text-slate-800">{citas.length}</span>
          </div>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-slate-200/60 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-500 flex items-center justify-center font-bold">
            <Clock size={20} />
          </div>
          <div>
            <span className="block text-[10px] text-slate-400 font-bold uppercase">En Espera (Check-in)</span>
            <span className="text-xl font-black text-slate-800">
              {citas.filter(c => c.estado === 'EN_ESPERA').length}
            </span>
          </div>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-slate-200/60 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-500 flex items-center justify-center font-bold">
            <CheckCircle size={20} />
          </div>
          <div>
            <span className="block text-[10px] text-slate-400 font-bold uppercase">Confirmadas</span>
            <span className="text-xl font-black text-slate-800">
              {citas.filter(c => c.estado === 'CONFIRMADA').length}
            </span>
          </div>
        </div>
      </div>

      {/* Listado de Pacientes */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200/60 shadow-sm">
        <h3 className="font-black text-slate-800 text-sm tracking-wide uppercase mb-4">Pacientes Agendados</h3>
        {loadingCitas ? (
          <div className="text-center py-10 text-xs font-bold text-slate-400 animate-pulse">
            Sincronizando agenda médica...
          </div>
        ) : citas.length === 0 ? (
          <div className="text-center py-12 space-y-3">
            <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto text-slate-400">
              <Calendar size={28} />
            </div>
            <h4 className="text-sm font-bold text-slate-700">No hay pacientes programados para hoy</h4>
            <p className="text-xs text-slate-400 max-w-xs mx-auto">
              Las citas aparecerán aquí a medida que los clientes reserven o cuando se registre su ingreso en caja (Check-In).
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {citas.map((cita) => {
              const esEnEspera = cita.estado === 'EN_ESPERA';
              const estaAtendiendo = citaActivaId === cita.id;
              return (
                <div 
                  key={cita.id} 
                  className={`p-5 rounded-2xl border transition-all duration-300 flex flex-col justify-between ${
                    estaAtendiendo
                      ? 'border-emerald-500 bg-emerald-50/10 shadow-md shadow-emerald-500/5'
                      : esEnEspera 
                        ? 'border-amber-200 bg-amber-50/20 hover:border-amber-300' 
                        : 'border-slate-205 hover:border-slate-300 hover:shadow-md hover:shadow-slate-500/5'
                  }`}
                >
                  <div>
                    <div className="flex justify-between items-start mb-3">
                      <h4 className="font-bold text-slate-800 text-sm tracking-tight">
                        {cita.mascota ? cita.mascota.nombre : 'Paciente'}
                      </h4>
                      <span className={`text-[9px] font-black px-2 py-0.5 rounded-full uppercase tracking-wider ${
                        esEnEspera 
                          ? 'bg-amber-100 text-amber-700' 
                          : 'bg-blue-100 text-blue-700'
                      }`}>
                        {esEnEspera ? 'En Espera' : 'Confirmada'}
                      </span>
                    </div>

                    <div className="space-y-1.5 text-xs text-slate-500 font-medium mb-4">
                      <p className="flex items-center gap-2">
                        <span className="text-[10px] text-slate-400 font-bold uppercase w-16">Especie:</span>
                        <span className="text-slate-700">{cita.mascota?.especie} {cita.mascota?.raza ? `(${cita.mascota.raza})` : ''}</span>
                      </p>
                      <p className="flex items-center gap-2">
                        <span className="text-[10px] text-slate-400 font-bold uppercase w-16">Servicio:</span>
                        <span className="text-slate-700">{cita.servicio ? cita.servicio.nombre : 'Consulta'}</span>
                      </p>
                      <p className="flex items-center gap-2">
                        <span className="text-[10px] text-slate-400 font-bold uppercase w-16">Hora:</span>
                        <span className="text-slate-700">
                          {new Date(cita.fechaHora).toLocaleTimeString('es-PE', { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </p>
                      <p className="flex items-center gap-2">
                        <span className="text-[10px] text-slate-400 font-bold uppercase w-16">Dueño:</span>
                        <span className="text-slate-700 truncate max-w-[140px]">{cita.mascota?.dueno ? cita.mascota.dueno.nombreCompleto : 'Cliente'}</span>
                      </p>
                    </div>
                  </div>

                  <button 
                    onClick={() => iniciarConsulta(cita)}
                    className={`w-full py-2.5 rounded-xl text-xs font-bold transition-all ${
                      estaAtendiendo
                        ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/20'
                        : esEnEspera 
                          ? 'bg-emerald-500 hover:bg-emerald-600 text-white shadow-lg shadow-emerald-500/20'
                          : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                    }`}
                  >
                    {estaAtendiendo ? 'Atendiendo...' : 'Iniciar Consulta'}
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default VeterinarioAgenda;
