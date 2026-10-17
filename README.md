# Laboratorio 09B - Integración Real Angular + Spring Boot: CORS, Validaciones, Errores y Pruebas

[![Angular](https://img.shields.io/badge/Angular-19%2B%20%2F%2022-DD0031?style=for-the-badge&logo=angular&logoColor=white)](https://angular.dev/)
[![Spring Boot](https://img.shields.io/badge/Spring%20Boot-3.3.4-6DB33F?style=for-the-badge&logo=springboot&logoColor=white)](https://spring.io/projects/spring-boot)
[![Java](https://img.shields.io/badge/Java-17%2B%20%2F%2025-ED8B00?style=for-the-badge&logo=openjdk&logoColor=white)](https://openjdk.org/)
[![Status](https://img.shields.io/badge/Status-Completed-success?style=for-the-badge)]()
[![UPN](https://img.shields.io/badge/UPN-2026--2-blue?style=for-the-badge)]()

> **Curso:** Soluciones Web y Aplicaciones Distribuidas (SIST1402A)  
> **Estudiante:** Orlando Dorival  
> **Universidad:** Universidad Privada del Norte (UPN)  
> **Semana:** 9B  

---

## 🎯 1. Propósito y Logro del Laboratorio

Consolidar la **integración real de extremo a extremo** entre una Single Page Application (SPA) en **Angular** y una API REST desarrollada con **Spring Boot 3.3+**, persistida sobre base de datos relacional.

Se sustituyó el servicio de datos mock por un `ProductoService` basado en `HttpClient`, se configuró la política de intercambio de recursos de origen cruzado (**CORS**) en el backend, se implementó el CRUD completo (listar, registrar, editar y eliminar con confirmación y refresco reactivo), y se estructuró el manejo visible de estados de carga (`cargando`) y mensajes de error HTTP (`status 0`, `400`, `404`, `500`).

---

## 🏗️ 2. Arquitectura de Integración

El diagrama de arquitectura modelado en **Draw.io** se encuentra en [`diagramas/arquitectura-lab09b.drawio`](diagramas/arquitectura-lab09b.drawio).

```
Navegador Web (SPA :4200)
    │
    ▼
Angular HttpClient (ProductoService)
    │  (GET, POST, PUT, DELETE)
    ▼
CorsConfig.java (Filtro CORS WebMvcConfigurer)
    │
    ▼
Spring Boot REST Controller (:8080 /api/productos)
    │
    ▼
ProductoService -> ProductoRepository (Spring Data JPA)
    │
    ▼
Base de Datos Relacional (H2 In-Memory / MySQL)
```

---

## 📁 3. Estructura del Repositorio

```
Laboratorio_09B_UPN_Integracion_Angular_Spring_CORS_Pruebas/
├── backend/                                  # Proyecto Spring Boot API REST
│   ├── src/main/java/com/example/laboratorio4/
│   │   ├── config/CorsConfig.java            # Configuración CORS para orígenes cruzados
│   │   ├── controller/ProductoController.java# Endpoints REST (/api/productos)
│   │   ├── model/Producto.java               # Entidad JPA (@Entity, @Table)
│   │   ├── repository/ProductoRepository.java# Repositorio Spring Data JPA
│   │   ├── service/ProductoService.java      # Capa de lógica de negocio
│   │   └── Laboratorio4Application.java      # Clase principal Spring Boot
│   ├── src/main/resources/
│   │   ├── application.properties            # Propiedades H2 / MySQL
│   │   └── data.sql                          # Datos semilla iniciales
│   ├── src/test/java/com/example/laboratorio4/
│   │   └── ProductoControllerTest.java       # Pruebas de integración con MockMvc
│   └── pom.xml                               # Dependencias Maven
├── frontend/                                 # Aplicación SPA Angular
│   ├── src/app/
│   │   ├── components/catalogo/              # Catálogo conectado a API con Signals y búsqueda
│   │   ├── components/encabezado/            # Encabezado modular
│   │   ├── pages/producto-form/              # Formulario reactivo para Crear y Editar
│   │   ├── services/producto.service.ts      # Cliente HTTP REST
│   │   ├── services/producto.service.spec.ts # Pruebas unitarias con HttpTestingController
│   │   ├── app.config.ts                     # provideHttpClient() registrado
│   │   └── app.routes.ts                     # Rutas con paso de ID y query params (?q=)
│   ├── angular.json
│   └── package.json
├── diagramas/
│   └── arquitectura-lab09b.drawio            # Diagrama oficial editable Draw.io
├── INTEGRACION.md                            # Registro formal de pruebas y evidencias HTTP
└── README.md
```

---

## ⚡ 4. Características y Mejoras Implementadas

1. **CRUD Completo contra API REST:**
   - `GET /api/productos`: Lista de inventario en tiempo real.
   - `GET /api/productos/{id}`: Carga de datos para edición.
   - `POST /api/productos`: Registro de nuevo producto (HTTP 201).
   - `PUT /api/productos/{id}`: Actualización con refresco inmediato.
   - `DELETE /api/productos/{id}`: Eliminación con modal de confirmación y recarga (HTTP 204).
2. **Búsqueda Sincronizada con Query Params (`?q=`):**
   - El catálogo permite filtrar por nombre (`/productos?q=mouse`) conservando el estado de búsqueda en la URL.
3. **Manejo Robusto de Errores y Loading States:**
   - Indicador visual mientras la petición HTTP está en tránsito.
   - Notificación clara ante backend apagado (HTTP 0) o errores de servidor (4xx/5xx).
4. **Resiliencia de Base de Datos:**
   - Configurado con base de datos H2 en modo MySQL en memoria para ejecución inmediata sin dependencias externas, con propiedades listas para MySQL local o contenedor Docker.

---

## 🧪 5. Verificación y Pruebas Automatizadas

### Backend (Spring Boot + MockMvc)
```bash
cd backend
mvn clean test
```
**Resultado:** 4/4 pruebas de integración superadas (Listar, Buscar por ID existente, 404 en inexistente, Registrar).

### Frontend (Angular + HttpTestingController)
```bash
cd frontend
npm test -- --watch=false
```
**Resultado:** 4/4 pruebas unitarias aprobadas.

### Compilación Frontend
```bash
cd frontend
npm run build
```
**Resultado:** Generación de bundle exitosa en `dist/`.

---

## 🚀 6. Guía de Ejecución

### Paso 1: Levantar el Backend (Terminal 1)
```bash
cd backend
mvn spring-boot:run
```
El backend iniciará en `http://localhost:8080`.

### Paso 2: Levantar el Frontend (Terminal 2)
```bash
cd frontend
npm install
ng serve --host 0.0.0.0
```
La aplicación estará disponible en `http://localhost:4200`.

---

## 📄 7. Documento de Evidencias
Consulte [`INTEGRACION.md`](INTEGRACION.md) para el detalle de payloads, cabeceras de respuesta, diagnóstico de errores reales y evidencias de red (DevTools > Network).
