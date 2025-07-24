const express = require("express");
const fs = require("fs");
const path = require("path");
const cors = require("cors");
const bodyParser = require("body-parser");

const app = express();
const PORT = 5500;
const DATA_PATH = path.join(__dirname, "user.json");

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(express.static(__dirname));

// API: Ghi người dùng mới vào user.json
app.post("/register", (req, res) => {
  const newUser = req.body;

  fs.readFile(DATA_PATH, "utf-8", (err, data) => {
    if (err) return res.status(500).send("Lỗi đọc file!");

    let users = [];
    try {
      users = JSON.parse(data);
    } catch {
      return res.status(500).send("Lỗi phân tích JSON!");
    }

    newUser.user_id =
      users.length > 0 ? users[users.length - 1].user_id + 1 : 1;
    users.push(newUser);

    fs.writeFile(DATA_PATH, JSON.stringify(users, null, 2), (err) => {
      if (err) return res.status(500).send("Lỗi ghi file!");
      res.status(200).json({ message: "Đăng ký thành công!" });
    });
  });
});

app.listen(PORT, () => {
  console.log(` Server đang chạy tại http://localhost:${PORT}`);
});
