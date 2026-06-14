package huesitos_backend.dominios.usuario.dto;

public record RespuestaLogin(
        String token,
        String correo,
        String rol,
        Long usuarioId,
        Long duenoId,
        String fotoPerfilUrl,
        String tema) {
}
