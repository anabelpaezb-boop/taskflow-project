const express = require("express");
const cors = require("cors");
const taskRoutes = require("../src/routes/task.routes");

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.json({ message: "API funcionando 🚀" });
});

app.use("/api/v1/tasks", taskRoutes);

app.use((err, req, res, next) => {
  console.error(err);

  if (err.message === "NOT_FOUND") {
    return res.status(404).json({ error: "Recurso no encontrado" });
  }

  return res.status(500).json({ error: "Error interno del servidor" });
});

module.exports = app;