package huesitos_backend.dominios.finanzas.controladores;

import huesitos_backend.dominios.finanzas.entidades.Transaccion;
import huesitos_backend.dominios.finanzas.repositorios.TransaccionRepositorio;
import huesitos_backend.dominios.finanzas.servicios.PagoEfectivoServicio;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/pagos/pagoefectivo")
@RequiredArgsConstructor
public class PagoEfectivoControlador {

    private final PagoEfectivoServicio pagoEfectivoServicio;
    private final TransaccionRepositorio transaccionRepositorio;

    /**
     * Endpoint para generar un código CIP de PagoEfectivo para una transacción específica.
     */
    @PostMapping("/{id}/cip")
    public ResponseEntity<?> generarCip(@PathVariable Long id) {
        try {
            Transaccion transaccion = transaccionRepositorio.findByIdConCitaYServicio(id)
                    .orElseThrow(() -> new RuntimeException("Transacción no encontrada"));

            Map<String, Object> respuestaCip = pagoEfectivoServicio.generarCip(transaccion);
            return ResponseEntity.ok(respuestaCip);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.badRequest().body(Map.of("mensaje", e.getMessage()));
        }
    }

    /**
     * Webhook público para recibir las notificaciones de PagoEfectivo.
     */
    @PostMapping("/webhook")
    public ResponseEntity<?> recibirWebhook(@RequestBody Map<String, Object> payload) {
        try {
            // Estructura habitual de PagoEfectivo webhook
            // payload: { "cip": "12345678", "status": "PAID" / "APROBADO" }
            String cip = (String) payload.get("cip");
            String status = (String) payload.get("status");

            if (cip == null || status == null) {
                return ResponseEntity.badRequest().body(Map.of("mensaje", "CIP y status son obligatorios"));
            }

            pagoEfectivoServicio.procesarNotificacionPago(cip, status);
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            System.err.println("Error procesando Webhook de PagoEfectivo: " + e.getMessage());
            return ResponseEntity.badRequest().body(Map.of("mensaje", e.getMessage()));
        }
    }

    /**
     * Endpoint de desarrollo para simular un pago exitoso de un CIP directamente desde el frontend.
     */
    @PostMapping("/simular-pago")
    public ResponseEntity<?> simularPago(@RequestBody Map<String, String> payload) {
        try {
            String cip = payload.get("cip");
            if (cip == null || cip.isBlank()) {
                return ResponseEntity.badRequest().body(Map.of("mensaje", "El código CIP es obligatorio"));
            }

            pagoEfectivoServicio.procesarNotificacionPago(cip, "APROBADO");
            return ResponseEntity.ok(Map.of("mensaje", "Pago simulado con éxito para el CIP " + cip));
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.badRequest().body(Map.of("mensaje", e.getMessage()));
        }
    }
}
