const express = require("express");
const fs = require("fs");
const path = require("path");

const router = express.Router();
const ADMIN_PATH = path.join(__dirname, "../admin.json");

router.post("/login", (req, res) => {
  const { username, password } = req.body;
  fs.readFile(ADMIN_PATH, "utf-8", (err, data) => {
    if (err)
      return res.status(500).json({ success: false, message: "Server error" });
    let admins = [];
    try {
      admins = JSON.parse(data);
    } catch {
      return res
        .status(500)
        .json({ success: false, message: "Invalid admin data" });
    }
    const admin = admins.find(
      (a) =>
        (a.username === username || a.email === username) &&
        a.password === password
    );
    if (!admin) {
      return res
        .status(401)
        .json({ success: false, message: "Invalid credentials" });
    }
    const { password: _, ...safeAdmin } = admin;
    res.json({ success: true, admin: safeAdmin });
  });
});

module.exports = router;
