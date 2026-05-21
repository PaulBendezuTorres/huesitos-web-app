package huesitos_backend.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
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

import java.util.List;

@Configuration
@EnableWebSecurity
public class SeguridadConfig {

    private final FiltroTokenJwt filtroTokenJwt;

    public SeguridadConfig(FiltroTokenJwt filtroTokenJwt) {
        this.filtroTokenJwt = filtroTokenJwt;
    }

    @Bean
    public SecurityFilterChain filtroCadenaSeguridad(HttpSecurity http) throws Exception {
        http
            // Deshabilitar CSRF dado que usamos tokens JWT
            .csrf(csrf -> csrf.disable())
            
            // Configurar CORS
            .cors(cors -> cors.configurationSource(configuracionOrigenCors()))
            
            // Configurar política de sesión stateless
            .sessionManagement(sesion -> sesion.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
            
            // Reglas de autorización de peticiones
            .authorizeHttpRequests(autorizaciones -> autorizaciones
                .requestMatchers("/api/autenticacion/**").permitAll() // Permitir registro y login sin autenticar
                .anyRequest().authenticated() // Cualquier otra petición requiere autenticación
            )
            
            // Agregar nuestro filtro personalizado de JWT
            .addFilterBefore(filtroTokenJwt, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

    @Bean
    public PasswordEncoder codificadorContrasena() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public AuthenticationManager gestorAutenticacion(AuthenticationConfiguration configuracion) throws Exception {
        return configuracion.getAuthenticationManager();
    }

    @Bean
    public CorsConfigurationSource configuracionOrigenCors() {
        CorsConfiguration configuracion = new CorsConfiguration();
        // Permitir solicitudes del frontend
        configuracion.setAllowedOrigins(List.of("http://localhost:5173")); 
        configuracion.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "OPTIONS"));
        configuracion.setAllowedHeaders(List.of("Authorization", "Content-Type"));
        configuracion.setAllowCredentials(true);

        UrlBasedCorsConfigurationSource origen = new UrlBasedCorsConfigurationSource();
        origen.registerCorsConfiguration("/**", configuracion);
        return origen;
    }
}
