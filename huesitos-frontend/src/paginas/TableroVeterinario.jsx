import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import PlantillaTablero from '../componentes/PlantillaTablero';
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
  const [vistaActual, setVistaActual] = useState(() => {
    const subvista = localStorage.getItem('subvistaDefecto');
    if (subvista) {
      localStorage.removeItem('subvistaDefecto');
      return subvista;
    }
    return localStorage.getItem('veterinarioVistaActual') || 'agenda';
  });

  useEffect(() => {
    localStorage.setItem('veterinarioVistaActual', vistaActual);
  }, [vistaActual]);

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
    <PlantillaTablero
      rol="VETERINARIO"
      correo={correo}
      vistaActual={vistaActual}
      setVistaActual={setVistaActual}
      handleLogout={handleLogout}
      tituloHeader="Módulo clínico veterinario"
      tieneCitaActiva={!!citaActiva}
    >
      {renderizarVista()}
    </PlantillaTablero>
  );
};

export default TableroVeterinario;
