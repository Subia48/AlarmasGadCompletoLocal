---
id: manual-tecnico-actualizado
title: Manual Técnico – Sistema Alarma Smart
---

# Manual Técnico  
## Sistema Alarma Smart

**Versión:** 2.0  
**Estado:** Actualizado  
**Base de datos:** MongoDB  
**Arquitectura:** Dockerizada  

---

## 1. Introducción

El presente **Manual Técnico** describe de manera detallada la arquitectura,
las tecnologías empleadas, la estructura de la base de datos, los procesos de
despliegue y el funcionamiento interno del sistema **Alarma Smart**, una
plataforma orientada a la gestión de alertas de emergencia en entornos
comunitarios y urbanos.

El sistema **Alarma Smart** fue diseñado con el objetivo de proporcionar una
respuesta rápida y eficiente ante situaciones de riesgo, permitiendo a los
usuarios emitir alertas SOS desde una aplicación móvil, las cuales son
procesadas por un backend central y reflejadas en tiempo real en una plataforma
web de monitoreo, así como en dispositivos físicos de alarma.

Este documento corresponde a la **versión actual del sistema**, en la cual se
realizó una **migración completa desde Firebase hacia MongoDB** como sistema
gestor de base de datos. Esta migración permitió mejorar el control sobre la
información, optimizar el rendimiento y facilitar la escalabilidad del sistema.
Asimismo, se implementó la **dockerización de todos los servicios**, lo que
garantiza entornos de ejecución consistentes, facilita el despliegue en
diferentes plataformas y simplifica las tareas de mantenimiento.

El presente manual está dirigido a desarrolladores, administradores de sistemas
y personal técnico, y tiene como finalidad servir como guía para la
comprensión, instalación, configuración, despliegue y mantenimiento del
sistema **Alarma Smart**, asegurando su correcta operación y evolución futura.

---


## 2. Objetivo del Manual Técnico

El objetivo del presente **Manual Técnico** es proporcionar una guía clara,
detallada y estructurada sobre el funcionamiento interno del sistema de alarma
comunitaria **Alarma Smart**.

El documento incluye la descripción de la arquitectura del sistema, los pasos
de configuración, así como el uso de cada uno de sus componentes principales,
entre los que se incluyen el **frontend web**, el **backend**, la **base de
datos MongoDB** y los servicios que permiten la comunicación con la aplicación
móvil y los dispositivos IoT.

Asimismo, se presentan las buenas prácticas recomendadas para el mantenimiento,
la ampliación y el despliegue del sistema, considerando su arquitectura actual
basada en **MongoDB** y la **dockerización de los servicios principales**.

Este manual tiene como finalidad facilitar la comprensión técnica del sistema
para desarrolladores y administradores, asegurando su correcta implementación,
continuidad operativa y evolución futura.


## 3. Destinatarios del Manual

El presente **Manual Técnico** está dirigido a los siguientes perfiles:

- **Desarrolladores y programadores**, responsables de dar soporte técnico,
  actualizar o ampliar la funcionalidad del sistema **Alarma Smart**, tanto en
  el backend como en las aplicaciones web y móvil.

- **Técnicos o administradores de sistemas**, encargados de desplegar,
  configurar y mantener el entorno del sistema, incluyendo los servicios
  dockerizados, la base de datos **MongoDB** y la infraestructura del backend.

- **Equipos de tecnologías de la información (IT), docentes y estudiantes**,
  que requieran comprender el funcionamiento interno del sistema con fines
  académicos, institucionales o para su replicación en proyectos comunitarios
  similares.


## 4. Tecnologías Utilizadas en el Proyecto

### 4.1. Aplicación Móvil (APK Android)

La aplicación móvil del sistema **Alarma Smart** fue desarrollada para
dispositivos **Android**, permitiendo a los usuarios generar alertas de
emergencia, compartir su ubicación en tiempo real y comunicarse con el sistema
central.

Las tecnologías utilizadas son:

- **Lenguaje de programación:** Java  
- **Entorno de desarrollo APK:** Se utilizó Apache Cordova para el empaquetado de la aplicación en formato APK. 
  *Meerkat Feature Drop | 2024.3.2 Patch 1*  
- **Comunicación con el backend:** API REST mediante solicitudes HTTP  
- **Sistema de autenticación:** Validación a través del backend utilizando
  tokens JWT  
- **Servicios del sistema:**
  - GPS para la obtención de la ubicación del usuario
  - Envío de notificaciones y mensajes (SMS / WhatsApp) mediante APIs externas
