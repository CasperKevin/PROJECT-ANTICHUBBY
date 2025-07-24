// account.js

function getCurrentUser() {
  const user = localStorage.getItem("currentUser");
  return user ? JSON.parse(user) : null;
}

function clearCurrentUser() {
  localStorage.removeItem("currentUser");
  location.reload();
}

const user = getCurrentUser();
const accountContent = document.querySelector(".account-content");
const accountMenu = document.querySelector(".account-menu");
const sidebarName = document.querySelector(".account-info h3");
const sidebarEmail = document.querySelector(".account-info p");
const logoutLink = document.getElementById("logout");

if (!user) {
  // Hiển thị yêu cầu đăng nhập
  accountContent.innerHTML = "<p>Bạn cần đăng nhập để truy cập trang này.</p>";
  accountContent.innerHTML +=
    '<button class="btn" onclick=\'window.location.href="/HTML/login.html"\'>Đăng nhập</button>';
  accountContent.innerHTML +=
    '<button class="btn btn-outline" onclick=\'window.location.href="/HTML/register.html"\'>Đăng ký</button>';
  if (accountMenu) accountMenu.style.display = "none";
} else {
  // Điền thông tin vào form
  const fullnameInput = document.getElementById("fullname");
  if (fullnameInput) {
    fullnameInput.value = user.username || user.name || "";
  }
  const phoneInput = document.getElementById("phone");
  if (phoneInput) {
    phoneInput.value = user.phone_number || "";
  }
  const emailInput = document.getElementById("email");
  if (emailInput) {
    emailInput.value = user.email || "";
  }
  const [year, month, day] = user.date_of_birth.split("-");
  const birthDaySelect = document.querySelector('select[name="birth_day"]');
  if (birthDaySelect) birthDaySelect.value = day;
  const birthMonthSelect = document.querySelector('select[name="birth_month"]');
  if (birthMonthSelect) birthMonthSelect.value = String(parseInt(month, 10));
  const birthYearSelect = document.querySelector('select[name="birth_year"]');
  if (birthYearSelect) birthYearSelect.value = year;
  // Thiết lập giới tính
  if (user.gender) {
    const genderValue = CSS.escape(user.gender);
    const genderInput = document.querySelector(
      `input[name="gender"][value="${genderValue}"]`
    );
    if (genderInput) genderInput.checked = true;
  }
  if (sidebarName) sidebarName.textContent = user.username || user.name || "";
  if (sidebarEmail) sidebarEmail.textContent = user.email || "";
  // Cập nhật sidebar thông tin
  if (sidebarName && (user.username || user.name)) {
    sidebarName.textContent = user.username || user.name || "";
  }
  if (sidebarEmail && user.email) {
    sidebarEmail.textContent = user.email || "";
  }
  // Xử lý đăng xuất
  if (logoutLink) {
    logoutLink.addEventListener("click", function (event) {
      event.preventDefault();
      clearCurrentUser();
    });
  }
}
