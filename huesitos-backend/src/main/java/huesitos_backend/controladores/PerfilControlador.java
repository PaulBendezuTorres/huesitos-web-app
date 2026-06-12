package huesitos_backend.controladores;

import huesitos_backend.dto.PerfilRequest;
import huesitos_backend.entidades.Dueño;
import huesitos_backend.entidades.Mascota;
import huesitos_backend.entidades.Rol;
import huesitos_backend.entidades.Usuario;
import huesitos_backend.repositorios.DueñoRepositorio;
import huesitos_backend.repositorios.MascotaRepositorio;
import huesitos_backend.repositorios.UsuarioRepositorio;
import huesitos_backend.servicios.StorageService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/perfiles")
@RequiredArgsConstructor
public class PerfilControlador {

    private final StorageService storageService;
    private final UsuarioRepositorio usuarioRepositorio;
    private final MascotaRepositorio mascotaRepositorio;
    private final DueñoRepositorio dueñoRepositorio;
    private final PasswordEncoder passwordEncoder;

    /**
     * Sube y comprime la foto de perfil de un usuario.
     */
    @PostMapping("/usuario/{id}/foto")
    public ResponseEntity<?> subirFotoUsuario(@PathVariable Long id, @RequestParam("archivo") MultipartFile archivo) {
        try {
            Usuario usuario = usuarioRepositorio.findById(id)
                    .orElseThrow(() -> new RuntimeException("Usuario no encontrado con ID: " + id));

            String urlFoto = storageService.comprimirYGuardarFoto(archivo, "usuario");
            usuario.setFotoPerfilUrl(urlFoto);
            usuarioRepositorio.save(usuario);

            Map<String, String> respuesta = new HashMap<>();
            respuesta.put("fotoPerfilUrl", urlFoto);
            return ResponseEntity.ok(respuesta);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    /**
     * Sube y comprime la foto de una mascota.
     */
    @PostMapping("/mascota/{id}/foto")
    public ResponseEntity<?> subirFotoMascota(@PathVariable Long id, @RequestParam("archivo") MultipartFile archivo) {
        try {
            Mascota mascota = mascotaRepositorio.findById(id)
                    .orElseThrow(() -> new RuntimeException("Mascota no encontrada con ID: " + id));

            String urlFoto = storageService.comprimirYGuardarFoto(archivo, "mascota");
            mascota.setFotoUrl(urlFoto);
            mascotaRepositorio.save(mascota);

            Map<String, String> respuesta = new HashMap<>();
            respuesta.put("fotoUrl", urlFoto);
            return ResponseEntity.ok(respuesta);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    /**
     * Obtiene los datos del perfil de un usuario.
     */
    @GetMapping("/usuario/{id}")
    public ResponseEntity<?> obtenerPerfilUsuario(@PathVariable Long id) {
        try {
            Usuario usuario = usuarioRepositorio.findById(id)
                    .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

            Map<String, Object> datos = new HashMap<>();
            datos.put("id", usuario.getId());
            datos.put("nombre", usuario.getNombre());
            datos.put("apellido", usuario.getApellido());
            datos.put("correo", usuario.getCorreo());
            datos.put("rol", usuario.getRol().name());
            datos.put("fotoPerfilUrl", usuario.getFotoPerfilUrl());

            if (usuario.getRol() == Rol.CLIENTE) {
                Optional<Dueño> dueñoOpt = dueñoRepositorio.findByUsuarioId(usuario.getId());
                if (dueñoOpt.isPresent()) {
                    Dueño dueño = dueñoOpt.get();
                    datos.put("telefono", dueño.getTelefono());
                    datos.put("direccion", dueño.getDireccion());
                } else {
                    datos.put("telefono", "");
                    datos.put("direccion", "");
                }
            } else {
                datos.put("telefono", usuario.getTelefono() != null ? usuario.getTelefono() : "");
                datos.put("direccion", usuario.getDireccion() != null ? usuario.getDireccion() : "");
            }

            return ResponseEntity.ok(datos);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    /**
     * Actualiza los datos del perfil de un usuario.
     */
    @PutMapping("/usuario/{id}")
    public ResponseEntity<?> actualizarPerfilUsuario(@PathVariable Long id, @RequestBody PerfilRequest request) {
        try {
            Usuario usuario = usuarioRepositorio.findById(id)
                    .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

            // 1. Validar correo
            if (request.getCorreo() != null && !request.getCorreo().isBlank() && !usuario.getCorreo().equalsIgnoreCase(request.getCorreo())) {
                if (usuarioRepositorio.findByCorreo(request.getCorreo()).isPresent()) {
                    throw new RuntimeException("El correo ya está en uso");
                }
                usuario.setCorreo(request.getCorreo());
            }

            // 2. Cambiar contraseña si se solicita
            if (request.getContrasena() != null && !request.getContrasena().isBlank()) {
                if (request.getContrasenaActual() == null || request.getContrasenaActual().isBlank()) {
                    throw new RuntimeException("Para cambiar tu contraseña debes ingresar tu contraseña actual");
                }
                if (!passwordEncoder.matches(request.getContrasenaActual(), usuario.getContrasena())) {
                    throw new RuntimeException("La contraseña actual es incorrecta");
                }
                if (request.getContrasena().length() < 6) {
                    throw new RuntimeException("La nueva contraseña debe tener al menos 6 caracteres");
                }
                usuario.setContrasena(passwordEncoder.encode(request.getContrasena()));
            }

            // 3. Guardar nombre y apellido en Usuario
            usuario.setNombre(request.getNombre());
            usuario.setApellido(request.getApellido());

            if (usuario.getRol() == Rol.CLIENTE) {
                Dueño dueño = dueñoRepositorio.findByUsuarioId(usuario.getId())
                        .orElseGet(() -> {
                            Dueño nuevo = new Dueño();
                            nuevo.setUsuario(usuario);
                            return nuevo;
                        });

                dueño.setNombreCompleto((request.getNombre() + " " + (request.getApellido() != null ? request.getApellido() : "")).trim());

                // Validar teléfono único si es provisto
                if (request.getTelefono() != null && !request.getTelefono().isBlank()) {
                    if (!request.getTelefono().equals(dueño.getTelefono())) {
                        if (dueñoRepositorio.existsByTelefono(request.getTelefono())) {
                            throw new RuntimeException("El teléfono ya está registrado");
                        }
                    }
                    dueño.setTelefono(request.getTelefono());
                } else {
                    dueño.setTelefono(null);
                }

                dueño.setDireccion(request.getDireccion());
                dueñoRepositorio.save(dueño);
            } else {
                usuario.setTelefono(request.getTelefono());
                usuario.setDireccion(request.getDireccion());
            }

            usuarioRepositorio.save(usuario);

            Map<String, String> respuesta = new HashMap<>();
            respuesta.put("mensaje", "Perfil actualizado correctamente");
            return ResponseEntity.ok(respuesta);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}
