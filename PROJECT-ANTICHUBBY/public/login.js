const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const sql = require("mssql/msnodesqlv8");

const app = express();
const PORT = 5500;

// Sử dụng Windows Authentication
const dbConfig = {
  server: "localhost\\SQLEXPRESS", // Đảm bảo đúng tên instance
  database: "CuaHangGundam",
  options: {
    trustedConnection: true,
    driver: "msnodesqlv8",
    instanceName: "SQLEXPRESS",
  },
};

app.use(cors());
app.use(bodyParser.json());
app.use(express.static("public"));

app.post("/register", async (req, res) => {
  const { username, email, password, phone, address } = req.body;
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
      SELECT maNguoiDung AS user_id, hoTen AS username, email 
      FROM NguoiDung
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
