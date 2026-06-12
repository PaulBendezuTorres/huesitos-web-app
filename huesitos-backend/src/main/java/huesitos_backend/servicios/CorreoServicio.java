package huesitos_backend.servicios;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import lombok.RequiredArgsConstructor;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class CorreoServicio {

    private final JavaMailSender mailSender;

    /**
     * Envía el código de recuperación de contraseña de 6 dígitos al correo del usuario.
     */
    public void enviarCodigoRecuperacion(String destinatario, String codigo) {
        try {
            MimeMessage mensaje = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(mensaje, true, "UTF-8");

            helper.setFrom("paultorres2266@gmail.com", "Clínica Veterinaria Huesitos");
            helper.setTo(destinatario);
            helper.setSubject("🔐 Código de Recuperación - Huesitos");
            helper.setText(construirPlantillaHtml(codigo), true);

            mailSender.send(mensaje);
        } catch (MessagingException | java.io.UnsupportedEncodingException e) {
            throw new RuntimeException("Error al enviar el correo de recuperación: " + e.getMessage());
        }
    }

    /**
     * Envía el código de activación de cuenta de 6 dígitos al correo del usuario.
     */
    public void enviarCodigoActivacion(String destinatario, String codigo) {
        try {
            MimeMessage mensaje = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(mensaje, true, "UTF-8");

            helper.setFrom("paultorres2266@gmail.com", "Clínica Veterinaria Huesitos");
            helper.setTo(destinatario);
            helper.setSubject("🔑 Activa tu cuenta - Huesitos");
            helper.setText(construirPlantillaHtmlActivacion(codigo), true);

            mailSender.send(mensaje);
        } catch (MessagingException | java.io.UnsupportedEncodingException e) {
            throw new RuntimeException("Error al enviar el correo de activación: " + e.getMessage());
        }
    }

    private String construirPlantillaHtmlActivacion(String codigo) {
        StringBuilder casillas = new StringBuilder();
        for (char digito : codigo.toCharArray()) {
            casillas.append(
                "<td style='width:48px;height:56px;background:#f1f5f9;border:2px solid #cbd5e1;border-radius:12px;text-align:center;font-size:28px;font-weight:700;color:#0f172a;font-family:monospace;letter-spacing:2px;'>"
                + digito + "</td><td style='width:8px;'></td>"
            );
        }

        return """
            <!DOCTYPE html>
            <html lang="es">
            <head><meta charset="UTF-8"></head>
            <body style="margin:0;padding:0;background:#f1f5f9;font-family:'Segoe UI',Arial,sans-serif;">
              <table width="100%%" cellpadding="0" cellspacing="0" style="background:#f1f5f9;padding:40px 0;">
                <tr><td align="center">
                  <table width="480" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.08);">
                    <tr>
                      <td style="background:linear-gradient(135deg,#185FA5 0%%,#042C53 100%%);padding:32px 40px;text-align:center;">
                        <h1 style="margin:0;font-size:24px;font-weight:700;color:#ffffff;letter-spacing:0.5px;">🦴 Huesitos</h1>
                        <p style="margin:6px 0 0;font-size:13px;color:#85B7EB;">Clínica Veterinaria · Marcona, Ica</p>
                      </td>
                    </tr>
                    <tr>
                      <td style="padding:36px 40px 20px;">
                        <h2 style="margin:0 0 8px;font-size:20px;font-weight:700;color:#0f172a;">Activa tu cuenta</h2>
                        <p style="margin:0 0 28px;font-size:14px;color:#64748b;line-height:1.6;">
                          ¡Gracias por registrarte en Vet Huesitos! Para activar tu cuenta de cliente, por favor ingresa el siguiente código de verificación de 6 dígitos:
                        </p>
                        <table cellpadding="0" cellspacing="0" style="margin:0 auto 28px;">
                          <tr>
                            %s
                          </tr>
                        </table>
                        <div style="background:#FEF3C7;border:1px solid #FDE68A;border-radius:10px;padding:14px 18px;margin-bottom:24px;">
                          <p style="margin:0;font-size:13px;color:#92400E;line-height:1.5;">
                            ⏱️ Este código es válido por <strong>15 minutos</strong>.
                          </p>
                        </div>
                        <p style="margin:0;font-size:13px;color:#94a3b8;line-height:1.5;">
                          Si no solicitaste esta cuenta, por favor ignora este mensaje.
                        </p>
                      </td>
                    </tr>
                    <tr>
                      <td style="padding:20px 40px 28px;border-top:1px solid #f1f5f9;text-align:center;">
                        <p style="margin:0;font-size:11px;color:#94a3b8;">
                          © 2026 Clínica Veterinaria Huesitos · Santo Domingo de Marcona, Ica, Perú
                        </p>
                      </td>
                    </tr>
                  </table>
                </td></tr>
              </table>
            </body>
            </html>
            """.formatted(casillas.toString());
    }

    /**
     * Construye la plantilla HTML premium para el correo de recuperación.
     */
    private String construirPlantillaHtml(String codigo) {
        // Separar los 6 dígitos para mostrarlos en casillas individuales
        StringBuilder casillas = new StringBuilder();
        for (char digito : codigo.toCharArray()) {
            casillas.append(
                "<td style='width:48px;height:56px;background:#f1f5f9;border:2px solid #cbd5e1;border-radius:12px;text-align:center;font-size:28px;font-weight:700;color:#0f172a;font-family:monospace;letter-spacing:2px;'>"
                + digito + "</td><td style='width:8px;'></td>"
            );
        }

        return """
            <!DOCTYPE html>
            <html lang="es">
            <head><meta charset="UTF-8"></head>
            <body style="margin:0;padding:0;background:#f1f5f9;font-family:'Segoe UI',Arial,sans-serif;">
              <table width="100%%" cellpadding="0" cellspacing="0" style="background:#f1f5f9;padding:40px 0;">
                <tr><td align="center">
                  <table width="480" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.08);">

                    <!-- HEADER -->
                    <tr>
                      <td style="background:linear-gradient(135deg,#185FA5 0%%,#042C53 100%%);padding:32px 40px;text-align:center;">
                        <h1 style="margin:0;font-size:24px;font-weight:700;color:#ffffff;letter-spacing:0.5px;">🦴 Huesitos</h1>
                        <p style="margin:6px 0 0;font-size:13px;color:#85B7EB;">Clínica Veterinaria · Marcona, Ica</p>
                      </td>
                    </tr>

                    <!-- BODY -->
                    <tr>
                      <td style="padding:36px 40px 20px;">
                        <h2 style="margin:0 0 8px;font-size:20px;font-weight:700;color:#0f172a;">Recuperación de contraseña</h2>
                        <p style="margin:0 0 28px;font-size:14px;color:#64748b;line-height:1.6;">
                          Recibimos una solicitud para restablecer la contraseña de tu cuenta. Usa el siguiente código de verificación:
                        </p>

                        <!-- CÓDIGO DE 6 DÍGITOS -->
                        <table cellpadding="0" cellspacing="0" style="margin:0 auto 28px;">
                          <tr>
                            %s
                          </tr>
                        </table>

                        <div style="background:#FEF3C7;border:1px solid #FDE68A;border-radius:10px;padding:14px 18px;margin-bottom:24px;">
                          <p style="margin:0;font-size:13px;color:#92400E;line-height:1.5;">
                            ⏱️ Este código es válido por <strong>15 minutos</strong>. Si no solicitaste este cambio, ignora este mensaje.
                          </p>
                        </div>

                        <p style="margin:0;font-size:13px;color:#94a3b8;line-height:1.5;">
                          Por tu seguridad, nunca compartas este código con nadie. El equipo de Huesitos nunca te pedirá tu código por teléfono o mensaje.
                        </p>
                      </td>
                    </tr>

                    <!-- FOOTER -->
                    <tr>
                      <td style="padding:20px 40px 28px;border-top:1px solid #f1f5f9;text-align:center;">
                        <p style="margin:0;font-size:11px;color:#94a3b8;">
                          © 2026 Clínica Veterinaria Huesitos · Santo Domingo de Marcona, Ica, Perú
                        </p>
                      </td>
                    </tr>

                  </table>
                </td></tr>
              </table>
            </body>
            </html>
            """.formatted(casillas.toString());
    }
}
