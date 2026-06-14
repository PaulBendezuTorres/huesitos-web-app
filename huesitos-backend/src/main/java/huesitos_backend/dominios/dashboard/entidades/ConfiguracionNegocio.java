package huesitos_backend.dominios.dashboard.entidades;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table(name = "configuracion_negocio")
@Data
public class ConfiguracionNegocio {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String nombreNegocio;
    private String telefono;
    private String telefonoEmergencia;
    private String correo;
    private String direccion;
    private String horarioSemana;
    private String horarioDomingo;
    private String moneda;
    private Double impuesto;
}