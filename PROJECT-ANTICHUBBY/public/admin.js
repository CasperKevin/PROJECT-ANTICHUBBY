// Sửa tên cột cho khớp cấu trúc bảng
app.post("/admin/login", async (req, res) => {
  const { username, password } = req.body;
  try {
    await sql.connect(dbConfig);
    const result = await sql.query`
      SELECT admin_id, username 
      FROM Admin 
      WHERE username = ${username} AND password = ${password}`;

    if (result.recordset.length > 0) {
      res.status(200).json({ success: true, admin: result.recordset[0] });
    } else {
      res
        .status(401)
        .json({ success: false, message: "Sai thông tin quản trị viên" });
    }
  } catch (err) {
    console.error("Admin login error:", err);
    res.status(500).json({ message: "Lỗi server" });
  }
});