- **Compatibilidad:** Android 7.0 (Nougat) o versiones superiores  

La aplicación móvil actúa como el principal medio de interacción del usuario
con el sistema de alarmas.

---

### 4.2. Plataforma Web

La plataforma web permite la visualización, administración y monitoreo de las
alertas generadas por los usuarios, así como la gestión de alarmas y usuarios
del sistema.

Las tecnologías empleadas en la aplicación web son:

- **Framework:** React.js  
- **Lenguajes:** JavaScript, HTML5, CSS3  
- **Consumo de servicios:** API REST  
- **Funciones principales:**
  - Visualización de alertas en tiempo real
  - Gestión de usuarios y alarmas
  - Visualización de ubicaciones mediante mapas
- **Entorno de ejecución:** Navegadores web modernos  

La aplicación web se comunica directamente con el backend para obtener la
información almacenada en la base de datos MongoDB.

---

### 4.3. Dispositivo IoT – ESP32

El sistema **Alarma Smart** integra un dispositivo **ESP32** como componente
IoT encargado de la activación física de las alarmas comunitarias.

Las características técnicas del ESP32 son:

- **Microcontrolador:** ESP32  
- **Lenguaje de programación:** C++ (Arduino IDE)  
- **Conectividad:** WiFi  
- **Comunicación:** Solicitudes HTTP hacia la API REST  
- **Funciones principales:**
  - Consulta del estado de las alarmas
  - Activación de sirenas o dispositivos luminosos
  - Respuesta automática ante alertas SOS  

El ESP32 no forma parte de la infraestructura dockerizada, ya que se trata de un
dispositivo físico que se comunica directamente con el backend del sistema.



## 5. Descripción General del Sistema

Alarma Smart es un sistema de seguridad participativo que permite:

- Enviar alertas de emergencia (SOS)
- Gestionar alarmas físicas
- Administrar usuarios y roles
- Gestionar códigos de emergencia
- Visualizar alertas en tiempo real mediante mapas

El sistema está compuesto por:
- Aplicación móvil (APK)
- Plataforma web
- Backend API
- Base de datos NoSQL
- Dispositivo IoT (ESP32)

---

## 6. Arquitectura General del Sistema

### 6.1 Arquitectura actual

El sistema utiliza una arquitectura cliente-servidor basada en microservicios,
contenida mediante Docker.


---

## 7. Tecnologías Utilizadas

### 7.1 Backend
- Node.js
- Express.js
- JWT (Autenticación)
- MongoDB Driver / Mongoose

### 7.2 Frontend Web
- React
- Leaflet (Mapas)
- HTML, CSS, JavaScript

### 7.3 Aplicación Móvil
- Android (APK)
- Consumo de API REST

### 7.4 Base de Datos
- MongoDB (NoSQL)

### 7.5 Infraestructura
- Docker
- Docker Compose

---

## 8. Base de Datos – MongoDB

### 8.1 Migración desde Firebase

En las versiones iniciales del proyecto **Alarma Smart** se utilizó **Firebase**
como plataforma de almacenamiento y gestión de datos, debido a su facilidad de
integración y rapidez de implementación durante las etapas tempranas de
desarrollo.

Sin embargo, a medida que el sistema evolucionó y aumentaron los requisitos de
control, escalabilidad y personalización, se identificaron limitaciones
relacionadas con la dependencia de servicios externos, el manejo de reglas de
seguridad y la flexibilidad en la estructura de los datos.

Por esta razón, en la versión actual del sistema se realizó una **migración
completa desde Firebase hacia MongoDB**, un sistema gestor de bases de datos
NoSQL orientado a documentos. Esta migración permitió un mayor control sobre la
información almacenada, facilitó la administración de los datos y optimizó el
rendimiento del sistema en entornos locales y productivos.

Asimismo, el uso de MongoDB permitió una integración más eficiente con el
backend desarrollado en Node.js, así como la posibilidad de **dockerizar la
base de datos**, garantizando entornos consistentes, facilidad de despliegue y
una mejor escalabilidad del sistema en el futuro.

---

### 8.2 Base de datos principal

- **Nombre de la base de datos:** `alarma_smart`

---

### 8.3 Colecciones del sistema

| Colección | Descripción |
|---------|-------------|
| `users` | Usuarios registrados y sus roles |
| `alarms` | Alarmas físicas registradas |
| `alerts` | Alertas SOS generadas |
| `emergencycodes` | Códigos de emergencia |

