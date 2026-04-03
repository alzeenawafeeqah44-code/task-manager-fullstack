const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

// 🔥 MySQL connection
const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "root", // change if needed
  database: "taskdb"
});

db.connect(err => {
  if (err) throw err;
  console.log("MySQL Connected...");
});


// ---------------- ADD TASK ----------------
app.post("/tasks", (req, res) => {
  const { title, userId } = req.body;

  if (!title || !userId) {
    return res.status(400).json("Missing data");
  }

  const sql = "INSERT INTO tasks (title, user_id) VALUES (?, ?)";

  db.query(sql, [title, userId], (err, result) => {
    if (err) {
      console.log("DB Error:", err);
      return res.status(500).json(err);
    }

    res.status(200).json({ message: "Task added successfully" });
  });
});


// ---------------- GET TASKS ----------------
app.get("/tasks/:userId", (req, res) => {
  const userId = req.params.userId;

  const sql = "SELECT * FROM tasks WHERE user_id = ?";

  db.query(sql, [userId], (err, results) => {
    if (err) {
      console.log("DB Error:", err);
      return res.status(500).json(err);
    }

    res.json(results);
  });
});


// ---------------- DELETE TASK ----------------
app.delete("/tasks/:id", (req, res) => {
  const taskId = req.params.id;

  const sql = "DELETE FROM tasks WHERE id = ?";

  db.query(sql, [taskId], (err, result) => {
    if (err) {
      console.log("DB Error:", err);
      return res.status(500).json(err);
    }

    res.json({ message: "Task deleted successfully" });
  });
});


// ---------------- MARK COMPLETE ----------------
app.put("/tasks/:id", (req, res) => {
  const taskId = req.params.id;

  const sql = "UPDATE tasks SET completed = 1 WHERE id = ?";

  db.query(sql, [taskId], (err, result) => {
    if (err) {
      console.log("DB Error:", err);
      return res.status(500).json(err);
    }

    res.json({ message: "Task marked as completed" });
  });
});


// ---------------- SERVER ----------------
app.listen(5000, () => {
  console.log("Server running on port 5000");
});