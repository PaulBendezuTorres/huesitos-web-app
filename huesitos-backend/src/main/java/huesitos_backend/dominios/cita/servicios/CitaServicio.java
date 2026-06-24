package huesitos_backend.dominios.cita.servicios;

import huesitos_backend.dominios.cita.entidades.Cita;
import huesitos_backend.dominios.cita.entidades.EstadoCita;
import huesitos_backend.dominios.veterinaria_servicio.entidades.Servicio;
import huesitos_backend.dominios.cita.repositorios.CitaRepositorio;
import huesitos_backend.dominios.mascota.repositorios.MascotaRepositorio;
import huesitos_backend.dominios.usuario.repositorios.UsuarioRepositorio;
import huesitos_backend.dominios.usuario.entidades.Usuario;
import huesitos_backend.dominios.veterinaria_servicio.repositorios.ServicioRepositorio;
import huesitos_backend.dominios.finanzas.servicios.TransaccionServicio;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import huesitos_backend.dominios.usuario.entidades.HorarioPersonal;
import huesitos_backend.dominios.usuario.repositorios.HorarioPersonalRepositorio;
import java.time.DayOfWeek;
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
    private final TransaccionServicio transaccionServicio;
    private final HorarioPersonalRepositorio horarioPersonalRepositorio;

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
                    EstadoCita.CANCELADA);
            if (existeCruce) {
                throw new RuntimeException("El veterinario ya tiene una cita programada en ese horario");
            }

            // Validar horario de atención del veterinario (dinámico)
            validarHorarioAtencion(cita.getVeterinario().getId(), cita.getFechaHora());
        }

        // 4. Forzar estado PENDIENTE si viene vacío
        if (cita.getEstado() == null) {
            cita.setEstado(EstadoCita.PENDIENTE);
        }

        // 5. Guardar y retornar con orden de pago
        Cita citaNueva = citaRepositorio.save(cita);
        transaccionServicio.crearOrdenPago(citaNueva);
        return citaNueva;
    }

    /**
     * Cambia el estado de una cita existente.
     *
     * @param citaId      El ID de la cita.
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

    /**
     * Cancela una cita cambiando su estado a CANCELADA.
     *
     * @param citaId El ID de la cita.
     * @return La cita actualizada.
     */
    @Transactional
    public Cita cancelarCita(Long citaId) {
        return cambiarEstadoCita(citaId, EstadoCita.CANCELADA);
    }

    /**
     * Registra el check-in de una cita, cambiando su estado a EN_ESPERA.
     *
     * @param citaId El ID de la cita.
     * @return La cita actualizada.
     */
    @Transactional
    public Cita checkInCita(Long citaId) {
        return cambiarEstadoCita(citaId, EstadoCita.EN_ESPERA);
    }

    /**
     * Reprograma una cita validando la disponibilidad del veterinario.
     *
     * @param citaId         El ID de la cita.
     * @param nuevaFechaHora La nueva fecha y hora para la cita.
     * @return La cita actualizada.
     */
    @Transactional
    public Cita reprogramarCita(Long citaId, LocalDateTime nuevaFechaHora) {
        Cita cita = citaRepositorio.findById(citaId)
                .orElseThrow(() -> new RuntimeException("Cita no encontrada"));

        // Validar que la nueva fecha no esté en el pasado
        if (nuevaFechaHora.isBefore(LocalDateTime.now())) {
            throw new RuntimeException("No se puede reprogramar una cita a una fecha y hora pasada");
        }

        // Si tiene veterinario asignado, validar cruces
        if (cita.getVeterinario() != null && cita.getVeterinario().getId() != null) {
            boolean existeCruce = citaRepositorio.existsByVeterinarioIdAndFechaHoraAndEstadoNotAndIdNot(
                    cita.getVeterinario().getId(),
                    nuevaFechaHora,
                    EstadoCita.CANCELADA,
                    citaId);
            if (existeCruce) {
                throw new RuntimeException("El veterinario ya tiene otra cita programada en ese horario");
            }

            // Validar horario de atención del veterinario (dinámico)
            validarHorarioAtencion(cita.getVeterinario().getId(), nuevaFechaHora);
        }

        cita.setFechaHora(nuevaFechaHora);
        return citaRepositorio.save(cita);
    }

    /**
     * Valida si la cita se encuentra dentro del horario de atención del
     * veterinario.
     * Si no hay horarios configurados para el veterinario, se omite la validación.
     */
    private void validarHorarioAtencion(Long veterinarioId, LocalDateTime fechaHora) {
        if (veterinarioId == null)
            return;

        List<HorarioPersonal> horarios = horarioPersonalRepositorio.findByUsuarioId(veterinarioId);
        if (horarios.isEmpty()) {
            return; // Omite validación si no hay horarios configurados
        }

        DayOfWeek diaCita = fechaHora.getDayOfWeek();
        LocalTime horaCita = fechaHora.toLocalTime();

        HorarioPersonal horario = horarios.stream()
                .filter(h -> h.getDiaSemana() == diaCita)
                .findFirst()
                .orElseThrow(
                        () -> new RuntimeException("El veterinario no atiende los días " + traducirDiaSemana(diaCita)));

        if (!horario.getActivo() || horario.getHoraEntrada() == null || horario.getHoraSalida() == null) {
            throw new RuntimeException("El veterinario no labora el día " + traducirDiaSemana(diaCita));
        }

        if (horaCita.isBefore(horario.getHoraEntrada()) || horaCita.isAfter(horario.getHoraSalida())) {
            throw new RuntimeException("La cita está fuera del horario de atención del veterinario ("
                    + horario.getHoraEntrada() + " a " + horario.getHoraSalida() + ")");
        }
    }

    /**
     * Lista citas aplicando filtros avanzados de rango de fechas, veterinario y
     * estado.
     *
     * @param inicio        Fecha de inicio de búsqueda (opcional).
     * @param fin           Fecha de fin de búsqueda (opcional).
     * @param veterinarioId ID del veterinario (opcional).
     * @param estado        Estado de la cita (opcional).
     * @return Lista de citas filtradas.
     */
    @Transactional(readOnly = true)
    public List<Cita> listarCitasConFiltros(LocalDate inicio, LocalDate fin, Long veterinarioId, EstadoCita estado) {
        LocalDateTime inicioLDT = (inicio != null) ? inicio.atStartOfDay() : null;
        LocalDateTime finLDT = (fin != null) ? fin.atTime(LocalTime.of(23, 59, 59)) : null;

        return citaRepositorio.buscarCitasConFiltros(inicioLDT, finLDT, veterinarioId, estado);
    }

    /**
     * Traduce DayOfWeek a su equivalente en español.
     */
    private String traducirDiaSemana(DayOfWeek day) {
        return switch (day) {
            case MONDAY -> "Lunes";
            case TUESDAY -> "Martes";
            case WEDNESDAY -> "Miércoles";
            case THURSDAY -> "Jueves";
            case FRIDAY -> "Viernes";
            case SATURDAY -> "Sábado";
            case SUNDAY -> "Domingo";
        };
    }

    /**
     * Obtiene la lista de todos los veterinarios activos.
     */
    @Transactional(readOnly = true)
    public List<Usuario> obtenerVeterinariosActivos() {
        return usuarioRepositorio.findByRol(huesitos_backend.dominios.usuario.entidades.Rol.VETERINARIO)
                .stream()
                .filter(Usuario::getActivo)
                .toList();
    }
}
