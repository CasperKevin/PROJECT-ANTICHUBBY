// admin_product.js – sửa để sử dụng SQL Server thay vì file JSON
const express = require("express");
const sql = require("mssql");

const router = express.Router();

// SQL Server config (đồng bộ với server.js)
const dbConfig = {
  user: "MSI/Gluttony",
  password: "",
  server: "localhost",
  database: "CuaHangGundam",
  options: {
    encrypt: false,
    trustServerCertificate: true,
  },
};

// GET /products — trả về danh sách sản phẩm
router.get("/", async (req, res) => {
  try {
    await sql.connect(dbConfig);
    const result = await sql.query("SELECT * FROM SanPham");
    res.json(result.recordset);
  } catch (err) {
    console.error("SQL error:", err);
    res.status(500).json({ message: "Database read error" });
  }
});

// POST /products — thêm mới sản phẩm
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
      INSERT INTO SanPham (tenSanPham, maLoaiSanPham, maThuongHieu, giaBan, soLuong, hinhAnh, moTa)
      VALUES (${tenSanPham}, ${maLoaiSanPham}, ${maThuongHieu}, ${giaBan}, ${soLuong}, ${hinhAnh}, ${moTa})
    `;
    res.json({ message: "Đã thêm sản phẩm thành công" });
  } catch (err) {
    console.error("Insert error:", err);
    res.status(500).json({ message: "Database write error" });
  }
});

module.exports = router;
