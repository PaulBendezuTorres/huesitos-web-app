package huesitos_backend.dominios.cita.controladores;

import huesitos_backend.dominios.cita.dto.SolicitudReprogramacion;
import huesitos_backend.dominios.cita.entidades.Cita;
import huesitos_backend.dominios.cita.entidades.EstadoCita;
import huesitos_backend.dominios.cita.servicios.CitaServicio;
import huesitos_backend.dominios.usuario.entidades.Usuario;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/citas")
@RequiredArgsConstructor
public class CitaControlador {

    private final CitaServicio citaServicio;

    /**
     * Endpoint para agendar una nueva cita.
     *
     * @param cita Los datos de la cita a agendar.
     * @return La cita agendada o BadRequest si falla.
     */
    @PostMapping
    public ResponseEntity<?> agendarCita(@RequestBody Cita cita) {
        try {
            Cita resultado = citaServicio.agendarCita(cita);
            return ResponseEntity.ok(resultado);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    /**
     * Endpoint para cambiar el estado de una cita existente.
     *
     * @param id El ID de la cita.
     * @param nuevoEstado El nuevo estado como texto (ej: "CONFIRMADA").
     * @return La cita actualizada o un mensaje de error.
     */
    @PutMapping("/{id}/estado")
    public ResponseEntity<?> cambiarEstado(@PathVariable Long id, @RequestBody String nuevoEstado) {
        try {
            // Limpiar comillas y espacios que puedan venir en el body
            String estadoLimpio = nuevoEstado.replace("\"", "").trim();
            EstadoCita estado = EstadoCita.valueOf(estadoLimpio);
            Cita resultado = citaServicio.cambiarEstadoCita(id, estado);
            return ResponseEntity.ok(resultado);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body("El estado especificado no es válido");
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    /**
     * Endpoint para listar todas las citas de un día específico (calendario diario).
     *
     * @param fecha La fecha del día a consultar (formato ISO: yyyy-MM-dd).
     * @return Lista de citas del día.
     */
    @GetMapping("/calendario")
    public ResponseEntity<List<Cita>> listarPorDia(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate fecha) {
        List<Cita> citas = citaServicio.listarCitasPorDia(fecha);
        return ResponseEntity.ok(citas);
    }

    /**
     * Endpoint para cancelar una cita.
     *
     * @param id El ID de la cita.
     * @return La cita cancelada o un mensaje de error.
     */
    @PutMapping("/{id}/cancelar")
    public ResponseEntity<?> cancelarCita(@PathVariable Long id) {
        try {
            Cita resultado = citaServicio.cancelarCita(id);
            return ResponseEntity.ok(resultado);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    /**
     * Endpoint para registrar el check-in (llegada) de una cita.
     *
     * @param id El ID de la cita.
     * @return La cita con estado EN_ESPERA o un mensaje de error.
     */
    @PutMapping("/{id}/check-in")
    public ResponseEntity<?> checkInCita(@PathVariable Long id) {
        try {
            Cita resultado = citaServicio.checkInCita(id);
            return ResponseEntity.ok(resultado);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    /**
     * Endpoint para reprogramar una cita a una nueva fecha y hora.
     *
     * @param id El ID de la cita.
     * @param solicitud El DTO con la nueva fecha y hora.
     * @return La cita reprogramada o un mensaje de error.
     */
    @PutMapping("/{id}/reprogramar")
    public ResponseEntity<?> reprogramarCita(@PathVariable Long id, @RequestBody SolicitudReprogramacion solicitud) {
        try {
            if (solicitud == null || solicitud.nuevaFechaHora() == null) {
                return ResponseEntity.badRequest().body("La nueva fecha y hora es requerida");
            }
            Cita resultado = citaServicio.reprogramarCita(id, solicitud.nuevaFechaHora());
            return ResponseEntity.ok(resultado);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    /**
     * Endpoint para consultar la agenda global de citas con filtros avanzados.
     *
     * @param inicio Fecha de inicio de búsqueda (opcional).
     * @param fin Fecha de fin de búsqueda (opcional).
     * @param veterinarioId ID del veterinario (opcional).
     * @param estado Estado de la cita (opcional).
     * @return Lista de citas que coinciden con los filtros aplicados.
     */
    @GetMapping("/agenda")
    public ResponseEntity<List<Cita>> consultarAgenda(
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate inicio,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate fin,
            @RequestParam(required = false) Long veterinarioId,
            @RequestParam(required = false) EstadoCita estado) {
        List<Cita> resultado = citaServicio.listarCitasConFiltros(inicio, fin, veterinarioId, estado);
        return ResponseEntity.ok(resultado);
    }

    /**
     * Endpoint para obtener la lista de veterinarios activos.
     * Accesible por CLIENTE y otros roles ya que no está restringido a nivel de clase.
     */
    @GetMapping("/veterinarios")
    public ResponseEntity<List<Usuario>> obtenerVeterinarios() {
        return ResponseEntity.ok(citaServicio.obtenerVeterinariosActivos());
    }
}
