package huesitos_backend.dominios.clinico.repositorios;

import huesitos_backend.dominios.clinico.entidades.ConsultaMedica;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ConsultaMedicaRepositorio extends JpaRepository<ConsultaMedica, Long> {

    /**
     * Busca todo el historial médico de una mascota específica
     * ordenado desde la consulta más reciente.
     *
     * @param mascotaId El ID de la mascota.
     * @return Lista de consultas médicas en orden descendente por fecha.
     */
    List<ConsultaMedica> findByMascotaIdOrderByFechaDesc(Long mascotaId);
}
