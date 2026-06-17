package huesitos_backend.dominios.cita.repositorios;

import huesitos_backend.dominios.cita.entidades.Cita;
import huesitos_backend.dominios.cita.entidades.EstadoCita;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDateTime;
import java.util.List;

public interface CitaRepositorio extends JpaRepository<Cita, Long> {

    /**
     * Verifica si ya existe una cita para un veterinario en un horario específico,
     * excluyendo las citas con un estado determinado (ej: CANCELADA).
     */
    boolean existsByVeterinarioIdAndFechaHoraAndEstadoNot(Long veterinarioId, LocalDateTime fechaHora, EstadoCita estado);

    /**
     * Verifica si ya existe otra cita para un veterinario en un horario específico,
     * excluyendo la cita actual y las citas canceladas.
     */
     boolean existsByVeterinarioIdAndFechaHoraAndEstadoNotAndIdNot(Long veterinarioId, LocalDateTime fechaHora, EstadoCita estado, Long id);

    /**
     * Lista todas las citas asignadas a un veterinario.
     */
    List<Cita> findByVeterinarioId(Long veterinarioId);

    /**
     * Verifica si una mascota tiene citas asociadas.
     */
    boolean existsByMascotaId(Long mascotaId);

    /**
     * Lista todas las citas programadas entre un rango de fechas (para el calendario diario).
     */
    List<Cita> findByFechaHoraBetween(LocalDateTime inicio, LocalDateTime fin);

    /**
     * Consulta la agenda global de citas aplicando filtros dinámicos y opcionales.
     */
    @org.springframework.data.jpa.repository.Query(
        "SELECT c FROM Cita c WHERE (:inicio IS NULL OR c.fechaHora >= :inicio) " +
        "AND (:fin IS NULL OR c.fechaHora <= :fin) " +
        "AND (:veterinarioId IS NULL OR c.veterinario.id = :veterinarioId) " +
        "AND (:estado IS NULL OR c.estado = :estado)"
    )
    List<Cita> buscarCitasConFiltros(
        @org.springframework.data.repository.query.Param("inicio") LocalDateTime inicio,
        @org.springframework.data.repository.query.Param("fin") LocalDateTime fin,
        @org.springframework.data.repository.query.Param("veterinarioId") Long veterinarioId,
        @org.springframework.data.repository.query.Param("estado") EstadoCita estado
    );
}
