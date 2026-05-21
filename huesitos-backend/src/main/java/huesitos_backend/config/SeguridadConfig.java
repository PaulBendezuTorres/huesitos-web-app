package huesitos_backend.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
@EnableWebSecurity
public class SeguridadConfig {

    @Bean
    public PasswordEncoder encriptadorContrasena() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public SecurityFilterChain filtroSeguridad(HttpSecurity http) throws Exception {
        http
            // Deshabilitar CSRF para permitir pruebas locales
            .csrf(csrf -> csrf.disable())
            // Permitir el acceso total de forma temporal para pruebas del registro
            .authorizeHttpRequests(autorizaciones -> autorizaciones
                .anyRequest().permitAll()
            );

        return http.build();
    }
}
