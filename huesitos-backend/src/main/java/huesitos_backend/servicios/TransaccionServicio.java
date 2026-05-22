package huesitos_backend.servicios;

import huesitos_backend.entidades.*;
import huesitos_backend.repositorios.CitaRepositorio;
import huesitos_backend.repositorios.TransaccionRepositorio;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class TransaccionServicio {

    private final TransaccionRepositorio transaccionRepositorio;
    private final CitaRepositorio citaRepositorio;

    /**
     * Crea una orden de pago para una cita.
     *
     * @param cita La cita para la cual se crea la orden.
     * @return La orden de pago (Transaccion) creada.
     */
    @Transactional
    public Transaccion crearOrdenPago(Cita cita) {
        if (cita.getServicio() == null) {
            throw new RuntimeException("La cita no tiene un servicio asociado");
        }

        Transaccion transaccion = new Transaccion();
        transaccion.setMonto(cita.getServicio().getPrecio());
        transaccion.setEstadoPago(EstadoPago.PENDIENTE);
        transaccion.setCita(cita);

        return transaccionRepositorio.save(transaccion);
    }

    /**
     * Registra el pago presencial de una cita de forma atómica.
     *
     * @param citaId    El ID de la cita.
     * @param medioPago El medio de pago utilizado.
     * @return La transacción de pago actualizada.
     */
    @Transactional
    public Transaccion registrarPagoPresencial(Long citaId, MedioPago medioPago) {
        Transaccion transaccion = transaccionRepositorio.findByCitaId(citaId)
                .orElseThrow(() -> new RuntimeException("Orden de pago no encontrada para esta cita"));

        if (transaccion.getEstadoPago() != EstadoPago.PENDIENTE) {
            throw new RuntimeException("Esta cita ya se encuentra pagada");
        }

        transaccion.setEstadoPago(EstadoPago.APROBADO);
        transaccion.setMedioPago(medioPago);
        transaccion.setFechaPago(LocalDateTime.now());
        Transaccion transaccionGuardada = transaccionRepositorio.save(transaccion);

        Cita cita = transaccionGuardada.getCita();
        cita.setEstado(EstadoCita.CONFIRMADA);
        citaRepositorio.save(cita);

        return transaccionGuardada;
    }

    /**
     * Registra el pago virtual de una cita de forma atómica.
     *
     * @param citaId                El ID de la cita.
     * @param medioPago             El medio de pago (CULQI, MERCADO_PAGO).
     * @param idTransaccionPasarela El ID único devuelto por la pasarela de pagos.
     * @return La transacción de pago actualizada.
     */
    @Transactional
    public Transaccion registrarPagoVirtual(Long citaId, MedioPago medioPago, String idTransaccionPasarela) {
        Transaccion transaccion = transaccionRepositorio.findByCitaId(citaId)
                .orElseThrow(() -> new RuntimeException("Orden de pago no encontrada para esta cita"));

        if (transaccion.getEstadoPago() != EstadoPago.PENDIENTE) {
            throw new RuntimeException("Esta cita ya se encuentra pagada");
        }

        transaccion.setEstadoPago(EstadoPago.APROBADO);
        transaccion.setMedioPago(medioPago);
        transaccion.setFechaPago(LocalDateTime.now());
        transaccion.setIdTransaccionPasarela(idTransaccionPasarela);
        Transaccion transaccionGuardada = transaccionRepositorio.save(transaccion);

        Cita cita = transaccionGuardada.getCita();
        cita.setEstado(EstadoCita.CONFIRMADA);
        citaRepositorio.save(cita);

        return transaccionGuardada;
    }
}
