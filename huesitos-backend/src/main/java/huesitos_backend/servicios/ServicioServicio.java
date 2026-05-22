package huesitos_backend.servicios;

import huesitos_backend.entidades.Servicio;
import huesitos_backend.repositorios.ServicioRepositorio;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ServicioServicio {

    private final ServicioRepositorio servicioRepositorio;

    /**
     * Registra un nuevo servicio en el catálogo.
     * Setea por defecto el campo activo en true.
     *
     * @param servicio El servicio a registrar.
     * @return El servicio guardado.
     */
    @Transactional
    public Servicio crearServicio(Servicio servicio) {
        servicio.setActivo(true);
        return servicioRepositorio.save(servicio);
    }

    /**
     * Obtiene una lista de todos los servicios que se encuentran activos.
     *
     * @return Lista de servicios activos.
     */
    @Transactional(readOnly = true)
    public List<Servicio> listarServiciosActivos() {
        return servicioRepositorio.findByActivoTrue();
    }

    /**
     * Realiza la desactivación lógica de un servicio por su ID.
     *
     * @param id El ID del servicio a desactivar.
     */
    @Transactional
    public void desactivarServicio(Long id) {
        Servicio servicio = servicioRepositorio.findById(id)
                .orElseThrow(() -> new RuntimeException("Servicio no encontrado"));
        servicio.setActivo(false);
        servicioRepositorio.save(servicio);
    }
}
