package huesitos_backend.dominios.usuario.repositorios;

import huesitos_backend.dominios.usuario.entidades.Usuario;

import huesitos_backend.dominios.usuario.entidades.HorarioPersonal;
import org.springframework.data.jpa.repository.JpaRepository;
import java.time.DayOfWeek;
import java.util.List;
import java.util.Optional;

public interface HorarioPersonalRepositorio extends JpaRepository<HorarioPersonal, Long> {

    /**
     * Busca los horarios asignados a un usuario específico.
     */
    List<HorarioPersonal> findByUsuarioId(Long usuarioId);

    /**
     * Busca el horario de un día específico para un usuario.
     */
    Optional<HorarioPersonal> findByUsuarioIdAndDiaSemana(Long usuarioId, DayOfWeek diaSemana);
}
