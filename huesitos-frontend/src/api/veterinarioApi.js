import axios from 'axios';

const API_BASE = 'http://localhost:8080/api';

const obtenerHeaders = () => ({
  headers: {
    Authorization: `Bearer ${localStorage.getItem('token')}`,
  },
});

const obtenerHeadersMultipart = () => ({
  headers: {
    Authorization: `Bearer ${localStorage.getItem('token')}`,
    'Content-Type': 'multipart/form-data',
  },
});

/** Obtener citas del día del veterinario o generales con estado check-in */
export const obtenerCitasAgenda = async (params) => {
  const respuesta = await axios.get(`${API_BASE}/citas/agenda`, {
    ...obtenerHeaders(),
    params,
  });
  return respuesta.data;
};

/** Registrar una nueva consulta médica */
export const registrarConsultaMedica = async (datosConsulta) => {
  const respuesta = await axios.post(`${API_BASE}/consultas`, datosConsulta, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem('token')}`,
      'Content-Type': 'application/json',
    },
  });
  return respuesta.data;
};

/** Registrar o actualizar una receta médica */
export const registrarRecetaMedica = async (datosReceta) => {
  const respuesta = await axios.post(`${API_BASE}/recetas`, datosReceta, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem('token')}`,
      'Content-Type': 'application/json',
    },
  });
  return respuesta.data;
};

/** Subir un archivo clínico (PDF, examen de laboratorio, etc.) */
export const subirArchivoClinico = async (formData) => {
  const respuesta = await axios.post(`${API_BASE}/archivos-clinicos/subir`, formData, obtenerHeadersMultipart());
  return respuesta.data;
};

/** Obtener historial de consultas de una mascota */
export const obtenerHistorialMascota = async (mascotaId) => {
  const respuesta = await axios.get(`${API_BASE}/consultas/mascota/${mascotaId}`, obtenerHeaders());
  return respuesta.data;
};

/** Obtener vacunas de una mascota */
export const obtenerVacunasMascota = async (mascotaId) => {
  const respuesta = await axios.get(`${API_BASE}/vacunas/mascota/${mascotaId}`, obtenerHeaders());
  return respuesta.data;
};

/** Obtener recetas vinculadas a una consulta médica */
export const obtenerRecetasPorConsulta = async (consultaId) => {
  const respuesta = await axios.get(`${API_BASE}/recetas/consulta/${consultaId}`, obtenerHeaders());
  return respuesta.data;
};
