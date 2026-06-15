package huesitos_backend.dominios.marketing.repositorios;

import huesitos_backend.dominios.marketing.entidades.Oferta;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.time.LocalDate;
import java.util.List;

public interface OfertaRepositorio extends JpaRepository<Oferta, Long> {
    List<Oferta> findByActivoTrue();

    List<Oferta> findByActivoTrueAndFechaFinBefore(LocalDate fecha);

    @Modifying
    @Query("UPDATE Oferta o SET o.campana = null WHERE o.campana.id = :campanaId")
    void desvincularCampana(@Param("campanaId") Long campanaId);
}
