import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Calendar,
  User,
  History,
  Stethoscope,
  LogOut
} from 'lucide-react';
import logo from '../assets/Logo Huesitos.png';
import {
  obtenerCitasAgenda,
  registrarConsultaMedica,
  registrarRecetaMedica,
  subirArchivoClinico
} from '../api/veterinarioAPI';
import MascotaHistorialTimeline from '../components/MascotaHistorialTimeline';
import VeterinarioAgenda from '../Modules/veterinario/pages/VeterinarioAgenda';
import ConsultaActiva from '../Modules/veterinario/pages/ConsultaActiva';

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
  
  // Carga de citas diarias
  const fetchCitas = async () => {
    setLoadingCitas(true);
    try {
      const hoyStr = new Date().toISOString().split('T')[0];
      const data = await obtenerCitasAgenda({
        inicio: hoyStr,
        fin: hoyStr
      });
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
          <VeterinarioAgenda
            citas={citas}
            loadingCitas={loadingCitas}
            iniciarConsulta={iniciarConsulta}
            citaActivaId={citaActiva?.id}
          />
        );
      
      case 'consulta':
        return (
          <ConsultaActiva
            citaActiva={citaActiva}
            finalizarAtencion={finalizarAtencion}
            consultaForm={consultaForm}
            setConsultaForm={setConsultaForm}
            recetaForm={recetaForm}
            setRecetaForm={setRecetaForm}
            recetaGuardada={recetaGuardada}
            setRecetaGuardada={setRecetaGuardada}
            archivoForm={archivoForm}
            setArchivoForm={setArchivoForm}
            selectedFile={selectedFile}
            setSelectedFile={setSelectedFile}
            subiendoArchivo={subiendoArchivo}
            setSubiendoArchivo={setSubiendoArchivo}
            archivosMascota={archivosMascota}
            setArchivosMascota={setArchivosMascota}
            handleGuardarReceta={handleGuardarReceta}
            handleSubirArchivo={handleSubirArchivo}
            setVistaActual={setVistaActual}
          />
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
              <p className="text-[9px] text-slate-505 text-slate-500 font-bold uppercase">Veterinario</p>
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
