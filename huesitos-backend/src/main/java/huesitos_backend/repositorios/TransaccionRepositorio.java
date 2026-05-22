package huesitos_backend.repositorios;

import huesitos_backend.entidades.Transaccion;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;

@Repository
public interface TransaccionRepositorio extends JpaRepository<Transaccion, Long> {
    Optional<Transaccion> findByCitaId(Long citaId);
}
