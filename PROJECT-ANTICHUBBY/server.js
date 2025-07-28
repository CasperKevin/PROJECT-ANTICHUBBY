// Sửa lỗi kết nối SQL Server và cấu trúc bảng
const dbConfig = {
  user: "MSIGluttony",
  password: "your_password_here",
  server: "localhost\\SQLEXPRESS",
  database: "CuaHangGundam",
  options: {
    encrypt: false,
    trustServerCertificate: true,
  },
};

// Sửa API register cho khớp cấu trúc bảng
app.post("/register", async (req, res) => {
  const { username, email, password, phone, address } = req.body;
  try {
    await sql.connect(dbConfig);
    const result = await sql.query`
      INSERT INTO NguoiDung (hoTen, email, matKhau, soDienThoai, diaChi, ngayTao)
      VALUES (${username}, ${email}, ${password}, ${phone}, ${address}, GETDATE());
      SELECT SCOPE_IDENTITY() AS user_id;
    `;
    res.status(200).json({
      message: "Registered successfully",
      user_id: result.recordset[0].user_id,
    });
  } catch (err) {
    console.error("Registration error:", err); // 👉 Thêm log lỗi
    res.status(500).send("Error registering user");
  }
});

// Sửa API login cho khớp tên cột
app.post("/login", async (req, res) => {
  const { username, password } = req.body;
  try {
    await sql.connect(dbConfig);
    const result = await sql.query`
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
