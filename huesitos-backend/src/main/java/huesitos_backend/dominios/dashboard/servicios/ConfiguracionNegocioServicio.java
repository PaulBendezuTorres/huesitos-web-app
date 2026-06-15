package huesitos_backend.dominios.dashboard.servicios;

import huesitos_backend.dominios.dashboard.entidades.ConfiguracionNegocio;
import huesitos_backend.dominios.dashboard.repositorios.ConfiguracionNegocioRepositorio;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.context.event.ApplicationReadyEvent;
import org.springframework.context.event.EventListener;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class ConfiguracionNegocioServicio {

    private final ConfiguracionNegocioRepositorio repositorio;

    /**
     * Inicializa los datos de configuración en el inicio de la aplicación.
     * Esto previene colisiones por peticiones web concurrentes en el arranque.
     */
    @EventListener(ApplicationReadyEvent.class)
    public void inicializarConfiguracion() {
        try {
            if (!repositorio.existsById(1L)) {
                ConfiguracionNegocio defecto = new ConfiguracionNegocio();
                defecto.setId(1L);
                defecto.setNombreNegocio("Huesitos");
                defecto.setTelefono("(01) 628-2000");
                defecto.setTelefonoEmergencia("+51 994 142 421");
                defecto.setCorreo("VeterinariaHuesito@gmail.com");
                defecto.setDireccion("Santo Domingo De Marcona C-22, Ica, Ica, 11001");
                defecto.setHorarioSemana("Lunes a Sábado: 08:00 AM - 08:00 PM");
                defecto.setHorarioDomingo("Domingos: 09:00 AM - 02:00 PM");
                defecto.setMoneda("Soles");
                defecto.setImpuesto(18.0);
                repositorio.save(defecto);
            }
        } catch (Exception ex) {
            // Ignorar de forma segura si ya fue creado o colisiona en el arranque
        }
    }


    /**
     * Recupera la configuración global.
     */
    @Transactional(readOnly = true)
    public ConfiguracionNegocio obtenerConfiguracion() {
        return repositorio.findById(1L).orElseGet(() -> {
            // Plan de respaldo si por algún motivo no existe aún en la consulta
            ConfiguracionNegocio defecto = new ConfiguracionNegocio();
            defecto.setId(1L);
            defecto.setNombreNegocio("Huesitos");
            defecto.setTelefono("(01) 628-2000");
            defecto.setTelefonoEmergencia("+51 994 142 421");
            defecto.setCorreo("VeterinariaHuesito@gmail.com");
            defecto.setDireccion("Santo Domingo De Marcona C-22, Ica, Ica, 11001");
            defecto.setHorarioSemana("Lunes a Sábado: 08:00 AM - 08:00 PM");
            defecto.setHorarioDomingo("Domingos: 09:00 AM - 02:00 PM");
            defecto.setMoneda("Soles");
            defecto.setImpuesto(18.0);
            return defecto;
        });
    }

    /**
     * Sobrescribe los parámetros globales manteniendo el identificador único del sistema.
     */
    @Transactional
    public ConfiguracionNegocio actualizarConfiguracion(ConfiguracionNegocio nuevasConfig) {
        ConfiguracionNegocio existente = repositorio.findById(1L).orElseGet(() -> {
            ConfiguracionNegocio c = new ConfiguracionNegocio();
            c.setId(1L);
            return c;
        });
        
        existente.setNombreNegocio(nuevasConfig.getNombreNegocio());
        existente.setTelefono(nuevasConfig.getTelefono());
        existente.setTelefonoEmergencia(nuevasConfig.getTelefonoEmergencia());
        existente.setCorreo(nuevasConfig.getCorreo());
        existente.setDireccion(nuevasConfig.getDireccion());
        existente.setHorarioSemana(nuevasConfig.getHorarioSemana());
        existente.setHorarioDomingo(nuevasConfig.getHorarioDomingo());
        existente.setMoneda(nuevasConfig.getMoneda());
        existente.setImpuesto(nuevasConfig.getImpuesto());
        
        return repositorio.save(existente);
    }
}