// ====================
// Global Variables
// ====================
const currentUser = JSON.parse(localStorage.getItem("currentUser")) || null;
let cart = JSON.parse(localStorage.getItem("cart")) || [];
let wishlist = JSON.parse(localStorage.getItem("wishlist")) || [];

// ====================
// DOM Elements
// ====================
const loginBtn = document.getElementById("loginBtn");
const registerBtn = document.getElementById("registerBtn");
const logoutBtn = document.getElementById("logoutBtn");
const loginModal = document.getElementById("loginModal");
const registerModal = document.getElementById("registerModal");
const closeModals = document.querySelectorAll(".close-modal");
const showRegister = document.getElementById("showRegister");
const showLogin = document.getElementById("showLogin");
const authButtons = document.getElementById("authButtons");
const userInfo = document.getElementById("userInfo");
const usernameDisplay = document.getElementById("usernameDisplay");
const cartCount = document.querySelector(".cart-count");
const cartIcon = document.getElementById("cartIcon");

// ====================
// Utility Functions
// ====================
function formatPrice(price) {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(price);
}

function showNotification(message, type = "success") {
  const notification = document.createElement("div");
  notification.className = `notification ${type}`;
  notification.textContent = message;
  document.body.appendChild(notification);

  setTimeout(() => {
    notification.classList.add("show");
  }, 10);

  setTimeout(() => {
    notification.classList.remove("show");
    setTimeout(() => {
      document.body.removeChild(notification);
    }, 300);
  }, 3000);
}

// ====================
// Cart Page Integration
// ====================
function renderCartTable() {
  const cartTable = document.getElementById("cart_items");
  const summaryRows = document.querySelectorAll(".summary-row span:last-child");

  if (!cartTable) return;

  cartTable.innerHTML = "";

  if (cart.length === 0) {
    cartTable.innerHTML = `<tr><td colspan="7" style="text-align:center;">Giỏ hàng trống!</td></tr>`;
    summaryRows.forEach((el) => (el.textContent = "0đ"));
    return;
  }

  let subtotal = 0;

  cart.forEach((item) => {
    const itemTotal = item.price * item.quantity;
    subtotal += itemTotal;

    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${item.name}</td>
      <td><img src="${item.image}" alt="${item.name}" width="80"></td>
      <td>${formatPrice(item.price)}</td>
      <td>
        <input type="number" value="${item.quantity}" min="1" data-id="${
      item.id
    }" class="update-qty">
      </td>
      <td>${formatPrice(itemTotal)}</td>
      <td><button data-id="${
        item.id
      }" class="btn update-btn">Cập nhật</button></td>
      <td><button data-id="${item.id}" class="btn remove-btn">Xóa</button></td>
    `;
    cartTable.appendChild(row);
  });

  const shipping = 30000;
  const discount = 0;
  const total = subtotal + shipping - discount;

  summaryRows[0].textContent = formatPrice(subtotal);
  summaryRows[1].textContent = formatPrice(shipping);
  summaryRows[2].textContent = formatPrice(discount);
  summaryRows[3].textContent = formatPrice(total);
}

document.addEventListener("click", (e) => {
  if (e.target.classList.contains("remove-btn")) {
    const id = parseInt(e.target.dataset.id);
    cart = cart.filter((item) => item.id !== id);
    localStorage.setItem("cart", JSON.stringify(cart));
    renderCartTable();
  }
});

document.addEventListener("click", (e) => {
  if (e.target.classList.contains("update-btn")) {
    const id = parseInt(e.target.dataset.id);
    const qtyInput = document.querySelector(`input[data-id='${id}']`);
    const newQty = parseInt(qtyInput.value);

    if (isNaN(newQty) || newQty <= 0) {
      showNotification("Vui lòng nhập số lượng hợp lệ", "error");
      return;
    }

    const item = cart.find((p) => p.id === id);
    if (item) item.quantity = newQty;
    localStorage.setItem("cart", JSON.stringify(cart));
    renderCartTable();
  }
});

document.addEventListener("DOMContentLoaded", () => {
  checkAuthStatus();
  updateCartCount();

  const cartTable = document.getElementById("cart_items");
  if (cartTable) {
    renderCartTable();
  }
});

window.addEventListener("storage", () => {
  if (document.querySelector(".cart-section")) {
    cart = JSON.parse(localStorage.getItem("cart")) || [];
    renderCartTable();
  }
});
