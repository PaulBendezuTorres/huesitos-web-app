package huesitos_backend.dominios.mascota.controladores;

import huesitos_backend.dominios.mascota.entidades.Mascota;
import huesitos_backend.dominios.mascota.servicios.MascotaServicio;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/mascotas")
@RequiredArgsConstructor
public class MascotaControlador {

    private final MascotaServicio mascotaServicio;

    /**
     * Endpoint para registrar una nueva mascota.
     *
     * @param mascota Los datos de la mascota a registrar.
     * @return La mascota registrada o BadRequest si falla.
     */
    @PostMapping
    public ResponseEntity<?> registrarMascota(@RequestBody Mascota mascota) {
        try {
            Mascota resultado = mascotaServicio.registrarMascota(mascota);
            return ResponseEntity.ok(resultado);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    /**
     * Endpoint para listar todas las mascotas de un dueño.
     *
     * @param duenoId El ID del dueño.
     * @return Lista de mascotas asociadas.
     */
    @GetMapping("/dueno/{duenoId}")
    public ResponseEntity<List<Mascota>> listarPorDueño(@PathVariable Long duenoId) {
        List<Mascota> mascotas = mascotaServicio.obtenerMascotasPorDueño(duenoId);
        return ResponseEntity.ok(mascotas);
    }

    /**
     * Endpoint para buscar una mascota por su ID.
     *
     * @param id El ID de la mascota.
     * @return La mascota encontrada o NotFound si no existe.
     */
    @GetMapping("/{id}")
    public ResponseEntity<?> buscarPorId(@PathVariable Long id) {
        try {
            Mascota resultado = mascotaServicio.obtenerMascotaPorId(id);
            return ResponseEntity.ok(resultado);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        }
    }

    /**
     * Endpoint para actualizar los datos de una mascota.
     */
    @PutMapping("/{id}")
    public ResponseEntity<?> actualizarMascota(
            @PathVariable Long id,
            @RequestBody Mascota mascota,
            java.security.Principal principal) {
        try {
            Mascota resultado = mascotaServicio.actualizarMascota(id, mascota, principal.getName());
            return ResponseEntity.ok(resultado);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    /**
     * Endpoint para eliminar una mascota validando la contraseña del usuario.
     */
    @PostMapping("/{id}/eliminar")
    public ResponseEntity<?> eliminarMascota(
            @PathVariable Long id,
            @RequestBody huesitos_backend.dominios.mascota.dto.SolicitudEliminarMascota solicitud,
            java.security.Principal principal) {
        if (solicitud == null || solicitud.getContrasena() == null || solicitud.getContrasena().trim().isEmpty()) {
            return ResponseEntity.badRequest().body("La contraseña de confirmación es requerida");
        }
        try {
            mascotaServicio.eliminarMascota(id, solicitud.getContrasena(), principal.getName());
            return ResponseEntity.ok("Mascota eliminada con éxito");
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}
