package huesitos_backend.controladores;

import huesitos_backend.dto.RespuestaLogin;
import huesitos_backend.entidades.Dueño;
import huesitos_backend.entidades.Usuario;
import huesitos_backend.repositorios.UsuarioRepositorio;
import huesitos_backend.servicios.AutenticacionServicio;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
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
    private final UsuarioRepositorio usuarioRepositorio;

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

    /**
     * Endpoint para iniciar sesión.
     */
    @PostMapping("/login")
    public ResponseEntity<?> iniciarSesion(@RequestBody Usuario datosLogin) {
        try {
            String token = autenticacionServicio.iniciarSesion(datosLogin.getCorreo(), datosLogin.getContrasena());
            
            Usuario usuario = usuarioRepositorio.findByCorreo(datosLogin.getCorreo())
                    .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));
            
            RespuestaLogin respuesta = new RespuestaLogin(token, usuario.getCorreo(), usuario.getRol().name());
            return ResponseEntity.ok(respuesta);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(e.getMessage());
        }
    }
}
