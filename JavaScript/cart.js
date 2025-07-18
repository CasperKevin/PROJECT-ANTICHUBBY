// ====================
// GLOBAL VARIABLES
// ====================
let cart = JSON.parse(localStorage.getItem("cart")) || [];

// ====================
// DOM ELEMENTS
// ====================
const cartTable = document.getElementById("cart_items");
const summaryRows = document.querySelectorAll(".summary-row span:last-child");
const checkoutBtn = document.querySelector(".checkout-btn");

// ====================
// CORE FUNCTIONS
// ====================
function initCart() {
  renderCartTable();
  updateCartCount();
  setupCartEvents();
}

function getCart() {
  return JSON.parse(localStorage.getItem("cart")) || [];
}

function saveCart(cart) {
  localStorage.setItem("cart", JSON.stringify(cart));
  updateCartCount();
  // Kích hoạt sự kiện để các tab khác cập nhật
  window.dispatchEvent(new Event("storage"));
}

function formatPrice(price) {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(price);
}

// ====================
// RENDER CART
// ====================
function renderCartTable() {
  if (!cartTable) return;

  cart = getCart();
  cartTable.innerHTML = "";

  if (cart.length === 0) {
    cartTable.innerHTML = `
      <tr>
        <td colspan="7" class="empty-cart">
          <i class="fas fa-shopping-cart"></i>
          <p>Giỏ hàng trống!</p>
          <a href="products.html" class="btn">Mua sắm ngay</a>
        </td>
      </tr>
    `;
    summaryRows.forEach((el) => (el.textContent = formatPrice(0)));
    checkoutBtn.style.display = "none";
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
        <input 
          type="number" 
          value="${item.quantity}" 
          min="1" 
          data-id="${item.id}" 
          class="update-qty"
        >
      </td>
      <td>${formatPrice(itemTotal)}</td>
      <td>
        <button data-id="${item.id}" class="btn update-btn">
          <i class="fas fa-sync-alt"></i>
        </button>
      </td>
      <td>
        <button data-id="${item.id}" class="btn remove-btn">
          <i class="fas fa-trash"></i>
        </button>
      </td>
    `;
    cartTable.appendChild(row);
  });

  // Tính tổng đơn hàng
  const shipping = 30000;
  const discount = 0;
  const total = subtotal + shipping - discount;

  summaryRows[0].textContent = formatPrice(subtotal);
  summaryRows[1].textContent = formatPrice(shipping);
  summaryRows[2].textContent = formatPrice(discount);
  summaryRows[3].textContent = formatPrice(total);
  checkoutBtn.style.display = "block";
}

// ====================
// EVENT HANDLERS
// ====================
function setupCartEvents() {
  // Xóa sản phẩm
  document.addEventListener("click", (e) => {
    if (e.target.closest(".remove-btn")) {
      const id = parseInt(e.target.closest(".remove-btn").dataset.id);
      cart = cart.filter((item) => item.id !== id);
      saveCart(cart);
      renderCartTable();
      showNotification("Đã xóa sản phẩm!", "success");
    }

    // Cập nhật số lượng
    if (e.target.closest(".update-btn")) {
      const id = parseInt(e.target.closest(".update-btn").dataset.id);
      const qtyInput = document.querySelector(`.update-qty[data-id="${id}"]`);
      const newQty = parseInt(qtyInput.value);

      if (isNaN(newQty) || newQty < 1) {
        showNotification("Số lượng không hợp lệ!", "error");
        qtyInput.value = 1;
        return;
      }

      const item = cart.find((item) => item.id === id);
      if (item) item.quantity = newQty;
      saveCart(cart);
      renderCartTable();
      showNotification("Đã cập nhật số lượng!", "success");
    }
  });

  // Cập nhật giỏ hàng khi có thay đổi từ trang khác
  window.addEventListener("storage", () => {
    cart = JSON.parse(localStorage.getItem("cart")) || [];
    renderCartTable();
  });
}

// ====================
// UTILITIES
// ====================
function updateCartCount() {
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  document.querySelectorAll(".cart-count").forEach((el) => {
    el.textContent = totalItems;
  });
}

function showNotification(message, type) {
  const notification = document.createElement("div");
  notification.className = `notification ${type}`;
  notification.innerHTML = `
    <i class="fas fa-${type === "success" ? "check" : "exclamation"}"></i>
    ${message}
  `;
  document.body.appendChild(notification);

  setTimeout(() => notification.classList.add("show"), 10);
  setTimeout(() => {
    notification.classList.remove("show");
    setTimeout(() => notification.remove(), 300);
  }, 3000);
}

// ====================
// INITIALIZE
// ====================
document.addEventListener("DOMContentLoaded", initCart);
