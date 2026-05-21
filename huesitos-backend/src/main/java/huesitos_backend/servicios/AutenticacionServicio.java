package huesitos_backend.servicios;

import huesitos_backend.entidades.Dueño;
import huesitos_backend.entidades.Rol;
import huesitos_backend.entidades.Usuario;
import huesitos_backend.repositorios.DueñoRepositorio;
import huesitos_backend.repositorios.UsuarioRepositorio;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class AutenticacionServicio {

    private final UsuarioRepositorio usuarioRepositorio;
    private final DueñoRepositorio dueñoRepositorio;

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

        // 3. Forzar rol CLIENTE y estado activo = true
        usuario.setRol(Rol.CLIENTE);
        usuario.setActivo(true);

        // 4. Guardar primero el Usuario en su repositorio
        Usuario usuarioGuardado = usuarioRepositorio.save(usuario);
        dueño.setUsuario(usuarioGuardado);

        // 5. Guardar el Dueño en su repositorio
        return dueñoRepositorio.save(dueño);
    }
}
