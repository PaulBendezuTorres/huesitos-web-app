import axios from 'axios';

const API_BASE = 'http://localhost:8080/api';

const obtenerHeaders = () => ({
  headers: {
    Authorization: `Bearer ${localStorage.getItem('token')}`,
    'Content-Type': 'application/json',
  },
});

// --- CAMPAÑAS ---

/** Listar todas las campañas (Recepcionista/Administrador) */
export const obtenerTodasCampanas = async () => {
  const respuesta = await axios.get(`${API_BASE}/campanas/todas`, obtenerHeaders());
  return respuesta.data;
};

/** Registrar una nueva campaña */
export const registrarCampana = async (campanaData) => {
  const respuesta = await axios.post(`${API_BASE}/campanas`, campanaData, obtenerHeaders());
  return respuesta.data;
};

/** Actualizar una campaña */
export const actualizarCampana = async (id, campanaData) => {
  const respuesta = await axios.put(`${API_BASE}/campanas/${id}`, campanaData, obtenerHeaders());
  return respuesta.data;
};

/** Eliminar/Desactivar una campaña */
export const eliminarCampana = async (id) => {
  const respuesta = await axios.delete(`${API_BASE}/campanas/${id}`, obtenerHeaders());
  return respuesta.data;
};

/** Subir foto/banner de la campaña */
export const subirFotoCampana = async (id, archivo) => {
  const formData = new FormData();
  formData.append('archivo', archivo);
  const respuesta = await axios.post(`${API_BASE}/campanas/${id}/foto`, formData, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem('token')}`,
      'Content-Type': 'multipart/form-data',
    },
  });
  return respuesta.data;
};

// --- OFERTAS ---

/** Listar todas las ofertas (Recepcionista/Administrador) */
export const obtenerTodasOfertas = async () => {
  const respuesta = await axios.get(`${API_BASE}/ofertas/todas`, obtenerHeaders());
  return respuesta.data;
};

/** Registrar una nueva oferta */
export const registrarOferta = async (ofertaData) => {
  const respuesta = await axios.post(`${API_BASE}/ofertas`, ofertaData, obtenerHeaders());
  return respuesta.data;
};

/** Actualizar una oferta */
export const actualizarOferta = async (id, ofertaData) => {
  const respuesta = await axios.put(`${API_BASE}/ofertas/${id}`, ofertaData, obtenerHeaders());
  return respuesta.data;
};

/** Eliminar/Desactivar una oferta */
export const eliminarOferta = async (id) => {
  const respuesta = await axios.delete(`${API_BASE}/ofertas/${id}`, obtenerHeaders());
  return respuesta.data;
};

/** Obtener campaña por ID */
export const obtenerCampanaPorId = async (id) => {
  const respuesta = await axios.get(`${API_BASE}/campanas/${id}`, obtenerHeaders());
  return respuesta.data;
};

/** Obtener oferta por ID */
export const obtenerOfertaPorId = async (id) => {
  const respuesta = await axios.get(`${API_BASE}/ofertas/${id}`, obtenerHeaders());
  return respuesta.data;
};
