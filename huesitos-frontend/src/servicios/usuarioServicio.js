import usuarioApi from "../api/usuarioApi";

export const obtenerListaUsuarios = async () => {
  const response = await usuarioApi.get("");
  return response.data;
};

// NUEVA FUNCIÓN AÑADIDA
export const registrarNuevoPersonal = async (datosPersonales) => {
  const response = await usuarioApi.post("", datosPersonales);
  return response.data;
};

export const modificarRolUsuario = async (id, nuevoRol) => {
  const response = await usuarioApi.patch(`/${id}/rol?rol=${nuevoRol}`);
  return response.data;
};

export const modificarEstadoUsuario = async (id, nuevoEstado) => {
  const response = await usuarioApi.patch(`/${id}/estado?activo=${nuevoEstado}`);
  return response.data;
};

export const obtenerDetallesDueño = async (usuarioId) => {
  const response = await usuarioApi.get(`/${usuarioId}/dueño`);
  return response.data;
};

export const actualizarCredencialesUsuario = async (usuarioId, datos) => {
  const response = await usuarioApi.patch(`/${usuarioId}/credenciales`, datos);
  return response.data;
};