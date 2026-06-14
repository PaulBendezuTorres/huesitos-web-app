package huesitos_backend.dominios.veterinaria_servicio.repositorios;

import huesitos_backend.dominios.veterinaria_servicio.entidades.Servicio;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface ServicioRepositorio extends JpaRepository<Servicio, Long> {
    List<Servicio> findByActivoTrue();

    long countByActivoTrue();
}
