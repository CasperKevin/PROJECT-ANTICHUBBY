const form = document.getElementById("registerForm");
form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const user = {
    username: form.username.value.trim(),
    email: form.email.value.trim(),
    password: form.password.value,
    date_of_birth: form.date_of_birth.value,
    address: form.address.value.trim(),
    phone_number: form.phone_number.value.trim(),
    user_rank: form.user_rank.value,
  };

  if (user.password !== form.confirmPassword.value) {
    alert("Mật khẩu xác nhận không khớp.");
    return;
  }

  try {
    const res = await fetch("/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(user),
    });
    const data = await res.json();
    if (res.ok) {
      alert(data.message);
      form.reset();
    } else {
      alert(data.message || "Đăng ký thất bại.");
    }
  } catch (err) {
    console.error(err);
    alert("Lỗi kết nối server.");
  }
});
// Ensure the form is cleared on page load
document.addEventListener("DOMContentLoaded", () => {
  form.reset();
});
