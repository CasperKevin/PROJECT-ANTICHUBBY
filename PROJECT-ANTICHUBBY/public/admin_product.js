const express = require("express");
const sql = require("mssql/msnodesqlv8");

const router = express.Router();

// Sử dụng Windows Authentication
const dbConfig = {
  server: "localhost\\SQLEXPRESS",
  database: "CuaHangGundam",
  options: {
    trustedConnection: true,
    driver: "msnodesqlv8",
    instanceName: "SQLEXPRESS",
  },
};

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
