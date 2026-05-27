package huesitos_backend.controladores;

import huesitos_backend.dto.ReporteFinanciero;
import huesitos_backend.entidades.MedioPago;
import huesitos_backend.entidades.Transaccion;
import huesitos_backend.servicios.TransaccionServicio;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/pagos")
@RequiredArgsConstructor
public class TransaccionControlador {

    private final TransaccionServicio transaccionServicio;

    @GetMapping
    @PreAuthorize("hasAnyRole('ADMINISTRADOR', 'RECEPCIONISTA')")
    public ResponseEntity<List<Transaccion>> listarTransacciones() {
        return ResponseEntity.ok(transaccionServicio.listarTodas());
    }

    @GetMapping("/reporte")
    @PreAuthorize("hasRole('ADMINISTRADOR')")
    public ResponseEntity<ReporteFinanciero> obtenerReporte(
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate fecha) {
        if (fecha == null) {
            fecha = LocalDate.now();
        }
        return ResponseEntity.ok(transaccionServicio.generarReporteDiario(fecha));
    }

    @PatchMapping("/{id}/procesar")
    @PreAuthorize("hasAnyRole('ADMINISTRADOR', 'RECEPCIONISTA')")
    public ResponseEntity<?> procesarPagoManual(
            @PathVariable Long id, 
            @RequestParam MedioPago medioPago, 
            @RequestParam(required = false) String referencia) {
        try {
            Transaccion actualizada = transaccionServicio.procesarPagoCaja(id, medioPago, referencia);
            return ResponseEntity.ok(actualizada);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}