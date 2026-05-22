package huesitos_backend.entidades;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import java.time.LocalDate;

@Entity
@Table(name = "mascotas")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Mascota {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 80)
    private String nombre;

    @Column(nullable = false, length = 50)
    private String especie;

    @Column(nullable = false, length = 50)
    private String raza;

    @Column(name = "fecha_nacimiento", nullable = false)
    private LocalDate fechaNacimiento;

    @Column(name = "peso_actual", nullable = false)
    private Double pesoActual;

    @Column(name = "alertas_medicas", length = 500)
    private String alertasMedicas;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "dueño_id", nullable = false)
    private Dueño dueño;
}
