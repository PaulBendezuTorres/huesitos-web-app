import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Menu } from 'lucide-react';
import BarraLateral from '../componentes/BarraLateral';
import {
  obtenerCitasAgenda,
  registrarConsultaMedica,
  registrarRecetaMedica,
  subirArchivoClinico
} from '../api/veterinarioApi';
import LineaTiempoHistorialMascota from '../componentes/LineaTiempoHistorialMascota';
import VeterinarioAgenda from '../modulos/veterinario/paginas/VeterinarioAgenda';
import ConsultaActiva from '../modulos/veterinario/paginas/ConsultaActiva';

const TableroVeterinario = () => {
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
  const [sidebarOpen, setSidebarOpen] = useState(false);
  
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
            <LineaTiempoHistorialMascota mostrarCabecera={true} />
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="flex h-screen bg-slate-50 font-sans overflow-hidden selection:bg-emerald-500 selection:text-white">
      
      {/* Overlay para móviles */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-30 lg:hidden transition-opacity duration-300"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* SIDEBAR LATERAL MODULARIZADO */}
      <BarraLateral 
        rol="VETERINARIO"
        correo={correo}
        vistaActual={vistaActual}
        setVistaActual={setVistaActual}
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        handleLogout={handleLogout}
        tieneCitaActiva={!!citaActiva}
      />

      {/* ÁREA DE CONTENIDO PRINCIPAL */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden relative">
        
        {/* HEADER SUPERIOR responsivo */}
        <header className="bg-white/80 backdrop-blur-md h-20 px-4 md:px-6 lg:px-8 flex justify-between items-center shadow-sm z-10 border-b border-slate-200/60 sticky top-0 shrink-0">
          <div className="flex items-center gap-3 min-w-0">
            {/* Botón hamburguesa */}
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2 rounded-lg text-slate-600 hover:bg-slate-100 transition-colors shrink-0"
            >
              <Menu size={20} />
            </button>
            <h1 className="text-base sm:text-lg md:text-xl font-bold text-slate-800 tracking-tight truncate max-w-[140px] sm:max-w-xs md:max-w-none">
              Módulo clínico veterinario
            </h1>
          </div>
          
          <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 p-1 rounded-full md:pr-4 md:gap-3 shrink-0">
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-emerald-500 to-teal-400 shadow-sm flex items-center justify-center text-white shrink-0">
              <User size={16} strokeWidth={2.5} />
            </div>
            <span className="text-xs md:text-sm font-semibold text-slate-600 truncate max-w-[80px] sm:max-w-[120px] md:max-w-[200px]" title={correo}>
              {correo}
            </span>
          </div>
        </header>

        {/* CONTENEDOR DINÁMICO DE PÁGINAS */}
        <div className="flex-1 p-4 lg:p-8 overflow-y-auto bg-slate-50">
          <div className="max-w-7xl mx-auto">
            {renderizarVista()}
          </div>
        </div>
      </main>
      
    </div>
  );
};

export default TableroVeterinario;
