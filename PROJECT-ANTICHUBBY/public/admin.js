app.post("/admin/login", async (req, res) => {
  const { username, password } = req.body;
  try {
    await sql.connect({
      server: "localhost\\SQLEXPRESS",
      database: "CuaHangGundam",
      options: {
        trustedConnection: true,
        driver: "msnodesqlv8",
        instanceName: "SQLEXPRESS",
      },
    });
    const result = await sql.query`
      SELECT maAdmin AS admin_id, tenDangNhap AS username 
      FROM Admin 
      WHERE tenDangNhap = ${username} AND matKhau = ${password}`;

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
