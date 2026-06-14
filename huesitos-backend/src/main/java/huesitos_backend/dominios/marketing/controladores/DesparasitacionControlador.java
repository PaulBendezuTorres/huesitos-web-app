package huesitos_backend.dominios.marketing.controladores;

import huesitos_backend.dominios.mascota.entidades.Mascota;

import huesitos_backend.dominios.marketing.entidades.Desparasitacion;
import huesitos_backend.dominios.marketing.servicios.DesparasitacionServicio;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/desparasitaciones")
public class DesparasitacionControlador {

    private final DesparasitacionServicio desparasitacionServicio;

    @PostMapping
    public ResponseEntity<?> registrarDesparasitacion(@RequestBody Desparasitacion desparasitacion) {
        try {
            Desparasitacion resultado = desparasitacionServicio.registrarDesparasitacion(desparasitacion);
            return ResponseEntity.ok(resultado);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @GetMapping("/mascota/{mascotaId}")
    public ResponseEntity<?> obtenerPorMascota(@PathVariable Long mascotaId) {
        try {
            List<Desparasitacion> desparasitaciones = desparasitacionServicio.obtenerPorMascota(mascotaId);
            return ResponseEntity.ok(desparasitaciones);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}
