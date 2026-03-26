/* =====================================================
   GOINGFLY - APP DE VIAJES
   ===================================================== */


/* =====================================================
   MODO OSCURO
   ===================================================== */

const themeToggle = document.querySelector("#theme-toggle");
const THEME_KEY = "taskflow_theme";

/**
 * Aplica el tema claro u oscuro
 * @param {string} theme
 */
function applyTheme(theme) {
  const root = document.documentElement;

  if (theme === "dark") {
    root.classList.add("dark");
  } else {
    root.classList.remove("dark");
  }
}

/**
 * Carga el tema guardado
 */
function initTheme() {
  const savedTheme = localStorage.getItem(THEME_KEY);

  if (savedTheme) {
    applyTheme(savedTheme);
  }
}

initTheme();

themeToggle.addEventListener("click", () => {
  const isDark = document.documentElement.classList.contains("dark");
  const newTheme = isDark ? "light" : "dark";

  applyTheme(newTheme);
  localStorage.setItem(THEME_KEY, newTheme);
});


/* =====================================================
   ELEMENTOS DEL DOM
   ===================================================== */

const form = document.querySelector("#task-form");
const input = document.querySelector("#task-input");
const daySelect = document.querySelector("#task-day");
const tagSelect = document.querySelector("#task-tag");
const prioritySelect = document.querySelector("#task-priority");

const taskList = document.querySelector("#task-list");

const searchInput = document.querySelector("#search");

const filterAll = document.querySelector("#filter-all");
const filterPending = document.querySelector("#filter-pending");
const filterCompleted = document.querySelector("#filter-completed");

const dayFilterSelect = document.querySelector("#day-filter");

const statTotal = document.querySelector("#stat-total");
const statCompleted = document.querySelector("#stat-completed");
const statPending = document.querySelector("#stat-pending");

const progressBar = document.querySelector("#progress-bar");
const progressText = document.querySelector("#progress-text");

const clearAllBtn = document.querySelector("#clear-all");

const destinationInput = document.querySelector("#trip-destination");
const durationSelect = document.querySelector("#trip-duration");

const summaryDestination = document.querySelector("#summary-destination");
const summaryDuration = document.querySelector("#summary-duration");

const networkState = document.querySelector("#network-state");
const networkMessage = document.querySelector("#network-message");


/* =====================================================
   CONFIGURACIÓN
   ===================================================== */

const TRIP_KEY = "goingfly_trip";

let tasks = [];
let currentFilter = "all";
let currentDayFilter = "all";

/* Datos del viaje */
let tripConfig = {
  destination: "Londres",
  duration: 6,
};


/* =====================================================
   ESTADOS DE RED EN UI
   ===================================================== */

/**
 * Muestra estado de carga
 * @param {string} message
 */
function showLoading(message = "Cargando...") {
  networkState.classList.remove("hidden");
  networkState.className =
    "mb-3 rounded-2xl border border-slate-200 bg-white p-3 text-sm shadow-sm dark:border-slate-700 dark:bg-slate-800";
  networkMessage.textContent = message;
}

/**
 * Muestra estado de error
 * @param {string} message
 */
function showError(message) {
  networkState.classList.remove("hidden");
  networkState.className =
    "mb-3 rounded-2xl border border-red-200 bg-red-50 p-3 text-sm shadow-sm dark:border-red-500 dark:bg-red-500/10";
  networkMessage.textContent = message;
}

/**
 * Muestra estado de éxito
 * @param {string} message
 */
function showSuccess(message) {
  networkState.classList.remove("hidden");
  networkState.className =
    "mb-3 rounded-2xl border border-emerald-200 bg-emerald-50 p-3 text-sm shadow-sm dark:border-emerald-500 dark:bg-emerald-500/10";
  networkMessage.textContent = message;

  setTimeout(() => {
    networkState.classList.add("hidden");
  }, 1800);
}

/**
 * Oculta el panel de estado
 */
function hideNetworkState() {
  networkState.classList.add("hidden");
}


/* =====================================================
   GUARDAR Y CARGAR CONFIGURACIÓN DEL VIAJE
   ===================================================== */

/**
 * Guarda la configuración del viaje
 */
function saveTripConfig() {
  localStorage.setItem(TRIP_KEY, JSON.stringify(tripConfig));
}

/**
 * Carga la configuración del viaje
 */
