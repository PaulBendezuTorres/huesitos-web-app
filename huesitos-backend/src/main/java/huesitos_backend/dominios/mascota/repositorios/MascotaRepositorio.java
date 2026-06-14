package huesitos_backend.dominios.mascota.repositorios;

import huesitos_backend.dominios.mascota.entidades.Mascota;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface MascotaRepositorio extends JpaRepository<Mascota, Long> {

    /**
     * Busca todas las mascotas que pertenecen a un dueño específico.
     *
     * @param dueñoId El ID del dueño.
     * @return La lista de mascotas asociadas a ese dueño.
     */
    List<Mascota> findByDueñoId(Long dueñoId);
}
