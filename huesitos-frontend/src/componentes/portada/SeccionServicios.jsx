import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Stethoscope, Activity, Syringe, Microscope, Home, CheckCircle2 
} from 'lucide-react';

const SeccionServicios = ({
  fadeUp,
  config
}) => {
  const [categoriaActiva, setCategoriaActiva] = useState('consultas');

  return (
    <motion.section
      id="servicios"
      className="py-24 sm:py-32 bg-sky-100 dark:bg-oscuro-secundario border-y border-sky-200 dark:border-oscuro-borde/40 transition-colors duration-300"
      variants={fadeUp}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.1 }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        <div className="text-center space-y-6 max-w-3xl mx-auto animate-in fade-in duration-300">
          <h2 className="text-4xl font-black text-slate-900 dark:text-white transition-colors">
            Servicios Médicos y Tarifas
          </h2>
          <p className="text-lg text-slate-700 dark:text-slate-300 transition-colors">
            Catálogo de atenciones estructurado. Transparencia total en los costos.
          </p>
        </div>

        {/* Selector de Categorías */}
        <div className="flex flex-wrap justify-center gap-4 border-b border-slate-200 dark:border-oscuro-borde/40 pb-8">
          {[
            { id: 'consultas', nombre: 'Consultas Médicas', icono: <Stethoscope size={18}/> },
            { id: 'especialidades', nombre: 'Especialidades', icono: <Activity size={18}/> },
            { id: 'vacunas', nombre: 'Vacunas', icono: <Syringe size={18}/> },
            { id: 'laboratorio', nombre: 'Laboratorio e Imágenes', icono: <Microscope size={18}/> },
            { id: 'internamiento', nombre: 'Internamiento', icono: <Home size={18}/> },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setCategoriaActiva(tab.id)}
              className={`flex items-center gap-2 px-6 py-3 rounded-full font-semibold transition-all duration-300 ${
                categoriaActiva === tab.id 
                  ? 'bg-blue-600 dark:bg-sky-550 text-white shadow-lg shadow-blue-500/30' 
                  : 'bg-white dark:bg-oscuro-tarjeta text-slate-655 dark:text-slate-300 border border-slate-200 dark:border-oscuro-borde/40 hover:bg-slate-100 dark:hover:bg-oscuro-borde/30'
              }`}
            >
              {tab.icono}
              {tab.nombre}
            </button>
          ))}
        </div>

        {/* Tablas de Contenido */}
        <div className="bg-white dark:bg-oscuro-tarjeta rounded-3xl shadow-sm border border-slate-100 dark:border-oscuro-borde/30 overflow-hidden min-h-[400px] transition-colors duration-200">
          <div className="p-8 md:p-12">
            
            {/* TAB: Consultas */}
            {categoriaActiva === 'consultas' && (
              <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="grid md:grid-cols-2 gap-8 items-center mb-6">
                  <p className="text-slate-655 dark:text-slate-300 leading-relaxed transition-colors">
                    Las consultas médicas nos ayudan a monitorear el estado de salud de tu mascota y detectar cualquier malestar o enfermedad. Nuestro equipo veterinario le brindará la atención oportuna para facilitar su recuperación.
                  </p>
                  <div className="bg-slate-50 dark:bg-oscuro-base p-5 rounded-2xl text-xs text-slate-550 dark:text-slate-400 space-y-2 border border-slate-100 dark:border-oscuro-borde/30 transition-colors">
                    <p><strong>Urgencia:</strong> Atención no programada el mismo día por signos clínicos agudos que generan malestar.</p>
                    <p><strong>Emergencia:</strong> Situación médica crítica e inmediata que representa un riesgo grave e inminente para la vida de la mascota.</p>
                  </div>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="border-b border-slate-200 dark:border-oscuro-borde text-slate-400 dark:text-slate-455 text-xs uppercase tracking-wider">
                        <th className="py-4 font-bold">Tipo de Consulta</th>
                        <th className="py-4 font-bold text-right">Precio Regular</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-oscuro-borde/50 text-slate-700 dark:text-slate-300 font-medium">
                      <tr className="hover:bg-slate-50/50 dark:hover:bg-oscuro-borde/25 transition-colors">
                        <td className="py-4">Consulta general</td>
                        <td className="py-4 text-right text-slate-900 dark:text-white">S/ 80.00</td>
                      </tr>
                      <tr className="hover:bg-slate-50/50 dark:hover:bg-oscuro-borde/25 transition-colors">
                        <td className="py-4">Consulta general - Medicina felina</td>
                        <td className="py-4 text-right text-slate-900 dark:text-white">S/ 100.00</td>
                      </tr>
                      <tr className="hover:bg-slate-50/50 dark:hover:bg-oscuro-borde/25 transition-colors">
                        <td className="py-4 text-amber-600 dark:text-amber-400">Consulta de urgencia</td>
                        <td className="py-4 text-right text-amber-600 dark:text-amber-400 font-semibold">S/ 120.00</td>
                      </tr>
                      <tr className="hover:bg-slate-50/50 dark:hover:bg-oscuro-borde/25 transition-colors">
                        <td className="py-4">Consulta a domicilio</td>
                        <td className="py-4 text-right text-slate-900 dark:text-white">S/ 150.00</td>
                      </tr>
                      <tr className="hover:bg-slate-50/50 dark:hover:bg-oscuro-borde/25 transition-colors">
                        <td className="py-4 text-red-650 dark:text-red-400 font-bold">Consulta de emergencia</td>
                        <td className="py-4 text-right text-red-650 dark:text-red-400 font-bold">S/ 160.00</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* TAB: Especialidades */}
            {categoriaActiva === 'especialidades' && (
              <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <p className="text-slate-655 dark:text-slate-300 transition-colors">
                  Contamos con los mejores especialistas en diversas ramas de la medicina veterinaria. La medicina especializada facilita encontrar el diagnóstico específico y efectivo para condiciones médicas complejas.
                </p>
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="border-b border-slate-200 dark:border-oscuro-borde text-slate-400 dark:text-slate-455 text-xs uppercase tracking-wider">
                        <th className="py-4 font-bold">Especialidad Clínica</th>
                        <th className="py-4 font-bold text-right">Precio Regular</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-oscuro-borde/50 text-slate-700 dark:text-slate-300 font-medium">
                      {['Cardiología', 'Dermatología', 'Cirugía', 'Oncología', 'Endocrinología', 'Neurología'].map(e => (
                        <tr key={e} className="hover:bg-slate-50/50 dark:hover:bg-oscuro-borde/25 transition-colors">
                          <td className="py-3.5">Consulta de {e}</td>
                          <td className="py-3.5 text-right text-slate-900 dark:text-white">S/ 250.00</td>
                        </tr>
                      ))}
                      <tr className="hover:bg-slate-50/50 dark:hover:bg-oscuro-borde/25 transition-colors">
                        <td className="py-3.5">Consulta de Nutrición</td>
                        <td className="py-3.5 text-right text-slate-900 dark:text-white">S/ 335.00</td>
                      </tr>
                      <tr className="hover:bg-slate-50/50 dark:hover:bg-oscuro-borde/25 transition-colors">
                        <td className="py-3.5">Consulta de Medicina Física / Fisioterapia</td>
                        <td className="py-3.5 text-right text-slate-900 dark:text-white">S/ 175.00</td>
                      </tr>
                      <tr className="hover:bg-slate-50/50 dark:hover:bg-oscuro-borde/25 transition-colors">
                        <td className="py-3.5">Consulta de Traumatología y Ortopedia</td>
                        <td className="py-3.5 text-right text-slate-900 dark:text-white">S/ 275.00</td>
                      </tr>
                      <tr className="hover:bg-slate-50/50 dark:hover:bg-oscuro-borde/25 transition-colors">
                        <td className="py-3.5">Consulta de Oftalmología</td>
                        <td className="py-3.5 text-right text-slate-900 dark:text-white">S/ 300.00</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* TAB: Vacunas */}
            {categoriaActiva === 'vacunas' && (
              <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <p className="text-slate-655 dark:text-slate-300 transition-colors">
                  Las vacunas son fundamentales como parte de la atención preventiva integral. Nos ayudan a evitar complicaciones en las enfermedades más peligrosas. Diseñamos un plan personalizado según el entorno de tu engreído.
                </p>
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="border-b border-slate-200 dark:border-oscuro-borde text-slate-400 dark:text-slate-455 text-xs uppercase tracking-wider">
                        <th className="py-4 font-bold">Vacuna</th>
                        <th className="py-4 font-bold text-right">Precio Regular</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-oscuro-borde/50 text-slate-700 dark:text-slate-300 font-medium">
                      <tr className="hover:bg-slate-50/50 dark:hover:bg-oscuro-borde/25 transition-colors"><td className="py-3.5">Vacuna Antirrábica</td><td className="py-3.5 text-right text-slate-900 dark:text-white">S/ 50.00</td></tr>
                      <tr className="hover:bg-slate-50/50 dark:hover:bg-oscuro-borde/25 transition-colors"><td className="py-3.5">Vacuna Quíntuple</td><td className="py-3.5 text-right text-slate-900 dark:text-white">S/ 100.00</td></tr>
                      <tr className="hover:bg-slate-50/50 dark:hover:bg-oscuro-borde/25 transition-colors"><td className="py-3.5">Vacuna Triple Felina</td><td className="py-3.5 text-right text-slate-900 dark:text-white">S/ 90.00</td></tr>
                      <tr className="hover:bg-slate-50/50 dark:hover:bg-oscuro-borde/25 transition-colors"><td className="py-3.5">Vacuna Leptospirosis</td><td className="py-3.5 text-right text-slate-900 dark:text-white">S/ 45.00</td></tr>
                      <tr className="hover:bg-slate-50/50 dark:hover:bg-oscuro-borde/25 transition-colors"><td className="py-3.5">Vacuna Puppy DP</td><td className="py-3.5 text-right text-slate-900 dark:text-white">S/ 60.00</td></tr>
                      <tr className="hover:bg-slate-50/50 dark:hover:bg-oscuro-borde/25 transition-colors"><td className="py-3.5">Vacuna Cuádruple</td><td className="py-3.5 text-right text-slate-900 dark:text-white">S/ 70.00</td></tr>
                      <tr className="hover:bg-slate-50/50 dark:hover:bg-oscuro-borde/25 transition-colors"><td className="py-3.5">Vacuna Leucemia Felina</td><td className="py-3.5 text-right text-slate-900 dark:text-white">S/ 90.00</td></tr>
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* TAB: Laboratorio */}
            {categoriaActiva === 'laboratorio' && (
              <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="grid md:grid-cols-2 gap-12">
                  <div className="space-y-4">
                    <h4 className="text-xl font-bold text-slate-900 dark:text-white transition-colors">Análisis Clínicos</h4>
                    <p className="text-slate-655 dark:text-slate-350 text-sm transition-colors">
                      Esenciales para detectar enfermedades y sus causas. Equipos propios automatizados para resultados veloces.
                    </p>
                    <table className="w-full text-left border-collapse text-sm">
                      <thead>
                        <tr className="border-b border-slate-200 dark:border-oscuro-borde text-slate-400 dark:text-slate-455 uppercase text-xs">
                          <th className="py-2 font-bold">Tipo de Prueba</th>
                          <th className="py-2 font-bold text-right">Precio Regular</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 dark:divide-oscuro-borde/50 text-slate-700 dark:text-slate-300 font-medium">
                        <tr className="hover:bg-slate-50/50 dark:hover:bg-oscuro-borde/25 transition-colors">
                          <td className="py-3 text-sky-700 dark:text-sky-400">Chequeo Preventivo Integral*</td>
                          <td className="py-3 text-right text-sky-700 dark:text-sky-400 font-semibold">S/ 425.00</td>
                        </tr>
                        <tr className="hover:bg-slate-50/50 dark:hover:bg-oscuro-borde/25 transition-colors"><td className="py-3">Hemograma Completo</td><td className="py-3 text-right text-slate-900 dark:text-white">S/ 65.00</td></tr>
                        <tr className="hover:bg-slate-50/50 dark:hover:bg-oscuro-borde/25 transition-colors"><td className="py-3">Coprológico Completo</td><td className="py-3 text-right text-slate-900 dark:text-white">S/ 90.00</td></tr>
                        <tr className="hover:bg-slate-50/50 dark:hover:bg-oscuro-borde/25 transition-colors"><td className="py-3">Examen Completo de Orina</td><td className="py-3 text-right text-slate-900 dark:text-white">S/ 40.00</td></tr>
                        <tr className="hover:bg-slate-50/50 dark:hover:bg-oscuro-borde/25 transition-colors"><td className="py-3">Perfil Bioquímico Pre-Anestésico</td><td className="py-3 text-right text-slate-900 dark:text-white">S/ 320.00</td></tr>
                        <tr className="hover:bg-slate-50/50 dark:hover:bg-oscuro-borde/25 transition-colors"><td className="py-3">Perfil Bioquímico Diagnóstico</td><td className="py-3 text-right text-slate-900 dark:text-white">S/ 200.00</td></tr>
                        <tr className="hover:bg-slate-50/50 dark:hover:bg-oscuro-borde/25 transition-colors"><td className="py-3">Perfil Bioquímico Integral</td><td className="py-3 text-right text-slate-900 dark:text-white">S/ 270.00</td></tr>
                      </tbody>
                    </table>
                    <p className="text-xs text-slate-400 dark:text-slate-500 transition-colors">
                      *Incluye: 1 hemograma completo, 1 toma de rayos X, 1 examen coprológico y 1 prueba de descarte de parásitos.
                    </p>
                  </div>
                  
                  <div className="bg-oscuro-base text-white p-8 rounded-3xl border border-oscuro-borde/40 self-start space-y-6 shadow-xl transition-all">
                    <div>
                      <h4 className="text-lg font-bold flex items-center gap-2">
                        <Activity className="text-sky-400" size={20}/> Pruebas de Imagenología
                      </h4>
                      <p className="text-slate-400 text-sm mt-1">
                        Tecnología digital de alta definición para diagnósticos eficaces y no invasivos.
                      </p>
                    </div>
                    <ul className="space-y-3.5 text-sm text-slate-300 font-medium">
                      <li className="flex items-center gap-3"><CheckCircle2 className="text-sky-400" size={16}/> Radiografía digital de alta definición</li>
                      <li className="flex items-center gap-3"><CheckCircle2 className="text-sky-400" size={16}/> Ecografía abdominal</li>
                      <li className="flex items-center gap-3"><CheckCircle2 className="text-sky-400" size={16}/> Ecocardiografía</li>
                      <li className="flex items-center gap-3"><CheckCircle2 className="text-sky-400" size={16}/> Ecografía gestacional y torácica</li>
                      <li className="flex items-center gap-3"><CheckCircle2 className="text-sky-400" size={16}/> Endoscopía y colonoscopía</li>
                    </ul>
                  </div>
                </div>
              </div>
            )}

            {/* TAB: Internamiento */}
            {categoriaActiva === 'internamiento' && (
              <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <p className="text-slate-655 dark:text-slate-300 transition-colors">
                  Ofrecemos hospitalización con un equipo médico disponible las 24 horas, en espacios separados para perros y gatos para reducir el estrés de tu mascota durante su estancia de recuperación o post-procedimiento.
                </p>
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="border-b border-slate-200 dark:border-oscuro-borde text-slate-400 dark:text-slate-455 text-xs uppercase tracking-wider">
                        <th className="py-4 font-bold">Tipo de Internamiento</th>
                        <th className="py-4 font-bold text-right">Precio Regular</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-oscuro-borde/50 text-slate-700 dark:text-slate-300 font-medium">
                      <tr className="hover:bg-slate-50/50 dark:hover:bg-oscuro-borde/25 transition-colors">
                        <td className="py-4">Internamiento de Día (incluye fluidoterapia)</td>
                        <td className="py-4 text-right text-slate-900 dark:text-white">S/ 120.00</td>
                      </tr>
                      <tr className="hover:bg-slate-50/50 dark:hover:bg-oscuro-borde/25 transition-colors">
                        <td className="py-4">Internamiento Día Completo (incluye fluidoterapia)</td>
                        <td className="py-4 text-right text-slate-900 dark:text-white">S/ 200.00</td>
                      </tr>
                      <tr className="hover:bg-slate-50/50 dark:hover:bg-oscuro-borde/25 transition-colors">
                        <td className="py-4 text-purple-700 dark:text-purple-400 font-semibold">
                          Internamiento de Día (incluye fluidoterapia) - Paciente infeccioso*
                        </td>
                        <td className="py-4 text-right text-purple-700 dark:text-purple-400 font-bold">S/ 170.00</td>
                      </tr>
                      <tr className="hover:bg-slate-50/50 dark:hover:bg-oscuro-borde/25 transition-colors">
                        <td className="py-4 text-purple-700 dark:text-purple-400 font-semibold">
                          Internamiento Día Completo (incluye fluidoterapia) - Paciente infeccioso*
                        </td>
                        <td className="py-4 text-right text-purple-700 dark:text-purple-400 font-bold">S/ 250.00</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                <p className="text-xs text-slate-400 dark:text-slate-550 max-w-3xl leading-relaxed transition-colors">
                  *Se considera paciente infeccioso a todo aquel con diagnóstico confirmado o signos compatibles con enfermedades contagiosas, requiriendo un aislamiento diferenciado y estrictas medidas de bioseguridad.
                </p>
              </div>
            )}

          </div>
        </div>
      </div>
    </motion.section>
  );
};

export default SeccionServicios;
