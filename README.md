# Examen Progreso 2 – Integración de Sistemas

**Estudiante:** Kevin Rosero  
**Repositorio GitHub:** [https://github.com/kevoEC/Examen-P2-Integraci-n-de-sistemas](https://github.com/kevoEC/Examen-P2-Integraci-n-de-sistemas)

---

## 1. Diseño de arquitectura

### 🔧 Servicios involucrados

- **Frontend / Cliente**: Realiza peticiones HTTP al API Gateway.
- **Kong Gateway**: API Gateway que expone `/solicitudes`, aplica autenticación (API Key) y rate limiting.
- **SolicitudService (REST)**: Microservicio en Node.js que valida JWT y envía datos al sistema SOAP.
- **SOAP Mock (externo)**: Simula el sistema de certificación usando Express.

### 🔄 Flujo entre componentes

1. El cliente envía solicitudes a través de Kong Gateway.
2. Kong valida la API Key y redirige la petición a `SolicitudService`.
3. El servicio procesa la solicitud, valida JWT, y llama al SOAP mock.
4. La respuesta es devuelta al cliente a través del Gateway.

### 🔐 Seguridad, Circuit Breaker y trazabilidad

- **API Key** protegida vía Kong (key-auth).
- **Rate limiting** (5 peticiones por minuto).
- **Circuit Breaker y Retry** entre `SolicitudService` y `SOAP`, aplicados vía Kuma.
- **Trazabilidad** a través de Kuma GUI + logs estructurados.

📎 Diagrama de arquitectura incluido en `/assets/diagrama.png`.

---

## 2. Implementación del microservicio `SolicitudService`

Se implementó en Node.js con los siguientes endpoints:

- `POST /solicitudes`  
- `GET /solicitudes/{id}`  

🔐 JWT validado en los headers  
🧪 Llama al servicio SOAP (mock)

Código completo en `/solicitud-service`.

---

## 3. Exposición a través del API Gateway

- API Gateway utilizado: **Kong 3.9 con base de datos**
- Servicio registrado: `solicitud-service → http://host.docker.internal:3000`
- Ruta: `/solicitudes` con `strip_path: false`
- Plugins activos:
  - `key-auth`
  - `rate-limiting (minute: 5)`
- Consumidor: `kevin`  
- API Key: Generada con Kong y utilizada en pruebas

📸 Capturas de configuración incluidas en `/evidencias/gateway`.

---

## 4. Circuit Breaking y Retry (Kuma)

Se implementaron en la malla `default`:

### ✅ Retry (`retry-soap.yaml`)

```yaml
type: Retry
name: retry-to-soap
mesh: default
sources:
  - match:
      kuma.io/service: solicitud-service
destinations:
  - match:
      kuma.io/service: soap-mock
conf:
  http:
    numRetries: 2
    perTryTimeout: 2s
    backOff:
      baseInterval: 100ms
      maxInterval: 1s