function loadTripConfig() {
  const saved = localStorage.getItem(TRIP_KEY);

  if (!saved) return;

  try {
    const parsed = JSON.parse(saved);

    tripConfig = {
      destination: parsed.destination || "Londres",
      duration: Number(parsed.duration) || 6,
    };
  } catch {
    tripConfig = {
      destination: "Londres",
      duration: 6,
    };
  }
}

/**
 * Actualiza el resumen del viaje en el panel lateral
 */
function updateTripSummary() {
  summaryDestination.textContent = tripConfig.destination || "Sin destino";
  summaryDuration.textContent = `${tripConfig.duration} días`;
}

/**
 * Genera las opciones de día según la duración del viaje
 */
function generateDayOptions() {
  daySelect.innerHTML = "";
  dayFilterSelect.innerHTML = `<option value="all">Todos los días</option>`;

  for (let i = 1; i <= tripConfig.duration; i++) {
    const dayText = `Día ${i}`;

    const optionForm = document.createElement("option");
    optionForm.value = dayText;
    optionForm.textContent = dayText;
    daySelect.appendChild(optionForm);

    const optionFilter = document.createElement("option");
    optionFilter.value = dayText;
    optionFilter.textContent = dayText;
    dayFilterSelect.appendChild(optionFilter);
  }
}

/**
 * Sincroniza la UI con la configuración del viaje
 */
function syncTripConfigUI() {
  destinationInput.value = tripConfig.destination;
  durationSelect.value = String(tripConfig.duration);

  updateTripSummary();
  generateDayOptions();
}


/* =====================================================
   API - FRONTEND CONECTADO AL BACKEND
   ===================================================== */

/**
 * Carga tareas desde el backend
 */
async function loadTasks() {
  showLoading("Cargando tareas...");

  try {
    tasks = await window.taskApi.getTasks();

    // corregir tareas antiguas o incompletas
    tasks = tasks.map((task) => ({
      id: task.id,
      title: task.title ?? "Tarea sin título",
      completed: task.completed ?? false,
      createdAt: task.createdAt ?? new Date().toISOString(),
      day: task.day ?? "Día 1",
      tag: task.tag ?? "Plan",
      priority: task.priority ?? "nice",
    }));

    renderTasks();
    hideNetworkState();
  } catch (error) {
    showError(`Error al cargar tareas: ${error.message}`);
  }
}

/**
 * Crea tarea en backend
 * @param {object} taskData
 */
async function createTask(taskData) {
  showLoading("Creando tarea...");

  try {
    const newTask = await window.taskApi.createTask(taskData);
    tasks.push(newTask);
    renderTasks();
    showSuccess("Tarea creada correctamente");
  } catch (error) {
    showError(`Error al crear tarea: ${error.message}`);
  }
}

/**
 * Actualiza tarea en backend
 * @param {string} id
 * @param {object} updates
 */
async function updateTask(id, updates) {
  showLoading("Actualizando tarea...");

  try {
    const updatedTask = await window.taskApi.patchTask(id, updates);

    tasks = tasks.map((task) => {
      if (task.id === id) return updatedTask;
      return task;
    });

    renderTasks();
    showSuccess("Tarea actualizada");
  } catch (error) {
    showError(`Error al actualizar tarea: ${error.message}`);
  }
}

/**
 * Elimina tarea en backend
 * @param {string} id
 */
async function deleteTask(id) {
  showLoading("Eliminando tarea...");

  try {
    await window.taskApi.deleteTask(id);
    tasks = tasks.filter((task) => task.id !== id);
    renderTasks();
    showSuccess("Tarea eliminada");
  } catch (error) {
    showError(`Error al eliminar tarea: ${error.message}`);
  }
}


/* =====================================================
   ESTADÍSTICAS Y PROGRESO
   ===================================================== */

/**
 * Actualiza estadísticas básicas
 */
function updateStats() {
  const total = tasks.length;
  const completed = tasks.filter((task) => task.completed).length;
  const pending = total - completed;

  statTotal.textContent = total;
  statCompleted.textContent = completed;
  statPending.textContent = pending;
}

/**
 * Actualiza la barra de progreso
 */
function updateProgress() {
  const total = tasks.length;
  const completed = tasks.filter((task) => task.completed).length;

  const percentage = total === 0 ? 0 : Math.round((completed / total) * 100);

  progressBar.style.width = `${percentage}%`;
  progressText.textContent = `${percentage}%`;
}


/* =====================================================
   PRIORIDAD
   ===================================================== */

/**
 * Devuelve clases de Tailwind según la prioridad
 * @param {string} priority
 * @returns {string}
 */
