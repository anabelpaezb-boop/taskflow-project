// Elementos del DOM
const form = document.querySelector("#task-form");
const input = document.querySelector("#task-input");
const list = document.querySelector("#task-list");
const search = document.querySelector("#search");
const tagSelect = document.querySelector("#task-tag");
const prioritySelect = document.querySelector("#task-priority");

// Clave de LocalStorage
const STORAGE_KEY = "taskflow_tasks_v1";

// Tareas por defecto (solo la primera vez)
const DEFAULT_TASKS = [
  { text: "Camden Market", tag: "Paseo", priority: "must" },
  { text: "British Museum", tag: "Museo", priority: "nice" },
  { text: "Notting Hill + Portobello", tag: "Paseo", priority: "optional" },
  { text: "Big Ben & Westminster", tag: "Monumento", priority: "must" },
  { text: "Andén 9¾ + tienda Harry Potter", tag: "Harry Potter", priority: "nice" },
  { text: "Tower Bridge", tag: "Monumento", priority: "must" },
  { text: "Fish & Chips", tag: "Comida", priority: "optional" },
];

// Estado
let tasks = [];

// Guardar
function saveTasks() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
}

// Cargar (y si no hay nada, poner defaults)
function loadTasks() {
  const saved = localStorage.getItem(STORAGE_KEY);

  if (!saved) {
    tasks = DEFAULT_TASKS;
    saveTasks(); // importante: para que no se vuelvan a crear al refrescar
    return;
  }

  try {
    const parsed = JSON.parse(saved);
    tasks = Array.isArray(parsed) ? parsed : [];
  } catch {
    tasks = [];
  }
}

// Convertir prioridad a clase + texto
function getPriorityUI(priority) {
  // priority: must | nice | optional
  if (priority === "must") return { cls: "badge--must", text: "IMPRESCINDIBLE" };
  if (priority === "optional") return { cls: "badge--optional", text: "OPCIONAL" };
  return { cls: "badge--nice", text: "RECOMENDADO" }; // por defecto
}

// Crear nodo de tarea (usa tu estilo de card)
function createTaskNode(task, index) {
  const li = document.createElement("li");

  const pr = getPriorityUI(task.priority);

  li.innerHTML = `
    <article class="card" tabindex="0">
      <div class="card-row">
        <div class="card-info">
          <h3></h3>
          <p class="muted">Tarea guardada en LocalStorage.</p>
        </div>

        <div class="card-meta">
          <span class="tag"></span>
          <span class="badge ${pr.cls}"></span>
          <button class="delete-btn" type="button">Eliminar</button>
        </div>
      </div>
    </article>
  `;

  li.querySelector("h3").textContent = task.text;
  li.querySelector(".tag").textContent = task.tag || "Plan";
  li.querySelector(".badge").textContent = pr.text;

  // Eliminar
  li.querySelector(".delete-btn").addEventListener("click", () => {
    tasks.splice(index, 1);
    saveTasks();
    renderTasks(search.value);
  });

  return li;
}

// Pintar lista (con filtro de búsqueda)
function renderTasks(filterText = "") {
  list.innerHTML = "";

  const q = filterText.trim().toLowerCase();

  tasks.forEach((task, index) => {
    if (q && !task.text.toLowerCase().includes(q)) return;
    list.appendChild(createTaskNode(task, index));
  });
}

// Añadir tarea desde formulario
form.addEventListener("submit", (e) => {
  e.preventDefault();

  const text = input.value.trim();
  if (!text) return;

  // Para mantenerlo simple, añadimos como RECOMENDADO y tag "Plan"
const tag = tagSelect.value;
const priority = prioritySelect.value;

tasks.push({ text, tag, priority });

saveTasks();
renderTasks(search.value);

input.value = "";
input.focus();
});

// BONUS: búsqueda en tiempo real
search.addEventListener("input", () => {
  renderTasks(search.value);
});

// Init
loadTasks();
renderTasks();