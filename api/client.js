const API_BASE_URL =
  window.location.hostname === "localhost"
    ? "http://localhost:3000/api/v1/tasks"
    : "https://taskflow-project-oqcs-lbrr5dq9x-anabels-projects-994fe2bd.vercel.app/api/v1/tasks";

/**
 * Convierte la respuesta HTTP en JSON o lanza un error útil
 * @param {Response} response
 * @returns {Promise<any>}
 */
async function handleResponse(response) {
  if (response.status === 204) return null;

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    const message = data.error || "Error de red";
    throw new Error(message);
  }

  return data;
}

window.taskApi = {
  async getTasks() {
    const response = await fetch(API_BASE_URL);
    return handleResponse(response);
  },

  async createTask(task) {
    const response = await fetch(API_BASE_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(task),
    });

    return handleResponse(response);
  },

  async patchTask(id, updates) {
    const response = await fetch(`${API_BASE_URL}/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updates),
    });

    return handleResponse(response);
  },

  async deleteTask(id) {
    const response = await fetch(`${API_BASE_URL}/${id}`, {
      method: "DELETE",
    });

    return handleResponse(response);
  },
};