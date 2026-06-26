package huesitos_backend.dominios.finanzas.controladores;

import com.mercadopago.resources.payment.Payment;
import huesitos_backend.dominios.finanzas.entidades.Transaccion;
import huesitos_backend.dominios.finanzas.repositorios.TransaccionRepositorio;
import huesitos_backend.dominios.finanzas.servicios.MercadoPagoServicio;
import huesitos_backend.dominios.finanzas.servicios.TransaccionServicio;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/pagos")
@RequiredArgsConstructor
public class MercadoPagoControlador {

    private final MercadoPagoServicio mercadoPagoServicio;
    private final TransaccionServicio transaccionServicio;
    private final TransaccionRepositorio transaccionRepositorio;

    /**
     * Endpoint para generar la preferencia de Mercado Pago.
     */
    @PostMapping("/{id}/preferencia")
    public ResponseEntity<?> generarPreferencia(@PathVariable Long id) {
        try {
            Transaccion transaccion = transaccionRepositorio.findByIdConCitaYServicio(id)
                    .orElseThrow(() -> new RuntimeException("Transacción no encontrada"));
            
            String initPoint = mercadoPagoServicio.crearPreferenciaPago(transaccion);
            
            Map<String, String> respuesta = new HashMap<>();
            respuesta.put("initPoint", initPoint);
            return ResponseEntity.ok(respuesta);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    /**
     * Endpoint público para recibir los webhooks de Mercado Pago.
     */
    @PostMapping("/webhook")
    public ResponseEntity<?> recibirWebhook(
            @RequestParam(value = "topic", required = false) String topic,
            @RequestParam(value = "id", required = false) Long idParam,
            @RequestBody(required = false) Map<String, Object> body) {
        
        try {
            Long paymentId = null;
            
            // 1. Validar si es notificación vía query param (ej: topic=payment&id=123456)
            if ("payment".equalsIgnoreCase(topic) && idParam != null) {
                paymentId = idParam;
            } 
            // 2. Validar si viene en el body JSON (ej: { "type": "payment", "data": { "id": "123456" } })
            else if (body != null) {
                String type = (String) body.get("type");
                if ("payment".equalsIgnoreCase(type) && body.containsKey("data")) {
                    Map<?, ?> data = (Map<?, ?>) body.get("data");
                    if (data != null && data.containsKey("id")) {
                        Object rawId = data.get("id");
                        if (rawId instanceof String) {
                            paymentId = Long.parseLong((String) rawId);
                        } else if (rawId instanceof Number) {
                            paymentId = ((Number) rawId).longValue();
                        }
                    }
                }
            }

            // Si pudimos obtener un ID de pago válido, procedemos a consultarlo a Mercado Pago
            if (paymentId != null) {
                Payment pago = mercadoPagoServicio.consultarPago(paymentId);
                
                if (pago != null && "approved".equalsIgnoreCase(pago.getStatus())) {
                    // El external reference contiene el ID de nuestra Transaccion local
                    String externalRef = pago.getExternalReference();
                    if (externalRef != null && !externalRef.isBlank()) {
                        Long transaccionId = Long.parseLong(externalRef);
                        String idPasarela = pago.getId().toString();
                        String referencia = "MP_" + paymentId;
                        
                        transaccionServicio.registrarPagoExitosoPasarela(transaccionId, idPasarela, referencia);
                    }
                }
            }

            // Siempre responder 200 OK a Mercado Pago para evitar reintentos infinitos
            return ResponseEntity.ok().build();
            
        } catch (Exception e) {
            // Incluso si falla algo, devolvemos 200 OK para no bloquear el webhook, pero registramos el error
            System.err.println("Error procesando Webhook de Mercado Pago: " + e.getMessage());
            return ResponseEntity.ok().body(e.getMessage());
        }
    }
}
