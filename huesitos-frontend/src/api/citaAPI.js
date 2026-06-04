import axios from 'axios';

const API_BASE = 'http://localhost:8080/api';

const obtenerHeaders = () => ({
  headers: {
    Authorization: `Bearer ${localStorage.getItem('token')}`,
    'Content-Type': 'application/json',
  },
});

/** Agendar una nueva cita (POST /api/citas) */
export const agendarCita = async (datosCita) => {
  const respuesta = await axios.post(`${API_BASE}/citas`, datosCita, obtenerHeaders());
  return respuesta.data;
};

/** Obtener citas de un día específico para ver disponibilidad */
export const obtenerCitasPorDia = async (fecha) => {
  const respuesta = await axios.get(`${API_BASE}/citas/calendario`, {
    ...obtenerHeaders(),
    params: { fecha },
  });
  return respuesta.data;
};

/** Obtener lista de servicios activos (público) */
export const obtenerServiciosActivos = async () => {
  const respuesta = await axios.get(`${API_BASE}/servicios`);
  return respuesta.data;
};

/** Obtener lista de todos los usuarios (para filtrar veterinarios) */
export const obtenerUsuarios = async () => {
  const respuesta = await axios.get(`${API_BASE}/usuarios`, obtenerHeaders());
  return respuesta.data;
};

/** Obtener horarios de un veterinario */
export const obtenerHorariosVeterinario = async (usuarioId) => {
  const respuesta = await axios.get(`${API_BASE}/usuarios/${usuarioId}/horarios`, obtenerHeaders());
  return respuesta.data;
};

/** Guardar o actualizar la configuración de horario para un día específico */
export const guardarHorarioPersonal = async (usuarioId, datosHorario) => {
  const respuesta = await axios.post(`${API_BASE}/usuarios/${usuarioId}/horarios`, datosHorario, obtenerHeaders());
  return respuesta.data;
};

/** Obtener citas de la agenda global con filtros avanzados */
export const obtenerCitasAgenda = async (inicio, fin, veterinarioId, estado) => {
  const params = {};
  if (inicio) params.inicio = inicio;
  if (fin) params.fin = fin;
  if (veterinarioId) params.veterinarioId = veterinarioId;
  if (estado) params.estado = estado;

  const respuesta = await axios.get(`${API_BASE}/citas/agenda`, {
    ...obtenerHeaders(),
    params,
  });
  return respuesta.data;
};

/** Reprogramar una cita */
export const reprogramarCita = async (id, nuevaFechaHora) => {
  const respuesta = await axios.put(
    `${API_BASE}/citas/${id}/reprogramar`,
    { nuevaFechaHora },
    obtenerHeaders()
  );
  return respuesta.data;
};

