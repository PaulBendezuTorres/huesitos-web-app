package huesitos_backend.dominios.usuario.dto;

import huesitos_backend.dominios.usuario.entidades.Usuario;
import huesitos_backend.dominios.usuario.entidades.Rol;

public record SolicitudCambioRol(
    String rol
) {}
