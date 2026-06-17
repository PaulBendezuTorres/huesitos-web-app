import { useState, useEffect, useCallback } from 'react';
import { obtenerMascotasPorDueno, obtenerCitasAgenda, obtenerCampanasActivas } from '@/api/clienteApi';

const useTableroCliente = () => {
  const [mascotas, setMascotas] = useState([]);
  const [citas, setCitas] = useState([]);
  const [campanas, setCampanas] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);

  const cargarDatos = useCallback(async () => {
    setCargando(true);
    setError(null);

    const duenoId = localStorage.getItem('duenoId');

    try {
      const [mascotasData, citasData, campanasData] = await Promise.allSettled([
        duenoId ? obtenerMascotasPorDueno(duenoId) : Promise.resolve([]),
        obtenerCitasAgenda(),
        obtenerCampanasActivas(),
      ]);

      setMascotas(mascotasData.status === 'fulfilled' ? mascotasData.value : []);
      setCitas(citasData.status === 'fulfilled' ? citasData.value : []);
      setCampanas(campanasData.status === 'fulfilled' ? campanasData.value : []);
    } catch (err) {
      console.error('Error cargando datos del dashboard:', err);
      setError('Error al cargar los datos del dashboard');
    } finally {
      setCargando(false);
    }
  }, []);

  useEffect(() => {
    cargarDatos();
  }, [cargarDatos]);

  return { mascotas, citas, campanas, cargando, error, recargar: cargarDatos, setMascotas };
};

export default useTableroCliente;
