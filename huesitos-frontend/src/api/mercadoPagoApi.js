import axios from 'axios';

const API_BASE = 'http://localhost:8080/api';

const obtenerHeaders = () => ({
  headers: {
    Authorization: `Bearer ${localStorage.getItem('token')}`,
    'Content-Type': 'application/json',
  },
});

/**
 * Crea una preferencia de pago en Mercado Pago para la transacción indicada.
 *
 * @param {number|string} transaccionId El ID de la transacción.
 * @returns {Promise<{ initPoint: string }>} La respuesta con el enlace del checkout.
 */
export const crearPreferenciaPago = async (transaccionId) => {
  const respuesta = await axios.post(
    `${API_BASE}/pagos/${transaccionId}/preferencia`,
    {},
    obtenerHeaders()
  );
  return respuesta.data;
};

/**
 * Obtiene la transacción asociada a una cita específica.
 *
 * @param {number|string} citaId El ID de la cita.
 * @returns {Promise<any>} Los datos de la transacción.
 */
export const obtenerTransaccionPorCita = async (citaId) => {
  const respuesta = await axios.get(
    `${API_BASE}/pagos/cita/${citaId}`,
    obtenerHeaders()
  );
  return respuesta.data;
};

