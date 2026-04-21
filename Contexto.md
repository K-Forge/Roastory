# Contexto del Proyecto: Roastory

## 1. Presentación del Proyecto
**Nombre del software:** Roastory
**Equipo de desarrollo:** K-Forge

El nombre **Roastory** surge de la combinación de las palabras "Roast" (tostar café) y "Story" (historia), representando un espacio donde la lectura se combina con la experiencia del café. El sistema está diseñado para gestionar integralmente una librería-cafetería, solucionando la falta de un sistema digital centralizado que controle inventario, ventas y facturas.

## 2. Problemática y Justificación
Actualmente, los pequeños negocios que combinan venta de productos y servicios (como una librería-cafetería) carecen de herramientas tecnológicas para administrar organizadamente su información. La ausencia de un sistema centralizado dificulta el control del inventario y genera inconsistencias en ventas y facturación. 

Roastory plantea una solución a través de una aplicación web basada en arquitectura cliente-servidor (Node.js, Express y MongoDB), integrando control de inventario, registro de clientes, gestión de ventas y generación de facturas PDF en tiempo real.

## 3. Equipo de Trabajo, Roles y Asignaciones (Taller 4)

El equipo operará bajo la siguiente estructura de responsabilidades para la construcción de la API RESTful:

*   **Brian Steven Vargas Clavijo - Desarrollador Backend**
    *   Setup del servidor Express y repositorio.
    *   Módulo de Usuario y Autenticación (Registro y Login con JWT y Bcrypt).
    *   Creación de middleware para protección de rutas.
    *   Code review, merge a la rama `main` y edición del video.
*   **Sebastián Angulo Castellanos - Administrador de Base de Datos (DBA)**
    *   Setup de MongoDB Atlas y definición de Modelos/Esquemas de BD.
    *   Desarrollo del Módulo de Inventario (CRUD de productos).
    *   Desarrollo del Módulo de Facturación (CRUD y lógica de generación de PDF).
    *   Poblar la base de datos con información real para pruebas.
*   **Lina Andrea Bello Ballen - Desarrolladora Frontend**
    *   Desarrollo del Módulo de Ventas (CRUD inicial).
    *   Creación de colección estructurada en Postman con todos los endpoints.
    *   Documentación inicial (Contexto.md, AGENTS.md, Setup de README).
    *   Elaboración del guion del video y documentación de uso de IA.

## 4. Actores del Sistema
1.  **Administrador:** Gestiona el funcionamiento general (usuarios, inventario, reportes de ventas y facturas). Tiene control centralizado.
2.  **Empleado:** Realiza operaciones diarias (registrar ventas, consultar productos, generar comprobantes). 
3.  **Cliente:** Consulta productos disponibles y realiza/confirma compras mediante la interfaz web.

## 5. Módulos Core del Backend
*   **Usuario:** Registro, inicio de sesión (Auth) y administración de usuarios.
*   **Inventario:** CRUD de productos (café, libros, repostería) y control de stock.
*   **Ventas:** Registro de ventas y confirmación de compras.
*   **Facturación:** Lógica para generar y descargar comprobantes/facturas en PDF.

## 6. Enlaces de Interés
*   **Tablero de Gestión (GitHub Projects):** [K-Forge Projects](https://github.com/orgs/K-Forge/projects/16)
*   **Video Resumen Entrega 1:** [YouTube](https://youtu.be/BLPK0eUVdYk)