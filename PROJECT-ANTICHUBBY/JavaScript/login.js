let users = [];

// 1. Tải dữ liệu user.json (đặt cùng thư mục với login.html)
fetch("/data/user.json")
  .then((res) => res.json())
  .then((data) => {
    users = data;
    document.getElementById("username").disabled = false;
    document.getElementById("password").disabled = false;
    document.querySelector(
      "#login-form button[type='submit']"
    ).disabled = false;
  })
  .catch((err) => console.error("Không tải được user.json:", err));

document
  .querySelector("#login-form")
  .addEventListener("submit", function (event) {
    event.preventDefault();

    const username = document.getElementById("username").value.trim();
    const password = document.getElementById("password").value;
    const msgBox = document.getElementById("message");

    const user = users.find(
      (u) =>
        (u.username === username || u.email === username) &&
        u.password === password
    );

    if (user) {
      localStorage.setItem("currentUser", JSON.stringify(user));

      msgBox.style.color = "green";
      msgBox.textContent = `Chào mừng ${user.username}!`;
      setTimeout(() => {
        window.location.href = "account.html";
      }, 800);
    } else {
      msgBox.style.color = "red";
      msgBox.textContent = "Sai tên đăng nhập hoặc mật khẩu";
    }
  });
