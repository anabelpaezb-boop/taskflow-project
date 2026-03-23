// Array en memoria que simula una base de datos
let tasks = [];

/**
 * Devuelve todas las tareas
 * @returns {Array}
 */
function obtenerTodas() {
  return tasks;
}

/**
 * Crea una nueva tarea
 * @param {Object} data
 * @returns {Object}
 */
function crearTarea(data) {
  const nuevaTarea = {
    id: Date.now().toString(),
    title: data.title,
    completed: false,
    createdAt: new Date().toISOString(),
    day: data.day || "Día 1",
    tag: data.tag || "Plan",
    priority: data.priority || "nice",
  };

  tasks.push(nuevaTarea);

  return nuevaTarea;
}

/**
 * Elimina una tarea por id
 * @param {string} id
 */
function eliminarTarea(id) {
  const existe = tasks.find((task) => task.id === id);

  if (!existe) {
    throw new Error("NOT_FOUND");
  }

  tasks = tasks.filter((task) => task.id !== id);
}

/**
 * Cambia el estado completed de una tarea
 * @param {string} id
 * @param {boolean} completed
 * @returns {Object}
 */
function actualizarEstado(id, completed) {
  const task = tasks.find((t) => t.id === id);

  if (!task) {
    throw new Error("NOT_FOUND");
  }

  task.completed = completed;

  return task;
}

module.exports = {
  obtenerTodas,
  crearTarea,
  eliminarTarea,
  actualizarEstado,
};