package huesitos_backend.controladores;

import huesitos_backend.entidades.Servicio;
import huesitos_backend.servicios.ServicioServicio;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/servicios")
@RequiredArgsConstructor
public class ServicioControlador {

    private final ServicioServicio servicioServicio;

    /**
     * Endpoint para registrar un nuevo servicio.
     *
     * @param servicio Los datos del servicio a registrar.
     * @return El servicio creado.
     */
    @PostMapping
    public ResponseEntity<?> crearServicio(@RequestBody Servicio servicio) {
        try {
            Servicio resultado = servicioServicio.crearServicio(servicio);
            return ResponseEntity.ok(resultado);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    /**
     * Endpoint para listar todos los servicios activos.
     * Libre de autenticación o accesible por todos.
     *
     * @return Lista de servicios activos.
     */
    @GetMapping
    public ResponseEntity<List<Servicio>> listarServiciosActivos() {
        List<Servicio> servicios = servicioServicio.listarServiciosActivos();
        return ResponseEntity.ok(servicios);
    }

    /**
     * Endpoint para desactivar lógicamente un servicio.
     *
     * @param id El ID del servicio a desactivar.
     * @return Mensaje de éxito o error.
     */
    @PutMapping("/{id}/desactivar")
    public ResponseEntity<?> desactivarServicio(@PathVariable Long id) {
        try {
            servicioServicio.desactivarServicio(id);
            return ResponseEntity.ok("Servicio desactivado con éxito");
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}