function getPriorityStyles(priority) {
  if (priority === "must") {
    return "bg-red-100 text-red-900 dark:border-red-300/40 dark:bg-red-400/15 dark:text-red-100";
  }

  if (priority === "optional") {
    return "bg-sky-100 text-sky-900 dark:border-sky-300/40 dark:bg-sky-400/15 dark:text-sky-100";
  }

  return "bg-amber-100 text-amber-900 dark:border-amber-300/40 dark:bg-amber-400/15 dark:text-amber-100";
}

/**
 * Devuelve el texto visible de la prioridad
 * @param {string} priority
 * @returns {string}
 */
function getPriorityText(priority) {
  if (priority === "must") return "IMPRESCINDIBLE";
  if (priority === "optional") return "OPCIONAL";
  return "RECOMENDADO";
}


/* =====================================================
   EDITAR TAREA
   ===================================================== */

/**
 * Permite editar el título de una tarea
 * @param {object} task
 */
function editTask(task) {
  const newTitle = prompt("Edita el nombre de la tarea:", task.title);

  if (newTitle === null) return;

  const cleanTitle = newTitle.trim();

  if (!cleanTitle) return;

  updateTask(task.id, { title: cleanTitle });
}


/* =====================================================
   CREAR TARJETA DE TAREA
   ===================================================== */

/**
 * Crea el nodo HTML de una tarea
 * @param {object} task
 * @returns {HTMLLIElement}
 */
function createTaskNode(task) {
  const li = document.createElement("li");
  li.className = "transition duration-300 ease-out";

  const priorityClass = getPriorityStyles(task.priority);
  const priorityText = getPriorityText(task.priority);

  li.innerHTML = `
    <article class="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition hover:-translate-y-0.5 hover:shadow dark:border-slate-700 dark:bg-slate-800">
      <div class="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">

        <div class="flex items-start gap-3">
          <input type="checkbox" class="task-checkbox mt-1 h-4 w-4 accent-slate-900 dark:accent-slate-200" ${task.completed ? "checked" : ""}>

          <div>
            <h3 class="font-semibold text-slate-900 dark:text-slate-100 ${task.completed ? "line-through opacity-60" : ""}">
              ${task.title}
            </h3>

            <div class="mt-2 flex flex-wrap items-center gap-2 text-xs">
              <span class="rounded-full border border-slate-300 bg-slate-100 px-2 py-1 font-semibold text-slate-700 dark:border-slate-600 dark:bg-slate-700 dark:text-slate-100">
                ${task.day}
              </span>

              <span class="rounded-full border border-slate-300 bg-slate-100 px-2 py-1 font-semibold text-slate-700 dark:border-slate-600 dark:bg-slate-700 dark:text-slate-100">
                ${task.tag}
              </span>

              <span class="rounded-full border border-slate-300 px-2 py-1 font-semibold ${priorityClass}">
                ${priorityText}
              </span>
            </div>

            <p class="mt-2 text-xs text-slate-500 dark:text-slate-300">
              Creada: ${new Date(task.createdAt).toLocaleDateString()}
            </p>
          </div>
        </div>

        <div class="flex flex-wrap items-center gap-2">
          <button
            class="edit-btn rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm font-semibold text-slate-800 shadow-sm transition duration-200 hover:-translate-y-0.5 hover:bg-slate-50 hover:shadow focus:outline-none focus:ring-2 focus:ring-slate-300 dark:border-slate-600 dark:bg-slate-700 dark:text-slate-100 dark:hover:bg-slate-600 dark:focus:ring-slate-400"
            type="button"
          >
            Editar
          </button>

          <button
            class="delete-btn rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm font-semibold text-slate-800 shadow-sm transition duration-200 hover:-translate-y-0.5 hover:bg-slate-50 hover:shadow focus:outline-none focus:ring-2 focus:ring-slate-300 dark:border-slate-600 dark:bg-slate-700 dark:text-slate-100 dark:hover:bg-slate-600 dark:focus:ring-slate-400"
            type="button"
            aria-label="Eliminar tarea"
          >
            Eliminar
          </button>
        </div>

      </div>
    </article>
  `;

  /* Marcar completada */
  li.querySelector(".task-checkbox").addEventListener("change", (e) => {
    updateTask(task.id, { completed: e.target.checked });
  });

  /* Editar */
  li.querySelector(".edit-btn").addEventListener("click", () => {
    editTask(task);
  });

  /* Eliminar */
  li.querySelector(".delete-btn").addEventListener("click", () => {
    deleteTask(task.id);
  });

  return li;
}


