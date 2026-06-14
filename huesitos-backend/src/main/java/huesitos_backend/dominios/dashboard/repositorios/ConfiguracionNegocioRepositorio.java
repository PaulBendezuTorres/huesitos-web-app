package huesitos_backend.dominios.dashboard.repositorios;

import huesitos_backend.dominios.dashboard.entidades.ConfiguracionNegocio;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ConfiguracionNegocioRepositorio extends JpaRepository<ConfiguracionNegocio, Long> {
}