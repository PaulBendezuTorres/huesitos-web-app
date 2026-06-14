package huesitos_backend.dominios.dashboard.servicios;

import huesitos_backend.dominios.dashboard.entidades.ConfiguracionNegocio;
import huesitos_backend.dominios.dashboard.repositorios.ConfiguracionNegocioRepositorio;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class ConfiguracionNegocioServicio {

    private final ConfiguracionNegocioRepositorio repositorio;

    /**
     * Recupera la configuración global. Si la base de datos está vacía,
     * inicializa automáticamente la fila de control con los datos semilla.
     */
    @Transactional
    public ConfiguracionNegocio obtenerConfiguracion() {
    return repositorio.findById(1L).orElseGet(() -> {
        ConfiguracionNegocio defecto = new ConfiguracionNegocio();
        defecto.setId(1L);
        defecto.setNombreNegocio("Huesitos");
        defecto.setTelefono("(01) 628-2000");
        defecto.setTelefonoEmergencia("+51 994 142 421");
        defecto.setCorreo("VeterinariaHuesito@gmail.com");
        defecto.setDireccion("Santo Domingo De Marcona C-22, Ica, Ica, 11001");
        // Valores por defecto alineados con tu landing
        defecto.setHorarioSemana("Lunes a Sábado: 08:00 AM - 08:00 PM");
        defecto.setHorarioDomingo("Domingos: 09:00 AM - 02:00 PM");
        defecto.setMoneda("Soles"); // Valor por defecto
        defecto.setImpuesto(18.0);
        return repositorio.save(defecto);
    });
}

    /**
     * Sobrescribe los parámetros globales manteniendo el identificador único del sistema.
     */
    @Transactional
    public ConfiguracionNegocio actualizarConfiguracion(ConfiguracionNegocio nuevasConfig) {
        ConfiguracionNegocio existente = obtenerConfiguracion();
        
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