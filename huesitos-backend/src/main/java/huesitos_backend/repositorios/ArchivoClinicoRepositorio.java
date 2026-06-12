package huesitos_backend.repositorios;

import huesitos_backend.entidades.ArchivoClinico;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface ArchivoClinicoRepositorio extends JpaRepository<ArchivoClinico, Long> {

    /**
     * Busca los archivos clínicos asociados a una mascota ordenados por fecha de
     * subida descendente.
     */
    List<ArchivoClinico> findByMascotaIdOrderByFechaSubidaDesc(Long mascotaId);
}
