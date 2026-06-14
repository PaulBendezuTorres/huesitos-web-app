package huesitos_backend.dominios.clinico.repositorios;

import huesitos_backend.dominios.clinico.entidades.Vacuna;
import org.springframework.data.jpa.repository.JpaRepository;

public interface VacunaRepositorio extends JpaRepository<Vacuna, Long> {
}
