const express = require("express");
const cors = require("cors");
require("./config/env");

const taskRoutes = require("./routes/task.routes");

const app = express();

// middlewares
app.use(cors());
app.use(express.json());

// rutas
app.use("/api/v1/tasks", taskRoutes);

// ruta de prueba
app.get("/", (req, res) => {
  res.send("API funcionando 🚀");
});

// manejo de errores global
app.use((err, req, res, next) => {
  console.error(err);

  if (err.message === "NOT_FOUND") {
    return res.status(404).json({ error: "Recurso no encontrado" });
  }

  res.status(500).json({ error: "Error interno del servidor" });
});

// SOLO en local
if (process.env.VERCEL !== "1") {
  const PORT = process.env.PORT || 3000;

  app.listen(PORT, () => {
    console.log(`Servidor escuchando en http://localhost:${PORT}`);
  });
}

module.exports = app;