const loginForm = document.getElementById("loginForm");
const msgBox = document.getElementById("message");
loginForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const payload = {
    username: loginForm.username.value.trim(),
    password: loginForm.password.value,
  };
  try {
    const res = await fetch("/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const data = await res.json();
    if (res.ok && data.success) {
      localStorage.setItem("currentUser", JSON.stringify(data.user));
      msgBox.style.color = "green";
      msgBox.textContent = `Chào mừng ${data.user.username}!`;
      setTimeout(() => (window.location.href = "account.html"), 800);
    } else {
      throw new Error(data.message || "Đăng nhập thất bại.");
    }
  } catch (err) {
    console.error(err);
    msgBox.style.color = "red";
    msgBox.textContent = err.message;
  }
});
// Ensure the message box is cleared on page load
document.addEventListener("DOMContentLoaded", () => {
  msgBox.textContent = "";
});
