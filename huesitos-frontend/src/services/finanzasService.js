import axios from "axios";

const finanzasAPI = axios.create({
  baseURL: "http://localhost:8080/api/pagos",
  headers: { "Content-Type": "application/json" }
});

finanzasAPI.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export const obtenerReporteDiario = async (fecha) => {
  const response = await finanzasAPI.get(`/reporte?fecha=${fecha}`);
  return response.data;
};

export const obtenerTransacciones = async () => {
  const response = await finanzasAPI.get("");
  return response.data;
};

export const procesarPago = async (id, medioPago, referencia) => {
  const response = await finanzasAPI.patch(`/${id}/procesar?medioPago=${medioPago}&referencia=${referencia || ""}`);
  return response.data;
};

export const obtenerAlertasBajoStock = async () => {
  const response = await axios.get("http://localhost:8080/api/inventarios/alertas/bajo-stock", {
    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
  });
  return response.data;
};

export const obtenerAlertasVencimientos = async (dias = 30) => {
  const response = await axios.get(`http://localhost:8080/api/inventarios/alertas/vencimientos?dias=${dias}`, {
    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
  });
  return response.data;
};

export const descargarBoletaPdf = async (transaccionId) => {
  const response = await axios.get(`http://localhost:8080/api/pagos/${transaccionId}/boleta`, {
    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
    responseType: 'blob'
  });
  return response.data;
};