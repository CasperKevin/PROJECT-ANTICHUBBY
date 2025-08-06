const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const sql = require("mssql");

const app = express();
const PORT = 5500;

app.use(cors());
app.use(express.json());
app.use(express.static(__dirname + "/HTML"));
app.use(express.static(__dirname + "/public"));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(__dirname));
const dbConfig = {
  user: "Arazuki",
  password: "887463",
  server: "localhost",
  port: 49695,
  database: "CuaHangGundam",
  options: {
    encrypt: false,
    trustServerCertificate: true,
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
// API để lấy danh sách sản phẩm
app.get("/api/products", async (req, res) => {
  try {
    const pool = await sql.connect(dbConfig);
    const result = await pool.request().query(`
      SELECT 
        SanPham.*, 
        LoaiSanPham.tenLoai,
        ThuongHieu.tenThuongHieu
      FROM SanPham
      INNER JOIN LoaiSanPham ON SanPham.maLoaiSanPham = LoaiSanPham.maLoai
      INNER JOIN ThuongHieu ON SanPham.maThuongHieu = ThuongHieu.maThuongHieu
    `);
    res.json(result.recordset);
  } catch (err) {
    console.error("Error fetching products:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});
// API để xóa sản phẩm
app.delete("/api/products/:id", async (req, res) => {
  const productId = req.params.id;

  try {
    const pool = await sql.connect(dbConfig);
    const result = await pool
      .request()
      .input("productId", sql.Int, productId)
      .query("DELETE FROM SanPham WHERE maSanPham = @productId");

    if (result.rowsAffected[0] > 0) {
      res.json({ success: true });
    } else {
      res.status(404).json({ error: "Product not found" });
    }
  } catch (err) {
    console.error("Error deleting product:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});
// API để lấy danh mục
app.get("/api/categories", async (req, res) => {
  try {
    const pool = await sql.connect(dbConfig);
    const result = await pool.request().query("SELECT * FROM LoaiSanPham");
    res.json(result.recordset);
  } catch (err) {
    console.error("Error fetching categories:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// API để lấy thương hiệu
app.get("/api/brands", async (req, res) => {
  try {
    const pool = await sql.connect(dbConfig);
    const result = await pool.request().query("SELECT * FROM ThuongHieu");
    res.json(result.recordset);
  } catch (err) {
    console.error("Error fetching brands:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// API để lấy thông tin sản phẩm theo ID
app.get("/api/products/:id", async (req, res) => {
  const productId = req.params.id;

  try {
    const pool = await sql.connect(dbConfig);
    const result = await pool
      .request()
      .input("productId", sql.Int, productId)
      .query("SELECT * FROM SanPham WHERE maSanPham = @productId");

    if (result.recordset.length > 0) {
      res.json(result.recordset[0]);
    } else {
      res.status(404).json({ error: "Product not found" });
    }
  } catch (err) {
    console.error("Error fetching product:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// API để tạo/cập nhật sản phẩm
app.post("/api/products", async (req, res) => {
  const productData = req.body;

  try {
    const pool = await sql.connect(dbConfig);
    const result = await pool
      .request()
      .input("tenSanPham", sql.NVarChar, productData.tenSanPham)
      .input("maLoaiSanPham", sql.Int, productData.maLoaiSanPham)
      .input("maThuongHieu", sql.Int, productData.maThuongHieu)
      .input("giaBan", sql.Decimal, productData.giaBan)
      .input("hinhAnh", sql.NVarChar, productData.hinhAnh)
      .input("moTa", sql.NText, productData.moTa).query(`
        INSERT INTO SanPham (
          tenSanPham, 
          maLoaiSanPham, 
          maThuongHieu, 
          giaBan, 
          hinhAnh, 
          moTa
        )
        VALUES (
          @tenSanPham, 
          @maLoaiSanPham, 
          @maThuongHieu, 
          @giaBan, 
          @hinhAnh, 
          @moTa
        );
        SELECT SCOPE_IDENTITY() AS newId;
      `);

    res.json({
      success: true,
      newId: result.recordset[0].newId,
    });
  } catch (err) {
    console.error("Error creating product:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.put("/api/products/:id", async (req, res) => {
  const productId = req.params.id;
  const productData = req.body;

  try {
    const pool = await sql.connect(dbConfig);
    await pool
      .request()
      .input("productId", sql.Int, productId)
      .input("tenSanPham", sql.NVarChar, productData.tenSanPham)
      .input("maLoaiSanPham", sql.Int, productData.maLoaiSanPham)
      .input("maThuongHieu", sql.Int, productData.maThuongHieu)
      .input("giaBan", sql.Decimal, productData.giaBan)
      .input("hinhAnh", sql.NVarChar, productData.hinhAnh)
      .input("moTa", sql.NText, productData.moTa).query(`
        UPDATE SanPham SET
          tenSanPham = @tenSanPham,
          maLoaiSanPham = @maLoaiSanPham,
          maThuongHieu = @maThuongHieu,
          giaBan = @giaBan,
          hinhAnh = @hinhAnh,
          moTa = @moTa
        WHERE maSanPham = @productId
      `);

    res.json({ success: true });
  } catch (err) {
    console.error("Error updating product:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});
app.post("/api/update-profile", async (req, res) => {
  const { userId, fullname, phone, date_of_birth, gender } = req.body;

  try {
    const pool = await sql.connect(dbConfig);
    await pool
      .request()
      .input("userId", sql.Int, userId)
      .input("fullname", sql.NVarChar, fullname)
      .input("phone", sql.NVarChar, phone)
      .input("date_of_birth", sql.Date, date_of_birth)
      .input("gender", sql.NVarChar, gender).query(`
        UPDATE NguoiDung SET
          hoTen = @fullname,
          soDienThoai = @phone,
          ngaySinh = @date_of_birth,
          gioiTinh = @gender
        WHERE maNguoiDung = @userId
      `);

    res.json({ success: true });
  } catch (err) {
    console.error("Update profile error:", err);
    res
      .status(500)
      .json({ success: false, message: "Lỗi khi cập nhật thông tin" });
  }
});
// API để lấy thông tin sản phẩm theo ID
app.get("/api/products/:id", async (req, res) => {
  const productId = req.params.id;

  try {
    const pool = await sql.connect(dbConfig);
    const result = await pool
      .request()
      .input("productId", sql.Int, productId)
      .query("SELECT * FROM SanPham WHERE maSanPham = @productId");

    if (result.recordset.length > 0) {
      res.json(result.recordset[0]);
    } else {
      res.status(404).json({ error: "Product not found" });
    }
  } catch (err) {
    console.error("Error fetching product:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// API để lấy sản phẩm liên quan
app.get("/api/related-products", async (req, res) => {
  const category = req.query.category;
  const brand = req.query.brand;
  const limit = parseInt(req.query.limit) || 4;

  try {
    const pool = await sql.connect(dbConfig);
    let query = `
      SELECT TOP ${limit} * 
      FROM SanPham 
      WHERE maLoaiSanPham = @category 
        AND maThuongHieu = @brand 
        AND maSanPham != @currentProduct
      ORDER BY NEWID()
    `;

    const result = await pool
      .request()
      .input("category", sql.Int, category)
      .input("brand", sql.Int, brand)
      .input("currentProduct", sql.Int, req.query.exclude || 0)
      .query(query);

    // If we don't have enough related products, get more from the same category
    if (result.recordset.length < limit) {
      const additional = await pool
        .request()
        .input("category", sql.Int, category)
        .input("limit", sql.Int, limit - result.recordset.length).query(`
          SELECT TOP ${limit - result.recordset.length} * 
          FROM SanPham 
          WHERE maLoaiSanPham = @category 
            AND maSanPham NOT IN (${
              result.recordset.map((p) => p.maSanPham).join(",") || "0"
            })
          ORDER BY NEWID()
        `);

      result.recordset = [...result.recordset, ...additional.recordset];
    }

    res.json(result.recordset);
  } catch (err) {
    console.error("Error fetching related products:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});
app.get("/api/products", async (req, res) => {
  try {
    const sortValue = req.query.sort;
    let orderBy = "ORDER BY SanPham.maSanPham DESC";

    if (sortValue) {
      switch (sortValue) {
        case "price-asc":
          orderBy = "ORDER BY giaBan ASC";
          break;
        case "price-desc":
          orderBy = "ORDER BY giaBan DESC";
          break;
        case "name-asc":
          orderBy = "ORDER BY tenSanPham ASC";
          break;
        case "name-desc":
          orderBy = "ORDER BY tenSanPham DESC";
          break;
        case "newest":
          orderBy = "ORDER BY ngayThem DESC";
          break;
        case "bestseller":
          orderBy = "ORDER BY soLuongDaBan DESC";
          break;
      }
    }

    const query = `
      SELECT SanPham.*, 
        LoaiSanPham.tenLoai,
        ThuongHieu.tenThuongHieu
      FROM SanPham
      INNER JOIN LoaiSanPham ON SanPham.maLoaiSanPham = LoaiSanPham.maLoai
      INNER JOIN ThuongHieu ON SanPham.maThuongHieu = ThuongHieu.maThuongHieu
      ${orderBy}
    `;

    const result = await pool.request().query(query);
    res.json(result.recordset);
  } catch (err) {
    console.error("Error fetching products:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.post("/register", async (req, res) => {
  // Đổi tên biến cho đồng bộ với client
  const { username, email, password, phone_number, address } = req.body;

  // Kiểm tra dữ liệu đầu vào
  if (!username || !email || !password || !phone_number || !address) {
    return res.status(400).json({ message: "Vui lòng điền đầy đủ thông tin." });
  }

  try {
    const request = pool.request();
    const result = await request.query`
      INSERT INTO NguoiDung (hoTen, email, matKhau, soDienThoai, diaChi, ngayTao)
      VALUES (${username}, ${email}, ${password}, ${phone_number}, ${address}, GETDATE());
      SELECT SCOPE_IDENTITY() AS user_id;
    `;
    res.status(200).json({
      message: "Đăng ký thành công.",
      user_id: result.recordset[0].user_id,
    });
  } catch (err) {
    console.error("Registration error:", err);
    res.status(500).json({ message: "Đăng ký thất bại." });
  }
});

app.post("/login", async (req, res) => {
  const { username, password } = req.body;

  try {
    // Sửa lại kết nối pool
    const poolInstance = await sql.connect(dbConfig);

    // Kiểm tra admin
    const adminResult = await poolInstance.request().query`
      SELECT maAdmin AS id, tenDangNhap AS username FROM Admin
      WHERE tenDangNhap = ${username} AND matKhau = ${password}`;

    if (adminResult.recordset.length > 0) {
      return res.json({
        success: true,
        role: "admin",
        user: adminResult.recordset[0],
      });
    }

    // Sửa lại truy vấn người dùng - tạm thời chỉ lấy các trường cơ bản
    const userResult = await poolInstance.request().query`
      SELECT 
        maNguoiDung AS id, 
        hoTen AS username,
        email,
        soDienThoai AS phone_number
      FROM NguoiDung
      WHERE (hoTen = ${username} OR email = ${username}) 
        AND matKhau = ${password}`;

    if (userResult.recordset.length > 0) {
      return res.json({
        success: true,
        role: "user",
        user: userResult.recordset[0],
      });
    }

    res
      .status(401)
      .json({ success: false, message: "Sai thông tin đăng nhập" });
  } catch (err) {
    console.error("Login error:", err);
    res
      .status(500)
      .json({ success: false, message: "Lỗi server: " + err.message });
  }
});

async function hasColumn(columnName) {
  return false;
}
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
//Thêm bộ đếm thời gian để theo dõi thời gian hoạt động của server
setInterval(() => {
  console.log(
    `Server has been running for ${Math.floor(process.uptime())} seconds`
  );
}, 10000);
//Thêm link và cổng kết nối mỗi 10 giây
setInterval(() => {
  console.log(`Server is listening on http://localhost:${PORT}`);
}, 10000);
