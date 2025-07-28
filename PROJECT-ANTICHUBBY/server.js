const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const sql = require("mssql");

const app = express();
const PORT = 5500;

// SQL Server config
const dbConfig = {
  user: "your_username",
  password: "your_password",
  server: "localhost", // or your server name
  database: "your_database",
  options: {
    encrypt: false, // set to true if using Azure
    trustServerCertificate: true,
  },
};

app.use(cors());
app.use(bodyParser.json());
app.use(express.static("public"));

// API: Register new user
app.post("/register", async (req, res) => {
  const { username, email, password } = req.body;
  try {
    await sql.connect(dbConfig);
    const result = await sql.query`
      INSERT INTO Users (username, email, password)
      VALUES (${username}, ${email}, ${password});
      SELECT SCOPE_IDENTITY() AS user_id;
    `;
    res.status(200).json({ message: "Registered successfully", user_id: result.recordset[0].user_id });
  } catch (err) {
    res.status(500).send("Error registering user");
  }
});

// API: Login
app.post("/login", async (req, res) => {
  const { username, password } = req.body;
  try {
    await sql.connect(dbConfig);
    const result = await sql.query`
      SELECT user_id, username, email FROM Users
      WHERE (username = ${username} OR email = ${username}) AND password = ${password}
    `;
    if (result.recordset.length > 0) {
      res.status(200).send({ success: true, user: result.recordset[0] });
    } else {
      res.status(401).send({ success: false, message: "Invalid credentials" });
    }
  } catch (err) {
    res.status(500).send({ success: false, message: "Server error" });
  }
});

// API: Get all products
app.get("/products", async (req, res) => {
  try {
    await sql.connect(dbConfig);
    const result = await sql.query`SELECT * FROM Products`;
    res.status(200).json(result.recordset);
  } catch (err) {
    res.status(500).send("Error reading products");
  }
});

// API: Admin login
app.post("/admin/login", async (req, res) => {
  const { username, password } = req.body;
  try {
    await sql.connect(dbConfig);
    const result = await sql.query`
      SELECT admin_id, username FROM Admins
      WHERE username = ${username} AND password = ${password}
    `;
    if (result.recordset.length > 0) {
      res.status(200).send({ success: true, admin: result.recordset[0] });
    } else {
      res.status(401).send({ success: false, message: "Invalid credentials" });
    }
  } catch (err) {
    res.status(500).send({ success: false, message: "Server error" });
  }
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
