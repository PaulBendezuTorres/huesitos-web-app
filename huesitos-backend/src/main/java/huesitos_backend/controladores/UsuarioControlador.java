package huesitos_backend.controladores;

import huesitos_backend.dto.SolicitudCambioRol;
import huesitos_backend.entidades.Rol;
import huesitos_backend.entidades.Usuario;
import huesitos_backend.servicios.AutenticacionServicio;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/usuarios")
@RequiredArgsConstructor
public class UsuarioControlador {

    private final AutenticacionServicio autenticacionServicio;

    /**
     * Endpoint para listar todos los usuarios, con filtro opcional por rol.
     */
    @GetMapping
    public ResponseEntity<?> listarUsuarios(@RequestParam(required = false) String rol) {
        try {
            Rol rolEnum = null;
            if (rol != null && !rol.trim().isEmpty()) {
                rolEnum = Rol.valueOf(rol.toUpperCase());
            }
            List<Usuario> usuarios = autenticacionServicio.listarUsuarios(rolEnum);
            return ResponseEntity.ok(usuarios);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body("El rol especificado no es válido");
        }
    }

    /**
     * Endpoint para obtener la lista de roles disponibles en el sistema.
     */
    @GetMapping("/roles")
    public ResponseEntity<Rol[]> obtenerRoles() {
        return ResponseEntity.ok(Rol.values());
    }

    /**
     * Endpoint para registrar un nuevo miembro del personal.
     */
    @PostMapping
    public ResponseEntity<?> registrarPersonal(@RequestBody Usuario usuario) {
        try {
            Usuario resultado = autenticacionServicio.registrarPersonal(usuario);
            return ResponseEntity.status(HttpStatus.CREATED).body(resultado);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

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

    /**
     * Endpoint para activar o desactivar un usuario.
     */
    @PutMapping("/{id}/estado")
    public ResponseEntity<?> cambiarEstado(@PathVariable Long id, @RequestParam boolean activo) {
        try {
            Usuario resultado = autenticacionServicio.cambiarEstadoUsuario(id, activo);
            return ResponseEntity.ok(resultado);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        }
    }
}
