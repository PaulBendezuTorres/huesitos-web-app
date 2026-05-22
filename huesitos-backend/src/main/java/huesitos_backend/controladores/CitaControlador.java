package huesitos_backend.controladores;

import huesitos_backend.entidades.Cita;
import huesitos_backend.entidades.EstadoCita;
import huesitos_backend.servicios.CitaServicio;
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
}
