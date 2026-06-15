import axios from 'axios';

const API_BASE = 'http://localhost:8080/api/configuracion-negocio';

const obtenerHeaders = () => ({
  headers: {
    Authorization: `Bearer ${localStorage.getItem('token')}`,
    'Content-Type': 'application/json',
  },
});

export const obtenerConfiguracionNegocio = async () => {
  const respuesta = await axios.get(API_BASE);
  return respuesta.data;
};

export const actualizarConfiguracionNegocio = async (datos) => {
  const respuesta = await axios.put(API_BASE, datos, obtenerHeaders());
  return respuesta.data;
};
