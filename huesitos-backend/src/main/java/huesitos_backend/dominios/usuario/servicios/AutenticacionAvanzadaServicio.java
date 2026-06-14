package huesitos_backend.dominios.usuario.servicios;

import huesitos_backend.dominios.usuario.entidades.Usuario;
import huesitos_backend.dominios.usuario.repositorios.UsuarioRepositorio;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class AutenticacionAvanzadaServicio {

    private final UsuarioRepositorio usuarioRepositorio;
    private final PasswordEncoder passwordEncoder;
    private final CorreoServicio correoServicio;

    /**
     * Inicia el proceso de restablecimiento de contraseña para un usuario.
     * Genera un código de 6 dígitos temporal válido por 15 minutos y lo envía por
     * correo real.
     */
    @Transactional
    public void solicitarRestablecimiento(String correo) {
        Usuario usuario = usuarioRepositorio.findByCorreo(correo)
                .orElseThrow(() -> new RuntimeException("No existe un usuario registrado con ese correo electrónico"));

        // Generar un código aleatorio de 6 dígitos
        String token = String.format("%06d", new java.util.Random().nextInt(1000000));
        LocalDateTime expiracion = LocalDateTime.now().plusMinutes(15);

        usuario.setTokenRecuperacion(token);
        usuario.setExpiracionToken(expiracion);
        usuarioRepositorio.save(usuario);

        // Envío real del código al correo del usuario
        correoServicio.enviarCodigoRecuperacion(correo, token);
    }

    /**
     * Completa el proceso de restablecimiento de contraseña actualizando la
     * contraseña del usuario.
     * El token se limpia para que sea de un solo uso.
     */
    @Transactional
    public void completarRestablecimiento(String token, String nuevaContrasena) {
        Usuario usuario = usuarioRepositorio.findByTokenRecuperacion(token)
                .orElseThrow(() -> new RuntimeException("El código de recuperación no es válido"));

        if (usuario.getExpiracionToken() == null || usuario.getExpiracionToken().isBefore(LocalDateTime.now())) {
            throw new RuntimeException("El código de recuperación ha expirado. Solicita uno nuevo.");
        }

        usuario.setContrasena(passwordEncoder.encode(nuevaContrasena));
        usuario.setTokenRecuperacion(null);
        usuario.setExpiracionToken(null);
        usuarioRepositorio.save(usuario);
    }
}
