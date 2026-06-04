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
  Syringe,
  Download,
  AlertTriangle
} from 'lucide-react';
import logo from '../assets/Logo Huesitos.png';
import {
  obtenerCitasAgenda,
  registrarConsultaMedica,
  registrarRecetaMedica,
  subirArchivoClinico,
  obtenerHistorialMascota,
  obtenerVacunasMascota,
  obtenerRecetasPorConsulta
} from '../api/veterinarioAPI';

const VeterinarioDashboard = () => {
  const navigate = useNavigate();
  const [correo] = useState(localStorage.getItem('usuarioCorreo') || 'Veterinario');
  const [usuarioId] = useState(localStorage.getItem('usuarioId') || '');
  
  // Lista de citas de la agenda
  const [citas, setCitas] = useState([]);
  const [loadingCitas, setLoadingCitas] = useState(true);
  
  // Cita y mascota cargada actualmente en la Ficha Activa
  const [citaActiva, setCitaActiva] = useState(null);
  
  // Pestaña activa del panel derecho
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
  
  // Historial clínico de la mascota activa
  const [historialMascota, setHistorialMascota] = useState([]);
  const [vacunasMascota, setVacunasMascota] = useState([]);
  const [loadingHistorial, setLoadingHistorial] = useState(false);
  
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
    
    // Cargar historial de la mascota en paralelo
    if (cita.mascota && cita.mascota.id) {
      setLoadingHistorial(true);
      try {
        const [hist, vacs] = await Promise.all([
          obtenerHistorialMascota(cita.mascota.id),
          obtenerVacunasMascota(cita.mascota.id)
        ]);
        setHistorialMascota(hist);
        setVacunasMascota(vacs);
      } catch (error) {
        console.error("Error al cargar historial clínico:", error);
      } finally {
        setLoadingHistorial(false);
      }
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate('/');
  };

  // Guardar receta en base de datos
  const handleGuardarReceta = async (e) => {
    e.preventDefault();
    if (!recetaForm.medicamentos.trim() || !recetaForm.indicaciones.trim()) {
      alert("Por favor completa los medicamentos y las indicaciones.");
      return;
    }
    try {
      // Necesita una consulta o un ID de consulta. Como la consulta médica no está guardada aún
      // (se guarda al Finalizar Atención), podemos simular o, según el backend de Huesitos,
      // la receta requiere estar asociada a una ConsultaMedica.
      // Solución: De acuerdo al endpoint de recetas (`POST /api/recetas`), se necesita una consulta médica guardada primero.
      // Por ende, la receta se registra AUTOMÁTICAMENTE o se asocia tras guardar la consulta,
      // o guardamos la consulta primero.
      // Vamos a indicarle al usuario que guarde la consulta médica o podemos hacer un guardado temporal.
      // En el backend, registrarConsultaMedica guarda la consulta y completa la cita.
      // Por ende, el flujo ideal es: el veterinario escribe la consulta y la receta, y al hacer click en "Finalizar Atención"
      // guardamos primero la consulta y con el ID de esa consulta guardamos la receta.
      // Para dar feedback inmediato, permitimos redactarla en la pestaña y la guardamos al final.
      alert("Receta redactada correctamente. Se registrará al Finalizar la Consulta.");
      setRecetaGuardada({
        medicamentos: recetaForm.medicamentos,
        indicaciones: recetaForm.indicaciones
      });
    } catch (error) {
      console.error(error);
      alert("Error al validar la receta.");
    }
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
      
      // Actualizar listado de citas de la sala de espera
      fetchCitas();
    } catch (error) {
      console.error(error);
      alert("Error al finalizar la atención médica: " + (error.response?.data || error.message));
    }
  };

  return (
    <div className="flex h-screen bg-slate-100 font-sans overflow-hidden">
      
      {/* SIDEBAR VETERINARIO */}
      <aside className="w-64 bg-slate-950 flex flex-col justify-between border-r border-slate-800 shrink-0">
        <div>
          <div className="h-20 flex items-center px-6 border-b border-slate-800/50">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-tr from-emerald-500 to-teal-300 rounded-xl flex items-center justify-center text-white shadow-lg shadow-emerald-500/20">
                <img src={logo} alt="Logo Huesitos" className="w-8 h-8 object-contain" />
              </div>
              <div className="flex flex-col">
                <span className="text-md font-black text-white tracking-tight leading-tight">Vet.Huesitos</span>
                <span className="text-[9px] font-bold text-emerald-400 uppercase tracking-widest">Módulo Clínico</span>
              </div>
            </div>
          </div>
          <div className="p-4">
            <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-emerald-500 flex items-center justify-center text-white">
                <User size={16} />
              </div>
              <div className="overflow-hidden">
                <p className="text-xs text-slate-400 font-bold">Veterinario</p>
                <p className="text-white text-xs font-bold truncate">{correo}</p>
              </div>
            </div>
          </div>
        </div>
        
        <div className="p-4 border-t border-slate-800/50">
          <button 
            onClick={handleLogout}
            className="w-full bg-red-500/10 text-red-400 hover:bg-red-500 hover:text-white px-4 py-3 rounded-xl font-bold text-sm transition-all duration-300 flex items-center justify-center gap-3 border border-red-500/20 shadow-sm"
          >
            <LogOut size={16} />
            Cerrar Sesión
          </button>
        </div>
      </aside>

      {/* CONTENEDOR PRINCIPAL SPLIT-VIEW (Tablet) */}
      <main className="flex-1 flex overflow-hidden">
        
        {/* PANEL IZQUIERDO: Sala de Espera / Citas (30% de ancho) */}
        <section className="w-[30%] bg-white border-r border-slate-200 flex flex-col overflow-hidden">
          <div className="p-4 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center shrink-0">
            <div className="flex items-center gap-2">
              <Users size={18} className="text-emerald-500" />
              <h2 className="font-black text-slate-800 text-sm tracking-wide uppercase">Sala de Espera</h2>
            </div>
            <span className="bg-emerald-100 text-emerald-700 text-[10px] font-black px-2 py-0.5 rounded-full">
              {citas.length} Activas
            </span>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {loadingCitas ? (
              <div className="text-center py-10 text-xs font-bold text-slate-400 animate-pulse">
                Sincronizando agenda médica...
              </div>
            ) : citas.length === 0 ? (
              <div className="text-center py-10 space-y-2">
                <p className="text-slate-400 text-xs font-bold">No hay pacientes hoy</p>
                <p className="text-[10px] text-slate-400">Las citas aparecerán aquí al hacer Check-In.</p>
              </div>
            ) : (
              citas.map((cita) => {
                const esEnEspera = cita.estado === 'EN_ESPERA';
                return (
                  <div 
                    key={cita.id} 
                    className={`p-3.5 rounded-2xl border transition-all duration-300 ${
                      citaActiva?.id === cita.id
                        ? 'border-emerald-500 bg-emerald-50/50 shadow-md shadow-emerald-500/5'
                        : esEnEspera 
                          ? 'border-amber-200 bg-amber-50/30 hover:border-amber-300' 
                          : 'border-slate-200 hover:bg-slate-50/50'
                    }`}
                  >
                    <div className="flex justify-between items-start mb-2">
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

                    <div className="space-y-1.5 text-xs text-slate-500 font-medium">
                      <p className="flex items-center gap-1.5">
                        <Stethoscope size={13} className="text-slate-400" />
                        {cita.servicio ? cita.servicio.nombre : 'Consulta'}
                      </p>
                      <p className="flex items-center gap-1.5">
                        <Clock size={13} className="text-slate-400" />
                        {new Date(cita.fechaHora).toLocaleTimeString('es-PE', { hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>

                    <button 
                      onClick={() => iniciarConsulta(cita)}
                      className={`w-full mt-3 py-2 rounded-xl text-xs font-bold transition-all ${
                        citaActiva?.id === cita.id
                          ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/20'
                          : esEnEspera 
                            ? 'bg-emerald-500 hover:bg-emerald-600 text-white shadow-md shadow-emerald-500/10'
                            : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                      }`}
                    >
                      {citaActiva?.id === cita.id ? 'Atendiendo...' : 'Iniciar Consulta'}
                    </button>
                  </div>
                );
              })
            )}
          </div>
        </section>

        {/* PANEL DERECHO: Ficha Clínica Activa (70% de ancho) */}
        <section className="flex-1 bg-slate-50 flex flex-col overflow-hidden relative">
          {citaActiva ? (
            <>
              {/* Cabecera del Paciente Activo */}
              <div className="bg-white p-5 border-b border-slate-200 flex justify-between items-center shrink-0">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center text-white text-lg font-black shadow-md shadow-emerald-500/10">
                    {citaActiva.mascota.nombre.charAt(0)}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-lg font-black text-slate-800 tracking-tight">
                        {citaActiva.mascota.nombre}
                      </h3>
                      <span className="text-[10px] bg-slate-100 border border-slate-200 px-2 py-0.5 rounded-md font-bold text-slate-600">
                        {citaActiva.mascota.especie} {citaActiva.mascota.raza ? `- ${citaActiva.mascota.raza}` : ''}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 font-medium mt-0.5">
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

              {/* Barra de Navegación de Pestañas */}
              <div className="bg-white px-6 border-b border-slate-200 flex gap-6 shrink-0">
                {[
                  { id: 'diagnostico', label: 'Diagnóstico & Consulta', icon: ClipboardList },
                  { id: 'historial', label: 'Historial Clínico', icon: History },
                  { id: 'receta', label: 'Prescribir Receta', icon: FileText },
                  { id: 'archivos', label: 'Subir Archivos', icon: Paperclip }
                ].map(pestana => {
                  const Icon = pestana.icon;
                  const activa = pestanaActiva === pestana.id;
                  return (
                    <button
                      key={pestana.id}
                      onClick={() => setPestanaActiva(pestana.id)}
                      className={`py-4 border-b-2 font-bold text-xs flex items-center gap-2 transition-all ${
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
              <div className="flex-1 overflow-y-auto p-6">
                
                {/* 1. DIAGNÓSTICO & CONSULTA */}
                {pestanaActiva === 'diagnostico' && (
                  <div className="bg-white p-6 rounded-2xl border border-slate-200/60 shadow-sm space-y-5 max-w-4xl">
                    <h4 className="font-black text-slate-800 text-xs uppercase tracking-wider mb-2 border-b border-slate-100 pb-2">
                      Ficha de Atención Clínica
                    </h4>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-slate-50 p-4 rounded-xl border border-slate-150">
                      <div>
                        <span className="block text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Motivo de Cita</span>
                        <p className="font-bold text-slate-800 text-xs">{consultaForm.motivoConsulta}</p>
                      </div>
                      <div>
                        <span className="block text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Edad de Mascota</span>
                        <p className="font-bold text-slate-800 text-xs">{citaActiva.mascota.edad || 'No especificada'}</p>
                      </div>
                    </div>

                    <div className="space-y-4 pt-2">
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
                          className="w-full border border-slate-300 p-3 rounded-xl text-slate-800 text-xs focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all"
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
                            className="w-full border border-slate-300 p-3 rounded-xl text-slate-800 text-xs focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all"
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
                            className="w-full border border-slate-300 p-3 rounded-xl text-slate-800 text-xs focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all"
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
                          className="w-full border border-slate-300 p-3 rounded-xl text-slate-800 text-xs focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* 2. HISTORIAL CLÍNICO (Timeline) */}
                {pestanaActiva === 'historial' && (
                  <div className="space-y-6 max-w-4xl">
                    <div className="bg-white p-5 rounded-2xl border border-slate-200/60 shadow-sm flex items-center gap-4 shrink-0">
                      <div className="flex items-center gap-2">
                        <History className="text-emerald-500" size={18} />
                        <h4 className="font-bold text-slate-800 text-sm">Historial Médico Registrado</h4>
                      </div>
                    </div>

                    {loadingHistorial ? (
                      <div className="text-center py-10 text-xs font-bold text-slate-400 animate-pulse">
                        Cargando historial médico...
                      </div>
                    ) : historialMascota.length === 0 && vacunasMascota.length === 0 ? (
                      <div className="bg-white p-8 rounded-2xl border border-slate-200/60 shadow-sm text-center">
                        <p className="text-slate-400 text-xs font-bold">No hay consultas previas registradas</p>
                      </div>
                    ) : (
                      <div className="relative border-l-2 border-slate-200 pl-6 ml-4 space-y-6">
                        {/* Vacunas Aplicadas */}
                        {vacunasMascota.map((v) => (
                          <div key={v.id} className="relative">
                            <span className="absolute -left-10 top-0.5 bg-emerald-500 text-white w-7 h-7 rounded-full flex items-center justify-center border-4 border-slate-100 shadow-sm">
                              <Syringe size={12} />
                            </span>
                            <div className="bg-white p-4 rounded-xl border border-slate-200/60 shadow-sm">
                              <div className="flex justify-between items-start mb-2">
                                <h5 className="font-bold text-slate-800 text-xs uppercase tracking-wide">
                                  Vacuna Aplicada: {v.vacuna ? v.vacuna.nombre : 'Vacuna'}
                                </h5>
                                <span className="bg-emerald-50 text-emerald-600 text-[10px] font-black px-2 py-0.5 rounded-full border border-emerald-100">
                                  {new Date(v.fechaAplicacion).toLocaleDateString('es-PE')}
                                </span>
                              </div>
                              <p className="text-xs text-slate-500 font-medium">Lote: <span className="font-bold text-slate-700">{v.lote || 'N/A'}</span></p>
                              {v.fechaProximaDosis && (
                                <p className="text-[10px] text-amber-600 font-bold mt-1">Próxima dosis: {new Date(v.fechaProximaDosis).toLocaleDateString('es-PE')}</p>
                              )}
                            </div>
                          </div>
                        ))}

                        {/* Consultas Médicas */}
                        {historialMascota.map((c) => (
                          <div key={c.id} className="relative">
                            <span className="absolute -left-10 top-0.5 bg-blue-500 text-white w-7 h-7 rounded-full flex items-center justify-center border-4 border-slate-100 shadow-sm">
                              <Stethoscope size={12} />
                            </span>
                            <div className="bg-white p-5 rounded-2xl border border-slate-200/60 shadow-sm">
                              <div className="flex justify-between items-start mb-3 border-b border-slate-100 pb-2">
                                <div>
                                  <h5 className="font-bold text-slate-800 text-xs uppercase tracking-wide">
                                    Consulta Médica - {c.motivoConsulta}
                                  </h5>
                                  <p className="text-[10px] text-slate-400 font-medium mt-0.5">Atendido por: {c.veterinario ? c.veterinario.correo : 'Veterinario'}</p>
                                </div>
                                <span className="bg-blue-50 text-blue-600 text-[10px] font-black px-2 py-0.5 rounded-full border border-blue-100">
                                  {new Date(c.fecha).toLocaleDateString('es-PE')}
                                </span>
                              </div>

                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                                <div>
                                  <span className="block text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Síntomas</span>
                                  <p className="text-slate-700 leading-relaxed font-medium">{c.sintomas}</p>
                                </div>
                                <div>
                                  <span className="block text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Diagnóstico</span>
                                  <p className="text-slate-700 leading-relaxed font-medium">{c.diagnostico}</p>
                                </div>
                                <div className="md:col-span-2">
                                  <span className="block text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Tratamiento</span>
                                  <p className="text-slate-700 leading-relaxed font-medium bg-slate-50 p-2.5 rounded-lg border border-slate-100">{c.tratamiento}</p>
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {/* 3. PRESCRIBIR RECETA */}
                {pestanaActiva === 'receta' && (
                  <div className="bg-white p-6 rounded-2xl border border-slate-200/60 shadow-sm max-w-4xl space-y-5">
                    <div className="flex justify-between items-center border-b border-slate-100 pb-3">
                      <div>
                        <h4 className="font-black text-slate-800 text-xs uppercase tracking-wider">
                          Redacción de Receta Médica A5
                        </h4>
                        <p className="text-xs text-slate-400 mt-0.5">La receta se compilará en formato PDF para el cliente.</p>
                      </div>
                      {recetaGuardada && (
                        <span className="bg-emerald-100 text-emerald-700 text-[10px] font-black px-2.5 py-1 rounded-lg flex items-center gap-1.5">
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
                          className="w-full border border-slate-300 p-3 rounded-xl text-slate-800 text-xs focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all"
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
                          className="w-full border border-slate-300 p-3 rounded-xl text-slate-800 text-xs focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all"
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

                {/* 4. SUBIR ARCHIVOS */}
                {pestanaActiva === 'archivos' && (
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 max-w-5xl">
                    {/* Formulario de carga */}
                    <div className="bg-white p-6 rounded-2xl border border-slate-200/60 shadow-sm space-y-4 h-fit">
                      <h4 className="font-black text-slate-800 text-xs uppercase tracking-wider mb-2 border-b border-slate-100 pb-2">
                        Nuevo Archivo Clínico
                      </h4>

                      <form onSubmit={handleSubirArchivo} className="space-y-4">
                        <div>
                          <label className="block text-xs font-bold text-slate-500 mb-1.5 uppercase tracking-wide">Tipo de Examen</label>
                          <select
                            value={archivoForm.tipoExamen}
                            onChange={e => setArchivoForm({...archivoForm, tipoExamen: e.target.value})}
                            className="w-full border border-slate-350 p-2.5 rounded-xl text-slate-800 text-xs font-bold bg-slate-50 cursor-pointer"
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
                            className="w-full border border-slate-300 p-2.5 rounded-xl text-slate-800 text-xs focus:ring-2 focus:ring-emerald-500 outline-none transition-all"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-bold text-slate-500 mb-1.5 uppercase tracking-wide">Seleccionar Archivo (PDF, JPG, PNG)</label>
                          <div className="border-2 border-dashed border-slate-300 rounded-2xl p-6 flex flex-col items-center justify-center bg-slate-50/50 hover:bg-slate-50 transition-all cursor-pointer relative">
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

                    {/* Lista de archivos de la mascota */}
                    <div className="bg-white p-6 rounded-2xl border border-slate-200/60 shadow-sm flex flex-col min-h-[300px]">
                      <h4 className="font-black text-slate-800 text-xs uppercase tracking-wider mb-3 border-b border-slate-100 pb-2">
                        Archivos Clínicos Asociados
                      </h4>
                      
                      <div className="flex-1 overflow-y-auto space-y-3">
                        {archivosMascota.length === 0 ? (
                          <div className="text-center py-10 text-xs font-bold text-slate-400">
                            No hay archivos subidos en esta consulta.
                          </div>
                        ) : (
                          archivosMascota.map((archivo) => (
                            <div key={archivo.id} className="flex justify-between items-center p-3 rounded-xl border border-slate-100 bg-slate-50/50">
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
            </>
          ) : (
            // Pantalla de bienvenida / sin paciente seleccionado
            <div className="flex-1 flex flex-col justify-center items-center p-8 text-center text-slate-500 select-none">
              <div className="w-16 h-16 bg-slate-200/50 rounded-full flex items-center justify-center text-slate-400 mb-4 animate-pulse">
                <Stethoscope size={32} />
              </div>
              <h3 className="text-lg font-black text-slate-800 tracking-tight">Ficha Clínica Activa</h3>
              <p className="text-xs text-slate-400 max-w-sm mt-1">
                Selecciona un paciente de la sala de espera para iniciar la consulta, diagnosticar, prescribir recetas y adjuntar archivos clínicos.
              </p>
            </div>
          )}
        </section>

      </main>

    </div>
  );
};

export default VeterinarioDashboard;
