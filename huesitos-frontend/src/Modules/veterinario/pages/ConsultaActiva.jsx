import { useState } from 'react';
import {
  ClipboardList,
  History,
  FileText,
  Paperclip,
  CheckCircle,
  Upload,
  Download,
  Stethoscope
} from 'lucide-react';
import MascotaHistorialTimeline from '../../../components/MascotaHistorialTimeline';

const ConsultaActiva = ({
  citaActiva,
  finalizarAtencion,
  consultaForm,
  setConsultaForm,
  recetaForm,
  setRecetaForm,
  recetaGuardada,
  archivoForm,
  setArchivoForm,
  selectedFile,
  setSelectedFile,
  subiendoArchivo,
  archivosMascota,
  handleGuardarReceta,
  handleSubirArchivo,
  setVistaActual
}) => {
  const [pestanaActiva, setPestanaActiva] = useState('diagnostico');

  if (!citaActiva) {
    return (
      <div className="bg-white p-12 rounded-3xl border border-slate-200/60 shadow-sm text-center max-w-2xl mx-auto space-y-4">
        <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto text-slate-400">
          <Stethoscope size={30} />
        </div>
        <h3 className="text-lg font-bold text-slate-800 tracking-tight">Ficha clínica inactiva</h3>
        <p className="text-xs text-slate-400 max-w-md mx-auto">
          No hay ninguna atención médica activa en este momento. Por favor ve a la pestaña **Agenda del día** y selecciona un paciente para iniciar su diagnóstico.
        </p>
        <button 
          onClick={() => setVistaActual('agenda')}
          className="bg-emerald-500 hover:bg-emerald-600 text-white px-5 py-2.5 rounded-xl font-semibold text-xs shadow-md transition-all inline-block"
        >
          Ver agenda del día
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Cabecera del Paciente Activo */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200/60 shadow-sm flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center text-white text-xl font-bold shadow-md shadow-emerald-500/10">
            {citaActiva.mascota.nombre.charAt(0)}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-xl font-bold text-slate-850 tracking-tight">
                {citaActiva.mascota.nombre}
              </h3>
              <span className="text-[10px] bg-slate-100 border border-slate-200 px-2 py-0.5 rounded-md font-semibold text-slate-650">
                {citaActiva.mascota.especie} {citaActiva.mascota.raza ? `- ${citaActiva.mascota.raza}` : ''}
              </span>
            </div>
            <p className="text-xs text-slate-500 font-medium mt-1">
              Propietario: <span className="font-bold text-slate-700">{citaActiva.mascota.dueno ? citaActiva.mascota.dueno.nombreCompleto : 'Cliente registrado'}</span>
            </p>
          </div>
        </div>

        <div className="flex gap-2">
          <button 
            onClick={finalizarAtencion}
            className="bg-emerald-500 hover:bg-emerald-600 text-white px-5 py-2.5 rounded-xl font-bold text-xs flex items-center gap-2 shadow-lg shadow-emerald-500/20 transition-all"
          >
            <CheckCircle size={16} /> Finalizar atención
          </button>
        </div>
      </div>

      {/* Sub-Navegación de Ficha */}
      <div className="bg-white px-6 rounded-t-3xl border-t border-x border-slate-200/60 flex gap-6 overflow-x-auto scrollbar-none">
        {[
          { id: 'diagnostico', label: 'Diagnóstico y consulta', icon: ClipboardList },
          { id: 'historial', label: 'Expediente histórico', icon: History },
          { id: 'receta', label: 'Prescribir receta', icon: FileText },
          { id: 'archivos', label: 'Subir archivos', icon: Paperclip }
        ].map(pestana => {
          const Icon = pestana.icon;
          const activa = pestanaActiva === pestana.id;
          return (
            <button
              key={pestana.id}
              onClick={() => setPestanaActiva(pestana.id)}
              className={`py-4 border-b-2 font-semibold text-xs flex items-center gap-2 transition-all shrink-0 ${
                activa 
                  ? 'border-emerald-500 text-emerald-600' 
                  : 'border-transparent text-slate-400 hover:text-slate-600'
              }`}
            >
              <Icon size={16} />
              {pestana.label}
            </button>
          );
        })}
      </div>

      {/* Contenedor de Vistas de Pestaña */}
      <div className="bg-white p-6 rounded-b-3xl border-b border-x border-slate-200/60 shadow-sm min-h-[400px]">
        {/* PESTAÑA: DIAGNÓSTICO */}
        {pestanaActiva === 'diagnostico' && (
          <div className="space-y-5 max-w-4xl">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-slate-50 p-4 rounded-xl border border-slate-200/60">
              <div>
                <span className="block text-[10px] font-semibold text-slate-500 mb-1">Motivo de cita</span>
                <p className="font-semibold text-slate-700 text-xs">{consultaForm.motivoConsulta}</p>
              </div>
              <div>
                <span className="block text-[10px] font-semibold text-slate-500 mb-1">Fisiológico</span>
                <p className="font-semibold text-slate-700 text-xs">Mascota: {citaActiva.mascota.nombre}</p>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-655 mb-1.5">
                  Síntomas presentados <span className="text-red-500">*</span>
                </label>
                <textarea
                  rows="2"
                  value={consultaForm.sintomas}
                  onChange={e => setConsultaForm({...consultaForm, sintomas: e.target.value})}
                  placeholder="Describe los síntomas observados..."
                  required
                  className="w-full border border-slate-300 p-3 rounded-xl text-slate-800 text-xs focus:ring-2 focus:ring-emerald-500 outline-none transition-all bg-slate-50 focus:bg-white"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-xs font-semibold text-slate-655 mb-1.5">
                    Diagnóstico médico <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    rows="4"
                    value={consultaForm.diagnostico}
                    onChange={e => setConsultaForm({...consultaForm, diagnostico: e.target.value})}
                    placeholder="Especifica el diagnóstico..."
                    required
                    className="w-full border border-slate-300 p-3 rounded-xl text-slate-800 text-xs focus:ring-2 focus:ring-emerald-500 outline-none transition-all bg-slate-50 focus:bg-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-655 mb-1.5">
                    Tratamiento recomendado <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    rows="4"
                    name="tratamiento"
                    value={consultaForm.tratamiento}
                    onChange={e => setConsultaForm({...consultaForm, tratamiento: e.target.value})}
                    placeholder="Medicinas, dosis y cuidados..."
                    required
                    className="w-full border border-slate-300 p-3 rounded-xl text-slate-800 text-xs focus:ring-2 focus:ring-emerald-500 outline-none transition-all bg-slate-50 focus:bg-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-655 mb-1.5">
                  Observaciones adicionales
                </label>
                <textarea
                  rows="2"
                  value={consultaForm.observaciones}
                  onChange={e => setConsultaForm({...consultaForm, observaciones: e.target.value})}
                  placeholder="Notas internas..."
                  className="w-full border border-slate-300 p-3 rounded-xl text-slate-800 text-xs focus:ring-2 focus:ring-emerald-500 outline-none transition-all bg-slate-50 focus:bg-white"
                />
              </div>
            </div>
          </div>
        )}

        {/* PESTAÑA: HISTORIAL ANTERIOR */}
        {pestanaActiva === 'historial' && (
          <div className="max-w-4xl">
            <MascotaHistorialTimeline mascotaId={citaActiva.mascota.id} mostrarCabecera={false} />
          </div>
        )}

        {/* PESTAÑA: RECETA */}
        {pestanaActiva === 'receta' && (
          <div className="max-w-3xl space-y-5">
            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
              <div>
                <h4 className="font-bold text-slate-800 text-sm">
                  Redacción de receta médica
                </h4>
                <p className="text-xs text-slate-400 mt-0.5">La receta se compilará en formato PDF para el cliente al finalizar.</p>
              </div>
              {recetaGuardada && (
                <span className="bg-emerald-50 text-emerald-600 border border-emerald-200 text-[10px] font-semibold px-2.5 py-1 rounded-lg flex items-center gap-1.5">
                  <CheckCircle size={12} /> Redactada y lista
                </span>
              )}
            </div>

            <form onSubmit={handleGuardarReceta} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-655 mb-1.5">
                  Medicamentos y dosis <span className="text-red-500">*</span>
                </label>
                <textarea
                  rows="4"
                  value={recetaForm.medicamentos}
                  onChange={e => setRecetaForm({...recetaForm, medicamentos: e.target.value})}
                  placeholder="Ej: Amoxicilina 250mg - 1 tableta cada 12 horas."
                  required
                  className="w-full border border-slate-300 p-3 rounded-xl text-slate-800 text-xs focus:ring-2 focus:ring-emerald-500 outline-none transition-all bg-slate-50 focus:bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-655 mb-1.5">
                  Indicaciones y duración <span className="text-red-500">*</span>
                </label>
                <textarea
                  rows="3"
                  value={recetaForm.indicaciones}
                  onChange={e => setRecetaForm({...recetaForm, indicaciones: e.target.value})}
                  placeholder="Ej: Vía oral con comida por 7 días. Control en una semana."
                  required
                  className="w-full border border-slate-300 p-3 rounded-xl text-slate-800 text-xs focus:ring-2 focus:ring-emerald-500 outline-none transition-all bg-slate-50 focus:bg-white"
                />
              </div>

              <div className="flex justify-end pt-2">
                <button
                  type="submit"
                  className="bg-slate-900 hover:bg-slate-800 text-white px-5 py-2.5 rounded-xl font-semibold text-xs shadow-md transition-colors"
                >
                  Guardar receta
                </button>
              </div>
            </form>
          </div>
        )}

        {/* PESTAÑA: SUBIR ARCHIVOS */}
        {pestanaActiva === 'archivos' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 max-w-5xl">
            {/* Formulario de carga */}
            <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200/60 space-y-4 h-fit">
              <h4 className="font-bold text-slate-850 text-xs mb-2 border-b border-slate-100 pb-2">
                Nuevo archivo clínico
              </h4>

              <form onSubmit={handleSubirArchivo} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-655 mb-1.5">Tipo de examen</label>
                  <select
                    value={archivoForm.tipoExamen}
                    onChange={e => setArchivoForm({...archivoForm, tipoExamen: e.target.value})}
                    className="w-full border border-slate-300 p-2.5 rounded-xl text-slate-800 text-xs font-semibold bg-white cursor-pointer"
                  >
                    <option value="LABORATORIO">Laboratorio</option>
                    <option value="ECOGRAFIA">Ecografía</option>
                    <option value="RAYOS_X">Rayos X</option>
                    <option value="OTROS">Otros</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-655 mb-1.5">Descripción del reporte</label>
                  <input
                    type="text"
                    value={archivoForm.descripcion}
                    onChange={e => setArchivoForm({...archivoForm, descripcion: e.target.value})}
                    placeholder="Ej: Hemograma completo 15/05/2026"
                    className="w-full border border-slate-300 p-2.5 rounded-xl text-slate-800 text-xs focus:ring-2 focus:ring-emerald-500 outline-none transition-all bg-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-655 mb-1.5">Seleccionar archivo (PDF, JPG, PNG)</label>
                  <div className="border-2 border-dashed border-slate-300 rounded-2xl p-6 flex flex-col items-center justify-center bg-white hover:bg-slate-50 transition-all cursor-pointer relative">
                    <input
                      type="file"
                      required
                      onChange={e => setSelectedFile(e.target.files[0])}
                      className="absolute inset-0 opacity-0 cursor-pointer"
                    />
                    <Upload className="text-slate-400 mb-2" size={24} />
                    <p className="text-xs text-slate-600 font-semibold">
                      {selectedFile ? selectedFile.name : 'Haz clic para subir o arrastra'}
                    </p>
                    <p className="text-[10px] text-slate-400 mt-1">Soporta PDF o Imágenes (Máx. 5MB)</p>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={subiendoArchivo}
                  className="w-full bg-emerald-500 hover:bg-emerald-600 text-white py-2.5 rounded-xl font-semibold text-xs shadow-md transition-colors disabled:opacity-50"
                >
                  {subiendoArchivo ? 'Subiendo...' : 'Subir archivo clínico'}
                </button>
              </form>
            </div>

            {/* Lista de archivos subidos */}
            <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200/60 flex flex-col min-h-[300px]">
              <h4 className="font-bold text-slate-850 text-xs mb-3 border-b border-slate-100 pb-2">
                Archivos clínicos de esta sesión
              </h4>
              
              <div className="flex-1 overflow-y-auto space-y-3">
                {archivosMascota.length === 0 ? (
                  <div className="text-center py-10 text-xs font-semibold text-slate-400">
                    No hay archivos subidos en esta consulta aún.
                  </div>
                ) : (
                  archivosMascota.map((archivo) => (
                    <div key={archivo.id} className="flex justify-between items-center p-3 rounded-xl border border-slate-200/60 bg-white">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-blue-50 text-blue-500 rounded-lg">
                          <FileText size={16} />
                        </div>
                        <div className="text-left">
                          <p className="text-xs font-semibold text-slate-850 truncate max-w-[180px]">{archivo.nombreOriginal}</p>
                          <p className="text-[9px] text-slate-400 font-medium">Examen: {archivo.tipoExamen}</p>
                        </div>
                      </div>
                      <a
                        href={`http://localhost:8080${archivo.rutaArchivo}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="bg-white border border-slate-200 hover:bg-slate-50 p-2 rounded-lg text-slate-500 transition-colors"
                      >
                        <Download size={14} />
                      </a>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ConsultaActiva;
