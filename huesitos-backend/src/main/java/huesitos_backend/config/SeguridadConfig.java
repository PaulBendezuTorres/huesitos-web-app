package huesitos_backend.config;

import huesitos_backend.seguridad.FiltroAutenticacionJwt;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
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
@EnableMethodSecurity
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
            .cors(cors -> cors.configurationSource(corsConfigurationSource()))
            .csrf(csrf -> csrf.disable())
            .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
            .authorizeHttpRequests(autorizaciones -> autorizaciones
                // 1. OBLIGATORIO: Permitir TODAS las peticiones OPTIONS (CORS Preflight)
                .requestMatchers(HttpMethod.OPTIONS, "/**").permitAll()
                
                // 2. Rutas Públicas de Auth
                .requestMatchers(
                    "/api/autenticacion/login", 
                    "/api/autenticacion/registro",
                    "/api/autenticacion/olvide-contrasena",
                    "/api/autenticacion/restablecer-contrasena",
                    "/api/autenticacion/activar",
                    "/api/autenticacion/reenviar-codigo",
                    "/api/pagos/webhook",
                    "/api/pagos/pagoefectivo/webhook",
                    "/api/pagos/pagoefectivo/simular-pago",
                    "/uploads/**"
                ).permitAll()
                
                // 3. Matchers de Servicios unificados con hasRole
                .requestMatchers(HttpMethod.GET, "/api/servicios", "/api/servicios/**").permitAll()
                .requestMatchers(HttpMethod.POST, "/api/servicios", "/api/servicios/**").hasRole("ADMINISTRADOR")
                .requestMatchers(HttpMethod.PUT, "/api/servicios/**").hasRole("ADMINISTRADOR")
                .requestMatchers(HttpMethod.PATCH, "/api/servicios/**").hasRole("ADMINISTRADOR")
                .requestMatchers(HttpMethod.DELETE, "/api/servicios/**").hasRole("ADMINISTRADOR")
                
                // 4. Endpoints del Dashboard
                .requestMatchers(HttpMethod.GET, "/api/dashboard/**").hasRole("ADMINISTRADOR")

                // 5. El resto de tus endpoints intactos
                .requestMatchers(HttpMethod.GET, "/api/usuarios/*/horarios").authenticated()
                .requestMatchers(HttpMethod.GET, "/api/vacunas/**", "/api/recetas/**", "/api/archivos-clinicos/**").authenticated()
                .requestMatchers("/api/vacunas/**", "/api/recetas/**", "/api/archivos-clinicos/**").hasAnyRole("VETERINARIO", "ADMINISTRADOR")
                .requestMatchers(HttpMethod.GET, "/api/pagos/reporte").hasRole("ADMINISTRADOR")
                .requestMatchers(HttpMethod.GET, "/api/pagos/estado/**").hasAnyRole("RECEPCIONISTA", "ADMINISTRADOR")
                .requestMatchers(HttpMethod.POST, "/api/pagos/procesar-caja/**").hasAnyRole("RECEPCIONISTA", "ADMINISTRADOR")
                .requestMatchers("/api/pagos/**").authenticated()
                .requestMatchers("/api/inventarios/alertas/**").hasAnyRole("VETERINARIO", "ADMINISTRADOR")
                .requestMatchers(HttpMethod.GET, "/api/categorias/**", "/api/productos/**").permitAll()
                .requestMatchers(HttpMethod.GET, "/api/campanas/todas", "/api/ofertas/todas").hasRole("ADMINISTRADOR")
                .requestMatchers(HttpMethod.GET, "/api/campanas/**", "/api/ofertas/**").permitAll()
                .requestMatchers("/api/campanas/**", "/api/ofertas/**").hasRole("ADMINISTRADOR")
                .requestMatchers(HttpMethod.POST, "/api/desparasitaciones").hasAnyRole("VETERINARIO", "ADMINISTRADOR")
                .requestMatchers("/api/desparasitaciones/**", "/api/recordatorios/**").authenticated()
                .requestMatchers("/api/carrito/**").authenticated()
                .requestMatchers("/api/pedidos/checkout", "/api/pedidos/cliente/**").authenticated()
                .requestMatchers(HttpMethod.GET, "/api/pedidos").hasAnyRole("RECEPCIONISTA", "ADMINISTRADOR")
                .requestMatchers("/api/pedidos/*/estado").hasAnyRole("RECEPCIONISTA", "ADMINISTRADOR")
                .requestMatchers("/api/categorias/**", "/api/productos/**", "/api/inventarios/**").hasRole("ADMINISTRADOR")
                .requestMatchers("/api/usuarios/**").hasRole("ADMINISTRADOR")
                .requestMatchers(HttpMethod.GET, "/api/configuracion-negocio").permitAll()
.requestMatchers(HttpMethod.PUT, "/api/configuracion-negocio").hasRole("ADMINISTRADOR")
                
                .anyRequest().authenticated()
            )
            .addFilterBefore(filtroAutenticacionJwt, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        configuration.setAllowedOrigins(Arrays.asList("http://localhost:5173", "http://localhost:5174", "http://localhost:3000"));
        
        configuration.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"));
        
        configuration.setAllowedHeaders(Arrays.asList("Authorization", "Content-Type"));
        configuration.setAllowCredentials(true);
        
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }
}