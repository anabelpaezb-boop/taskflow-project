# ✈️ GoingFly - Planificador de Viajes

GoingFly es una aplicación web desarrollada para planificar viajes de forma organizada, permitiendo crear, gestionar y visualizar tareas por días.

El proyecto ha evolucionado desde un frontend básico hasta una aplicación con backend estructurado y uso de herramientas de inteligencia artificial en el desarrollo.

---

## 🚀 Funcionalidades principales

### 📝 Gestión de tareas
- Crear tareas
- Marcar tareas como completadas
- Editar tareas
- Eliminar tareas
- Borrar todas las tareas

### 📅 Organización por días
- Asignar tareas a días concretos del viaje
- Filtrar tareas por día
- Visualizar planificación completa del viaje

### 🔍 Filtros y búsqueda
- Ver todas las tareas
- Ver tareas pendientes
- Ver tareas completadas
- Buscar tareas por texto

### ⭐ Prioridades
- Imprescindible
- Recomendado
- Opcional

### 📊 Estadísticas
- Total de tareas
- Tareas completadas
- Tareas pendientes
- Barra de progreso del viaje

### 🌙 Modo oscuro
- Alternancia entre modo claro y oscuro
- Preferencia guardada en LocalStorage

---

## 🧱 Tecnologías utilizadas

### Frontend
- HTML5 (estructura semántica)
- CSS (Tailwind CSS)
- JavaScript (Vanilla JS)

### Backend
- Node.js
- Express.js
- dotenv
- cors

### Herramientas
- Git & GitHub
- Vercel (deploy)
- Inteligencia Artificial (ChatGPT, Cursor)

---

## 🏗️ Arquitectura del proyecto

### 📁 Frontend

- `index.html` → estructura principal
- `styles.css` → estilos con Tailwind
- `app.js` → lógica de la aplicación

---

### 📁 Backend (`/server`)

Arquitectura por capas:
server/
│
├── src/
│ ├── config/
│ │ └── env.js
│ ├── controllers/
│ │ └── task.controller.js
│ ├── routes/
│ │ └── task.routes.js
│ ├── services/
│ │ └── task.service.js
│ └── index.js
│
├── .env
├── package.json

---

## 🔌 API REST

Base URL:
http://localhost:3000/api/v1/tasks

### Endpoints

#### GET /tasks
Obtiene todas las tareas

#### POST /tasks
Crea una nueva tarea

/*```json
{
  "title": "Visitar museo",
  "day": "Día 1",
  "tag": "Museo",
  "priority": "must"
}
*/
🔹 PATCH /tasks/:id
Actualiza parcialmente una tarea

🔹 DELETE /tasks/:id
Elimina una tarea

## ⚙️ Backend

### ✅ Fase A - Configuración del entorno
- Configuración del servidor con Express
- Uso de dotenv para variables de entorno
- Gestión de configuración mediante archivo `.env`
- Script de desarrollo con nodemon

### ✅ Fase B - Arquitectura por capas
Se ha implementado una arquitectura profesional basada en separación de responsabilidades:

- **Routes** → gestión de endpoints HTTP  
- **Controllers** → control de peticiones y respuestas  
- **Services** → lógica de negocio  

Esto permite un código más escalable, mantenible y organizado.

### ✅ Fase C - Robustez y manejo de errores
- Validación de datos en la entrada (req.body)
- Middleware global de manejo de errores
- Gestión de errores HTTP:
  - **400** → datos inválidos  
  - **404** → recurso no encontrado  
  - **500** → error interno del servidor  

### ✅ Fase D - Conexión frontend-backend
El frontend ha sido refactorizado para eliminar el uso de LocalStorage en la gestión de tareas.

🔌 Comunicación con API

Se utiliza fetch mediante:
api/client.js

📡 Operaciones implementadas
- GET → obtener tareas
- POST → crear tarea
- PATCH → actualizar tarea
- DELETE → eliminar tarea

🎯 Gestión de estados en UI
La interfaz gestiona:

- Carga → feedback visual durante peticiones
- Éxito → actualización dinámica del DOM
- Error → mensajes informativos al usuario

---

## 🤖 Uso de Inteligencia Artificial

Durante el desarrollo del proyecto se han utilizado herramientas de IA como apoyo en el flujo de trabajo:

- Generación de código base
- Refactorización de funciones
- Mejora del diseño con Tailwind CSS
- Resolución de errores y debugging
- Generación y mejora de documentación

Se ha documentado todo el proceso en:
docs/ai/

Archivos incluidos:
- ai-comparison.md  
- cursor-workflow.md  
- prompt-engineering.md  
- experiments.md  
- reflection.md  

---

## 🧪 Testing

Se han realizado pruebas manuales para verificar el correcto funcionamiento de la aplicación:

- Creación de tareas
- Eliminación de tareas
- Validación de errores en el backend
- Persistencia de datos
- Funcionamiento de la API REST

## 🌐 Conexión frontend-backend

El frontend ya no utiliza LocalStorage para la gestión de tareas. En su lugar, consume una API REST mediante `fetch` a través de un archivo dedicado:

- `api/client.js`

La interfaz gestiona tres estados de red:

- **Carga**: muestra un mensaje mientras la petición está en curso
- **Éxito**: actualiza la vista y notifica al usuario
- **Error**: muestra feedback visual cuando la API responde con error

La API utilizada es:

- `GET /api/v1/tasks`
- `POST /api/v1/tasks`
- `PATCH /api/v1/tasks/:id`
- `DELETE /api/v1/tasks/:id`