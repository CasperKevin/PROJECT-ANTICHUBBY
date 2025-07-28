// Sửa cấu hình kết nối
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

// Sửa lỗi INSERT thiếu dấu phẩy
router.post("/", async (req, res) => {
  const {
    tenSanPham,
    maLoaiSanPham,
    maThuongHieu,
    giaBan,
    soLuong,
    hinhAnh,
    moTa,
  } = req.body;
  try {
    await sql.connect(dbConfig);
    await sql.query`
      INSERT INTO SanPham 
        (tenSanPham, maLoaiSanPham, maThuongHieu, giaBan, soLuong, hinhAnh, moTa)
      VALUES 
        (${tenSanPham}, ${maLoaiSanPham}, ${maThuongHieu}, ${giaBan}, ${soLuong}, ${hinhAnh}, ${moTa})`;

    res.json({ message: "Đã thêm sản phẩm thành công" });
  } catch (err) {
    console.error("Insert error:", err);
    res.status(500).json({ message: "Database write error" });
  }
});
