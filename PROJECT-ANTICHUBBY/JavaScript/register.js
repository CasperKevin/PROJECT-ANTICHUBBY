document
  .getElementById("registerForm")
  .addEventListener("submit", function (e) {
    e.preventDefault();

    const user = {
      username: document.getElementById("username").value,
      email: document.getElementById("email").value,
      password: document.getElementById("password").value,
      date_of_birth: document.getElementById("date_of_birth").value,
      address: document.getElementById("address").value,
      phone_number: document.getElementById("phone_number").value,
      user_rank: document.getElementById("user_rank").value,
    };

    const confirmPassword = document.getElementById("confirmPassword").value;
    if (user.password !== confirmPassword) {
      alert("Mật khẩu xác nhận không khớp.");
      return;
    }

    fetch("/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(user),
    })
      .then((res) => res.json())
      .then((data) => {
        alert(data.message || "Đăng ký thành công!");
        document.getElementById("registerForm").reset();
      })
      .catch((err) => {
        console.error("Lỗi:", err);
        alert("Có lỗi xảy ra. Vui lòng thử lại.");
      });
  });
