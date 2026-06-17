package huesitos_backend.dominios.mascota.servicios;

import huesitos_backend.dominios.mascota.entidades.Mascota;
import huesitos_backend.dominios.mascota.repositorios.MascotaRepositorio;
import huesitos_backend.dominios.cliente.repositorios.DueñoRepositorio;
import huesitos_backend.dominios.usuario.repositorios.UsuarioRepositorio;
import huesitos_backend.dominios.usuario.entidades.Usuario;
import huesitos_backend.dominios.cita.repositorios.CitaRepositorio;
import huesitos_backend.dominios.clinico.repositorios.ConsultaMedicaRepositorio;
import huesitos_backend.dominios.clinico.repositorios.HistorialVacunacionRepositorio;
import huesitos_backend.dominios.clinico.repositorios.ArchivoClinicoRepositorio;
import org.springframework.security.crypto.password.PasswordEncoder;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;

@Service
@RequiredArgsConstructor
public class MascotaServicio {

    private final MascotaRepositorio mascotaRepositorio;
    private final DueñoRepositorio dueñoRepositorio;
    private final UsuarioRepositorio usuarioRepositorio;
    private final PasswordEncoder passwordEncoder;
    private final CitaRepositorio citaRepositorio;
    private final ConsultaMedicaRepositorio consultaMedicaRepositorio;
    private final HistorialVacunacionRepositorio historialVacunacionRepositorio;
    private final ArchivoClinicoRepositorio archivoClinicoRepositorio;

    /**
     * Registra una nueva mascota en el sistema, previa verificación de la existencia de su dueño.
     *
     * @param mascota La mascota a registrar.
     * @return La mascota guardada en la base de datos.
     */
    @Transactional
    public Mascota registrarMascota(Mascota mascota) {
        if (mascota.getDueño() == null || mascota.getDueño().getId() == null || 
            !dueñoRepositorio.existsById(mascota.getDueño().getId())) {
            throw new RuntimeException("El dueño especificado no existe");
        }
        if (mascota.getFotoUrl() == null || mascota.getFotoUrl().trim().isEmpty()) {
            mascota.setFotoUrl("/uploads/defecto-mascota.png");
        }
        return mascotaRepositorio.save(mascota);
    }

    /**
     * Obtiene todas las mascotas asociadas a un dueño.
     *
     * @param dueñoId El ID del dueño.
     * @return La lista de mascotas del dueño.
     */
    @Transactional(readOnly = true)
    public List<Mascota> obtenerMascotasPorDueño(Long dueñoId) {
        return mascotaRepositorio.findByDueñoId(dueñoId);
    }

    /**
     * Busca una mascota por su identificador único.
     *
     * @param id El ID de la mascota.
     * @return La mascota encontrada.
     * @throws RuntimeException si la mascota no existe.
     */
    @Transactional(readOnly = true)
    public Mascota obtenerMascotaPorId(Long id) {
        return mascotaRepositorio.findById(id)
                .orElseThrow(() -> new RuntimeException("Mascota no encontrada"));
    }

    /**
     * Actualiza los datos de una mascota, validando permisos de dueño si el usuario actual es cliente.
     */
    @Transactional
    public Mascota actualizarMascota(Long id, Mascota datosMascota, String correoUsuarioLogueado) {
        Usuario usuario = usuarioRepositorio.findByCorreo(correoUsuarioLogueado)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

        Mascota mascota = mascotaRepositorio.findById(id)
                .orElseThrow(() -> new RuntimeException("Mascota no encontrada"));

        // Validar permisos si el rol es CLIENTE
        if (usuario.getRol().name().equals("CLIENTE")) {
            if (mascota.getDueño() == null || mascota.getDueño().getUsuario() == null ||
                !mascota.getDueño().getUsuario().getId().equals(usuario.getId())) {
                throw new RuntimeException("No tienes permisos para modificar esta mascota.");
            }
        }

        // Modificar campos editables
        mascota.setNombre(datosMascota.getNombre());
        mascota.setEspecie(datosMascota.getEspecie());
        mascota.setRaza(datosMascota.getRaza());
        mascota.setFechaNacimiento(datosMascota.getFechaNacimiento());
        mascota.setPesoActual(datosMascota.getPesoActual());
        mascota.setAlertasMedicas(datosMascota.getAlertasMedicas());

        // Asignar fotoUrl por defecto si no viene ninguna
        if (datosMascota.getFotoUrl() != null && !datosMascota.getFotoUrl().trim().isEmpty()) {
            mascota.setFotoUrl(datosMascota.getFotoUrl());
        } else if (mascota.getFotoUrl() == null || mascota.getFotoUrl().trim().isEmpty()) {
            mascota.setFotoUrl("/uploads/defecto-mascota.png");
        }

        return mascotaRepositorio.save(mascota);
    }

    /**
     * Elimina una mascota tras confirmar la contraseña del usuario logueado.
     */
    @Transactional
    public void eliminarMascota(Long id, String contrasena, String correoUsuarioLogueado) {
        Usuario usuario = usuarioRepositorio.findByCorreo(correoUsuarioLogueado)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

        // Validar contraseña del usuario logueado
        if (!passwordEncoder.matches(contrasena, usuario.getContrasena())) {
            throw new RuntimeException("La contraseña ingresada es incorrecta. No se pudo eliminar la mascota.");
        }

        Mascota mascota = mascotaRepositorio.findById(id)
                .orElseThrow(() -> new RuntimeException("Mascota no encontrada"));

        // Validar permisos si el rol es CLIENTE
        if (usuario.getRol().name().equals("CLIENTE")) {
            if (mascota.getDueño() == null || mascota.getDueño().getUsuario() == null ||
                !mascota.getDueño().getUsuario().getId().equals(usuario.getId())) {
                throw new RuntimeException("No tienes permisos para eliminar esta mascota.");
            }
        }

        // Validar si tiene historial médico o citas registradas para evitar inconsistencias
        if (citaRepositorio.existsByMascotaId(id)) {
            throw new RuntimeException("No se puede eliminar la mascota porque tiene citas programadas o registradas.");
        }
        if (consultaMedicaRepositorio.existsByMascotaId(id)) {
            throw new RuntimeException("No se puede eliminar la mascota porque tiene consultas médicas en su historial clínico.");
        }
        if (historialVacunacionRepositorio.existsByMascotaId(id)) {
            throw new RuntimeException("No se puede eliminar la mascota porque tiene registros de vacunas aplicadas.");
        }
        if (archivoClinicoRepositorio.existsByMascotaId(id)) {
            throw new RuntimeException("No se puede eliminar la mascota porque tiene archivos clínicos asociados.");
        }

        mascotaRepositorio.delete(mascota);
    }
}
