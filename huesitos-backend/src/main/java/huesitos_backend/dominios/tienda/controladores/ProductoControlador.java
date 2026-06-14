package huesitos_backend.dominios.tienda.controladores;

import huesitos_backend.dominios.tienda.entidades.Categoria;

import huesitos_backend.dominios.tienda.entidades.Producto;
import huesitos_backend.dominios.tienda.servicios.ProductoServicio;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/productos")
@RequiredArgsConstructor
public class ProductoControlador {

    private final ProductoServicio productoServicio;

    @PostMapping
    public ResponseEntity<?> registrarProducto(@RequestBody Producto producto) {
        try {
            Producto resultado = productoServicio.guardarProducto(producto);
            return ResponseEntity.ok(resultado);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @GetMapping
    public ResponseEntity<List<Producto>> listarProductos() {
        return ResponseEntity.ok(productoServicio.listarActivos());
    }

    @GetMapping("/categoria/{categoriaId}")
    public ResponseEntity<List<Producto>> listarPorCategoria(@PathVariable Long categoriaId) {
        return ResponseEntity.ok(productoServicio.listarPorCategoria(categoriaId));
    }

    @GetMapping("/buscar")
    public ResponseEntity<List<Producto>> buscarProductos(@RequestParam(required = false) String nombre) {
        return ResponseEntity.ok(productoServicio.buscarProductos(nombre));
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> buscarPorId(@PathVariable Long id) {
        try {
            return ResponseEntity.ok(productoServicio.buscarPorId(id));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> desactivarProducto(@PathVariable Long id) {
        try {
            productoServicio.desactivarProducto(id);
            return ResponseEntity.ok("Producto desactivado con éxito");
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}
