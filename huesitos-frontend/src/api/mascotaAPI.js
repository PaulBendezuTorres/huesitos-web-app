import axios from 'axios';

const API_BASE = 'http://localhost:8080/api';

const obtenerHeaders = () => ({
  headers: {
    Authorization: `Bearer ${localStorage.getItem('token')}`,
    'Content-Type': 'application/json',
  },
});

/** Obtener datos completos de una mascota por ID */
export const obtenerMascotaPorId = async (mascotaId) => {
  const respuesta = await axios.get(`${API_BASE}/mascotas/${mascotaId}`, obtenerHeaders());
  return respuesta.data;
};

/** Obtener historial de consultas médicas de una mascota */
export const obtenerConsultasPorMascota = async (mascotaId) => {
  const respuesta = await axios.get(`${API_BASE}/consultas/mascota/${mascotaId}`, obtenerHeaders());
  return respuesta.data;
};

/** Obtener historial de vacunación de una mascota */
export const obtenerVacunasPorMascota = async (mascotaId) => {
  const respuesta = await axios.get(`${API_BASE}/vacunas/mascota/${mascotaId}`, obtenerHeaders());
  return respuesta.data;
};

/** Obtener archivos clínicos asociados a una mascota */
export const obtenerArchivosPorMascota = async (mascotaId) => {
  const respuesta = await axios.get(`${API_BASE}/archivos-clinicos/mascota/${mascotaId}`, obtenerHeaders());
  return respuesta.data;
};

/** Obtener recetas vinculadas a una consulta médica */
export const obtenerRecetasPorConsulta = async (consultaId) => {
  const respuesta = await axios.get(`${API_BASE}/recetas/consulta/${consultaId}`, obtenerHeaders());
  return respuesta.data;
};

/** Descargar receta en formato PDF (retorna blob para descarga) */
export const descargarRecetaPdf = async (recetaId) => {
  const respuesta = await axios.get(`${API_BASE}/recetas/${recetaId}/pdf`, {
    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
    responseType: 'blob',
  });
  return respuesta.data;
};
