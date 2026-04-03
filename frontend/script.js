console.log("JS is working");

// 🔥 Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyC9CJE5aVR-JuElK35kZsHeJ5R7WxZhJjE",
  authDomain: "task-manager-21463.firebaseapp.com",
  projectId: "task-manager-21463",
  storageBucket: "task-manager-21463.firebasestorage.app",
  messagingSenderId: "678808317948",
  appId: "1:678808317948:web:2fb5e7aa382436a73a0c79"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

// Google Auth
const provider = new firebase.auth.GoogleAuthProvider();

// Backend API
const API_URL = "http://localhost:5000";

// Store userId
let userId = localStorage.getItem("userId");

// ✅ Login
function loginWithGoogle() {
  firebase.auth()
    .signInWithPopup(provider)
    .then((result) => {
      const user = result.user;

      localStorage.setItem("userId", user.uid);
      userId = user.uid;

      alert("Welcome " + user.displayName);

      loadTasks();
    })
    .catch((error) => {
      console.error("Login Error:", error);
      alert("Login failed");
    });
}

// 📥 Load tasks
async function loadTasks() {
  if (!userId) return;

  try {
    const res = await fetch(`${API_URL}/tasks/${userId}`);
    const tasks = await res.json();

    const activeList = document.getElementById("taskList");
    const completedList = document.getElementById("completedList");

    activeList.innerHTML = "";
    completedList.innerHTML = "";

    tasks.forEach(task => {
      const li = document.createElement("li");
      li.textContent = task.title + " ";

      if (task.completed === 0) {
        // 🟢 Active Task → show COMPLETE button
        const completeBtn = document.createElement("button");
        completeBtn.textContent = "Completed";
        completeBtn.style.marginLeft = "10px";

completeBtn.onclick = () => {
  console.log("Clicked complete:", task.id);
  markCompleted(task.id);
};
        li.appendChild(completeBtn);
        activeList.appendChild(li);

      } else {
        // ✅ Completed Task → show DELETE button
        const deleteBtn = document.createElement("button");
        deleteBtn.textContent = "Delete";
        deleteBtn.style.marginLeft = "10px";

        deleteBtn.onclick = () => deleteTask(task.id);

        li.appendChild(deleteBtn);
        completedList.appendChild(li);
      }
    });

  } catch (err) {
    console.error("Load tasks error:", err);
  }
}

// ➕ Add task
async function addTask() {
  if (!userId) {
    alert("Please login first!");
    return;
  }

  const input = document.getElementById("taskInput");
  const task = input.value;

  if (!task) return;

  try {
    await fetch(`${API_URL}/tasks`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        title: task,
        userId: userId
      })
    });

    input.value = "";
    loadTasks();

  } catch (err) {
    console.error("Add task error:", err);
  }
}

// ✅ Mark as completed
async function markCompleted(id) {
  try {
    const res = await fetch(`${API_URL}/tasks/${id}`, {
      method: "PUT"
    });

    if (!res.ok) {
      throw new Error("Server error");
    }

    const data = await res.json();
    console.log("Server response:", data);

    loadTasks();

  } catch (err) {
    console.error("Complete error:", err);
  }
}
// 🗑️ Delete task
async function deleteTask(id) {
  try {
    await fetch(`${API_URL}/tasks/${id}`, {
      method: "DELETE"
    });

    loadTasks();

  } catch (err) {
    console.error("Delete error:", err);
  }
}

// 🔄 Auto load
if (userId) {
  loadTasks();
}