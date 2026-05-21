package huesitos_backend.repositorios;

import huesitos_backend.entidades.Dueno;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface DuenoRepositorio extends JpaRepository<Dueno, Long> {

    /**
     * Verifica si ya existe un dueño registrado con un número de teléfono específico.
     */
    boolean existsByTelefono(String telefono);
}
