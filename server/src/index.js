const express = require("express");
const cors = require("cors");
const { PORT } = require("./config/env");
const taskRoutes = require("./routes/task.routes");

const app = express();

/* =========================================
   MIDDLEWARES GLOBALES
   ========================================= */

// Permite peticiones desde otros orígenes
app.use(cors());

// Convierte JSON crudo en req.body
app.use(express.json());

/**
 * Middleware de auditoría
 * Registra método, URL, estado y duración
 */
function loggerAcademico(req, res, next) {
  const inicio = performance.now();

  res.on("finish", () => {
    const duracion = performance.now() - inicio;
    console.log(
      `[${req.method}] ${req.originalUrl} - Estado: ${res.statusCode} (${duracion.toFixed(2)}ms)`
    );
  });

  next();
}

app.use(loggerAcademico);

/* =========================================
   RUTAS
   ========================================= */

app.get("/", (req, res) => {
  res.json({ message: "API de TaskFlow / GoingFly funcionando" });
});

app.use("/api/v1/tasks", taskRoutes);

/* =========================================
   MIDDLEWARE GLOBAL DE ERRORES
   ========================================= */

app.use((err, req, res, next) => {
  if (err.message === "NOT_FOUND") {
    return res.status(404).json({ error: "Tarea no encontrada" });
  }

  console.error(err);
  return res.status(500).json({ error: "Error interno del servidor" });
});

/* =========================================
   ARRANQUE DEL SERVIDOR
   ========================================= */

app.listen(PORT, () => {
  console.log(`Servidor escuchando en http://localhost:${PORT}`);
});