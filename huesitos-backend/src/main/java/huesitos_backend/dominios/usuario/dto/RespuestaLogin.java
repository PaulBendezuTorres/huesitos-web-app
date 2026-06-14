package huesitos_backend.dominios.usuario.dto;

import huesitos_backend.dominios.usuario.entidades.Usuario;
import huesitos_backend.dominios.usuario.entidades.Rol;

public record RespuestaLogin(
    String token,
    String correo,
    String rol,
    Long usuarioId,
    Long duenoId,
    String fotoPerfilUrl,
    String tema
) {}
