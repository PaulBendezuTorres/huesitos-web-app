package huesitos_backend.controladores;

import huesitos_backend.entidades.Dueño;
import huesitos_backend.servicios.AutenticacionServicio;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/autenticacion")
@RequiredArgsConstructor
public class AutenticacionControlador {

    private final AutenticacionServicio autenticacionServicio;

    /**
     * Endpoint para registrar un nuevo cliente (Dueño + Usuario).
     */
    @PostMapping("/registro")
    public ResponseEntity<?> registrarCliente(@RequestBody Dueño dueño) {
        try {
            Dueño resultado = autenticacionServicio.registrarCliente(dueño);
            return ResponseEntity.ok(resultado);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}
