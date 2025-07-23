let currentUser = null;
function getCurrentUser() {
  const user = localStorage.getItem("currentUser");
  if (user) {
    currentUser = JSON.parse(user);
  }
  return currentUser;
}
function saveCurrentUser(user) {
  currentUser = user;
  localStorage.setItem("currentUser", JSON.stringify(user));
}
function clearCurrentUser() {
  currentUser = null;
  localStorage.removeItem("currentUser");
}
function isLoggedIn() {
  return currentUser !== null;
}
if (!isLoggedIn()) {
  document.querySelector(".account-content").innerHTML =
    "<p>Bạn cần đăng nhập để truy cập trang này.</p>";
  document.querySelector(".account-menu").style.display = "none";
} else {
  const user = getCurrentUser();
  document.querySelector(".account-avatar img").src =
    user.avatar || "https://via.placeholder.com/100x100?text=User";
  document.querySelector(".account-avatar h3").textContent =
    user.fullname || "Nguyễn Văn A";
  document.querySelector(".account-avatar p").textContent = `Thành viên từ: ${
    user.joinDate || "15/10/2022"
  }`;
}
if (!isLoggedIn()) {
  const loginButton = document.createElement("button");
  loginButton.textContent = "Đăng nhập";
  loginButton.className = "btn";
  loginButton.onclick = () => {
    window.location.href = "login.html";
  };

  const registerButton = document.createElement("button");
  registerButton.textContent = "Đăng ký";
  registerButton.className = "btn btn-outline";
  registerButton.onclick = () => {
    window.location.href = "register.html";
  };

  const accountContent = document.querySelector(".account-content");
  accountContent.innerHTML = "<p>Bạn cần đăng nhập để truy cập trang này.</p>";
  accountContent.appendChild(loginButton);
  accountContent.appendChild(registerButton);
}
