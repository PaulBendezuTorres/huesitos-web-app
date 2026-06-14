package huesitos_backend.dominios.usuario.controladores;

import huesitos_backend.dominios.usuario.entidades.Rol;
import huesitos_backend.dominios.usuario.entidades.Usuario;
import huesitos_backend.dominios.usuario.servicios.UsuarioServicio;
import lombok.Data;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/usuarios")
@RequiredArgsConstructor
@PreAuthorize("hasRole('ADMINISTRADOR')")
public class UsuarioControlador {

    private final UsuarioServicio usuarioServicio;

    @GetMapping
    public ResponseEntity<List<Usuario>> listarUsuarios() {
        return ResponseEntity.ok(usuarioServicio.listarTodos());
    }

    @GetMapping("/{id}/dueño")
    public ResponseEntity<?> obtenerDatosDueño(@PathVariable Long id) {
        return usuarioServicio.obtenerDatosDueño(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // ==========================================
    // NUEVO ENDPOINT: CREACIÓN DE PERSONAL
    // ==========================================
    @PostMapping
    public ResponseEntity<?> registrarPersonal(@RequestBody SolicitudRegistro dto) {
        try {
            Usuario resultado = usuarioServicio.registrarPersonal(dto.getCorreo(), dto.getContrasena(), dto.getRol());
            return ResponseEntity.status(HttpStatus.CREATED).body(resultado);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PatchMapping("/{id}/rol")
    public ResponseEntity<?> cambiarRol(@PathVariable Long id, @RequestParam Rol rol) {
        try {
            Usuario usuarioActualizado = usuarioServicio.cambiarRolUsuario(id, rol);
            return ResponseEntity.ok(usuarioActualizado);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PatchMapping("/{id}/estado")
    public ResponseEntity<?> cambiarEstado(@PathVariable Long id, @RequestParam Boolean activo) {
        try {
            Usuario resultado = usuarioServicio.cambiarEstadoUsuario(id, activo);
            return ResponseEntity.ok(resultado);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PatchMapping("/{id}/credenciales")
    public ResponseEntity<?> actualizarCredenciales(@PathVariable Long id, @RequestBody SolicitudCredenciales dto) {
        try {
            Usuario resultado = usuarioServicio.actualizarCredenciales(id, dto.getCorreo(), dto.getContrasena());
            return ResponseEntity.ok(resultado);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> eliminarUsuario(@PathVariable Long id) {
        try {
            usuarioServicio.eliminarUsuario(id);
            return ResponseEntity.ok("Usuario eliminado con éxito.");
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @Data
    static class SolicitudCredenciales {
        private String correo;
        private String contrasena;
    }

    @Data
    static class SolicitudRegistro {
        private String correo;
        private String contrasena;
        private Rol rol;
    }
}