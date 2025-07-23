//Kiem tra trang thai dang nhap
function checkLoginStatus() {
  const token = localStorage.getItem("token");
  if (token) {
    return true;
  } else {
    return false;
  }
}
//Khi chuyen huong toi trang dang nhap neu chua dang nhap
function redirectToLogin() {
  if (!checkLoginStatus()) {
    window.location.href = "login.html";
  }
}
//Khi chuyen huong toi trang dang ky neu da dang nhap
function redirectToRegister() {
  if (checkLoginStatus()) {
    window.location.href = "index.html";
  }
}
