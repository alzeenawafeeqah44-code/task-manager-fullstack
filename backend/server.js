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
  password: "root", // 👉 put your MySQL password
  database: "taskdb"
});

// connect
db.connect(err => {
  if (err) {
    console.log(err);
  } else {
    console.log("MySQL Connected...");
  }
});

// ================= USERS =================

// signup
app.post("/signup", (req, res) => {
  const { username, password } = req.body;

  db.query(
    "INSERT INTO users (username, password) VALUES (?, ?)",
    [username, password],
    (err, result) => {
      if (err) throw err;
      res.send("User registered");
    }
  );
});

// login
app.post("/login", (req, res) => {
  const { username, password } = req.body;

  db.query(
    "SELECT * FROM users WHERE username=? AND password=?",
    [username, password],
    (err, result) => {
      if (err) throw err;

      if (result.length > 0) {
        res.json({ success: true });
      } else {
        res.json({ success: false });
      }
    }
  );
});

// ================= TASKS =================

// get tasks
app.get("/tasks", (req, res) => {
  db.query("SELECT * FROM tasks", (err, result) => {
    if (err) throw err;
    res.json(result);
  });
});

// add task
app.post("/tasks", (req, res) => {
  const { title } = req.body;

  db.query(
    "INSERT INTO tasks (title, completed) VALUES (?, false)",
    [title],
    (err, result) => {
      if (err) throw err;
      res.send("Task added");
    }
  );
});

// delete task
app.delete("/tasks/:id", (req, res) => {
  db.query(
    "DELETE FROM tasks WHERE id=?",
    [req.params.id],
    (err, result) => {
      if (err) throw err;
      res.send("Task deleted");
    }
  );
});

// start server
app.listen(5000, () => {
  console.log("Server running on port 5000");
});