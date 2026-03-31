// add task
async function addTask() {
  const input = document.getElementById("taskInput");
  const task = input.value;

  if (task === "") return;

  await fetch("http://localhost:5000/tasks", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ title: task })
  });

  input.value = "";
  loadTasks();
}

// load tasks
async function loadTasks() {
  const res = await fetch("http://localhost:5000/tasks");
  const data = await res.json();

  const list = document.getElementById("taskList");
  list.innerHTML = "";

  data.forEach(task => {
    const li = document.createElement("li");

    li.innerText = task.title + " ";

    // delete button
    const btn = document.createElement("button");
    btn.innerText = "Delete";

    btn.onclick = async () => {
      await fetch(`http://localhost:5000/tasks/${task.id}`, {
        method: "DELETE"
      });
      loadTasks();
    };

    li.appendChild(btn);
    list.appendChild(li);
  });
}

// load tasks on start
loadTasks();