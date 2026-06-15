package huesitos_backend.dominios.usuario.servicios;

import huesitos_backend.dominios.usuario.entidades.Usuario;
import huesitos_backend.dominios.usuario.entidades.Rol;
import huesitos_backend.dominios.cliente.entidades.Dueño;
import huesitos_backend.dominios.dashboard.entidades.Actividad;
import huesitos_backend.dominios.usuario.entidades.HorarioPersonal;
import huesitos_backend.dominios.mascota.entidades.Mascota;
import huesitos_backend.dominios.cita.entidades.Cita;
import huesitos_backend.dominios.cita.entidades.EstadoCita;
import huesitos_backend.dominios.usuario.repositorios.UsuarioRepositorio;
import huesitos_backend.dominios.cliente.repositorios.DueñoRepositorio;
import huesitos_backend.dominios.dashboard.repositorios.ActividadRepositorio;
import huesitos_backend.dominios.usuario.repositorios.HorarioPersonalRepositorio;
import huesitos_backend.dominios.mascota.repositorios.MascotaRepositorio;
import huesitos_backend.dominios.cita.repositorios.CitaRepositorio;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class UsuarioServicio {

    private final UsuarioRepositorio usuarioRepositorio;
    private final DueñoRepositorio dueñoRepositorio;
    private final ActividadRepositorio actividadRepositorio;
    private final PasswordEncoder passwordEncoder;
    private final HorarioPersonalRepositorio horarioPersonalRepositorio;
    private final MascotaRepositorio mascotaRepositorio;
    private final CitaRepositorio citaRepositorio;

    @Transactional(readOnly = true)
    public List<Usuario> listarTodos() {
        return usuarioRepositorio.findAll();
    }

    @Transactional(readOnly = true)
    public Optional<Dueño> obtenerDatosDueño(Long usuarioId) {
        return dueñoRepositorio.findByUsuarioId(usuarioId);
    }

    // ==========================================
    // NUEVO MÉTODO: REGISTRO DE PERSONAL INTERNO
    // ==========================================
    @Transactional
    public Usuario registrarPersonal(String correo, String contrasena, Rol rol) {
        if (rol == Rol.CLIENTE) {
            throw new RuntimeException("No se pueden crear cuentas de clientes desde este módulo.");
        }
        
        if (usuarioRepositorio.findByCorreo(correo).isPresent()) {
            throw new RuntimeException("El correo electrónico ya se encuentra registrado en el sistema.");
        }

        Usuario nuevoUsuario = new Usuario();
        nuevoUsuario.setCorreo(correo);
        nuevoUsuario.setContrasena(passwordEncoder.encode(contrasena)); // Encriptación obligatoria
        nuevoUsuario.setRol(rol);
        nuevoUsuario.setActivo(true); // Se crea activo por defecto

        Usuario guardado = usuarioRepositorio.save(nuevoUsuario);

        // Registro en auditoría
        Actividad actividad = new Actividad();
        actividad.setMensaje("Se dio de alta un nuevo personal: " + correo + " con el rol de " + rol);
        actividad.setTipo("USUARIO");
        actividad.setFecha(LocalDateTime.now());
        actividadRepositorio.save(actividad);

        return guardado;
    }

    @Transactional
    public Usuario cambiarRolUsuario(Long id, Rol nuevoRol, String contrasenaConfirmacion, String correoAdminActual) {
        if (nuevoRol == Rol.ADMINISTRADOR) {
            if (contrasenaConfirmacion == null || contrasenaConfirmacion.trim().isEmpty()) {
                throw new RuntimeException("Se requiere confirmación de contraseña para otorgar permisos de Administrador.");
            }
            Usuario adminActual = usuarioRepositorio.findByCorreo(correoAdminActual)
                    .orElseThrow(() -> new RuntimeException("Administrador actual no encontrado."));
            
            if (!passwordEncoder.matches(contrasenaConfirmacion, adminActual.getContrasena())) {
                throw new RuntimeException("La contraseña ingresada es incorrecta. No se pudo realizar el cambio de rol.");
            }
        }

        Usuario usuario = usuarioRepositorio.findById(id)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado con ID: " + id));

        Rol rolAnterior = usuario.getRol();
        usuario.setRol(nuevoRol);
        Usuario actualizado = usuarioRepositorio.save(usuario);

        Actividad actividad = new Actividad();
        actividad.setMensaje("Se actualizó el rol de " + actualizado.getCorreo() + " de " + rolAnterior + " a " + nuevoRol);
        actividad.setTipo("USUARIO");
        actividad.setFecha(LocalDateTime.now());
        actividadRepositorio.save(actividad);

        return actualizado;
    }

    @Transactional
    public Usuario cambiarEstadoUsuario(Long id, Boolean activo) {
        Usuario usuario = usuarioRepositorio.findById(id)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado con ID: " + id));

        usuario.setActivo(activo);
        Usuario actualizado = usuarioRepositorio.save(usuario);

        Actividad actividad = new Actividad();
        actividad.setMensaje("Se modificó el estado de acceso para el usuario: " + actualizado.getCorreo() + " a " + (activo ? "ACTIVO" : "INACTIVO"));
        actividad.setTipo("USUARIO");
        actividad.setFecha(LocalDateTime.now());
        actividadRepositorio.save(actividad);

        return actualizado;
    }

    @Transactional
    public Usuario actualizarCredenciales(Long id, String nuevoCorreo, String nuevaContrasena) {
        Usuario usuario = usuarioRepositorio.findById(id)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado con ID: " + id));

        boolean huboCambios = false;

        if (nuevoCorreo != null && !nuevoCorreo.trim().isEmpty() && !nuevoCorreo.equals(usuario.getCorreo())) {
            usuario.setCorreo(nuevoCorreo);
            huboCambios = true;
        }

        if (nuevaContrasena != null && !nuevaContrasena.trim().isEmpty()) {
            usuario.setContrasena(passwordEncoder.encode(nuevaContrasena));
            huboCambios = true;
        }

        if (huboCambios) {
            Usuario guardado = usuarioRepositorio.save(usuario);
            Actividad actividad = new Actividad();
            actividad.setMensaje("Se actualizaron las credenciales de acceso de: " + guardado.getCorreo());
            actividad.setTipo("USUARIO");
            actividad.setFecha(LocalDateTime.now());
            actividadRepositorio.save(actividad);
            return guardado;
        }

        return usuario;
    }

    @Transactional
    public void eliminarUsuario(Long id) {
        Usuario usuario = usuarioRepositorio.findById(id)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado con ID: " + id));

        // Proteger cuenta de administrador principal
        if ("admin@huesitos.com".equalsIgnoreCase(usuario.getCorreo())) {
            throw new RuntimeException("No se puede eliminar la cuenta del administrador principal del sistema.");
        }

        // Manejar dependencias según rol
        if (usuario.getRol() == Rol.CLIENTE) {
            Optional<Dueño> duenoOpt = dueñoRepositorio.findByUsuarioId(id);
            if (duenoOpt.isPresent()) {
                Dueño dueno = duenoOpt.get();
                List<Mascota> mascotas = mascotaRepositorio.findByDueñoId(dueno.getId());
                if (!mascotas.isEmpty()) {
                    throw new RuntimeException("No se puede eliminar la cuenta del cliente porque tiene mascotas registradas.");
                }
                dueñoRepositorio.delete(dueno);
            }
        } else if (usuario.getRol() == Rol.VETERINARIO) {
            // Validar citas pendientes
            List<Cita> citas = citaRepositorio.findByVeterinarioId(id);
            boolean tieneCitasPendientes = citas.stream()
                    .anyMatch(c -> c.getEstado() == EstadoCita.PENDIENTE 
                            || c.getEstado() == EstadoCita.CONFIRMADA 
                            || c.getEstado() == EstadoCita.EN_ESPERA);
            
            if (tieneCitasPendientes) {
                throw new RuntimeException("No se puede eliminar la cuenta del veterinario porque tiene citas pendientes o confirmadas programadas.");
            }

            // Desvincular citas del veterinario (pasa a null para registro histórico)
            for (Cita cita : citas) {
                cita.setVeterinario(null);
            }
            citaRepositorio.saveAll(citas);

            // Eliminar horarios de personal del veterinario
            List<HorarioPersonal> horarios = horarioPersonalRepositorio.findByUsuarioId(id);
            if (!horarios.isEmpty()) {
                horarioPersonalRepositorio.deleteAll(horarios);
            }
        }

        // Registrar auditoría de eliminación
        Actividad actividad = new Actividad();
        actividad.setMensaje("Se eliminó permanentemente la cuenta de usuario: " + usuario.getCorreo());
        actividad.setTipo("USUARIO");
        actividad.setFecha(LocalDateTime.now());
        actividadRepositorio.save(actividad);

        // Eliminar físicamente el usuario
        usuarioRepositorio.delete(usuario);
    }
}