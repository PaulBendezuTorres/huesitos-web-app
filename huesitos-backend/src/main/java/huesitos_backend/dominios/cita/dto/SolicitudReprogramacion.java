package huesitos_backend.dominios.cita.dto;

import huesitos_backend.dominios.cita.entidades.Cita;

import java.time.LocalDateTime;

public record SolicitudReprogramacion(LocalDateTime nuevaFechaHora) {}
