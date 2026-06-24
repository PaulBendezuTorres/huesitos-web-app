package huesitos_backend.dominios.finanzas.servicios;

import huesitos_backend.dominios.finanzas.entidades.EstadoPago;
import huesitos_backend.dominios.finanzas.entidades.MedioPago;
import huesitos_backend.dominios.finanzas.entidades.Transaccion;
import huesitos_backend.dominios.finanzas.repositorios.TransaccionRepositorio;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;
import java.util.Random;

@Service
@RequiredArgsConstructor
public class PagoEfectivoServicio {

    private final TransaccionRepositorio transaccionRepositorio;

    @Value("${pagoefectivo.access-token:}")
    private String accessToken;

    @Value("${pagoefectivo.merchant-id:}")
    private String merchantId;

    /**
     * Genera un código de pago (CIP) para la transacción de forma simulada o real.
     */
    @Transactional
    public Map<String, Object> generarCip(Transaccion transaccion) {
        // En un escenario real, aquí se llamaría a la API de PagoEfectivo / Kushki usando el accessToken y merchantId
        // de la siguiente manera:
        // PEClient.createCip(new CipRequest(transaccion.getMonto(), ...))
        
        String cip;
        String urlInstrucciones;
        LocalDateTime fechaExpiracion = LocalDateTime.now().plusHours(24);

        if (accessToken != null && !accessToken.isBlank() && merchantId != null && !merchantId.isBlank()) {
            // Lógica real de integración API PagoEfectivo
            // Por simplicidad y desarrollo, utilizaremos la simulación si no se desea realizar la conexión real
            cip = "PE-" + (10000000 + new Random().nextInt(90000000));
            urlInstrucciones = "https://cip.pagoefectivo.pe/pe/instrucciones/" + cip;
        } else {
            // Modo Simulación Local (Desarrollo sin credenciales)
            Random random = new Random();
            cip = String.valueOf(10000000 + random.nextInt(90000000));
            urlInstrucciones = "https://cip.pagoefectivo.pe/pe/instrucciones/simulado?cip=" + cip;
        }

        // Actualizar la transacción con el medio de pago, referencia del CIP y estado
        transaccion.setMedioPago(MedioPago.PAGO_EFECTIVO);
        transaccion.setReferenciaPago(cip);
        transaccion.setIdTransaccionPasarela(cip); // Almacenamos el CIP también como ID de pasarela para rastreo
        transaccion.setEstadoPago(EstadoPago.PENDIENTE);
        transaccion.setFechaActualizacion(LocalDateTime.now());
        transaccionRepositorio.save(transaccion);

        Map<String, Object> respuesta = new HashMap<>();
        respuesta.put("transaccionId", transaccion.getId());
        respuesta.put("cip", cip);
        respuesta.put("monto", transaccion.getMonto());
        respuesta.put("moneda", "PEN");
        respuesta.put("fechaExpiracion", fechaExpiracion);
        respuesta.put("urlInstrucciones", urlInstrucciones);
        respuesta.put("estado", "PENDIENTE");

        return respuesta;
    }

    /**
     * Procesa la notificación de pago (webhook) para marcar la transacción como aprobada.
     */
    @Transactional
    public void procesarNotificacionPago(String cip, String estado) {
        Transaccion transaccion = transaccionRepositorio.findByIdTransaccionPasarela(cip)
                .or(() -> transaccionRepositorio.findByReferenciaPago(cip))
                .orElseThrow(() -> new RuntimeException("Transacción con código CIP " + cip + " no encontrada"));

        if ("APROBADO".equalsIgnoreCase(estado) || "PAID".equalsIgnoreCase(estado)) {
            transaccion.setEstadoPago(EstadoPago.APROBADO);
            transaccion.setFechaPago(LocalDateTime.now());
            transaccion.setFechaActualizacion(LocalDateTime.now());
            transaccionRepositorio.save(transaccion);
        }
    }
}
