package huesitos_backend.servicios;

import huesitos_backend.entidades.Cita;
import huesitos_backend.entidades.EstadoCita;
import huesitos_backend.entidades.Servicio;
import huesitos_backend.repositorios.CitaRepositorio;
import huesitos_backend.repositorios.MascotaRepositorio;
import huesitos_backend.repositorios.UsuarioRepositorio;
import huesitos_backend.repositorios.ServicioRepositorio;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class CitaServicio {

    private final CitaRepositorio citaRepositorio;
    private final MascotaRepositorio mascotaRepositorio;
    private final UsuarioRepositorio usuarioRepositorio;
    private final ServicioRepositorio servicioRepositorio;

    /**
     * Agenda una nueva cita validando la existencia de la mascota,
     * del veterinario (si fue asignado) y la disponibilidad horaria.
     *
     * @param cita La cita a agendar.
     * @return La cita guardada en la base de datos.
     */
    @Transactional
    public Cita agendarCita(Cita cita) {
        // 0. Validar que el servicio exista
        if (cita.getServicio() == null || cita.getServicio().getId() == null) {
            throw new RuntimeException("El servicio especificado no existe o no está disponible");
        }
        Servicio servicioReal = servicioRepositorio.findById(cita.getServicio().getId())
            .orElseThrow(() -> new RuntimeException("El servicio especificado no existe o no está disponible"));
        cita.setServicio(servicioReal);

        // 1. Validar que la mascota exista
        if (cita.getMascota() == null || cita.getMascota().getId() == null ||
            !mascotaRepositorio.existsById(cita.getMascota().getId())) {
            throw new RuntimeException("La mascota especificada no existe");
        }

        // 2. Si tiene veterinario asignado, validar que exista
        if (cita.getVeterinario() != null && cita.getVeterinario().getId() != null) {
            if (!usuarioRepositorio.existsById(cita.getVeterinario().getId())) {
                throw new RuntimeException("El veterinario especificado no existe");
            }

            // 3. Verificar disponibilidad del veterinario (ignorando citas CANCELADAS)
            boolean existeCruce = citaRepositorio.existsByVeterinarioIdAndFechaHoraAndEstadoNot(
                    cita.getVeterinario().getId(),
                    cita.getFechaHora(),
                    EstadoCita.CANCELADA
            );
            if (existeCruce) {
                throw new RuntimeException("El veterinario ya tiene una cita programada en ese horario");
            }
        }

        // 4. Forzar estado PENDIENTE si viene vacío
        if (cita.getEstado() == null) {
            cita.setEstado(EstadoCita.PENDIENTE);
        }

        // 5. Guardar y retornar
        return citaRepositorio.save(cita);
    }

    /**
     * Cambia el estado de una cita existente.
     *
     * @param citaId El ID de la cita.
     * @param nuevoEstado El nuevo estado a asignar.
     * @return La cita actualizada.
     */
    @Transactional
    public Cita cambiarEstadoCita(Long citaId, EstadoCita nuevoEstado) {
        Cita cita = citaRepositorio.findById(citaId)
                .orElseThrow(() -> new RuntimeException("Cita no encontrada"));

        cita.setEstado(nuevoEstado);
        return citaRepositorio.save(cita);
    }

    /**
     * Lista todas las citas programadas en un día específico.
     *
     * @param fecha La fecha del día a consultar.
     * @return La lista de citas del día.
     */
    @Transactional(readOnly = true)
    public List<Cita> listarCitasPorDia(LocalDate fecha) {
        LocalDateTime inicio = fecha.atStartOfDay();
        LocalDateTime fin = fecha.atTime(LocalTime.of(23, 59, 59));
        return citaRepositorio.findByFechaHoraBetween(inicio, fin);
    }
}
