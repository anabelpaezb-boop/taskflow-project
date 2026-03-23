const taskService = require("../services/task.service");

/**
 * GET /api/v1/tasks
 */
function getTasks(req, res, next) {
  try {
    const tasks = taskService.obtenerTodas();
    res.status(200).json(tasks);
  } catch (error) {
    next(error);
  }
}

/**
 * POST /api/v1/tasks
 */
function createTask(req, res, next) {
  try {
    const { title, day, tag, priority } = req.body;

    // Validación defensiva
    if (!title || typeof title !== "string" || title.trim().length < 3) {
      return res.status(400).json({
        error: "El título es obligatorio y debe tener al menos 3 caracteres.",
      });
    }

    if (day && typeof day !== "string") {
      return res.status(400).json({
        error: "El día debe ser un texto válido.",
      });
    }

    if (tag && typeof tag !== "string") {
      return res.status(400).json({
        error: "La categoría debe ser un texto válido.",
      });
    }

    if (priority && typeof priority !== "string") {
      return res.status(400).json({
        error: "La prioridad debe ser un texto válido.",
      });
    }

    const nuevaTarea = taskService.crearTarea({
      title: title.trim(),
      day,
      tag,
      priority,
    });

    res.status(201).json(nuevaTarea);
  } catch (error) {
    next(error);
  }
}

/**
 * DELETE /api/v1/tasks/:id
 */
function deleteTask(req, res, next) {
  try {
    const { id } = req.params;

    taskService.eliminarTarea(id);

    res.status(204).send();
  } catch (error) {
    next(error);
  }
}

/**
 * PATCH /api/v1/tasks/:id
 */
function patchTask(req, res, next) {
  try {
    const { id } = req.params;
    const { completed } = req.body;

    if (typeof completed !== "boolean") {
      return res.status(400).json({
        error: "El campo completed debe ser booleano.",
      });
    }

    const updatedTask = taskService.actualizarEstado(id, completed);

    res.status(200).json(updatedTask);
  } catch (error) {
    next(error);
  }
}

module.exports = {
  getTasks,
  createTask,
  deleteTask,
  patchTask,
};            