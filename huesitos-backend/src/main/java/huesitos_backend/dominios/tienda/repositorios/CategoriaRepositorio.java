package huesitos_backend.dominios.tienda.repositorios;

import huesitos_backend.dominios.tienda.entidades.Categoria;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

public interface CategoriaRepositorio extends JpaRepository<Categoria, Long> {
    List<Categoria> findByActivoTrue();

    Optional<Categoria> findByNombreAndActivoTrue(String nombre);
}
