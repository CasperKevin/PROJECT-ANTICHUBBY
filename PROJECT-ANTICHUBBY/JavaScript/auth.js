// Sửa lại hàm kiểm tra trạng thái đăng nhập
function checkLoginStatus() {
  const user = localStorage.getItem("currentUser");
  return user ? true : false;
}

// Sửa lại hàm chuyển hướng
function redirectToLogin() {
  if (!checkLoginStatus()) {
    window.location.href = "/HTML/login.html";
  }
}

// Sửa lại hàm chuyển hướng khi đăng ký
function redirectToRegister() {
  if (checkLoginStatus()) {
    window.location.href = "/index.html";
  }
}
function checkUserRole(requiredRole) {
  const user = JSON.parse(localStorage.getItem("currentUser") || {});
  return user.role === requiredRole;
}

// Sử dụng trong các trang admin
function protectAdminPage() {
  if (!checkUserRole("admin")) {
    alert("Bạn không có quyền truy cập trang này");
    window.location.href = "/index.html";
  }
}
