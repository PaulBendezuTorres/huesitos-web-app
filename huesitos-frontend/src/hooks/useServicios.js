import { useEffect, useState } from "react";
import { listarServicios } from "../services/servicioService";

export const useServicios = () => {

  const [servicios, setServicios] = useState([]);
  const [loading, setLoading] = useState(true);

  const obtenerServicios = async () => {

    try {
      const data = await listarServicios();
      setServicios(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    obtenerServicios;
  }, []);

  return {
    servicios,
    loading,
    obtenerServicios,
  };
};