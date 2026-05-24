package huesitos_backend.repositorios;

import huesitos_backend.entidades.Transaccion;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.util.Optional;
import java.time.LocalDateTime;
import java.math.BigDecimal;

@Repository
public interface TransaccionRepositorio extends JpaRepository<Transaccion, Long> {
    Optional<Transaccion> findByCitaId(Long citaId);
    java.util.List<Transaccion> findByCitaMascotaDueñoUsuarioId(Long usuarioId);
    java.util.List<Transaccion> findByEstadoPago(huesitos_backend.entidades.EstadoPago estadoPago);

    @Query("SELECT SUM(t.monto) FROM Transaccion t WHERE t.estadoPago = 'APROBADO' AND t.fechaPago >= :inicio AND t.fechaPago <= :fin")
    BigDecimal sumarMontoPorFechaPagoBetween(@Param("inicio") LocalDateTime inicio, @Param("fin") LocalDateTime fin);

    @Query("SELECT SUM(t.monto) FROM Transaccion t WHERE t.estadoPago = 'APROBADO'")
    BigDecimal sumarMontoTotalAprobado();
}
