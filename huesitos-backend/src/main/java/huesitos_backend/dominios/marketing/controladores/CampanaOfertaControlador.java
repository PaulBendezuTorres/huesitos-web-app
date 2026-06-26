package huesitos_backend.dominios.marketing.controladores;

import huesitos_backend.dominios.marketing.entidades.Campana;
import huesitos_backend.dominios.marketing.entidades.Oferta;
import huesitos_backend.dominios.marketing.servicios.CampanaOfertaServicio;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api")
public class CampanaOfertaControlador {

    private final CampanaOfertaServicio campanaOfertaServicio;

    // --- ENDPOINTS DE CAMPAÑAS ---

    @GetMapping("/campanas")
    public ResponseEntity<List<Campana>> listarCampanasActivas() {
        return ResponseEntity.ok(campanaOfertaServicio.listarCampanasActivas());
    }

    @GetMapping("/campanas/todas")
    public ResponseEntity<List<Campana>> listarTodasCampanas() {
        return ResponseEntity.ok(campanaOfertaServicio.listarTodasCampanas());
    }

    @GetMapping("/campanas/{id}")
    public ResponseEntity<?> buscarCampanaPorId(@PathVariable Long id) {
        try {
            return ResponseEntity.ok(campanaOfertaServicio.buscarCampanaPorId(id));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PostMapping("/campanas")
    public ResponseEntity<?> registrarCampana(@RequestBody Campana campana) {
        try {
            Campana resultado = campanaOfertaServicio.guardarCampana(campana);
            return ResponseEntity.ok(resultado);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PostMapping("/campanas/{id}/foto")
    public ResponseEntity<?> subirFotoCampana(@PathVariable Long id, @RequestParam("archivo") org.springframework.web.multipart.MultipartFile archivo) {
        try {
            String urlFoto = campanaOfertaServicio.subirFotoCampana(id, archivo);
            java.util.Map<String, String> respuesta = new java.util.HashMap<>();
            respuesta.put("imagenUrl", urlFoto);
            return ResponseEntity.ok(respuesta);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PutMapping("/campanas/{id}")
    public ResponseEntity<?> actualizarCampana(@PathVariable Long id, @RequestBody Campana campana) {
        try {
            campana.setId(id);
            Campana resultado = campanaOfertaServicio.guardarCampana(campana);
            return ResponseEntity.ok(resultado);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @DeleteMapping("/campanas/{id}")
    public ResponseEntity<?> eliminarCampana(@PathVariable Long id) {
        try {
            campanaOfertaServicio.eliminarCampana(id);
            return ResponseEntity.ok("Campaña desactivada con éxito");
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @DeleteMapping("/campanas/{id}/fisico")
    public ResponseEntity<?> eliminarFisicamenteCampana(@PathVariable Long id) {
        try {
            campanaOfertaServicio.eliminarFisicamenteCampana(id);
            return ResponseEntity.ok("Campaña eliminada físicamente con éxito");
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    // --- ENDPOINTS DE OFERTAS ---

    @GetMapping("/ofertas")
    public ResponseEntity<List<Oferta>> listarOfertasActivas() {
        return ResponseEntity.ok(campanaOfertaServicio.listarOfertasActivas());
    }

    @GetMapping("/ofertas/todas")
    public ResponseEntity<List<Oferta>> listarTodasOfertas() {
        return ResponseEntity.ok(campanaOfertaServicio.listarTodasOfertas());
    }

    @GetMapping("/ofertas/{id}")
    public ResponseEntity<?> buscarOfertaPorId(@PathVariable Long id) {
        try {
            return ResponseEntity.ok(campanaOfertaServicio.buscarOfertaPorId(id));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PostMapping("/ofertas")
    public ResponseEntity<?> registrarOferta(@RequestBody Oferta oferta) {
        try {
            Oferta resultado = campanaOfertaServicio.guardarOferta(oferta);
            return ResponseEntity.ok(resultado);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PostMapping("/ofertas/categoria")
    public ResponseEntity<?> registrarOfertasPorCategoria(@RequestBody SolicitudOfertaCategoria solicitud) {
        try {
            List<Oferta> resultados = campanaOfertaServicio.guardarOfertasPorCategoria(
                    solicitud.getCategoriaId(),
                    solicitud.getDescuentoPorcentaje(),
                    solicitud.getFechaInicio(),
                    solicitud.getFechaFin()
            );
            return ResponseEntity.ok(resultados);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @lombok.Getter
    @lombok.Setter
    @lombok.NoArgsConstructor
    public static class SolicitudOfertaCategoria {
        private Long categoriaId;
        private java.math.BigDecimal descuentoPorcentaje;
        private java.time.LocalDate fechaInicio;
        private java.time.LocalDate fechaFin;
    }

    @PutMapping("/ofertas/{id}")
    public ResponseEntity<?> actualizarOferta(@PathVariable Long id, @RequestBody Oferta oferta) {
        try {
            oferta.setId(id);
            Oferta resultado = campanaOfertaServicio.guardarOferta(oferta);
            return ResponseEntity.ok(resultado);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @DeleteMapping("/ofertas/{id}")
    public ResponseEntity<?> eliminarOferta(@PathVariable Long id) {
        try {
            campanaOfertaServicio.eliminarOferta(id);
            return ResponseEntity.ok("Oferta desactivada con éxito");
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @DeleteMapping("/ofertas/{id}/fisico")
    public ResponseEntity<?> eliminarFisicamenteOferta(@PathVariable Long id) {
        try {
            campanaOfertaServicio.eliminarFisicamenteOferta(id);
            return ResponseEntity.ok("Oferta eliminada físicamente con éxito");
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}
