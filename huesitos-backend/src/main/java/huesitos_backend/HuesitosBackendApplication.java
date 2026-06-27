package huesitos_backend;

import huesitos_backend.dominios.cliente.entidades.Dueño;
import huesitos_backend.dominios.usuario.entidades.Rol;
import huesitos_backend.dominios.usuario.entidades.Usuario;
import huesitos_backend.dominios.cliente.repositorios.DueñoRepositorio;
import huesitos_backend.dominios.usuario.repositorios.UsuarioRepositorio;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.crypto.password.PasswordEncoder;

import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableScheduling
@EnableMethodSecurity
public class HuesitosBackendApplication {

    public static void main(String[] args) {
        cargarVariablesEntorno();
        SpringApplication.run(HuesitosBackendApplication.class, args);
    }

    private static void cargarVariablesEntorno() {
        java.io.File archivoEnv = new java.io.File(".env");
        if (archivoEnv.exists()) {
            try (java.io.BufferedReader br = new java.io.BufferedReader(new java.io.FileReader(archivoEnv))) {
                String linea;
                while ((linea = br.readLine()) != null) {
                    linea = linea.trim();
                    if (linea.isEmpty() || linea.startsWith("#")) {
                        continue;
                    }
                    int idx = linea.indexOf('=');
                    if (idx > 0) {
                        String clave = linea.substring(0, idx).trim();
                        String valor = linea.substring(idx + 1).trim();
                        
                        // Eliminar comillas si las hay
                        if (valor.startsWith("\"") && valor.endsWith("\"")) {
                            valor = valor.substring(1, valor.length() - 1);
                        } else if (valor.startsWith("'") && valor.endsWith("'")) {
                            valor = valor.substring(1, valor.length() - 1);
                        }
                        
                        // Solo inyectar si no existe ya en el entorno real
                        if (System.getenv(clave) == null && System.getProperty(clave) == null) {
                            System.setProperty(clave, valor);
                        }
                    }
                }
            } catch (java.io.IOException e) {
                System.err.println("Error al leer el archivo .env: " + e.getMessage());
            }
        }
    }

    // Este bloque crea los 3 roles automáticamente al iniciar el servidor
    @Bean
    public CommandLineRunner inicializarDatos(
            UsuarioRepositorio usuarioRepo, 
            DueñoRepositorio dueñoRepo, 
            PasswordEncoder passwordEncoder,
            org.springframework.jdbc.core.JdbcTemplate jdbcTemplate
    ) {
        return args -> {
            // Modificar columnas telefono y direccion de la tabla duenos para que acepten nulos
            try {
                jdbcTemplate.execute("ALTER TABLE duenos MODIFY COLUMN telefono VARCHAR(20) NULL");
                jdbcTemplate.execute("ALTER TABLE duenos MODIFY COLUMN direccion VARCHAR(150) NULL");
            } catch (Exception e) {
                // Si la alteración falla o ya se aplicó, continuar
            }

            // Encriptamos la contraseña "123456" con tu propia configuración de seguridad
            String claveEncriptada = passwordEncoder.encode("123456");

            // 1. Crear cuenta de ADMINISTRADOR
            if (usuarioRepo.findByCorreo("admin@huesitos.com").isEmpty()) {
                Usuario admin = new Usuario();
                admin.setCorreo("admin@huesitos.com");
                admin.setContrasena(claveEncriptada);
                admin.setRol(Rol.ADMINISTRADOR);
                admin.setActivo(true);
                admin.setFotoPerfilUrl("/uploads/defecto-usuario.png");
                usuarioRepo.save(admin);
            }

            // 2. Crear cuenta de VETERINARIO
            if (usuarioRepo.findByCorreo("vet@huesitos.com").isEmpty()) {
                Usuario vet = new Usuario();
                vet.setCorreo("vet@huesitos.com");
                vet.setContrasena(claveEncriptada);
                vet.setRol(Rol.VETERINARIO);
                vet.setActivo(true);
                vet.setFotoPerfilUrl("/uploads/defecto-usuario.png");
                usuarioRepo.save(vet);
            }

            // 3. Crear cuenta de CLIENTE (con su vinculación obligatoria de Dueño)
            if (usuarioRepo.findByCorreo("cliente@ejemplo.com").isEmpty()) {
                Usuario cliente = new Usuario();
                cliente.setCorreo("cliente@ejemplo.com");
                cliente.setContrasena(claveEncriptada);
                cliente.setRol(Rol.CLIENTE);
                cliente.setActivo(true);
                cliente.setFotoPerfilUrl("/uploads/defecto-usuario.png");
                Usuario clienteGuardado = usuarioRepo.save(cliente); // Guardamos el usuario primero

                Dueño dueño = new Dueño();
                dueño.setNombreCompleto("Usuario de Prueba Cliente");
                dueño.setTelefono("999888777");
                dueño.setDireccion("Avenida Siempre Viva 123");
                dueño.setUsuario(clienteGuardado); // Lo vinculamos para cumplir el RF-05
                dueñoRepo.save(dueño);
            }
        };
    }
}