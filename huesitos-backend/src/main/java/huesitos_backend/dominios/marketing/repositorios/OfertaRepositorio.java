package huesitos_backend.dominios.marketing.repositorios;

import huesitos_backend.dominios.marketing.entidades.Oferta;
import org.springframework.data.jpa.repository.JpaRepository;
import java.time.LocalDate;
import java.util.List;

public interface OfertaRepositorio extends JpaRepository<Oferta, Long> {
    List<Oferta> findByActivoTrue();

    List<Oferta> findByActivoTrueAndFechaFinBefore(LocalDate fecha);
}
