// botón del header
const themeToggle = document.querySelector("#theme-toggle");

// clave donde guardamos la preferencia del tema
const THEME_KEY = "taskflow_theme";

/* función que aplica el tema */
function applyTheme(theme) {
  const root = document.documentElement;

  if (theme === "dark") {
    root.classList.add("dark");
  } else {
    root.classList.remove("dark");
  }
}

/* revisar si el usuario ya tenía un tema guardado */
function initTheme() {
  const savedTheme = localStorage.getItem(THEME_KEY);

  if (savedTheme) {
    applyTheme(savedTheme);
  }
}

initTheme();

/* botón para cambiar entre claro y oscuro */
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
const tagSelect = document.querySelector("#task-tag");
const prioritySelect = document.querySelector("#task-priority");

const taskList = document.querySelector("#task-list");

const searchInput = document.querySelector("#search");

const filterAll = document.querySelector("#filter-all");
const filterPending = document.querySelector("#filter-pending");
const filterCompleted = document.querySelector("#filter-completed");

const statTotal = document.querySelector("#stat-total");
const statCompleted = document.querySelector("#stat-completed");
const statPending = document.querySelector("#stat-pending");


/* =====================================================
   CONFIGURACIÓN
   ===================================================== */

// clave usada en LocalStorage
const STORAGE_KEY = "taskflow_tasks";

// array donde guardamos todas las tareas
let tasks = [];

// filtro actual
let currentFilter = "all";


/* =====================================================
   GUARDAR Y CARGAR DATOS
   ===================================================== */

// guardar tareas en LocalStorage
function saveTasks() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
}


// cargar tareas cuando se inicia la app
function loadTasks() {
  const saved = localStorage.getItem(STORAGE_KEY);

  if (!saved) {
    tasks = [];
    return;
  }

  try {
    const parsed = JSON.parse(saved);

    // si no es un array, dejamos array vacío
    if (!Array.isArray(parsed)) {
      tasks = [];
      return;
    }

    // adaptar tareas antiguas al nuevo formato
    tasks = parsed.map((task, index) => {
      return {
        id: task.id ?? Date.now() + index,
        title: task.title ?? task.text ?? "Tarea sin título",
        completed: task.completed ?? false,
        createdAt: task.createdAt ?? new Date().toISOString(),
        tag: task.tag ?? "Plan",
        priority: task.priority ?? "nice"
      };
    });

  } catch {
    tasks = [];
  }
}


/* =====================================================
   ESTADÍSTICAS
   ===================================================== */

function updateStats() {
  const total = tasks.length;
  const completed = tasks.filter(task => task.completed).length;
  const pending = total - completed;

  statTotal.textContent = total;
  statCompleted.textContent = completed;
  statPending.textContent = pending;
}


/* =====================================================
   PRIORIDAD → ESTILO VISUAL
   ===================================================== */

function getPriorityStyles(priority) {
  if (priority === "must") {
    return "bg-red-100 text-red-900 dark:bg-red-500/20 dark:text-red-100";
  }

  if (priority === "optional") {
    return "bg-sky-100 text-sky-900 dark:bg-sky-500/20 dark:text-sky-100";
  }

  return "bg-amber-100 text-amber-900 dark:bg-amber-500/20 dark:text-amber-100";
}

function getPriorityText(priority) {
  if (priority === "must") return "IMPRESCINDIBLE";
  if (priority === "optional") return "OPCIONAL";
  return "RECOMENDADO";
}


/* =====================================================
   CREAR TARJETA DE TAREA
   ===================================================== */

function createTaskNode(task) {
  const li = document.createElement("li");

  const priorityClass = getPriorityStyles(task.priority);
  const priorityText = getPriorityText(task.priority);

  li.innerHTML = `
    <article class="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition hover:-translate-y-0.5 hover:shadow dark:border-slate-800 dark:bg-slate-900">

      <div class="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">

        <div class="flex items-center gap-3">
          <!-- checkbox para marcar tarea completada -->
          <input type="checkbox" class="task-checkbox h-4 w-4" ${task.completed ? "checked" : ""}>

          <!-- título de la tarea -->
          <div>
            <h3 class="font-semibold ${task.completed ? "line-through opacity-60" : ""}">
              ${task.title}
            </h3>
            <p class="text-sm text-slate-500 dark:text-slate-400">
              ${new Date(task.createdAt).toLocaleDateString()}
            </p>
          </div>
        </div>

        <div class="flex flex-wrap items-center gap-2">
          <!-- categoría -->
          <span class="rounded-full border border-slate-200 bg-slate-50 px-2 py-1 text-xs font-semibold dark:border-slate-800 dark:bg-slate-950/40">
            ${task.tag}
          </span>

          <!-- prioridad -->
          <span class="rounded-full border border-slate-200 px-2 py-1 text-xs font-semibold ${priorityClass}">
            ${priorityText}
          </span>

          <!-- botón eliminar -->
          <button
            class="delete-btn rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-semibold shadow-sm transition duration-200 hover:-translate-y-0.5 hover:shadow focus:outline-none focus:ring-2 focus:ring-slate-300 dark:border-slate-800 dark:bg-slate-950 dark:focus:ring-slate-700"
            aria-label="Eliminar tarea"
          >
            Eliminar
          </button>
        </div>

      </div>

    </article>
  `;


  /* ================================
     MARCAR COMO COMPLETADA
     ================================ */

  li.querySelector(".task-checkbox").addEventListener("change", (e) => {
    task.completed = e.target.checked;

    saveTasks();
    renderTasks();
  });


  /* ================================
     ELIMINAR TAREA
     ================================ */

  li.querySelector(".delete-btn").addEventListener("click", () => {
    tasks = tasks.filter(t => t.id !== task.id);

    saveTasks();
    renderTasks();
  });

  return li;
}


/* =====================================================
   MOSTRAR TAREAS
   ===================================================== */

function renderTasks() {
  // limpiar lista antes de volver a pintar
  taskList.innerHTML = "";

  let filteredTasks = tasks;

  /* aplicar filtro */
  if (currentFilter === "pending") {
    filteredTasks = tasks.filter(task => !task.completed);
  }

  if (currentFilter === "completed") {
    filteredTasks = tasks.filter(task => task.completed);
  }

  /* aplicar buscador */
  const searchText = searchInput.value.toLowerCase().trim();

  filteredTasks = filteredTasks.filter(task =>
    (task.title || "").toLowerCase().includes(searchText)
  );

  /* renderizar cada tarea */
  filteredTasks.forEach(task => {
    const node = createTaskNode(task);
    taskList.appendChild(node);
  });

  updateStats();
}


/* =====================================================
   AÑADIR NUEVA TAREA
   ===================================================== */

form.addEventListener("submit", (e) => {
  e.preventDefault();

  const title = input.value.trim();

  if (!title) return;

  const newTask = {
    id: Date.now(),
    title: title,
    completed: false,
    createdAt: new Date().toISOString(),
    tag: tagSelect.value,
    priority: prioritySelect.value
  };

  tasks.push(newTask);

  saveTasks();
  renderTasks();

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
   FILTROS
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
   INICIALIZACIÓN
   ===================================================== */

loadTasks();
renderTasks();