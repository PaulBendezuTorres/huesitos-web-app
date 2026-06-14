package huesitos_backend.dominios.tienda.controladores;

import huesitos_backend.dominios.tienda.entidades.Categoria;
import huesitos_backend.dominios.tienda.servicios.CategoriaServicio;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/categorias")
@RequiredArgsConstructor
public class CategoriaControlador {

    private final CategoriaServicio categoriaServicio;

    @PostMapping
    public ResponseEntity<?> registrarCategoria(@RequestBody Categoria categoria) {
        try {
            Categoria resultado = categoriaServicio.guardarCategoria(categoria);
            return ResponseEntity.ok(resultado);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @GetMapping
    public ResponseEntity<List<Categoria>> listarCategorias() {
        return ResponseEntity.ok(categoriaServicio.listarActivas());
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> buscarPorId(@PathVariable Long id) {
        try {
            return ResponseEntity.ok(categoriaServicio.buscarPorId(id));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> desactivarCategoria(@PathVariable Long id) {
        try {
            categoriaServicio.desactivarCategoria(id);
            return ResponseEntity.ok("Categoría desactivada con éxito");
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}
