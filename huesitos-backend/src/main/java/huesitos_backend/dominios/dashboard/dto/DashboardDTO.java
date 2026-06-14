package huesitos_backend.dominios.dashboard.dto;

import huesitos_backend.dominios.dashboard.entidades.Actividad;
import lombok.Data;
import java.math.BigDecimal;
import java.util.List;

@Data
public class DashboardDTO {
    private long totalServicios;
    private long serviciosActivos;
    private long totalUsuarios;
    private BigDecimal ingresosTotales;
    private List<Actividad> actividades;
}