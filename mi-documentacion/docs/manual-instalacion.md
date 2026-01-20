# Manual de Instalación – Alarma Smart (Actualizado)

## 1. Introducción (explicado fácil)

Este manual explica **paso a paso y con comandos** cómo instalar el sistema **Alarma Smart** usando:

* Frontend (React)
* Backend (Node.js / Express)
* Base de datos MongoDB
* Docker y Docker Compose

Está pensado **para principiantes ("para dinosaurios")**, así que todo va explicado lento y claro.

---

## 2. Requisitos previos

Antes de empezar, asegúrate de tener instalado:

### En Windows

1. **Git**
2. **Node.js (LTS)**
3. **Docker Desktop** (incluye Docker Compose)
4. **Visual Studio Code** (recomendado)

Verificar instalaciones (abrir CMD o PowerShell):

```bash
git --version
node -v
npm -v
docker --version
docker compose version
```

Si alguno falla, instálalo antes de continuar.

---

## 3. Descargar el proyecto

Clonar el repositorio:

```bash
git clone https://github.com/JuanChimarro/Alarma-Smart.git
```

Entrar al proyecto:

```bash
cd alarma-smart-int
```

Estructura importante del proyecto:

```
alarma-smart-int/
│
├── backend/        → servidor Node + Mongo
├── frontend-alarmas/ → React (pantalla web)
├── docker-compose.yml
```

---

## 4. Instalación del Backend (Node + MongoDB)

### 4.1 ¿Qué hace el backend?

* Maneja usuarios
* Guarda alertas
* Se conecta a MongoDB
* Expone una API (URLs)

---

### 4.2 Variables de entorno (.env)

Entrar a la carpeta backend:

```bash
cd backend
```

Crear archivo `.env`:

```bash
copy .env.example .env
```

Ejemplo de `.env`:

```
PORT=4000
MONGO_URI=mongodb://mongo:27017/alarmasmart
JWT_SECRET=alarmasmart123
```

---

### 4.3 Backend sin Docker (opcional)

Instalar dependencias:

```bash
npm install
```

Levantar servidor:

```bash
npm run dev
```

Servidor activo en:

```
http://localhost:4000
```

---

## 5. MongoDB (Base de datos)

### 5.1 Mongo con Docker (recomendado)

Mongo **NO se instala a mano**, Docker lo hace solo.

Estructura usada:

* Base de datos: `alarmasmart`
* Puerto: `27017`

---

## 6. Docker y Docker Compose (LO IMPORTANTE)

### 6.1 ¿Qué hace Docker aquí?

Docker levanta:

* Backend
* MongoDB
* Todo conectado automáticamente

---

### 6.2 Archivo docker-compose.yml

Ubicado en la raíz del proyecto.

Servicios:

* `backend`
* `mongo`

---

### 6.3 Levantar TODO con un solo comando

Desde la raíz del proyecto:

```bash
docker compose up -d
```

Ver contenedores:

```bash
docker ps
```

Detener todo:

```bash
docker compose down
```

---

## 7. Instalación del Frontend (React)

### 7.1 Entrar al frontend

```bash
cd frontend-alarmas
```

---

### 7.2 Instalar dependencias

```bash
npm install
```

---

### 7.3 Configurar conexión al backend

Buscar archivo similar a:

```
src/services/api.js
```

Ejemplo:

```js
const API_URL = "http://localhost:4000";
```

---

### 7.4 Ejecutar frontend

```bash
npm start
```

Se abre en el navegador:

```
http://localhost:3000
```

---

## 8. Flujo completo del sistema

```
[ Navegador ]
      ↓
[ Frontend React ]
      ↓ API
[ Backend Node ]
      ↓
[ MongoDB ]
```

---

## 9. Comandos importantes (RESUMEN)

### Proyecto

```bash
git clone <repo>
cd alarma-smart-int
```

### Docker

```bash
docker compose up -d
docker ps
docker compose down
```

### Backend

```bash
cd backend
npm install
npm run dev
```

### Frontend

```bash
cd frontend-alarmas
npm install
npm start
```

---

## 10. Errores comunes

❌ Puerto ocupado → cerrar apps
❌ Docker no inicia → abrir Docker Desktop
❌ Mongo no conecta → revisar `MONGO_URI`
❌ Frontend no carga → revisar `API_URL`

---

## 11. Conclusión

Con este manual puedes:

* Levantar backend
* Usar MongoDB
* Ejecutar frontend
* Usar Docker sin miedo

Este documento **reemplaza al manual antiguo** y refleja los cambios actuales del proyecto.

✔ Simple
✔ Con comandos
✔ Paso a paso
