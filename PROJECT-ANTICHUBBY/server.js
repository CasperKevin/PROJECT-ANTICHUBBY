const express = require("express");
const fs = require("fs");
const path = require("path");
const cors = require("cors");
const bodyParser = require("body-parser");

const app = express();
const PORT = 5500;
const DATA_PATH = path.join(__dirname, "user.json");
const ADMIN_DATA_PATH = path.join(__dirname, "admin.json");
const PRODUCTS_DATA_PATH = path.join(__dirname, "products.json");

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, "public")));
app.use(express.static(__dirname)); // to serve HTML and user.json

// API: Register new user
app.post("/register", (req, res) => {
  const newUser = req.body;

  fs.readFile(DATA_PATH, "utf-8", (err, data) => {
    if (err) return res.status(500).send("Error reading file");

    let users = [];
    try {
      users = JSON.parse(data);
    } catch {
      return res.status(500).send("Invalid JSON");
    }

    newUser.user_id =
      users.length > 0 ? users[users.length - 1].user_id + 1 : 1;
    users.push(newUser);

    fs.writeFile(DATA_PATH, JSON.stringify(users, null, 2), (err) => {
      if (err) return res.status(500).send("Error writing file");
      res.status(200).json({ message: "Registered successfully" });
    });
  });
});

// API: Login
app.post("/login", (req, res) => {
  const { username, password } = req.body;

  fs.readFile(DATA_PATH, "utf-8", (err, data) => {
    if (err)
      return res.status(500).send({ success: false, message: "Server error" });

    let users = [];
    try {
      users = JSON.parse(data);
    } catch {
      return res.status(500).send({ success: false, message: "Invalid data" });
    }

    const user = users.find(
      (u) =>
        (u.username === username || u.email === username) &&
        u.password === password
    );

    if (user) {
      const { password, ...safeUser } = user;
      return res.status(200).send({ success: true, user: safeUser });
    }

    res.status(401).send({ success: false, message: "Invalid credentials" });
  });
});
// API: Get all products
app.get("/products", (req, res) => {
  fs.readFile(PRODUCTS_DATA_PATH, "utf-8", (err, data) => {
    if (err) return res.status(500).send("Error reading products file");

    let products = [];
    try {
      products = JSON.parse(data);
    } catch {
      return res.status(500).send("Invalid products data");
    }

    res.status(200).json(products);
  });
});
// API: Admin login
app.post("/admin/login", (req, res) => {
  const { username, password } = req.body;

  fs.readFile(ADMIN_DATA_PATH, "utf-8", (err, data) => {
    if (err)
      return res.status(500).send({ success: false, message: "Server error" });

    let admins = [];
    try {
      admins = JSON.parse(data);
    } catch {
      return res.status(500).send({ success: false, message: "Invalid data" });
    }

    const admin = admins.find(
      (a) => a.username === username && a.password === password
    );

    if (admin) {
      const { password, ...safeAdmin } = admin;
      return res.status(200).send({ success: true, admin: safeAdmin });
    }

    res.status(401).send({ success: false, message: "Invalid credentials" });
  });
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
