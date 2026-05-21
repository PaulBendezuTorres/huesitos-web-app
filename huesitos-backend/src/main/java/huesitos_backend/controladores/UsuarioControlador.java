package huesitos_backend.controladores;

import huesitos_backend.dto.SolicitudCambioRol;
import huesitos_backend.entidades.Rol;
import huesitos_backend.entidades.Usuario;
import huesitos_backend.servicios.AutenticacionServicio;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/usuarios")
@RequiredArgsConstructor
public class UsuarioControlador {

    private final AutenticacionServicio autenticacionServicio;

    /**
     * Endpoint para actualizar el rol de un usuario.
     */
    @PutMapping("/{id}/rol")
    public ResponseEntity<?> cambiarRol(@PathVariable Long id, @RequestBody SolicitudCambioRol solicitud) {
        try {
            Rol nuevoRol = Rol.valueOf(solicitud.rol());
            Usuario usuarioActualizado = autenticacionServicio.cambiarRolUsuario(id, nuevoRol);
            return ResponseEntity.ok(usuarioActualizado);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("El rol especificado no es válido");
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        }
    }
}
