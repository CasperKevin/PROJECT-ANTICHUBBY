// Sửa cấu hình kết nối Windows Authentication
const dbConfig = {
  server: "localhost\\SQLEXPRESS",
  database: "CuaHangGundam",
  options: {
    trustedConnection: true,
    trustServerCertificate: true,
  },
};

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
