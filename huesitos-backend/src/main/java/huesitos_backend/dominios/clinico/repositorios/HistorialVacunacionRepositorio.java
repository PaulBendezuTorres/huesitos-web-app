package huesitos_backend.dominios.clinico.repositorios;

import huesitos_backend.dominios.clinico.entidades.HistorialVacunacion;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface HistorialVacunacionRepositorio extends JpaRepository<HistorialVacunacion, Long> {

    /**
     * Busca el historial de vacunas de una mascota ordenado por fecha de aplicación
     * descendente.
     */
    List<HistorialVacunacion> findByMascotaIdOrderByFechaAplicacionDesc(Long mascotaId);

    List<HistorialVacunacion> findByFechaProximaDosisBetween(java.time.LocalDate inicio, java.time.LocalDate fin);

    boolean existsByMascotaId(Long mascotaId);
}
