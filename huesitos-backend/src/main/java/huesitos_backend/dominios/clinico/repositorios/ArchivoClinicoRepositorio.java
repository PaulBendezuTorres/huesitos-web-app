package huesitos_backend.dominios.clinico.repositorios;

import huesitos_backend.dominios.mascota.entidades.Mascota;

import huesitos_backend.dominios.clinico.entidades.ArchivoClinico;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface ArchivoClinicoRepositorio extends JpaRepository<ArchivoClinico, Long> {

    /**
     * Busca los archivos clínicos asociados a una mascota ordenados por fecha de
     * subida descendente.
     */
    List<ArchivoClinico> findByMascotaIdOrderByFechaSubidaDesc(Long mascotaId);
}
