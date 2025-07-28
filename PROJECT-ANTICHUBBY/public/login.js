const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const sql = require("mssql");

const app = express();
const PORT = 5500;

const dbConfig = {
  user: "your_username",
  password: "your_password",
  server: "localhost",
  database: "GundamStore",
  options: {
    encrypt: false,
    trustServerCertificate: true,
  },
};

app.use(cors());
app.use(bodyParser.json());
app.use(express.static("public"));

// -------------------- AUTH --------------------
app.post("/register", async (req, res) => {
  const { username, email, password, phone, address, date_of_birth } = req.body;
  try {
    await sql.connect(dbConfig);
    await sql.query`
      INSERT INTO NguoiDung (hoTen, email, matKhau, soDienThoai, diaChi, ngayTao)
      VALUES (${username}, ${email}, ${password}, ${phone}, ${address}, GETDATE())`;
    res.status(200).json({ message: "Đăng ký thành công" });
  } catch (err) {
    console.error("Register error:", err);
    res.status(500).json({ message: "Lỗi đăng ký" });
  }
});

app.post("/login", async (req, res) => {
  const { username, password } = req.body;
  try {
    await sql.connect(dbConfig);
    const result = await sql.query`
      SELECT * FROM NguoiDung
      WHERE (hoTen = ${username} OR email = ${username}) AND matKhau = ${password}`;
    if (result.recordset.length > 0) {
      res.status(200).json({ success: true, user: result.recordset[0] });
    } else {
      res
        .status(401)
        .json({ success: false, message: "Sai tài khoản hoặc mật khẩu" });
    }
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ success: false, message: "Lỗi server" });
  }
});
