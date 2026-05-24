package huesitos_backend.controladores;

import huesitos_backend.entidades.MedioPago;
import huesitos_backend.entidades.Transaccion;
import huesitos_backend.servicios.TransaccionServicio;
import huesitos_backend.servicios.BoletaPdfServicio;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import huesitos_backend.entidades.EstadoPago;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/pagos")
@RequiredArgsConstructor
public class TransaccionControlador {

    private final TransaccionServicio transaccionServicio;
    private final BoletaPdfServicio boletaPdfServicio;

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

    /**
     * Endpoint para obtener el historial de transacciones de un cliente.
     *
     * @param usuarioId El ID del usuario/cliente.
     * @return Lista de transacciones del cliente.
     */
    @GetMapping("/cliente/{usuarioId}")
    public ResponseEntity<List<Transaccion>> obtenerPorUsuario(@PathVariable Long usuarioId) {
        return ResponseEntity.ok(transaccionServicio.obtenerTransaccionesPorUsuario(usuarioId));
    }

    /**
     * Endpoint para obtener todas las transacciones filtradas por estado.
     *
     * @param estado El estado del pago (ej: PENDIENTE, APROBADO).
     * @return Lista de transacciones que coinciden con el estado.
     */
    @GetMapping("/estado/{estado}")
    public ResponseEntity<?> obtenerPorEstado(@PathVariable String estado) {
        try {
            EstadoPago estadoPago = EstadoPago.valueOf(estado.trim().toUpperCase());
            return ResponseEntity.ok(transaccionServicio.obtenerTransaccionesPorEstado(estadoPago));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body("El estado de pago especificado no es válido");
        }
    }

    /**
     * Endpoint para consultar el reporte financiero consolidado (flujo diario, mensual y acumulado).
     * Reservado para el Administrador.
     *
     * @return El reporte consolidado.
     */
    @GetMapping("/reporte")
    public ResponseEntity<?> obtenerReporte() {
        return ResponseEntity.ok(transaccionServicio.obtenerReporteFinanciero());
    }

    /**
     * Endpoint para descargar la boleta de pago electrónica en PDF inline.
     *
     * @param id El ID de la transacción.
     * @return El archivo PDF inline.
     */
    @GetMapping("/{id}/boleta")
    public ResponseEntity<?> descargarBoleta(@PathVariable Long id) {
        try {
            byte[] pdfBytes = boletaPdfServicio.generarPdfBoleta(id);
            org.springframework.http.HttpHeaders headers = new org.springframework.http.HttpHeaders();
            headers.setContentType(org.springframework.http.MediaType.APPLICATION_PDF);
            headers.setContentDisposition(org.springframework.http.ContentDisposition.inline().filename("boleta-pago-" + id + ".pdf").build());
            return new ResponseEntity<>(pdfBytes, headers, org.springframework.http.HttpStatus.OK);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}
