package huesitos_backend.config;

import huesitos_backend.seguridad.FiltroAutenticacionJwt;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.Arrays;

@Configuration
@EnableWebSecurity
@RequiredArgsConstructor
public class SeguridadConfig {

    private final FiltroAutenticacionJwt filtroAutenticacionJwt;

    @Bean
    public PasswordEncoder encriptadorContrasena() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public SecurityFilterChain filtroSeguridad(HttpSecurity http) throws Exception {
        http
            .cors(cors -> cors.configurationSource(corsConfigurationSource())) // <-- Habilita CORS
            .csrf(csrf -> csrf.disable())
            .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
            .authorizeHttpRequests(autorizaciones -> autorizaciones
                .requestMatchers(
                    "/api/autenticacion/login", 
                    "/api/autenticacion/registro",
                    "/api/autenticacion/olvide-contrasena",
                    "/api/autenticacion/restablecer-contrasena"
                ).permitAll()
                .requestMatchers(HttpMethod.GET, "/api/servicios").permitAll()
                .requestMatchers(HttpMethod.GET, "/api/usuarios/*/horarios").authenticated()
                .requestMatchers(HttpMethod.GET, "/api/vacunas/**", "/api/recetas/**", "/api/archivos-clinicos/**").authenticated()
                .requestMatchers("/api/vacunas/**", "/api/recetas/**", "/api/archivos-clinicos/**").hasAnyRole("VETERINARIO", "ADMINISTRADOR")
                .requestMatchers(HttpMethod.GET, "/api/pagos/reporte").hasRole("ADMINISTRADOR")
                .requestMatchers(HttpMethod.GET, "/api/pagos/estado/**").hasAnyRole("RECEPCIONISTA", "ADMINISTRADOR")
                .requestMatchers(HttpMethod.POST, "/api/pagos/procesar-caja/**").hasAnyRole("RECEPCIONISTA", "ADMINISTRADOR")
                .requestMatchers("/api/pagos/**").authenticated()
                .requestMatchers("/api/inventarios/alertas/**").hasAnyRole("VETERINARIO", "ADMINISTRADOR")
                .requestMatchers(HttpMethod.GET, "/api/categorias/**", "/api/productos/**").permitAll()
                .requestMatchers("/api/categorias/**", "/api/productos/**", "/api/inventarios/**").hasRole("ADMINISTRADOR")
                .requestMatchers("/api/usuarios/**").hasRole("ADMINISTRADOR")
                .anyRequest().authenticated()
            )
            .addFilterBefore(filtroAutenticacionJwt, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

    // <-- Define qué aplicaciones externas pueden acceder a tus endpoints
    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        // Agrega el puerto donde corre tu frontend (Vite usa el 5173 normalmente)
        configuration.setAllowedOrigins(Arrays.asList("http://localhost:5173", "http://localhost:3000"));
        configuration.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE", "OPTIONS"));
        configuration.setAllowedHeaders(Arrays.asList("Authorization", "Content-Type"));
        configuration.setAllowCredentials(true);
        
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }
}