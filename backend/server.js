const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

// MySQL connection
const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "root", // 🔴 replace this
  database: "taskdb"
});

db.connect(err => {
  if (err) throw err;
  console.log("MySQL Connected...");
});

// ---------------- SIGNUP ----------------
app.post("/signup", (req, res) => {
  const { username, password } = req.body;

  const sql = "INSERT INTO users (username, password) VALUES (?, ?)";
  db.query(sql, [username, password], (err, result) => {
    if (err) return res.send(err);
    res.json({ message: "User registered!" });
  });
});

// ---------------- LOGIN ----------------
app.post("/login", (req, res) => {
  const { username, password } = req.body;

  const sql = "SELECT * FROM users WHERE username=? AND password=?";
  db.query(sql, [username, password], (err, results) => {
    if (err) return res.send(err);

    if (results.length > 0) {
      res.json({
        message: "Login successful",
        userId: results[0].id   // ✅ IMPORTANT
      });
    } else {
      res.json({ message: "Invalid credentials" });
    }
  });
});

// ---------------- ADD TASK ----------------
app.post("/tasks", (req, res) => {
  const { title, userId } = req.body;

  const sql = "INSERT INTO tasks (title, completed, user_id) VALUES (?, ?, ?)";
  db.query(sql, [title, 0, userId], (err, result) => {
    if (err) return res.send(err);
    res.json({ message: "Task added!" });
  });
});

// ---------------- GET TASKS ----------------
app.get("/tasks/:userId", (req, res) => {
  const userId = req.params.userId;

  const sql = "SELECT * FROM tasks WHERE user_id = ?";
  db.query(sql, [userId], (err, results) => {
    if (err) return res.send(err);
    res.json(results);
  });
});

// ---------------- SERVER ----------------
app.listen(5000, () => {
  console.log("Server running on port 5000");
});