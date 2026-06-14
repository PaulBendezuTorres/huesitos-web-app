package huesitos_backend.dominios.dashboard.repositorios;

import huesitos_backend.dominios.usuario.entidades.Usuario;

import huesitos_backend.dominios.dashboard.entidades.ConfiguracionRol;
import huesitos_backend.dominios.usuario.entidades.Rol;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface ConfiguracionRolRepositorio extends JpaRepository<ConfiguracionRol, Long> {

    /**
     * Busca la configuración asociada a un rol específico.
     */
    Optional<ConfiguracionRol> findByRol(Rol rol);
}
