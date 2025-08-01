const form =
  document.getElementById("loginForm") || document.querySelector("form");
if (form) {
  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const username = document.getElementById("username").value.trim();
    const password = document.getElementById("password").value;

    if (!username || !password) return alert("Vui lòng điền đầy đủ thông tin!");

    try {
      const res = await fetch("/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      // Xử lý response không thành công
      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(`Lỗi server: ${res.status} - ${errorText}`);
      }

      const data = await res.json();

      if (data.success) {
        localStorage.setItem("currentUser", JSON.stringify(data.user));
        if (data.role === "admin") {
          window.location.href = "/HTML/manager.html";
        } else {
          window.location.href = "/HTML/account.html";
        }
      } else {
        alert(data.message || "Đăng nhập thất bại");
      }
    } catch (err) {
      console.error("Login error:", err);
      alert(err.message || "Lỗi kết nối máy chủ");
    }
  });
}
