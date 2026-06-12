package huesitos_backend.repositorios;

import huesitos_backend.entidades.HistorialVacunacion;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface HistorialVacunacionRepositorio extends JpaRepository<HistorialVacunacion, Long> {

    /**
     * Busca el historial de vacunas de una mascota ordenado por fecha de aplicación
     * descendente.
     */
    List<HistorialVacunacion> findByMascotaIdOrderByFechaAplicacionDesc(Long mascotaId);

    List<HistorialVacunacion> findByFechaProximaDosisBetween(java.time.LocalDate inicio, java.time.LocalDate fin);
}
