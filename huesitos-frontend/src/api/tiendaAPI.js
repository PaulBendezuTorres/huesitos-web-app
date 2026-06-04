import axios from 'axios';

const API_BASE = 'http://localhost:8080/api';

const obtenerHeaders = () => ({
  headers: {
    Authorization: `Bearer ${localStorage.getItem('token')}`,
    'Content-Type': 'application/json',
  },
});

/** Listar todos los productos activos (público) */
export const obtenerProductos = async () => {
  const respuesta = await axios.get(`${API_BASE}/productos`);
  return respuesta.data;
};

/** Buscar productos por nombre (público) */
export const buscarProductos = async (nombre) => {
  const respuesta = await axios.get(`${API_BASE}/productos/buscar`, { params: { nombre } });
  return respuesta.data;
};

/** Listar productos por categoría (público) */
export const obtenerProductosPorCategoria = async (categoriaId) => {
  const respuesta = await axios.get(`${API_BASE}/productos/categoria/${categoriaId}`);
  return respuesta.data;
};

/** Obtener carrito del usuario autenticado */
export const obtenerCarrito = async () => {
  const respuesta = await axios.get(`${API_BASE}/carrito`, obtenerHeaders());
  return respuesta.data;
};

/** Agregar producto al carrito */
export const agregarAlCarrito = async (productoId, cantidad) => {
  const respuesta = await axios.post(`${API_BASE}/carrito`, { productoId, cantidad }, obtenerHeaders());
  return respuesta.data;
};

/** Modificar cantidad de un item del carrito */
export const modificarCantidadCarrito = async (itemId, cantidad) => {
  const respuesta = await axios.put(`${API_BASE}/carrito/${itemId}?cantidad=${cantidad}`, {}, obtenerHeaders());
  return respuesta.data;
};

/** Eliminar item del carrito */
export const eliminarItemCarrito = async (itemId) => {
  const respuesta = await axios.delete(`${API_BASE}/carrito/${itemId}`, obtenerHeaders());
  return respuesta.data;
};

/** Vaciar carrito completo */
export const vaciarCarrito = async () => {
  const respuesta = await axios.delete(`${API_BASE}/carrito`, obtenerHeaders());
  return respuesta.data;
};

/** Ejecutar checkout (descuento FEFO atómico) */
export const realizarCheckout = async () => {
  const respuesta = await axios.post(`${API_BASE}/pedidos/checkout`, {}, obtenerHeaders());
  return respuesta.data;
};

/** Obtener historial de pedidos del cliente */
export const obtenerMisPedidos = async (usuarioId) => {
  const respuesta = await axios.get(`${API_BASE}/pedidos/cliente/${usuarioId}`, obtenerHeaders());
  return respuesta.data;
};

/** Listar todos los pedidos de la tienda (Recepcionista/Administrador) */
export const obtenerTodosLosPedidos = async () => {
  const respuesta = await axios.get(`${API_BASE}/pedidos`, obtenerHeaders());
  return respuesta.data;
};

/** Cambiar el estado de un pedido (Recepcionista/Administrador) */
export const cambiarEstadoPedido = async (id, estado) => {
  const respuesta = await axios.put(`${API_BASE}/pedidos/${id}/estado?estado=${estado}`, {}, obtenerHeaders());
  return respuesta.data;
};
