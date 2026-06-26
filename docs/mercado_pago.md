# Guía de Integración y Configuración de Mercado Pago

Esta guía detalla los pasos para configurar, verificar tu cuenta y simular pagos utilizando la pasarela de Mercado Pago (Checkout Pro) en la plataforma **Huesitos**.

---

## 1. Verificación de Identidad (Muro de Seguridad)

Al ingresar a la consola de Mercado Pago Developers, la plataforma suele requerir una verificación obligatoria por seguridad antes de permitir el acceso a las credenciales o aplicaciones.

### Pasos para Resolverlo:
1. **Descarga e instala la aplicación móvil** de Mercado Pago en tu smartphone.
2. **Inicia sesión** en la app móvil con la misma cuenta de correo que usas en el navegador (ej: `paultorres2266@gmail.com`).
3. Busca y abre la **notificación o tarjeta de alerta** en la app móvil que te solicita verificar tu identidad.
4. Completa el flujo en el celular (requiere usar la cámara para tomar una foto de tu documento de identidad DNI/CE y un selfie para reconocimiento facial).
5. Si no cuentas con un smartphone compatible o con la aplicación instalada, selecciona el enlace **"No tengo la app"** en el navegador web para explorar métodos de verificación alternativos (SMS o correo).
6. Una vez aprobada tu identidad en el celular, la página del navegador web se actualizará automáticamente y te dará acceso al panel de desarrollador.

---

## 2. Obtención de Credenciales de Integración

Mercado Pago utiliza dos credenciales principales para cualquier tipo de integración (sea Checkout Pro, Bricks, etc.):
* **Public Key (Clave Pública):** Utilizada únicamente en el lado del cliente (Frontend).
* **Access Token (Token de Acceso):** Clave privada utilizada únicamente en el servidor (Backend).

### Pasos para Obtenerlas:
1. Ingresa a [Mercado Pago Developers (Tus Integraciones)](https://www.mercadopago.com.pe/developers).
2. Haz clic en tu aplicación creada (ej: **Huesitos**). Si no la has creado, haz clic en **"Crear aplicación"**, selecciona "Pagos online", completa la información básica y acéptala.
3. En el panel lateral izquierdo de tu aplicación, navega a:
   * **Credenciales de prueba:** Para simular transacciones en entorno sandbox (desarrollo).
   * **Credenciales de producción:** Para transacciones reales de clientes (requiere completar previamente el formulario de activación de negocio).
4. Copia el **Access Token** y la **Public Key**.

---

## 3. Configuración en la Plataforma Huesitos

Abre el archivo de configuración del Backend:
[application.properties](file:///c:/Users/Paul%20Bendezu/Desktop/huesitos-web-app/huesitos-backend/src/main/resources/application.properties)

Actualiza las siguientes variables con tus nuevas credenciales:

```properties
# Credenciales de Mercado Pago
mercadopago.access-token=TEST-TU_ACCESS_TOKEN_AQUI
mercadopago.public-key=TEST-TU_PUBLIC_KEY_AQUI
```

---

## 4. Simulación de Pagos (Sandbox)

Para probar el flujo de citas sin utilizar dinero real, asegúrate de estar usando credenciales de tipo **TEST / prueba** y realiza las compras usando tarjetas simuladas.

### Tarjetas de Prueba Oficiales (Perú)

| Franquicia | Número de Tarjeta | Fecha Vencimiento | Código de Seguridad (CVV) |
| :--- | :--- | :--- | :--- |
| **Visa** | `4009 1753 3280 6176` | `11/30` | `123` |
| **Mastercard** | `5031 7557 3453 0604` | `11/30` | `123` |
| **Amex** | `3711 803032 57522` | `11/30` | `1234` |

### Simulación de Resultados
Mercado Pago decide el resultado de la simulación de acuerdo al **Nombre del Titular** que ingreses al pagar:

* **Pago Aprobado (approved):** Escribe `APRO` como nombre del titular.
* **Pago Rechazado por saldo insuficiente:** Escribe `FUND` como nombre del titular.
* **Pago Pendiente de acreditación:** Escribe `CONT` como nombre del titular.
* **Pago Rechazado (error general):** Escribe `OTHE` como nombre del titular.

> [!TIP]
> Realiza siempre las pruebas de pago en una pestaña de incógnito de tu navegador para evitar colisiones con las cookies de tu sesión real de Mercado Pago.

---

## 5. Pruebas de Webhooks en Entorno Local

Mercado Pago avisa asíncronamente a tu servidor cuando un pago es aprobado usando el endpoint de Webhook `/api/pagos/webhook`. Como el servidor de Mercado Pago no puede acceder directamente a tu `localhost`, debes configurar un túnel seguro.

### Configuración con Ngrok:
1. Descarga e inicia **ngrok** apuntando al puerto de tu backend:
   ```bash
   ngrok http 8080
   ```
2. Copia la URL pública generada (ej: `https://abcd-123.ngrok-free.app`).
3. Actualiza la propiedad en tu archivo `application.properties`:
   ```properties
   mercadopago.webhook-url=https://abcd-123.ngrok-free.app/api/pagos/webhook
   ```
4. Reinicia tu servidor backend para que cargue la nueva URL del webhook.
