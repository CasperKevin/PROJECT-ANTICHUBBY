async function loginAdmin(username, password) {
  try {
    const res = await fetch("/admin/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });
    const data = await res.json();
    if (data.success) {
      alert("Đăng nhập admin thành công!");
      localStorage.setItem("admin", JSON.stringify(data.admin));
      window.location.href = "/HTML/manager.html";
    } else {
      alert(data.message);
    }
  } catch (err) {
    console.error(err);
    alert("Không thể kết nối đến máy chủ");
  }
}
