// botón del header
const themeToggle = document.querySelector("#theme-toggle");

// clave para guardar el tema en localStorage
const THEME_KEY = "taskflow_theme";

/* Función que aplica el tema claro u oscuro */
function applyTheme(theme) {
  const root = document.documentElement;

  if (theme === "dark") {
    root.classList.add("dark");
  } else {
    root.classList.remove("dark");
  }
}

/* Al iniciar la web revisamos si el usuario ya tenía
   una preferencia guardada */
function initTheme() {
  const savedTheme = localStorage.getItem(THEME_KEY);

  if (savedTheme) {
    applyTheme(savedTheme);
  }
}

// activar tema al cargar
initTheme();

/* Evento para cambiar entre claro y oscuro */
themeToggle.addEventListener("click", () => {
  const isDark = document.documentElement.classList.contains("dark");

  const newTheme = isDark ? "light" : "dark";

  applyTheme(newTheme);

  // guardamos la preferencia
  localStorage.setItem(THEME_KEY, newTheme);
});


/* TASKFLOW - GESTIÓN DE TAREAS */

// elementos del DOM
const form = document.querySelector("#task-form");
const input = document.querySelector("#task-input");
const taskList = document.querySelector("#task-list");
const searchInput = document.querySelector("#search");

const tagSelect = document.querySelector("#task-tag");
const prioritySelect = document.querySelector("#task-priority");

// clave donde guardamos tareas
const STORAGE_KEY = "taskflow_tasks";

// array donde guardamos las tareas
let tasks = [];


/* TAREAS INICIALES (solo la primera vez) */

const DEFAULT_TASKS = [
  { text: "Camden Market", tag: "Paseo", priority: "must" },
  { text: "British Museum", tag: "Museo", priority: "nice" },
  { text: "Notting Hill + Portobello", tag: "Paseo", priority: "optional" },
  { text: "Big Ben & Westminster", tag: "Monumento", priority: "must" },
  { text: "Andén 9¾ + tienda Harry Potter", tag: "Harry Potter", priority: "nice" },
  { text: "Tower Bridge", tag: "Monumento", priority: "must" },
  { text: "Fish & Chips", tag: "Comida", priority: "optional" }
];


/* GUARDAR Y CARGAR DATOS*/

/* Guardamos las tareas en LocalStorage */
function saveTasks() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
}

/* Cargamos tareas al iniciar la app */
function loadTasks() {
  const saved = localStorage.getItem(STORAGE_KEY);

  // si no hay nada guardado usamos las tareas por defecto
  if (!saved) {
    tasks = DEFAULT_TASKS;
    saveTasks();
    return;
  }

  // si sí hay tareas guardadas
  try {
    const parsed = JSON.parse(saved);
    tasks = Array.isArray(parsed) ? parsed : [];
  } catch {
    tasks = [];
  }
}


/*  PRIORIDAD → BADGE VISUAL */

function getPriorityBadge(priority) {

  if (priority === "must") {
    return {
      text: "IMPRESCINDIBLE",
      color: "bg-red-100 text-red-900 dark:bg-red-500/20 dark:text-red-100"
    };
  }

  if (priority === "optional") {
    return {
      text: "OPCIONAL",
      color: "bg-sky-100 text-sky-900 dark:bg-sky-500/20 dark:text-sky-100"
    };
  }

  // recomendado por defecto
  return {
    text: "RECOMENDADO",
    color: "bg-amber-100 text-amber-900 dark:bg-amber-500/20 dark:text-amber-100"
  };
}


/*  CREAR TARJETA DE TAREA*/

function createTaskNode(task, index) {

  const li = document.createElement("li");

  const badge = getPriorityBadge(task.priority);

  li.innerHTML = `
    <article class="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition hover:-translate-y-0.5 hover:shadow dark:border-slate-800 dark:bg-slate-900">

      <div class="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">

        <div>
          <h3 class="font-bold text-base">${task.text}</h3>
          <p class="text-sm text-slate-600 dark:text-slate-400">
            Tarea guardada en LocalStorage
          </p>
        </div>

        <div class="flex items-center gap-2 flex-wrap">

          <span class="rounded-full border border-slate-200 bg-slate-50 px-2 py-1 text-xs font-semibold dark:border-slate-800 dark:bg-slate-950/40">
            ${task.tag}
          </span>

          <span class="rounded-full border border-slate-200 px-2 py-1 text-xs font-semibold ${badge.color}">
            ${badge.text}
          </span>

          <button class="delete-btn rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-semibold shadow-sm transition hover:-translate-y-0.5 hover:shadow dark:border-slate-800 dark:bg-slate-950">
            Eliminar
          </button>

        </div>

      </div>

    </article>
  `;

  /* Botón eliminar */
  li.querySelector(".delete-btn").addEventListener("click", () => {

    // eliminamos la tarea del array
    tasks.splice(index, 1);

    // guardamos cambios
    saveTasks();

    // volvemos a renderizar
    renderTasks(searchInput.value);
  });

  return li;
}


/*  MOSTRAR TAREAS EN PANTALLA */

function renderTasks(filterText = "") {

  // limpiamos la lista antes de pintar
  taskList.innerHTML = "";

  const query = filterText.toLowerCase().trim();

  tasks.forEach((task, index) => {

    // filtro de búsqueda 
    if (query && !task.text.toLowerCase().includes(query)) return;

    const node = createTaskNode(task, index);

    taskList.appendChild(node);
  });
}


/* AÑADIR NUEVA TAREA */

form.addEventListener("submit", (e) => {

  e.preventDefault();

  const text = input.value.trim();

  if (!text) return;

  const tag = tagSelect.value;
  const priority = prioritySelect.value;

  // añadimos nueva tarea
  tasks.push({
    text,
    tag,
    priority
  });

  // guardamos
  saveTasks();

  // actualizamos lista
  renderTasks(searchInput.value);

  // limpiar input
  input.value = "";

  input.focus();
});


/* BUSCADOR */

searchInput.addEventListener("input", () => {
  renderTasks(searchInput.value);
});


/*  INICIALIZACIÓN */

// cargar tareas guardadas
loadTasks();

// mostrarlas en pantalla
renderTasks();