---

### 8.4 Descripción de colecciones

#### 📁 users
- Cédula
- Nombre
- Email
- Contraseña cifrada
- Rol (Usuario, Admin, Cuerpo SOS)
- Contacto de emergencia

---

#### 📁 alarms
- Nombre de la alarma
- Dirección
- Latitud
- Longitud
- ID del dispositivo
- Estado

---

#### 📁 alerts
- Usuario emisor
- Latitud
- Longitud
- Fecha y hora
- Estado de la alerta

---

#### 📁 emergencycodes
- Código
- Descripción
- Estado

---

## 9. Relación entre Colecciones

- Un usuario puede generar múltiples alertas
- Una alerta puede activar una alarma
- Los códigos de emergencia validan acciones críticas


---

## 10. API REST del Sistema

El sistema Alarma Smart expone una API REST desarrollada con Node.js y Express,
la cual permite la comunicación entre la aplicación móvil (APK), la plataforma
web y los dispositivos IoT (ESP32).

La API está organizada en distintos módulos según la funcionalidad del sistema.

### 10.1 Endpoints Principales

- **/api/auth**  
  Gestiona la autenticación de usuarios, incluyendo inicio de sesión y
  validación de credenciales mediante tokens JWT.

- **/api/users**  
  Permite la gestión de usuarios del sistema, incluyendo registro, consulta,
  actualización y eliminación de información de usuarios.

- **/api/alarms**  
  Administra las alarmas físicas registradas en el sistema.  
  Permite crear, consultar y actualizar el estado de las alarmas.

- **/api/alerts**  
  Gestiona las alertas SOS generadas por los usuarios desde la aplicación móvil,
  registrando información como ubicación, fecha y estado de la alerta.

- **/api/admin/alerts**  
  Endpoint exclusivo para usuarios con rol administrador, el cual permite la
  supervisión, validación y gestión avanzada de las alertas generadas en el
  sistema.

- **/api/devices**  
  Facilita la comunicación con los dispositivos IoT (ESP32), permitiendo la
  consulta del estado de las alarmas y la activación de dispositivos físicos.

- **/api/emergency-codes**  
  Gestiona los códigos de emergencia utilizados para validaciones especiales,
  activaciones críticas o procedimientos de seguridad dentro del sistema.

---

## 11. Dockerización del Sistema

La dockerización del sistema **Alarma Smart** se implementó con el objetivo de
facilitar el despliegue, garantizar entornos de ejecución consistentes y mejorar
el mantenimiento del sistema.

Es importante aclarar que **no todos los componentes del sistema se encuentran
dockerizados**. Únicamente se dockerizaron aquellos módulos que se ejecutan en
entornos de servidor.

---

### Contenedores Dockerizados

| Contenedor | Función |
|-----------|--------|
| `api` | Backend desarrollado en Node.js y Express |
| `mongodb` | Base de datos MongoDB |
| `frontend` | Aplicación web desarrollada en React |

El **dispositivo IoT ESP32** no forma parte de la infraestructura dockerizada,
ya que se trata de un componente físico que ejecuta su propio firmware y se
comunica con el backend mediante solicitudes HTTP.

---

### Beneficios de la Dockerización

La dockerización de los servicios principales del sistema aporta los siguientes
beneficios:

- Facilita el despliegue del sistema en distintos entornos
- Garantiza la compatibilidad entre versiones de software
- Reduce errores de configuración
- Permite escalar los servicios de forma independiente
- Simplifica las tareas de mantenimiento y actualización

---

## 12. Comunicación con el ESP32

El ESP32 consume la API REST para:

- Consultar alarmas
- Activar dispositivos físicos
- Responder a alertas SOS

El flujo es:
1. Usuario envía alerta
2. API registra alerta en MongoDB
3. ESP32 consulta la API
4. ESP32 activa la alarma física

---

## 13. Seguridad del Sistema

- Autenticación mediante JWT
- Contraseñas cifradas
- Roles de usuario
- Acceso controlado a endpoints

---

## 14. Consideraciones Finales

La migración a MongoDB y la dockerización del sistema permiten a **Alarma Smart**
ser una solución moderna, escalable y preparada para entornos reales de producción.

Este manual técnico refleja fielmente la **arquitectura actual del sistema**.

---

## 15. Versionamiento

- **Versión 1.0:** Firebase
- **Versión 2.0:** MongoDB + Docker (actual)
