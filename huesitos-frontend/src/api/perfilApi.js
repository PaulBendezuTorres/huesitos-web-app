import axios from 'axios';

const API_BASE = 'http://localhost:8080/api/perfiles';

const obtenerHeaders = () => ({
  headers: {
    Authorization: `Bearer ${localStorage.getItem('token')}`,
    'Content-Type': 'application/json',
  },
});

export const obtenerPerfil = async (id) => {
  const respuesta = await axios.get(`${API_BASE}/usuario/${id}`, obtenerHeaders());
  return respuesta.data;
};

export const actualizarPerfil = async (id, datos) => {
  const respuesta = await axios.put(`${API_BASE}/usuario/${id}`, datos, obtenerHeaders());
  return respuesta.data;
};

export const actualizarTemaUsuario = async (id, tema) => {
  const respuesta = await axios.patch(`${API_BASE}/usuario/${id}/tema?tema=${tema}`, {}, obtenerHeaders());
  return respuesta.data;
};

export const subirFotoPerfil = async (id, archivo) => {
  const formData = new FormData();
  formData.append('archivo', archivo);
  
  const respuesta = await axios.post(`${API_BASE}/usuario/${id}/foto`, formData, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem('token')}`,
      'Content-Type': 'multipart/form-data',
    },
  });
  return respuesta.data;
};
