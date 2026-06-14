package huesitos_backend.dominios.dashboard.controladores;

import huesitos_backend.dominios.dashboard.entidades.ConfiguracionNegocio;
import huesitos_backend.dominios.dashboard.servicios.ConfiguracionNegocioServicio;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/configuracion-negocio")
@RequiredArgsConstructor
public class ConfiguracionNegocioControlador {

    private final ConfiguracionNegocioServicio servicio;

    /**
     * Endpoint público para que la Landing Page y el panel lean los datos sin
     * restricciones.
     */
    @GetMapping
    public ResponseEntity<ConfiguracionNegocio> obtener() {
        return ResponseEntity.ok(servicio.obtenerConfiguracion());
    }

    /**
     * Endpoint restringido para guardar las modificaciones desde el panel
     * administrativo.
     */
    @PutMapping
    @PreAuthorize("hasRole('ADMINISTRADOR')")
    public ResponseEntity<ConfiguracionNegocio> actualizar(@RequestBody ConfiguracionNegocio config) {
        return ResponseEntity.ok(servicio.actualizarConfiguracion(config));
    }
}