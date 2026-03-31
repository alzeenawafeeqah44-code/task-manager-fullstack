const API_URL = "http://localhost:5000";
const userId = localStorage.getItem("userId");

// Load tasks
async function loadTasks() {
  const res = await fetch(`${API_URL}/tasks/${userId}`);
  const tasks = await res.json();

  const list = document.getElementById("taskList");
  list.innerHTML = "";

  tasks.forEach(task => {
    const li = document.createElement("li");
    li.textContent = task.title;
    list.appendChild(li);
  });
}

// Add task
async function addTask() {
  const input = document.getElementById("taskInput");
  const task = input.value;

  await fetch(`${API_URL}/tasks`, {
    method: "POST",
    headers: {"Content-Type": "application/json"},
    body: JSON.stringify({ title: task, userId: userId })
  });

  input.value = "";
  loadTasks();
}

// Load tasks on page load
loadTasks();