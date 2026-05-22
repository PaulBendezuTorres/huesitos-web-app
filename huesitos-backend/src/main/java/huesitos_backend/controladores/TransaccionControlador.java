package huesitos_backend.controladores;

import huesitos_backend.entidades.MedioPago;
import huesitos_backend.entidades.Transaccion;
import huesitos_backend.servicios.TransaccionServicio;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/pagos")
@RequiredArgsConstructor
public class TransaccionControlador {

    private final TransaccionServicio transaccionServicio;

    /**
     * Endpoint para simular el procesamiento de una compra web a través de pasarela (Culqi/Mercado Pago).
     *
     * @param datosPago Mapa con los datos del pago (citaId, idTransaccionPasarela, medioPago).
     * @return Mensaje de confirmación o error.
     */
    @PostMapping("/procesar-virtual")
    public ResponseEntity<?> procesarPagoVirtual(@RequestBody Map<String, Object> datosPago) {
        try {
            if (!datosPago.containsKey("citaId") || datosPago.get("citaId") == null) {
                return ResponseEntity.badRequest().body("El campo citaId es obligatorio");
            }
            if (!datosPago.containsKey("idTransaccionPasarela") || datosPago.get("idTransaccionPasarela") == null) {
                return ResponseEntity.badRequest().body("El campo idTransaccionPasarela es obligatorio");
            }

            Long citaId = Long.valueOf(datosPago.get("citaId").toString());
            String idTransaccionPasarela = datosPago.get("idTransaccionPasarela").toString();
            
            // Determinar MedioPago, si no se envía por defecto es CULQI
            MedioPago medioPago = MedioPago.CULQI;
            if (datosPago.containsKey("medioPago") && datosPago.get("medioPago") != null) {
                String medioStr = datosPago.get("medioPago").toString().trim().toUpperCase();
                medioPago = MedioPago.valueOf(medioStr);
            }

            transaccionServicio.registrarPagoVirtual(citaId, medioPago, idTransaccionPasarela);

            return ResponseEntity.ok("Compra web procesada con éxito. Cita confirmada.");
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body("El medio de pago especificado no es válido");
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    /**
     * Endpoint para procesar el pago presencial en caja de una cita.
     *
     * @param citaId    El ID de la cita.
     * @param medioPago El medio de pago usado (EFECTIVO, TARJETA, etc.).
     * @return La transacción actualizada o error.
     */
    @PostMapping("/procesar-caja/{citaId}")
    public ResponseEntity<?> procesarPagoCaja(@PathVariable Long citaId, @RequestParam MedioPago medioPago) {
        try {
            Transaccion transaccion = transaccionServicio.registrarPagoPresencial(citaId, medioPago);
            return ResponseEntity.ok(transaccion);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}
