import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Calendar,
  Clock,
  User,
  Users,
  Stethoscope,
  ClipboardList,
  History,
  FileText,
  Paperclip,
  CheckCircle,
  LogOut,
  Upload,
  Download,
  AlertTriangle
} from 'lucide-react';
import logo from '../assets/Logo Huesitos.png';
import {
  obtenerCitasAgenda,
  registrarConsultaMedica,
  registrarRecetaMedica,
  subirArchivoClinico
} from '../api/veterinarioAPI';
import MascotaHistorialTimeline from '../components/MascotaHistorialTimeline';

const VeterinarioDashboard = () => {
  const navigate = useNavigate();
  const [correo] = useState(localStorage.getItem('usuarioCorreo') || 'Veterinario');
  const [usuarioId] = useState(localStorage.getItem('usuarioId') || '');
  
  // Vista activa del panel principal
  const [vistaActual, setVistaActual] = useState('agenda'); // 'agenda', 'consulta', 'mascotas'

  // Lista de citas de la agenda
  const [citas, setCitas] = useState([]);
  const [loadingCitas, setLoadingCitas] = useState(true);
  
  // Cita y mascota cargada actualmente en la Ficha Activa
  const [citaActiva, setCitaActiva] = useState(null);
  
  // Pestaña activa del panel de consulta
  const [pestanaActiva, setPestanaActiva] = useState('diagnostico');
  
  // Estados de Formularios
  // 1. Consulta Médica
  const [consultaForm, setConsultaForm] = useState({
    motivoConsulta: '',
    sintomas: '',
    diagnostico: '',
    tratamiento: '',
    observaciones: ''
  });
  
  // 2. Receta Médica
  const [recetaForm, setRecetaForm] = useState({
    medicamentos: '',
    indicaciones: ''
  });
  const [recetaGuardada, setRecetaGuardada] = useState(null);
  
  // 3. Archivos Clínicos
  const [archivoForm, setArchivoForm] = useState({
    descripcion: '',
    tipoExamen: 'LABORATORIO'
  });
  const [selectedFile, setSelectedFile] = useState(null);
  const [subiendoArchivo, setSubiendoArchivo] = useState(false);
  const [archivosMascota, setArchivosMascota] = useState([]);
  
  // Carga de citas diarias al iniciar o actualizar
  const fetchCitas = async () => {
    setLoadingCitas(true);
    try {
      const hoyStr = new Date().toISOString().split('T')[0];
      const data = await obtenerCitasAgenda({
        inicio: hoyStr,
        fin: hoyStr
      });
      // Filtrar citas del veterinario actual o citas pendientes que aún no tienen veterinario
      // y que estén en estados: PENDIENTE, CONFIRMADA, EN_ESPERA
      const citasFiltradas = data.filter(c => 
        (c.veterinario === null || c.veterinario.id === parseInt(usuarioId)) &&
        c.estado !== 'COMPLETADA' && c.estado !== 'CANCELADA'
      );
      setCitas(citasFiltradas);
    } catch (error) {
      console.error("Error al obtener la agenda de citas:", error);
    } finally {
      setLoadingCitas(false);
    }
  };

  useEffect(() => {
    const rol = localStorage.getItem('usuarioRol');
    if (rol !== 'VETERINARIO' && rol !== 'ADMINISTRADOR') {
      navigate('/');
      return;
    }
    fetchCitas();
  }, [usuarioId, navigate]);

  // Manejar selección de cita para iniciar consulta
  const iniciarConsulta = async (cita) => {
    setCitaActiva(cita);
    setPestanaActiva('diagnostico');
    setRecetaGuardada(null);
    setConsultaForm({
      motivoConsulta: cita.servicio ? cita.servicio.nombre : 'Consulta General',
      sintomas: '',
      diagnostico: '',
      tratamiento: '',
      observaciones: ''
    });
    setRecetaForm({
      medicamentos: '',
      indicaciones: ''
    });
    setSelectedFile(null);
    setArchivoForm({
      descripcion: '',
      tipoExamen: 'LABORATORIO'
    });
    setArchivosMascota([]);
    setVistaActual('consulta'); // Redirigir a pestaña de consulta
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate('/');
  };

  // Guardar receta temporalmente
  const handleGuardarReceta = async (e) => {
    e.preventDefault();
    if (!recetaForm.medicamentos.trim() || !recetaForm.indicaciones.trim()) {
      alert("Por favor completa los medicamentos y las indicaciones.");
      return;
    }
    setRecetaGuardada({
      medicamentos: recetaForm.medicamentos,
      indicaciones: recetaForm.indicaciones
    });
    alert("Receta redactada correctamente. Se registrará al Finalizar la Consulta.");
  };

  // Subir archivo clínico
  const handleSubirArchivo = async (e) => {
    e.preventDefault();
    if (!selectedFile) {
      alert("Selecciona un archivo primero.");
      return;
    }
    setSubiendoArchivo(true);
    try {
      const formData = new FormData();
      formData.append('mascotaId', citaActiva.mascota.id);
      formData.append('tipoExamen', archivoForm.tipoExamen);
      formData.append('archivo', selectedFile);
      if (archivoForm.descripcion) {
        formData.append('descripcion', archivoForm.descripcion);
      }
      
      const archivoGuardado = await subirArchivoClinico(formData);
      setArchivosMascota(prev => [archivoGuardado, ...prev]);
      setSelectedFile(null);
      setArchivoForm(prev => ({ ...prev, descripcion: '' }));
      alert("Archivo clínico subido de manera exitosa.");
    } catch (error) {
      console.error(error);
      alert("No se pudo subir el archivo. Inténtalo nuevamente.");
    } finally {
      setSubiendoArchivo(false);
    }
  };

  // Guardar todo el registro clínico y completar la cita
  const finalizarAtencion = async () => {
    if (!consultaForm.sintomas.trim() || !consultaForm.diagnostico.trim() || !consultaForm.tratamiento.trim()) {
      alert("Por favor completa los campos obligatorios de Diagnóstico: Síntomas, Diagnóstico y Tratamiento.");
      return;
    }

    try {
      // 1. Guardar la consulta médica
      const consultaPayload = {
        fecha: new Date().toISOString(),
        motivoConsulta: consultaForm.motivoConsulta,
        sintomas: consultaForm.sintomas,
        diagnostico: consultaForm.diagnostico,
        tratamiento: consultaForm.tratamiento,
        observaciones: consultaForm.observaciones,
        mascota: { id: citaActiva.mascota.id },
        cita: { id: citaActiva.id },
        veterinario: { id: parseInt(usuarioId) }
      };

      const consultaGuardada = await registrarConsultaMedica(consultaPayload);
      
      // 2. Si se redactó una receta, guardarla asociada a la consulta recién creada
      if (recetaGuardada) {
        const recetaPayload = {
          medicamentos: recetaGuardada.medicamentos,
          indicaciones: recetaGuardada.indicaciones,
          consultaMedica: { id: consultaGuardada.id }
        };
        await registrarRecetaMedica(recetaPayload);
      }

      alert("Consulta clínica registrada y cita completada con éxito.");
      
      // Limpiar estados de la cita activa
      setCitaActiva(null);
      setRecetaGuardada(null);
      
      // Actualizar listado de citas
      fetchCitas();
      setVistaActual('agenda'); // Volver a la agenda
    } catch (error) {
      console.error(error);
      alert("Error al finalizar la atención médica: " + (error.response?.data || error.message));
    }
  };

  // Clases CSS para la navegación lateral
  const baseBtnClass = "w-full text-left px-4 py-3.5 rounded-xl font-semibold transition-all duration-300 flex items-center gap-4 text-sm tracking-wide group";
  const activeBtnClass = `${baseBtnClass} bg-gradient-to-r from-emerald-500 to-teal-400 text-white shadow-lg shadow-emerald-500/20 translate-x-1`;
  const inactiveBtnClass = `${baseBtnClass} text-slate-400 hover:bg-slate-800/50 hover:text-slate-100`;

  // Renderizador de Vistas Principales
  const renderizarVista = () => {
    switch (vistaActual) {
      case 'agenda':
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
                    return (
                      <div 
                        key={cita.id} 
                        className={`p-5 rounded-2xl border transition-all duration-300 flex flex-col justify-between ${
                          citaActiva?.id === cita.id
                            ? 'border-emerald-500 bg-emerald-50/10 shadow-md shadow-emerald-500/5'
                            : esEnEspera 
                              ? 'border-amber-200 bg-amber-50/20 hover:border-amber-300' 
                              : 'border-slate-250 hover:border-slate-300 hover:shadow-md hover:shadow-slate-500/5'
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
                            citaActiva?.id === cita.id
                              ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/20'
                              : esEnEspera 
                                ? 'bg-emerald-500 hover:bg-emerald-600 text-white shadow-lg shadow-emerald-500/20'
                                : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                          }`}
                        >
                          {citaActiva?.id === cita.id ? 'Atendiendo...' : 'Iniciar Consulta'}
                        </button>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        );
      
      case 'consulta':
        if (!citaActiva) {
          return (
            <div className="bg-white p-12 rounded-3xl border border-slate-200/60 shadow-sm text-center max-w-2xl mx-auto space-y-4">
              <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto text-slate-450">
                <Stethoscope size={30} />
              </div>
              <h3 className="text-lg font-black text-slate-800 tracking-tight">Ficha Clínica Inactiva</h3>
              <p className="text-xs text-slate-400 max-w-md mx-auto">
                No hay ninguna atención médica activa en este momento. Por favor ve a la pestaña **Agenda del Día** y selecciona un paciente para iniciar su diagnóstico.
              </p>
              <button 
                onClick={() => setVistaActual('agenda')}
                className="bg-emerald-500 hover:bg-emerald-600 text-white px-5 py-2.5 rounded-xl font-bold text-xs shadow-md transition-all inline-block"
              >
                Ver Agenda del Día
              </button>
            </div>
          );
        }
        return (
          <div className="space-y-6">
            {/* Cabecera del Paciente Activo */}
            <div className="bg-white p-6 rounded-3xl border border-slate-200/60 shadow-sm flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center text-white text-xl font-black shadow-md shadow-emerald-500/20">
                  {citaActiva.mascota.nombre.charAt(0)}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-xl font-black text-slate-800 tracking-tight">
                      {citaActiva.mascota.nombre}
                    </h3>
                    <span className="text-[10px] bg-slate-100 border border-slate-200 px-2 py-0.5 rounded-md font-bold text-slate-600">
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
                  <CheckCircle size={16} /> Finalizar Atención
                </button>
              </div>
            </div>

            {/* Sub-Navegación de Ficha */}
            <div className="bg-white px-6 rounded-t-3xl border-t border-x border-slate-250/60 flex gap-6 overflow-x-auto scrollbar-none">
              {[
                { id: 'diagnostico', label: 'Diagnóstico & Consulta', icon: ClipboardList },
                { id: 'historial', label: 'Expediente Histórico', icon: History },
                { id: 'receta', label: 'Prescribir Receta', icon: FileText },
                { id: 'archivos', label: 'Subir Archivos', icon: Paperclip }
              ].map(pestana => {
                const Icon = pestana.icon;
                const activa = pestanaActiva === pestana.id;
                return (
                  <button
                    key={pestana.id}
                    onClick={() => setPestanaActiva(pestana.id)}
                    className={`py-4 border-b-2 font-bold text-xs flex items-center gap-2 transition-all shrink-0 ${
                      activa 
                        ? 'border-emerald-500 text-emerald-600' 
                        : 'border-transparent text-slate-400 hover:text-slate-650'
                    }`}
                  >
                    <Icon size={16} />
                    {pestana.label}
                  </button>
                );
              })}
            </div>

            {/* Contenedor de Vistas de Pestaña */}
            <div className="bg-white p-6 rounded-b-3xl border-b border-x border-slate-250/60 shadow-sm min-h-[400px]">
              {/* PESTAÑA: DIAGNÓSTICO */}
              {pestanaActiva === 'diagnostico' && (
                <div className="space-y-5 max-w-4xl">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-slate-50 p-4 rounded-xl border border-slate-200/60">
                    <div>
                      <span className="block text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Motivo de Cita</span>
                      <p className="font-bold text-slate-800 text-xs">{consultaForm.motivoConsulta}</p>
                    </div>
                    <div>
                      <span className="block text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Fisiológico</span>
                      <p className="font-bold text-slate-800 text-xs">Mascota: {citaActiva.mascota.nombre}</p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-500 mb-1.5 uppercase tracking-wide">
                        Síntomas Presentados <span className="text-red-500">*</span>
                      </label>
                      <textarea
                        rows="2"
                        value={consultaForm.sintomas}
                        onChange={e => setConsultaForm({...consultaForm, sintomas: e.target.value})}
                        placeholder="Describe los síntomas observados..."
                        required
                        className="w-full border border-slate-355 p-3 rounded-xl text-slate-800 text-xs focus:ring-2 focus:ring-emerald-500 outline-none transition-all bg-slate-50 focus:bg-white"
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      <div>
                        <label className="block text-xs font-bold text-slate-500 mb-1.5 uppercase tracking-wide">
                          Diagnóstico Médico <span className="text-red-500">*</span>
                        </label>
                        <textarea
                          rows="4"
                          value={consultaForm.diagnostico}
                          onChange={e => setConsultaForm({...consultaForm, diagnostico: e.target.value})}
                          placeholder="Especifica el diagnóstico..."
                          required
                          className="w-full border border-slate-355 p-3 rounded-xl text-slate-800 text-xs focus:ring-2 focus:ring-emerald-500 outline-none transition-all bg-slate-50 focus:bg-white"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-slate-500 mb-1.5 uppercase tracking-wide">
                          Tratamiento Recomendado <span className="text-red-500">*</span>
                        </label>
                        <textarea
                          rows="4"
                          value={consultaForm.tratamiento}
                          onChange={e => setConsultaForm({...consultaForm, tratamiento: e.target.value})}
                          placeholder="Medicinas, dosis y cuidados..."
                          required
                          className="w-full border border-slate-355 p-3 rounded-xl text-slate-800 text-xs focus:ring-2 focus:ring-emerald-500 outline-none transition-all bg-slate-50 focus:bg-white"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-500 mb-1.5 uppercase tracking-wide">
                        Observaciones Adicionales
                      </label>
                      <textarea
                        rows="2"
                        value={consultaForm.observaciones}
                        onChange={e => setConsultaForm({...consultaForm, observaciones: e.target.value})}
                        placeholder="Notas internas..."
                        className="w-full border border-slate-355 p-3 rounded-xl text-slate-800 text-xs focus:ring-2 focus:ring-emerald-500 outline-none transition-all bg-slate-50 focus:bg-white"
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
                        Redacción de Receta Médica
                      </h4>
                      <p className="text-xs text-slate-400 mt-0.5">La receta se compilará en formato PDF para el cliente al finalizar.</p>
                    </div>
                    {recetaGuardada && (
                      <span className="bg-emerald-50 text-emerald-600 border border-emerald-200 text-[10px] font-black px-2.5 py-1 rounded-lg flex items-center gap-1.5">
                        <CheckCircle size={12} /> Redactada y Lista
                      </span>
                    )}
                  </div>

                  <form onSubmit={handleGuardarReceta} className="space-y-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-500 mb-1.5 uppercase tracking-wide">
                        Medicamentos y Dosis <span className="text-red-500">*</span>
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
                      <label className="block text-xs font-bold text-slate-500 mb-1.5 uppercase tracking-wide">
                        Indicaciones y Duración <span className="text-red-500">*</span>
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
                        className="bg-slate-900 hover:bg-slate-800 text-white px-5 py-2.5 rounded-xl font-bold text-xs shadow-md transition-colors"
                      >
                        Guardar Receta
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
                    <h4 className="font-black text-slate-800 text-xs uppercase tracking-wider mb-2 border-b border-slate-150 pb-2">
                      Nuevo Archivo Clínico
                    </h4>

                    <form onSubmit={handleSubirArchivo} className="space-y-4">
                      <div>
                        <label className="block text-xs font-bold text-slate-500 mb-1.5 uppercase tracking-wide">Tipo de Examen</label>
                        <select
                          value={archivoForm.tipoExamen}
                          onChange={e => setArchivoForm({...archivoForm, tipoExamen: e.target.value})}
                          className="w-full border border-slate-300 p-2.5 rounded-xl text-slate-800 text-xs font-bold bg-white cursor-pointer"
                        >
                          <option value="LABORATORIO">LABORATORIO</option>
                          <option value="ECOGRAFIA">ECOGRAFIA</option>
                          <option value="RAYOS_X">RAYOS_X</option>
                          <option value="OTROS">OTROS</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-500 mb-1.5 uppercase tracking-wide">Descripción del Reporte</label>
                        <input
                          type="text"
                          value={archivoForm.descripcion}
                          onChange={e => setArchivoForm({...archivoForm, descripcion: e.target.value})}
                          placeholder="Ej: Hemograma completo 15/05/2026"
                          className="w-full border border-slate-300 p-2.5 rounded-xl text-slate-800 text-xs focus:ring-2 focus:ring-emerald-500 outline-none transition-all bg-white"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-500 mb-1.5 uppercase tracking-wide">Seleccionar Archivo (PDF, JPG, PNG)</label>
                        <div className="border-2 border-dashed border-slate-300 rounded-2xl p-6 flex flex-col items-center justify-center bg-white hover:bg-slate-50 transition-all cursor-pointer relative">
                          <input
                            type="file"
                            required
                            onChange={e => setSelectedFile(e.target.files[0])}
                            className="absolute inset-0 opacity-0 cursor-pointer"
                          />
                          <Upload className="text-slate-400 mb-2" size={24} />
                          <p className="text-xs text-slate-600 font-bold">
                            {selectedFile ? selectedFile.name : 'Haz clic para subir o arrastra'}
                          </p>
                          <p className="text-[10px] text-slate-400 mt-1">Soporta PDF o Imágenes (Máx. 5MB)</p>
                        </div>
                      </div>

                      <button
                        type="submit"
                        disabled={subiendoArchivo}
                        className="w-full bg-emerald-500 hover:bg-emerald-600 text-white py-2.5 rounded-xl font-bold text-xs shadow-md transition-colors disabled:opacity-50"
                      >
                        {subiendoArchivo ? 'Subiendo...' : 'Subir Archivo Clínico'}
                      </button>
                    </form>
                  </div>

                  {/* Lista de archivos subidos */}
                  <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200/60 flex flex-col min-h-[300px]">
                    <h4 className="font-black text-slate-800 text-xs uppercase tracking-wider mb-3 border-b border-slate-150 pb-2">
                      Archivos Clínicos de esta Sesión
                    </h4>
                    
                    <div className="flex-1 overflow-y-auto space-y-3">
                      {archivosMascota.length === 0 ? (
                        <div className="text-center py-10 text-xs font-bold text-slate-400">
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
                                <p className="text-xs font-bold text-slate-800 truncate max-w-[180px]">{archivo.nombreOriginal}</p>
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

      case 'mascotas':
        return (
          <div className="bg-white p-6 rounded-3xl border border-slate-200/60 shadow-sm">
            <MascotaHistorialTimeline mostrarCabecera={true} />
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="flex h-screen bg-slate-50 font-sans overflow-hidden selection:bg-emerald-500 selection:text-white">
      
      {/* BARRA LATERAL (Estilo Moderno Oscuro) */}
      <aside className="w-72 bg-slate-950 flex flex-col border-r border-slate-800 relative z-20 shadow-2xl">
        {/* Logo de la Clínica */}
        <div className="h-24 flex items-center px-8 border-b border-slate-800/50">
          <div className="flex items-center gap-3 cursor-pointer">
            <div className="w-11 h-11 bg-gradient-to-tr from-emerald-500 to-teal-350 rounded-xl flex items-center justify-center text-white shadow-lg shadow-emerald-500/20">
              <img src={logo} alt="Logo" className="w-8 h-8 object-contain" />
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-black text-white tracking-tight leading-tight">Vet.Huesitos</span>
              <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest">Módulo Clínico</span>
            </div>
          </div>
        </div>

        {/* Menú de Navegación */}
        <nav className="flex-1 px-4 py-6 space-y-1.5 overflow-y-auto custom-scrollbar">
          <button 
            onClick={() => setVistaActual('agenda')} 
            className={vistaActual === 'agenda' ? activeBtnClass : inactiveBtnClass}
          >
            <Calendar size={20} className={vistaActual === 'agenda' ? "text-white" : "text-slate-500 group-hover:text-emerald-450 transition-colors"} /> 
            Agenda del Día
          </button>

          <button 
            onClick={() => setVistaActual('consulta')} 
            className={vistaActual === 'consulta' ? activeBtnClass : inactiveBtnClass}
          >
            <Stethoscope size={20} className={vistaActual === 'consulta' ? "text-white" : "text-slate-500 group-hover:text-emerald-450 transition-colors"} /> 
            Consulta Activa
            {citaActiva && (
              <span className="ml-auto w-2.5 h-2.5 bg-rose-500 rounded-full animate-ping" />
            )}
          </button>

          <button 
            onClick={() => setVistaActual('mascotas')} 
            className={vistaActual === 'mascotas' ? activeBtnClass : inactiveBtnClass}
          >
            <History size={20} className={vistaActual === 'mascotas' ? "text-white" : "text-slate-500 group-hover:text-emerald-450 transition-colors"} /> 
            Buscar Expedientes
          </button>
        </nav>

        {/* Info del Usuario y Cerrar Sesión */}
        <div className="p-4 border-t border-slate-800/50 bg-slate-950/50">
          <div className="bg-slate-900 border border-slate-800 p-3 rounded-xl flex items-center gap-3 mb-4">
            <div className="w-8 h-8 rounded-full bg-emerald-500 flex items-center justify-center text-white font-bold shrink-0">
              <User size={14} />
            </div>
            <div className="overflow-hidden">
              <p className="text-[9px] text-slate-500 font-bold uppercase">Veterinario</p>
              <p className="text-white text-xs font-bold truncate">{correo}</p>
            </div>
          </div>
          <button 
            onClick={handleLogout} 
            className="w-full bg-red-500/10 text-red-400 hover:bg-red-500 hover:text-white px-4 py-3 rounded-xl font-bold text-sm transition-all duration-300 flex items-center justify-center gap-3 border border-red-500/20 hover:shadow-lg hover:shadow-red-500/20"
          >
            <LogOut size={18} />
            Cerrar Sesión
          </button>
        </div>
      </aside>

      {/* ÁREA DE CONTENIDO PRINCIPAL */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden relative">
        
        {/* HEADER SUPERIOR (Glassmorphism sutil) */}
        <header className="bg-white/80 backdrop-blur-md h-20 px-8 flex justify-between items-center shadow-sm z-10 border-b border-slate-200/60 sticky top-0">
          <h1 className="text-xl font-black text-slate-800 tracking-tight">Módulo Clínico Veterinario</h1>
          
          <div className="flex items-center gap-4 bg-slate-50 border border-slate-200 px-2 py-1.5 rounded-full pr-5">
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-emerald-500 to-teal-400 shadow-sm flex items-center justify-center text-white">
              <User size={16} strokeWidth={2.5} />
            </div>
            <span className="text-sm font-bold text-slate-600">{correo}</span>
          </div>
        </header>

        {/* CONTENEDOR DINÁMICO DE PÁGINAS */}
        <div className="flex-1 p-8 overflow-y-auto bg-slate-50">
          <div className="max-w-7xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
            {renderizarVista()}
          </div>
        </div>
      </main>
      
    </div>
  );
};

export default VeterinarioDashboard;
