package huesitos_backend.dominios.dashboard.controladores;

import huesitos_backend.dominios.dashboard.dto.DashboardDTO;
import huesitos_backend.dominios.dashboard.servicios.DashboardServicio;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/dashboard")
@RequiredArgsConstructor
public class DashboardControlador {

    private final DashboardServicio dashboardServicio;

    @GetMapping("/resumen")
    @PreAuthorize("hasAuthority('ROLE_ADMINISTRADOR')")
    public ResponseEntity<DashboardDTO> obtenerResumen() {
        return ResponseEntity.ok(dashboardServicio.obtenerEstadisticas());
    }
}