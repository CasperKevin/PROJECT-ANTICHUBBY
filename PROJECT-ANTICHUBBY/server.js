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
  // Triển khai logic kiểm tra cột ở đây
  // Hoặc tạm thời return false nếu chưa triển khai
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
