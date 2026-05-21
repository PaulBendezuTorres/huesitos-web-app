package huesitos_backend.repositorios;

import huesitos_backend.entidades.Dueño;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface DueñoRepositorio extends JpaRepository<Dueño, Long> {

    /**
     * Verifica si ya existe un dueño registrado con un número de teléfono específico.
     */
    boolean existsByTelefono(String telefono);
}
