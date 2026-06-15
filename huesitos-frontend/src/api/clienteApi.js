import axios from 'axios';

const API_BASE = 'http://localhost:8080/api';

const obtenerHeaders = () => ({
  headers: {
    Authorization: `Bearer ${localStorage.getItem('token')}`,
    'Content-Type': 'application/json',
  },
});

/** Obtener mascotas del dueño logueado */
export const obtenerMascotasPorDueno = async (duenoId) => {
  const respuesta = await axios.get(`${API_BASE}/mascotas/dueno/${duenoId}`, obtenerHeaders());
  return respuesta.data;
};

/** Obtener citas con filtros (próximas citas del cliente) */
export const obtenerCitasAgenda = async (params = {}) => {
  const respuesta = await axios.get(`${API_BASE}/citas/agenda`, {
    ...obtenerHeaders(),
    params,
  });
  return respuesta.data;
};

/** Obtener campañas activas (endpoint público) */
export const obtenerCampanasActivas = async () => {
  const respuesta = await axios.get(`${API_BASE}/campanas`);
  return respuesta.data;
};

/** Registrar una nueva mascota */
export const registrarMascota = async (datosMascota) => {
  const respuesta = await axios.post(`${API_BASE}/mascotas`, datosMascota, obtenerHeaders());
  return respuesta.data;
};

