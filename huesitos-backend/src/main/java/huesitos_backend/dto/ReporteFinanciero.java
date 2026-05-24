package huesitos_backend.dto;

import java.math.BigDecimal;

public record ReporteFinanciero(
    BigDecimal flujoCajaDiario,
    BigDecimal ingresosMensuales,
    BigDecimal gananciasTotales
) {}
