package huesitos_backend.servicios;

import huesitos_backend.entidades.Dueño;
import huesitos_backend.entidades.Rol;
import huesitos_backend.entidades.Usuario;
import huesitos_backend.repositorios.DueñoRepositorio;
import huesitos_backend.repositorios.UsuarioRepositorio;
import huesitos_backend.seguridad.TokenJwtUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class AutenticacionServicio {

    private final UsuarioRepositorio usuarioRepositorio;
    private final DueñoRepositorio dueñoRepositorio;
    private final PasswordEncoder passwordEncoder;
    private final TokenJwtUtil tokenJwtUtil;

    /**
     * Registra un nuevo cliente en el sistema.
     * Guarda el usuario asociado y luego el dueño.
     */
    @Transactional
    public Dueño registrarCliente(Dueño dueño) {
        if (dueño.getUsuario() == null) {
            throw new RuntimeException("El dueño debe tener un usuario asociado");
        }

        Usuario usuario = dueño.getUsuario();

        // 1. Verificar si el correo ya está registrado
        if (usuarioRepositorio.findByCorreo(usuario.getCorreo()).isPresent()) {
            throw new RuntimeException("El correo ya está registrado");
        }

        // 2. Verificar si el teléfono ya está registrado
        if (dueñoRepositorio.existsByTelefono(dueño.getTelefono())) {
            throw new RuntimeException("El teléfono ya está registrado");
        }

        // 3. Forzar rol CLIENTE, estado activo = true y encriptar contraseña
        usuario.setRol(Rol.CLIENTE);
        usuario.setActivo(true);
        usuario.setContrasena(passwordEncoder.encode(usuario.getContrasena()));

        // 4. Guardar primero el Usuario en su repositorio
        Usuario usuarioGuardado = usuarioRepositorio.save(usuario);
        dueño.setUsuario(usuarioGuardado);

        // 5. Guardar el Dueño en su repositorio
        return dueñoRepositorio.save(dueño);
    }

    /**
     * Inicia la sesión de un usuario verificando sus credenciales y estado.
     * Genera y retorna un Token JWT de acceso si el login es exitoso.
     *
     * @param correo El correo del usuario.
     * @param contrasena La contraseña en texto plano.
     * @return El Token JWT generado.
     */
    @Transactional(readOnly = true)
    public String iniciarSesion(String correo, String contrasena) {
        // 1. Buscar al usuario por correo
        Usuario usuario = usuarioRepositorio.findByCorreo(correo)
                .orElseThrow(() -> new RuntimeException("Credenciales incorrectas"));

        // 2. Verificar si está activo
        if (usuario.getActivo() == null || !usuario.getActivo()) {
            throw new RuntimeException("El usuario se encuentra inactivo");
        }

        // 3. Verificar la contraseña encriptada
        if (!passwordEncoder.matches(contrasena, usuario.getContrasena())) {
            throw new RuntimeException("Credenciales incorrectas");
        }

        // 4. Generar y retornar el token JWT
        return tokenJwtUtil.generarToken(usuario);
    }
}

