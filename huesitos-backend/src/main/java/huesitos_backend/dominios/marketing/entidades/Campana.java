package huesitos_backend.dominios.marketing.entidades;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDate;
import java.util.List;
import java.util.ArrayList;
import huesitos_backend.dominios.veterinaria_servicio.entidades.Servicio;

@Entity
@Table(name = "campanas")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Campana {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 150)
    private String nombre;

    @Column(length = 500)
    private String descripcion;

    @Column(name = "fecha_inicio", nullable = false)
    private LocalDate fechaInicio;

    @Column(name = "fecha_fin", nullable = false)
    private LocalDate fechaFin;

    @Column(nullable = false)
    private Boolean activo = true;

    @Column(name = "imagen_url", length = 500)
    private String imagenUrl;

    @Column(name = "precio_promocional", precision = 10, scale = 2)
    private java.math.BigDecimal precioPromocional;

    @ManyToMany
    @JoinTable(
        name = "campana_servicios",
        joinColumns = @JoinColumn(name = "campana_id"),
        inverseJoinColumns = @JoinColumn(name = "servicio_id")
    )
    private List<Servicio> servicios = new ArrayList<>();
}
