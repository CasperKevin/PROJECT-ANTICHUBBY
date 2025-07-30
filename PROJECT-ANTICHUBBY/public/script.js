// Đăng ký tài khoản
const form = document.getElementById("registerForm");
form.addEventListener("submit", async (e) => {
  e.preventDefault();
  const user = {
    username: form.username.value.trim(),
    email: form.email.value.trim(),
    password: form.password.value,
    confirmPassword: form.confirmPassword.value,
    date_of_birth: form.date_of_birth.value,
    address: form.address.value.trim(),
    phone_number: form.phone_number.value.trim(),
    user_rank: form.user_rank.value,
  };

  if (Object.values(user).some((v) => !v))
    return alert("Vui lòng điền đầy đủ thông tin.");
  if (user.password !== user.confirmPassword)
    return alert("Mật khẩu xác nhận không khớp.");

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
      alert(data.message);
    }
  } catch (err) {
    console.error(err);
    alert("Lỗi kết nối server");
  }
});
