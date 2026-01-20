# 🔔 Alarma Smart – Sistema de Alerta Ciudadana para el Cantón Cayambe

**Alarma Smart** es una solución tecnológica diseñada para mejorar la gestión de emergencias en comunidades mediante la integración de dispositivos IoT (ESP32), una aplicación móvil y una plataforma web. El sistema permite que los ciudadanos envíen alertas desde sus celulares, activen automáticamente la alarma física más cercana y notifiquen a los organismos de emergencia y contactos personales.

## 📌 Objetivo General

Diseñar e implementar un sistema de alerta ciudadana que identifique y active la alarma física más cercana al usuario en caso de emergencia, integrando el envío automatizado de notificaciones a entidades pertinentes y contactos de emergencia.

---

## 🚀 Características del Proyecto

- Envío de alertas desde una aplicación móvil con geolocalización.
- Activación remota de sirenas físicas mediante microcontroladores ESP32.
- Notificación automática al ECU 911, Cuerpo de Bomberos y contactos personales.
- Plataforma web para monitoreo de alertas en tiempo real.
<<<<<<< HEAD
- Almacenamiento y sincronización de datos mediante MongoDB
=======



## 🧩 Componentes del Sistema

### 1. Aplicación Móvil (Android)
- Registro e inicio de sesión 
- Botón de alerta de emergencia
- Envío de ubicación y notificaciones automáticas

### 2. Plataforma Web
- Panel de administración con mapa interactivo
- Visualización de alertas activas e históricas
- Gestión de usuarios y alarmas

### 3. Dispositivo IoT
- Microcontrolador ESP32 conectado a internet
- Activación de sirenas mediante relé
- Integración con MongoDB

---

## ⚙️ Tecnologías Utilizadas

- **Frontend móvil:** Java + Android Studio  
- **Frontend web:** HTML, CSS, JavaScript  
- **Backend:** MongoDB, Express
- **IoT:** ESP32, sensores, relés  

---

## 📐 Arquitectura General

```text
[App Móvil] --> [MongoDB] --> [ESP32 - Alarma]  
             \--> [Plataforma Web - ECU 911]  
             \--> [Notificación SMS / Contacto]
