import axios from 'axios';

const API_BASE = 'http://localhost:8080/api';

const obtenerHeaders = () => ({
  headers: {
    Authorization: `Bearer ${localStorage.getItem('token')}`,
    'Content-Type': 'application/json',
  },
});

/**
 * Genera un código CIP en PagoEfectivo para la transacción especificada.
 *
 * @param {number|string} transaccionId El ID de la transacción.
 * @returns {Promise<any>} Objeto con el código CIP, monto, instrucciones, etc.
 */
export const generarCipPagoEfectivo = async (transaccionId) => {
  const respuesta = await axios.post(
    `${API_BASE}/pagos/pagoefectivo/${transaccionId}/cip`,
    {},
    obtenerHeaders()
  );
  return respuesta.data;
};

/**
 * Simula el pago de un código CIP para desarrollo local.
 *
 * @param {string} cip El código CIP a pagar.
 * @returns {Promise<any>} Respuesta del servidor.
 */
export const simularPagoPagoEfectivo = async (cip) => {
  const respuesta = await axios.post(
    `${API_BASE}/pagos/pagoefectivo/simular-pago`,
    { cip },
    obtenerHeaders()
  );
  return respuesta.data;
};
