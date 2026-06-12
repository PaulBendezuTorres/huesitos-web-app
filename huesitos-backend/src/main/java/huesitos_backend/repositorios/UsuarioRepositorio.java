package huesitos_backend.repositorios;

import huesitos_backend.entidades.Usuario;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface UsuarioRepositorio extends JpaRepository<Usuario, Long> {

    /**
     * Busca un usuario por su correo electrónico.
     */
    Optional<Usuario> findByCorreo(String correo);

    /**
     * Busca un usuario por su token de recuperación de contraseña.
     */
    Optional<Usuario> findByTokenRecuperacion(String tokenRecuperacion);

    /**
     * Busca usuarios por su rol.
     */
    java.util.List<Usuario> findByRol(huesitos_backend.entidades.Rol rol);
}
