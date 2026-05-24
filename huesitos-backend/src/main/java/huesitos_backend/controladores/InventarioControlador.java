package huesitos_backend.controladores;

import huesitos_backend.entidades.Inventario;
import huesitos_backend.servicios.InventarioServicio;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/inventarios")
@RequiredArgsConstructor
public class InventarioControlador {

    private final InventarioServicio inventarioServicio;

    @PostMapping
    public ResponseEntity<?> registrarLote(@RequestBody Inventario lote) {
        try {
            Inventario resultado = inventarioServicio.registrarIngresoStock(lote);
            return ResponseEntity.ok(resultado);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PutMapping("/{id}/ajuste")
    public ResponseEntity<?> ajustarStock(@PathVariable Long id, @RequestBody Map<String, Object> body) {
        try {
            if (!body.containsKey("stock") || body.get("stock") == null) {
                return ResponseEntity.badRequest().body("El campo stock es obligatorio");
            }
            Integer nuevoStock = Integer.valueOf(body.get("stock").toString());
            Inventario resultado = inventarioServicio.ajustarStockLote(id, nuevoStock);
            return ResponseEntity.ok(resultado);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @GetMapping("/producto/{productoId}")
    public ResponseEntity<List<Inventario>> listarPorProducto(@PathVariable Long productoId) {
        return ResponseEntity.ok(inventarioServicio.listarLotesPorProducto(productoId));
    }

    @GetMapping
    public ResponseEntity<List<Inventario>> listarLotes() {
        return ResponseEntity.ok(inventarioServicio.listarLotesActivos());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> desactivarLote(@PathVariable Long id) {
        try {
            inventarioServicio.desactivarLote(id);
            return ResponseEntity.ok("Lote de inventario desactivado con éxito");
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}
