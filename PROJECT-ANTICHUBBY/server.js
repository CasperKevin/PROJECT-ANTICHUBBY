const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const sql = require("mssql/msnodesqlv8");

const app = express();
const PORT = 5500;

// Sử dụng Windows Authentication
const dbConfig = {
  user: "Arazuki",
  password: "887463",
  server: "MSI\\SQLEXPRESS", // Sử dụng dấu \\ cho instance name
  database: "CuaHangGundam",
  options: {
    encrypt: false,
    trustServerCertificate: true,
    connectTimeout: 30000,
    requestTimeout: 30000,
  },
};

const pool = new sql.ConnectionPool(dbConfig);
pool
  .connect()
  .then(() => {
    console.log(" Đã kết nối SQL Server thành công!");
  })
  .catch((err) => {
    console.error(" Lỗi kết nối SQL:", err);
  });

app.post("/register", async (req, res) => {
  const { username, email, password, phone, address } = req.body;
  try {
    const request = pool.request();
    const result = await request.query`
      INSERT INTO NguoiDung (hoTen, email, matKhau, soDienThoai, diaChi, ngayTao)
      VALUES (${username}, ${email}, ${password}, ${phone}, ${address}, GETDATE());
      SELECT SCOPE_IDENTITY() AS user_id;
    `;
    res.status(200).json({
      message: "Registered successfully",
      user_id: result.recordset[0].user_id,
    });
  } catch (err) {
    console.error("Registration error:", err);
    res.status(500).send("Error registering user");
  }
});

app.post("/login", async (req, res) => {
  const { username, password } = req.body;
  try {
    const request = pool.request();
    const result = await request.query`
      SELECT maNguoiDung AS user_id, hoTen AS username, email 
      FROM NguoiDung
      WHERE (hoTen = ${username} OR email = ${username}) AND matKhau = ${password}`;

    if (result.recordset.length > 0) {
      res.status(200).send({ success: true, user: result.recordset[0] });
    } else {
      res.status(401).send({ success: false, message: "Invalid credentials" });
    }
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).send({ success: false, message: "Server error" });
  }
});
