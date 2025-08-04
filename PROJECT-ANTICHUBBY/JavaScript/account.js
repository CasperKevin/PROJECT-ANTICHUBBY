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
  if (logout) {
    logout.addEventListener("click", function (event) {
      event.preventDefault();
      clearCurrentUser();
      window.location.href = "/HTML/index.html";
    });
  }
}
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

// Xử lý ngày sinh (chỉ khi có dữ liệu)
if (user.date_of_birth) {
  const [year, month, day] = user.date_of_birth.split("-");
  const birthDaySelect = document.querySelector('select[name="birth_day"]');
  if (birthDaySelect) birthDaySelect.value = day;
  const birthMonthSelect = document.querySelector('select[name="birth_month"]');
  if (birthMonthSelect) birthMonthSelect.value = String(parseInt(month, 10));
  const birthYearSelect = document.querySelector('select[name="birth_year"]');
  if (birthYearSelect) birthYearSelect.value = year;
}

// Thiết lập giới tính (chỉ khi có dữ liệu)
if (user.gender) {
  const genderValue = CSS.escape(user.gender);
  const genderInput = document.querySelector(
    `input[name="gender"][value="${genderValue}"]`
  );
  if (genderInput) genderInput.checked = true;
} else {
  const accountForm = document.getElementById("accountForm");
  if (accountForm) {
    accountForm.addEventListener("submit", async function (event) {
      event.preventDefault();

      const formData = {
        fullname: document.getElementById("fullname").value,
        phone: document.getElementById("phone").value,
        birth_day: document.querySelector('select[name="birth_day"]').value,
        birth_month: document.querySelector('select[name="birth_month"]').value,
        birth_year: document.querySelector('select[name="birth_year"]').value,
        gender:
          document.querySelector('input[name="gender"]:checked')?.value || "",
      };

      // Tạo ngày sinh dạng YYYY-MM-DD
      const date_of_birth = `${
        formData.birth_year
      }-${formData.birth_month.padStart(2, "0")}-${formData.birth_day.padStart(
        2,
        "0"
      )}`;

      try {
        const response = await fetch("/api/update-profile", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            userId: user.id,
            fullname: formData.fullname,
            phone: formData.phone,
            date_of_birth: date_of_birth,
            gender: formData.gender,
          }),
        });

        const result = await response.json();

        if (result.success) {
          alert("Cập nhật thông tin thành công!");
          // Cập nhật localStorage
          const updatedUser = {
            ...user,
            username: formData.fullname,
            phone_number: formData.phone,
            date_of_birth: date_of_birth,
            gender: formData.gender,
          };
          localStorage.setItem("currentUser", JSON.stringify(updatedUser));

          // Cập nhật sidebar
          if (sidebarName) sidebarName.textContent = formData.fullname;
        } else {
          alert(
            "Cập nhật thất bại: " + (result.message || "Lỗi không xác định")
          );
        }
      } catch (error) {
        console.error("Update error:", error);
        alert("Lỗi khi cập nhật thông tin");
      }
    });
  }
}
