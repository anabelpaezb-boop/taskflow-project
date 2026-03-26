let tasks = [];

/**
 * Devuelve todas las tareas
 * @returns {Array}
 */
function obtenerTodas() {
  return tasks;
}

/**
 * Crea una tarea nueva
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
 * Actualiza parcialmente una tarea
 * @param {string} id
 * @param {Object} updates
 * @returns {Object}
 */
function actualizarTarea(id, updates) {
  const task = tasks.find((t) => t.id === id);

  if (!task) {
    throw new Error("NOT_FOUND");
  }

  if (typeof updates.title !== "undefined") task.title = updates.title;
  if (typeof updates.completed !== "undefined") task.completed = updates.completed;
  if (typeof updates.day !== "undefined") task.day = updates.day;
  if (typeof updates.tag !== "undefined") task.tag = updates.tag;
  if (typeof updates.priority !== "undefined") task.priority = updates.priority;

  return task;
}

module.exports = {
  obtenerTodas,
  crearTarea,
  eliminarTarea,
  actualizarTarea,
};