/* =====================================================
   RENDERIZAR TAREAS
   ===================================================== */

/**
 * Muestra las tareas aplicando:
 * - filtro por estado
 * - filtro por día
 * - búsqueda
 * - orden por día
 */
function renderTasks() {
  taskList.innerHTML = "";

  let filteredTasks = tasks;

  /* filtro por estado */
  if (currentFilter === "pending") {
    filteredTasks = filteredTasks.filter((task) => !task.completed);
  }

  if (currentFilter === "completed") {
    filteredTasks = filteredTasks.filter((task) => task.completed);
  }

  /* filtro por día */
  if (currentDayFilter !== "all") {
    filteredTasks = filteredTasks.filter((task) => task.day === currentDayFilter);
  }

  /* buscador */
  const searchText = searchInput.value.toLowerCase().trim();

  filteredTasks = filteredTasks.filter((task) =>
    (task.title || "").toLowerCase().includes(searchText)
  );

  /* ordenar por día */
  filteredTasks = [...filteredTasks].sort((a, b) => {
    const dayA = parseInt((a.day || "Día 1").replace("Día ", ""));
    const dayB = parseInt((b.day || "Día 1").replace("Día ", ""));
    return dayA - dayB;
  });

  /* pintar tareas */
  filteredTasks.forEach((task) => {
    const node = createTaskNode(task);
    taskList.appendChild(node);
  });

  updateStats();
  updateProgress();
}


/* =====================================================
   AÑADIR NUEVA TAREA
   ===================================================== */

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const title = input.value.trim();

  if (!title) return;

  await createTask({
    title,
    day: daySelect.value,
    tag: tagSelect.value,
    priority: prioritySelect.value,
  });

  input.value = "";
  input.focus();
});


/* =====================================================
   BUSCADOR
   ===================================================== */

searchInput.addEventListener("input", () => {
  renderTasks();
});


/* =====================================================
   FILTROS DE ESTADO
   ===================================================== */

filterAll.addEventListener("click", () => {
  currentFilter = "all";
  renderTasks();
});

filterPending.addEventListener("click", () => {
  currentFilter = "pending";
  renderTasks();
});

filterCompleted.addEventListener("click", () => {
  currentFilter = "completed";
  renderTasks();
});


/* =====================================================
   FILTRO POR DÍA
   ===================================================== */

dayFilterSelect.addEventListener("change", () => {
  currentDayFilter = dayFilterSelect.value;
  renderTasks();
});


/* =====================================================
   BORRAR TODAS LAS TAREAS
   ===================================================== */

clearAllBtn.addEventListener("click", async () => {
  const confirmed = confirm("¿Seguro que quieres borrar TODAS las tareas?");

  if (!confirmed) return;

  showLoading("Borrando tareas...");

  try {
    await Promise.all(tasks.map((task) => window.taskApi.deleteTask(task.id)));
    tasks = [];
    renderTasks();
    showSuccess("Todas las tareas se han borrado");
  } catch (error) {
    showError(`Error al borrar tareas: ${error.message}`);
  }
});


/* =====================================================
   CAMBIOS EN DESTINO Y DURACIÓN
   ===================================================== */

/**
 * Cuando cambia el destino, lo guardamos y actualizamos el resumen
 */
destinationInput.addEventListener("input", () => {
  tripConfig.destination = destinationInput.value.trim() || "Sin destino";
  saveTripConfig();
  updateTripSummary();
});

/**
 * Cuando cambia la duración:
 * - actualizamos el viaje
 * - regeneramos días
 * - limpiamos el filtro si ya no existe ese día
 * - corregimos tareas que apunten a un día fuera del rango
 */
durationSelect.addEventListener("change", () => {
  tripConfig.duration = Number(durationSelect.value);
  saveTripConfig();

  generateDayOptions();

  const maxDay = tripConfig.duration;

  if (currentDayFilter !== "all") {
    const dayNumber = parseInt(currentDayFilter.replace("Día ", ""));
    if (dayNumber > maxDay) {
      currentDayFilter = "all";
      dayFilterSelect.value = "all";
    }
  }

  tasks = tasks.map((task) => {
    const taskDayNumber = parseInt((task.day || "Día 1").replace("Día ", ""));
    if (taskDayNumber > maxDay) {
      return {
        ...task,
        day: `Día ${maxDay}`,
      };
    }
    return task;
  });

  updateTripSummary();
  renderTasks();
});


/* =====================================================
   INICIALIZACIÓN
   ===================================================== */

loadTripConfig();
syncTripConfigUI();
loadTasks();