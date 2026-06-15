package huesitos_backend.dominios.finanzas.servicios;

import com.mercadopago.MercadoPagoConfig;
import com.mercadopago.client.payment.PaymentClient;
import com.mercadopago.client.preference.PreferenceBackUrlsRequest;
import com.mercadopago.client.preference.PreferenceClient;
import com.mercadopago.client.preference.PreferenceItemRequest;
import com.mercadopago.client.preference.PreferenceRequest;
import com.mercadopago.exceptions.MPApiException;
import com.mercadopago.exceptions.MPException;
import com.mercadopago.resources.payment.Payment;
import com.mercadopago.resources.preference.Preference;
import huesitos_backend.dominios.finanzas.entidades.Transaccion;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.Collections;

@Service
public class MercadoPagoServicio {

    private final String webhookUrl;
    private final String successUrl;
    private final String failureUrl;
    private final String pendingUrl;

    public MercadoPagoServicio(
            @Value("${mercadopago.access-token}") String accessToken,
            @Value("${mercadopago.webhook-url}") String webhookUrl) {
        // Inicializar Mercado Pago con el Token de Acceso
        MercadoPagoConfig.setAccessToken(accessToken);
        this.webhookUrl = webhookUrl;
        
        // URLs del frontend para redireccionar después del flujo de checkout
        this.successUrl = "http://localhost:5173/cliente/citas/retorno-pago?estado=exito";
        this.failureUrl = "http://localhost:5173/cliente/citas/retorno-pago?estado=fallo";
        this.pendingUrl = "http://localhost:5173/cliente/citas/retorno-pago?estado=pendiente";
    }

    /**
     * Crea una preferencia de pago en Mercado Pago para la transacción indicada.
     *
     * @param transaccion Los datos de la transacción en base de datos.
     * @return El initPoint (URL de Checkout Pro) para redireccionar al cliente.
     */
    public String crearPreferenciaPago(Transaccion transaccion) {
        try {
            PreferenceClient client = new PreferenceClient();

            String tituloItem = "Servicio Clínico";
            if (transaccion.getCita() != null && transaccion.getCita().getServicio() != null) {
                tituloItem = "Servicio: " + transaccion.getCita().getServicio().getNombre();
            }

            PreferenceItemRequest item = PreferenceItemRequest.builder()
                    .id(transaccion.getId().toString())
                    .title(tituloItem)
                    .quantity(1)
                    .unitPrice(transaccion.getMonto())
                    .currencyId("PEN") // Moneda Soles Peruanos
                    .build();

            PreferenceBackUrlsRequest backUrls = PreferenceBackUrlsRequest.builder()
                    .success(successUrl + "&transaccionId=" + transaccion.getId())
                    .failure(failureUrl + "&transaccionId=" + transaccion.getId())
                    .pending(pendingUrl + "&transaccionId=" + transaccion.getId())
                    .build();

            // Configurar preferencia
            PreferenceRequest request = PreferenceRequest.builder()
                    .items(Collections.singletonList(item))
                    .backUrls(backUrls)
                    .notificationUrl(webhookUrl)
                    .externalReference(transaccion.getId().toString())
                    .autoReturn("approved") // Retorno automático en caso de aprobación
                    .build();

            Preference preference = client.create(request);
            return preference.getInitPoint();

        } catch (MPException | MPApiException e) {
            throw new RuntimeException("Error al comunicarse con Mercado Pago: " + e.getMessage(), e);
        }
    }

    /**
     * Consulta los detalles de un pago en Mercado Pago para validar su estado de aprobación.
     *
     * @param paymentId El ID de pago enviado por el webhook.
     * @return El recurso Payment obtenido directamente de Mercado Pago.
     */
    public Payment consultarPago(Long paymentId) {
        try {
            PaymentClient client = new PaymentClient();
            return client.get(paymentId);
        } catch (MPException | MPApiException e) {
            throw new RuntimeException("Error al consultar el pago en Mercado Pago: " + e.getMessage(), e);
        }
    }
}
