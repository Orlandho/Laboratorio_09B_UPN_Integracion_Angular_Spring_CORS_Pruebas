# Laboratorio 09B - Evidencias de Integración Frontend y Backend

[![Angular](https://img.shields.io/badge/Angular-19%2B%20%2F%2022-DD0031?style=flat-square&logo=angular&logoColor=white)](https://angular.dev/)
[![Spring Boot](https://img.shields.io/badge/Spring%20Boot-3.3.4-6DB33F?style=flat-square&logo=springboot&logoColor=white)](https://spring.io/projects/spring-boot)
[![Status](https://img.shields.io/badge/Integraci%C3%B3n-Exitosa-success?style=flat-square)]()

**Curso:** Soluciones Web y Aplicaciones Distribuidas  
**Estudiante:** Orlando Dorival  
**Universidad:** Universidad Privada del Norte (UPN)  
**Periodo:** 2026-2  

---

## 🌐 1. URLs y Puntos de Acceso

| Servicio | Entorno Local | GitHub Codespaces |
|---|---|---|
| **Frontend (Angular)** | `http://localhost:4200` | `https://<codespace-id>-4200.app.github.dev` |
| **Backend API (Spring Boot)** | `http://localhost:8080` | `https://<codespace-id>-8080.app.github.dev` |
| **Base de Datos** | H2 In-Memory / MySQL `localhost:3306` | H2 In-Memory / Contenedor Docker MySQL |

---

## 🔄 2. Matriz de Operaciones HTTP Probadas

| N.° | Operación | Método | Endpoint | Status Esperado | Status Obtenido | Resultado y Verificación |
|:---:|---|:---:|---|:---:|:---:|---|
| **1** | Listar productos | `GET` | `/api/productos` | `200 OK` | `200 OK` | Retorna arreglo JSON con 5 productos iniciales (`Teclado Mecanico RGB`, `Mouse Optico Gamer`, etc.). |
| **2** | Buscar por ID existente | `GET` | `/api/productos/1` | `200 OK` | `200 OK` | Retorna entidad Producto correspondiente al ID 1 con estado de stock calculado. |
| **3** | Buscar por ID inexistente | `GET` | `/api/productos/999` | `404 NOT FOUND` | `404 NOT FOUND` | Respuesta controlada con cuerpo vacío / error 404, gestionada por `ProductoService`. |
| **4** | Registrar nuevo producto | `POST` | `/api/productos` | `201 CREATED` | `201 CREATED` | Persiste la entidad con nuevo ID autoincremental y retorna el objeto guardado en BD. |
| **5** | Actualizar producto | `PUT` | `/api/productos/1` | `200 OK` | `200 OK` | Modifica `nombre`, `precio` y `stock`, retornando la entidad actualizada. |
| **6** | Eliminar producto | `DELETE` | `/api/productos/5` | `204 NO CONTENT` | `204 NO CONTENT` | Elimina el registro de la base de datos y refresca la vista del catálogo. |
| **7** | Búsqueda por coincidencia | `GET` | `/api/productos/buscar?nombre=teclado` | `200 OK` | `200 OK` | Filtra mediante query param en Spring Data JPA con `findByNombreContainingIgnoreCase`. |

---

## 🛠️ 3. Diagnóstico de Problemas Reales y Solución

### Diagnóstico 1: Bloqueo de CORS (Cross-Origin Resource Sharing)
- **Problema:** Al enviar solicitudes desde el frontend en `http://localhost:4200` hacia el backend en `http://localhost:8080`, el navegador bloqueaba la respuesta con el error:
  `Access to fetch at 'http://localhost:8080/api/productos' from origin 'http://localhost:4200' has been blocked by CORS policy: No 'Access-Control-Allow-Origin' header is present on the requested resource.`
- **Causa Raíz:** Política del mismo origen (Same-Origin Policy). Angular y Spring Boot se ejecutan en puertos distintos, por lo que son tratados como orígenes independientes.
- **Solución Técnica:** Se implementó `CorsConfig.java` implementando `WebMvcConfigurer` con el bean de mapeo CORS:
  ```java
  @Configuration
  public class CorsConfig implements WebMvcConfigurer {
      @Override
      public void addCorsMappings(CorsRegistry registry) {
          registry.addMapping("/api/**")
                  .allowedOriginPatterns("https://*.app.github.dev", "http://localhost:4200", "http://127.0.0.1:4200", "*")
                  .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS")
                  .allowedHeaders("*");
      }
  }
  ```

### Diagnóstico 2: Manejo de Caída de Red / Backend Apagado
- **Problema:** Si el backend de Spring Boot se detiene o no ha inicializado aún, el navegador reporta un error con código de estado HTTP `0` (Network Error / Connection Refused).
- **Solución Técnica:** En `CatalogoComponent` y `ProductoFormComponent` se implementó suscripción con observadores `next` y `error`:
  ```typescript
  error: err => {
    const msg = err.status === 0
      ? 'Error de conexión: El backend no está disponible o hay bloqueo CORS.'
      : `Error HTTP ${err.status}: ${err.statusText}`;
    this.error.set(msg);
    this.cargando.set(false);
  }
  ```
  Esto garantiza que el usuario reciba un mensaje claro y un botón de reintento en lugar de un fallo silencioso.

---

## 📊 4. Evidencias de Tráfico HTTP (DevTools > Network)

### Petición 1: Listar Catálogo
- **Request:** `GET http://localhost:8080/api/productos`
- **Response Headers:** `HTTP/1.1 200 OK`, `Content-Type: application/json`, `Access-Control-Allow-Origin: *`
- **Response Body:**
  ```json
  [
    {"id": 1, "nombre": "Teclado Mecanico RGB", "precio": 120.0, "stock": 15, "estadoStock": "OK"},
    {"id": 2, "nombre": "Mouse Optico Gamer", "precio": 65.5, "stock": 4, "estadoStock": "INSUFICIENTE"},
    {"id": 3, "nombre": "Monitor LED 24 Pulgadas", "precio": 580.0, "stock": 8, "estadoStock": "OK"}
  ]
  ```

### Petición 2: Registro de Producto
- **Request:** `POST http://localhost:8080/api/productos`
- **Payload:** `{"nombre": "Microfono Condensador USB", "precio": 180.50, "stock": 10}`
- **Response Status:** `201 CREATED`
- **Response Body:** `{"id": 6, "nombre": "Microfono Condensador USB", "precio": 180.5, "stock": 10, "estadoStock": "OK"}`

### Petición 3: Actualización
- **Request:** `PUT http://localhost:8080/api/productos/2`
- **Payload:** `{"nombre": "Mouse Optico Gamer Wireless", "precio": 79.90, "stock": 12}`
- **Response Status:** `200 OK`

### Petición 4: Eliminación
- **Request:** `DELETE http://localhost:8080/api/productos/5`
- **Response Status:** `204 NO CONTENT`
