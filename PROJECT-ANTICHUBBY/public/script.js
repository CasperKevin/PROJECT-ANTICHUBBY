const form = document.getElementById("registerForm");
form.addEventListener("submit", async (e) => {
  e.preventDefault();

  // Kiểm tra các trường bắt buộc
  if (
    !form.username.value.trim() ||
    !form.email.value.trim() ||
    !form.password.value ||
    !form.confirmPassword.value ||
    !form.date_of_birth.value ||
    !form.address.value.trim() ||
    !form.phone_number.value.trim() ||
    !form.user_rank.value
  ) {
    alert("Vui lòng điền đầy đủ thông tin.");
    return;
  }

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
    // Gửi dữ liệu đăng ký lên server để lưu vào database
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
