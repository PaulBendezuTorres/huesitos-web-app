package huesitos_backend.repositorios;

import huesitos_backend.entidades.Cita;
import huesitos_backend.entidades.EstadoCita;
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
     * Lista todas las citas programadas entre un rango de fechas (para el calendario diario).
     */
    List<Cita> findByFechaHoraBetween(LocalDateTime inicio, LocalDateTime fin);
}
