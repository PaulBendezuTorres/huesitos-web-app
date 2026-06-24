package huesitos_backend.dominios.finanzas.servicios;

import huesitos_backend.dominios.finanzas.dto.ReporteFinanciero;
import huesitos_backend.dominios.cita.entidades.Cita;
import huesitos_backend.dominios.finanzas.entidades.EstadoPago;
import huesitos_backend.dominios.finanzas.entidades.MedioPago;
import huesitos_backend.dominios.finanzas.entidades.Transaccion;
import huesitos_backend.dominios.finanzas.repositorios.TransaccionRepositorio;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.Arrays;
import java.util.List;

@Service
@RequiredArgsConstructor
public class TransaccionServicio {

    private final TransaccionRepositorio transaccionRepositorio;
    private final huesitos_backend.dominios.marketing.repositorios.CampanaRepositorio campanaRepositorio;

    @Transactional(readOnly = true)
    public List<Transaccion> listarTodas() {
        return transaccionRepositorio.findAllByOrderByFechaCreacionDesc();
    }

    @Transactional(readOnly = true)
    public ReporteFinanciero generarReporteDiario(LocalDate fecha) {
        LocalDateTime inicioDia = fecha.atStartOfDay();
        LocalDateTime finDia = fecha.atTime(LocalTime.MAX);

        BigDecimal total = transaccionRepositorio.sumarIngresosPorRangoFecha(inicioDia, finDia);

        BigDecimal efectivo = transaccionRepositorio.sumarIngresosPorMediosYFecha(
                Arrays.asList(MedioPago.EFECTIVO), inicioDia, finDia);

        BigDecimal tarjetas = transaccionRepositorio.sumarIngresosPorMediosYFecha(
                Arrays.asList(MedioPago.TARJETA_CREDITO, MedioPago.TARJETA_DEBITO), inicioDia, finDia);

        BigDecimal transferencia = transaccionRepositorio.sumarIngresosPorMediosYFecha(
                Arrays.asList(MedioPago.TRANSFERENCIA, MedioPago.YAPE, MedioPago.PLIN), inicioDia, finDia);

        long completadas = transaccionRepositorio.countByEstadoPagoAndFechaCreacionBetween(EstadoPago.APROBADO,
                inicioDia, finDia);
        long pendientes = transaccionRepositorio.countByEstadoPagoAndFechaCreacionBetween(EstadoPago.PENDIENTE,
                inicioDia, finDia);

        ReporteFinanciero reporte = new ReporteFinanciero();
        reporte.setTotalIngresos(total != null ? total : BigDecimal.ZERO);
        reporte.setIngresosEfectivo(efectivo != null ? efectivo : BigDecimal.ZERO);
        reporte.setIngresosTarjeta(tarjetas != null ? tarjetas : BigDecimal.ZERO);
        reporte.setIngresosTransferencia(transferencia != null ? transferencia : BigDecimal.ZERO);
        reporte.setTransaccionesCompletadas(completadas);
        reporte.setTransaccionesPendientes(pendientes);

        return reporte;
    }

    @Transactional
    public Transaccion procesarPagoCaja(Long id, MedioPago medio, String referencia) {
        Transaccion t = transaccionRepositorio.findById(id)
                .orElseThrow(() -> new RuntimeException("Transacción no encontrada"));

        t.setMedioPago(medio);
        t.setEstadoPago(EstadoPago.APROBADO);
        t.setReferenciaPago(referencia);

        return transaccionRepositorio.save(t);
    }

    @Transactional
    public Transaccion registrarPagoExitosoPasarela(Long transaccionId, String idTransaccionPasarela, String referencia) {
        Transaccion t = transaccionRepositorio.findById(transaccionId)
                .orElseThrow(() -> new RuntimeException("Transacción no encontrada con ID: " + transaccionId));

        t.setMedioPago(MedioPago.MERCADO_PAGO);
        t.setEstadoPago(EstadoPago.APROBADO);
        t.setIdTransaccionPasarela(idTransaccionPasarela);
        t.setReferenciaPago(referencia);
        t.setFechaPago(LocalDateTime.now());

        return transaccionRepositorio.save(t);
    }

    @Transactional(readOnly = true)
    public Transaccion obtenerPorCitaId(Long citaId) {
        return transaccionRepositorio.findByCitaId(citaId)
                .orElseThrow(() -> new RuntimeException("Transacción no encontrada para la cita: " + citaId));
    }

    // ====================================================================
    // NUEVO MÉTODO AÑADIDO: Para crear el pago automáticamente al agendar
    // ====================================================================
    @Transactional
    public void crearOrdenPago(Cita cita) {
        Transaccion transaccion = new Transaccion();
        transaccion.setCita(cita);
        transaccion.setEstadoPago(EstadoPago.PENDIENTE);
        transaccion.setReferenciaPago("SISTEMA_CITA");

        BigDecimal monto = BigDecimal.ZERO;
        if (cita.getServicio() != null) {
            monto = cita.getServicio().getPrecio();
            
            // Buscar si hay campañas activas que contengan este servicio
            LocalDate hoy = LocalDate.now();
            List<huesitos_backend.dominios.marketing.entidades.Campana> campanasActivas = campanaRepositorio.findByActivoTrue();
            for (huesitos_backend.dominios.marketing.entidades.Campana campana : campanasActivas) {
                if (!hoy.isBefore(campana.getFechaInicio()) && !hoy.isAfter(campana.getFechaFin())) {
                    boolean contieneServicio = campana.getServicios().stream()
                            .anyMatch(s -> s.getId().equals(cita.getServicio().getId()));
                    if (contieneServicio && campana.getPrecioPromocional() != null) {
                        monto = campana.getPrecioPromocional();
                        transaccion.setReferenciaPago("CAMPANA_" + campana.getId());
                        break;
                    }
                }
            }
        }
        transaccion.setMonto(monto != null ? monto : BigDecimal.ZERO);

        transaccionRepositorio.save(transaccion);
    }
}