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

/** Actualizar una mascota existente */
export const actualizarMascota = async (mascotaId, datosMascota) => {
  const respuesta = await axios.put(`${API_BASE}/mascotas/${mascotaId}`, datosMascota, obtenerHeaders());
  return respuesta.data;
};

/** Eliminar una mascota confirmando con la contraseña del usuario */
export const eliminarMascota = async (mascotaId, contrasena) => {
  const respuesta = await axios.post(`${API_BASE}/mascotas/${mascotaId}/eliminar`, { contrasena }, obtenerHeaders());
  return respuesta.data;
};

/** Subir foto de una mascota */
export const subirFotoMascota = async (mascotaId, archivo) => {
  const formData = new FormData();
  formData.append('archivo', archivo);
  
  const respuesta = await axios.post(`${API_BASE}/perfiles/mascota/${mascotaId}/foto`, formData, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem('token')}`,
      'Content-Type': 'multipart/form-data',
    },
  });
  return respuesta.data;
};


