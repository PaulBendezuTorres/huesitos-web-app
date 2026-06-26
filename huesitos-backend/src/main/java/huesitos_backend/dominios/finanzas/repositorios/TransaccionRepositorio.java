package huesitos_backend.dominios.finanzas.repositorios;

import huesitos_backend.dominios.finanzas.entidades.EstadoPago;
import huesitos_backend.dominios.finanzas.entidades.MedioPago;
import huesitos_backend.dominios.finanzas.entidades.Transaccion;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

public interface TransaccionRepositorio extends JpaRepository<Transaccion, Long> {

    List<Transaccion> findAllByOrderByFechaCreacionDesc();

    @Query("SELECT COALESCE(SUM(t.monto), 0) FROM Transaccion t WHERE t.estadoPago = 'APROBADO'")
    BigDecimal sumarIngresosAprobados();

    @Query("SELECT COALESCE(SUM(t.monto), 0) FROM Transaccion t WHERE t.estadoPago = 'APROBADO' AND t.fechaActualizacion BETWEEN :inicio AND :fin")
    BigDecimal sumarIngresosPorRangoFecha(@Param("inicio") LocalDateTime inicio, @Param("fin") LocalDateTime fin);

    @Query("SELECT COALESCE(SUM(t.monto), 0) FROM Transaccion t WHERE t.estadoPago = 'APROBADO' AND t.medioPago IN :medios AND t.fechaActualizacion BETWEEN :inicio AND :fin")
    BigDecimal sumarIngresosPorMediosYFecha(@Param("medios") List<MedioPago> medios,
            @Param("inicio") LocalDateTime inicio, @Param("fin") LocalDateTime fin);

    // Corregido: countBy... debe coincidir con los nombres de campos de tu entidad
    long countByEstadoPagoAndFechaCreacionBetween(EstadoPago estado, LocalDateTime inicio, LocalDateTime fin);

    java.util.Optional<Transaccion> findByCitaId(Long citaId);

    @Query("SELECT t FROM Transaccion t LEFT JOIN FETCH t.cita c LEFT JOIN FETCH c.servicio WHERE t.id = :id")
    java.util.Optional<Transaccion> findByIdConCitaYServicio(@Param("id") Long id);

    java.util.Optional<Transaccion> findByIdTransaccionPasarela(String idTransaccionPasarela);

    java.util.Optional<Transaccion> findByReferenciaPago(String referenciaPago);

    @Query("SELECT COUNT(t) FROM Transaccion t WHERE t.cita.mascota.dueño.id = :dueñoId AND t.referenciaPago = :referenciaPago AND t.cita.estado <> 'CANCELADA'")
    long contarUsosDeCampanaPorCliente(@Param("dueñoId") Long dueñoId, @Param("referenciaPago") String referenciaPago);
}