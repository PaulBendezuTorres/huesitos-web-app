import servicioApi from "../api/servicioApi";

export const listarServicios = async () => {
  const response = await servicioApi.get(""); 
  return response.data;
};

export const crearServicio = async (data) => {
  const response = await servicioApi.post("", data); 
  return response.data;
};

export const actualizarServicio = async (id, data) => {
  const response = await servicioApi.put(`/${id}`, data);
  return response.data;
};

export const cambiarEstadoServicio = async (id, activo) => {
  const response = await servicioApi.patch(`/${id}/estado?activo=${activo}`);
  return response.data;
};

export const subirFotoServicio = async (id, archivo) => {
  const formData = new FormData();
  formData.append('archivo', archivo);
  const response = await servicioApi.post(`/${id}/foto`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};

export const eliminarServicio = async (id) => {
  const response = await servicioApi.delete(`/${id}`);
  return response.data;
};