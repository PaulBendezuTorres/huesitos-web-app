import { useState, useEffect, useCallback } from 'react';
import {
  obtenerMascotaPorId,
  obtenerConsultasPorMascota,
  obtenerVacunasPorMascota,
  obtenerArchivosPorMascota,
} from '../api/mascotaApi';

/**
 * Hook que carga y unifica el historial clínico de una mascota
 * en una línea de tiempo cronológica (más reciente primero).
 */
const useHistorialClinico = (mascotaId) => {
  const [mascota, setMascota] = useState(null);
  const [historial, setHistorial] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);

  const cargarDatos = useCallback(async () => {
    if (!mascotaId) return;

    setCargando(true);
    setError(null);

    try {
      const [mascotaRes, consultasRes, vacunasRes, archivosRes] = await Promise.allSettled([
        obtenerMascotaPorId(mascotaId),
        obtenerConsultasPorMascota(mascotaId),
        obtenerVacunasPorMascota(mascotaId),
        obtenerArchivosPorMascota(mascotaId),
      ]);

      // Datos de la mascota
      if (mascotaRes.status === 'fulfilled') {
        setMascota(mascotaRes.value);
      }

      // Unificar eventos en timeline
      const eventos = [];

      // Consultas médicas
      if (consultasRes.status === 'fulfilled' && Array.isArray(consultasRes.value)) {
        consultasRes.value.forEach((c) => {
          eventos.push({
            tipo: 'Consulta',
            fecha: c.fechaRegistro || c.fecha || c.cita?.fechaHora,
            titulo: c.motivo || 'Consulta Médica',
            diagnostico: c.diagnostico,
            tratamiento: c.tratamiento,
            veterinario: c.veterinario?.nombre || c.veterinario?.correo || null,
            temperatura: c.temperatura,
            pesoActual: c.pesoActual,
            consultaId: c.id,
            citaId: c.cita?.id,
          });
        });
      }

      // Vacunas
      if (vacunasRes.status === 'fulfilled' && Array.isArray(vacunasRes.value)) {
        vacunasRes.value.forEach((v) => {
          eventos.push({
            tipo: 'Vacuna',
            fecha: v.fechaAplicacion || v.fecha,
            titulo: `Vacuna: ${v.vacuna?.nombre || v.nombre || 'Sin nombre'}`,
            nombreVacuna: v.vacuna?.nombre || v.nombre,
            lote: v.vacuna?.lote || v.lote,
            laboratorio: v.vacuna?.laboratorio || v.laboratorio,
            proximoRefuerzo: v.fechaProximoRefuerzo || v.proximoRefuerzo,
          });
        });
      }

      // Archivos clínicos
      if (archivosRes.status === 'fulfilled' && Array.isArray(archivosRes.value)) {
        archivosRes.value.forEach((a) => {
          eventos.push({
            tipo: 'Archivo',
            fecha: a.fechaSubida || a.fecha,
            titulo: a.nombreArchivo || 'Archivo Clínico',
            tipoArchivo: a.tipo || a.tipoArchivo,
            urlArchivo: a.urlArchivo || a.url,
          });
        });
      }

      // Ordenar cronológicamente (más reciente primero)
      eventos.sort((a, b) => {
        const fechaA = a.fecha ? new Date(a.fecha).getTime() : 0;
        const fechaB = b.fecha ? new Date(b.fecha).getTime() : 0;
        return fechaB - fechaA;
      });

      setHistorial(eventos);
    } catch (err) {
      console.error('Error cargando historial clínico:', err);
      setError('No se pudo cargar el historial clínico.');
    } finally {
      setCargando(false);
    }
  }, [mascotaId]);

  useEffect(() => {
    cargarDatos();
  }, [cargarDatos]);

  return { mascota, historial, cargando, error, recargar: cargarDatos };
};

export default useHistorialClinico;
