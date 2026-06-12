package huesitos_backend.dto;

import lombok.Data;

@Data
public class PerfilRequest {
    private String nombre;
    private String apellido;
    private String correo;
    private String contrasena;
    private String telefono;
    private String direccion;
}
