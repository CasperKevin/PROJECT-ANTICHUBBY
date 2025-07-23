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
// Authentication Functions
// ====================
function checkAuthStatus() {
  if (currentUser) {
    authButtons.style.display = "none";
    userInfo.style.display = "flex";
    usernameDisplay.textContent = currentUser.username;
  } else {
    authButtons.style.display = "flex";
    userInfo.style.display = "none";
  }
}

function login(username, password) {
  const users = JSON.parse(localStorage.getItem("users")) || [];
  const user = users.find(
    (u) => u.username === username && u.password === password
  );

  if (user) {
    localStorage.setItem("currentUser", JSON.stringify(user));
    showNotification("Đăng nhập thành công!");
    return true;
  }
  return false;
}

function register(username, email, password) {
  const users = JSON.parse(localStorage.getItem("users")) || [];

  if (users.some((u) => u.username === username)) {
    showNotification("Tên đăng nhập đã tồn tại", "error");
    return false;
  }

  if (users.some((u) => u.email === email)) {
    showNotification("Email đã được đăng ký", "error");
    return false;
  }

  const newUser = {
    id: Date.now(),
    username,
    email,
    password,
  };

  users.push(newUser);
  localStorage.setItem("users", JSON.stringify(users));
  localStorage.setItem("currentUser", JSON.stringify(newUser));
  showNotification("Đăng ký thành công!");
  return true;
}

function logout() {
  localStorage.removeItem("currentUser");
  showNotification("Đã đăng xuất");
}

// ====================
// Cart Functions
// ====================
function addToCart(productId, quantity = 1) {
  const product = products.find((p) => p.id === productId);

  if (!product) return;

  const existingItem = cart.find((item) => item.id === productId);

  if (existingItem) {
    existingItem.quantity += quantity;
  } else {
    cart.push({
      ...product,
      quantity,
    });
  }

  updateCart();
  showNotification(`${product.name} đã được thêm vào giỏ hàng`);
}

function removeFromCart(productId) {
  cart = cart.filter((item) => item.id !== productId);
  updateCart();
}

function updateCartQuantity(productId, quantity) {
  const item = cart.find((item) => item.id === productId);
  if (item) {
    item.quantity = quantity;
    updateCart();
  }
}

function updateCart() {
  localStorage.setItem("cart", JSON.stringify(cart));
  updateCartCount();

  if (document.querySelector(".cart-items")) {
    renderCartItems();
  }
}

function updateCartCount() {
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  cartCount.textContent = totalItems;
}

// ====================
// Wishlist Functions
// ====================
function addToWishlist(productId) {
  const product = products.find((p) => p.id === productId);

  if (!product || wishlist.some((item) => item.id === productId)) return;

  wishlist.push(product);
  updateWishlist();
  showNotification(`${product.name} đã được thêm vào danh sách yêu thích`);
}

function removeFromWishlist(productId) {
  wishlist = wishlist.filter((item) => item.id !== productId);
  updateWishlist();
}

function updateWishlist() {
  localStorage.setItem("wishlist", JSON.stringify(wishlist));

  if (document.querySelector(".wishlist-items")) {
    renderWishlistItems();
  }
}

// ====================
// Render Functions
// ====================
function renderProducts(products, container, type = "grid") {
  if (!container) return;

  container.innerHTML = "";

  if (products.length === 0) {
    container.innerHTML =
      '<p class="empty-message">Không tìm thấy sản phẩm nào.</p>';
    return;
  }

  products.forEach((product) => {
    const productCard = document.createElement("div");
    productCard.className = "product-card";

    const badges = [];
    if (product.isNew)
      badges.push('<span class="product-badge badge-new">Mới</span>');
    if (product.isSale)
      badges.push('<span class="product-badge badge-sale">Giảm giá</span>');
    if (product.isHot)
      badges.push('<span class="product-badge badge-hot">Hot</span>');

    productCard.innerHTML = `
      <div class="product-image">
        <img src="${product.image}" alt="${product.name}">
        ${badges.join("")}
      </div>
      <div class="product-info">
        <h3 class="product-title">${product.name}</h3>
        <div class="product-price">
          ${formatPrice(product.price)}
          ${
            product.originalPrice
              ? `<span class="original-price">${formatPrice(
                  product.originalPrice
                )}</span>`
              : ""
          }
        </div>
        <button class="add-to-cart" data-id="${
          product.id
        }">Thêm vào giỏ</button>
      </div>
    `;

    container.appendChild(productCard);
  });

  // Add event listeners to all add to cart buttons
  document.querySelectorAll(".add-to-cart").forEach((button) => {
    button.addEventListener("click", () => {
      const productId = parseInt(button.dataset.id);
      addToCart(productId);
    });
  });
}

function renderCartItems() {
  const cartItemsContainer = document.querySelector(".cart-items");
  const cartTotalContainer = document.querySelector(".cart-total");

  if (!cartItemsContainer) return;

  cartItemsContainer.innerHTML = "";

  if (cart.length === 0) {
    document.querySelector(".cart-empty").style.display = "block";
    document.querySelector(".cart-content").style.display = "none";
    return;
  }

  document.querySelector(".cart-empty").style.display = "none";
  document.querySelector(".cart-content").style.display = "flex";

  let subtotal = 0;

  cart.forEach((item) => {
    const itemTotal = item.price * item.quantity;
    subtotal += itemTotal;

    const cartItem = document.createElement("div");
    cartItem.className = "cart-item";
    cartItem.innerHTML = `
      <div class="product-info">
        <img src="${item.image}" alt="${item.name}">
        <div class="product-details">
          <h4>${item.name}</h4>
          <p>Mã: ${item.sku}</p>
          <button class="remove-item" data-id="${item.id}">Xóa</button>
        </div>
      </div>
      <div class="product-price">${formatPrice(item.price)}</div>
      <div class="product-quantity">
        <button class="quantity-btn minus" data-id="${item.id}">-</button>
        <input type="number" value="${item.quantity}" min="1">
        <button class="quantity-btn plus" data-id="${item.id}">+</button>
      </div>
      <div class="product-total">${formatPrice(itemTotal)}</div>
    `;

    cartItemsContainer.appendChild(cartItem);
  });

  // Calculate totals
  const shipping = 30000;
  const discount = 0;
  const total = subtotal + shipping - discount;

  // Update summary
  document.querySelector(".subtotal-price").textContent = formatPrice(subtotal);
  document.querySelector(".shipping-price").textContent = formatPrice(shipping);
  document.querySelector(".discount-price").textContent = formatPrice(discount);
  document.querySelector(".total-price").textContent = formatPrice(total);

  // Add event listeners
  document.querySelectorAll(".remove-item").forEach((button) => {
    button.addEventListener("click", () => {
      const productId = parseInt(button.dataset.id);
      removeFromCart(productId);
    });
  });

  document.querySelectorAll(".quantity-btn").forEach((button) => {
    button.addEventListener("click", () => {
      const productId = parseInt(button.dataset.id);
      const input = button.parentElement.querySelector("input");
      let quantity = parseInt(input.value);

      if (button.classList.contains("minus") && quantity > 1) {
        quantity--;
      } else if (button.classList.contains("plus")) {
        quantity++;
      }

      input.value = quantity;
      updateCartQuantity(productId, quantity);
    });
  });

  document.querySelectorAll(".product-quantity input").forEach((input) => {
    input.addEventListener("change", () => {
      const productId = parseInt(
        input.closest(".product-quantity").querySelector(".quantity-btn")
          .dataset.id
      );
      let quantity = parseInt(input.value);

      if (quantity < 1) {
        quantity = 1;
        input.value = 1;
      }

      updateCartQuantity(productId, quantity);
    });
  });
}

function renderWishlistItems() {
  const wishlistContainer = document.querySelector(".wishlist-items");

  if (!wishlistContainer) return;

  wishlistContainer.innerHTML = "";

  if (wishlist.length === 0) {
    document.querySelector(".wishlist-empty").style.display = "block";
    document.querySelector(".wishlist-items").style.display = "none";
    return;
  }

  document.querySelector(".wishlist-empty").style.display = "none";
  document.querySelector(".wishlist-items").style.display = "block";

  const header = document.createElement("div");
  header.className = "wishlist-header";
  header.innerHTML = `
    <h3>Sản phẩm</h3>
    <h3>Giá</h3>
    <h3>Tình trạng</h3>
    <h3>Hành động</h3>
  `;
  wishlistContainer.appendChild(header);

  wishlist.forEach((item) => {
    const wishlistItem = document.createElement("div");
    wishlistItem.className = "wishlist-item";
    wishlistItem.innerHTML = `
      <div class="product-info">
        <img src="${item.image}" alt="${item.name}">
        <div class="product-details">
          <h4>${item.name}</h4>
          <p>Mã: ${item.sku}</p>
          <button class="remove-item" data-id="${item.id}">Xóa</button>
        </div>
      </div>
      <div class="product-price">${formatPrice(item.price)}</div>
      <div class="product-stock in-stock">Còn hàng</div>
      <div class="product-actions">
        <button class="btn add-to-cart" data-id="${
          item.id
        }">Thêm vào giỏ</button>
      </div>
    `;

    wishlistContainer.appendChild(wishlistItem);
  });

  // Add event listeners
  document.querySelectorAll(".wishlist-item .remove-item").forEach((button) => {
    button.addEventListener("click", () => {
      const productId = parseInt(button.dataset.id);
      removeFromWishlist(productId);
    });
  });

  document.querySelectorAll(".wishlist-item .add-to-cart").forEach((button) => {
    button.addEventListener("click", () => {
      const productId = parseInt(button.dataset.id);
      addToCart(productId);
      removeFromWishlist(productId);
    });
  });
}

// ====================
// Event Listeners
// ====================
// Modal toggles
if (loginBtn) {
  loginBtn.addEventListener("click", () => {
    loginModal.style.display = "flex";
  });
}

if (registerBtn) {
  registerBtn.addEventListener("click", () => {
    registerModal.style.display = "flex";
  });
}

if (closeModals) {
  closeModals.forEach((btn) => {
    btn.addEventListener("click", () => {
      loginModal.style.display = "none";
      registerModal.style.display = "none";
    });
  });
}

if (showRegister) {
  showRegister.addEventListener("click", (e) => {
    e.preventDefault();
    loginModal.style.display = "none";
    registerModal.style.display = "flex";
  });
}

if (showLogin) {
  showLogin.addEventListener("click", (e) => {
    e.preventDefault();
    registerModal.style.display = "none";
    loginModal.style.display = "flex";
  });
}

// Close modals when clicking outside
window.addEventListener("click", (e) => {
  if (e.target === loginModal) loginModal.style.display = "none";
  if (e.target === registerModal) registerModal.style.display = "none";
});

// Form submissions
if (document.getElementById("loginForm")) {
  document.getElementById("loginForm").addEventListener("submit", (e) => {
    e.preventDefault();
    const username = document.getElementById("loginUsername").value;
    const password = document.getElementById("loginPassword").value;

    if (login(username, password)) {
      loginModal.style.display = "none";
      checkAuthStatus();
      location.reload();
    } else {
      showNotification("Tên đăng nhập hoặc mật khẩu không đúng", "error");
    }
  });
}

if (document.getElementById("registerForm")) {
  document.getElementById("registerForm").addEventListener("submit", (e) => {
    e.preventDefault();
    const username = document.getElementById("registerUsername").value;
    const email = document.getElementById("registerEmail").value;
    const password = document.getElementById("registerPassword").value;
    const confirmPassword = document.getElementById("registerConfirm").value;

    if (password !== confirmPassword) {
      showNotification("Mật khẩu không khớp", "error");
      return;
    }

    if (register(username, email, password)) {
      registerModal.style.display = "none";
      checkAuthStatus();
      location.reload();
    }
  });
}

if (logoutBtn) {
  logoutBtn.addEventListener("click", () => {
    logout();
    checkAuthStatus();
    location.reload();
  });
}

if (cartIcon) {
  cartIcon.addEventListener("click", () => {
    if (cart.length === 0) {
      showNotification("Giỏ hàng của bạn đang trống", "info");
    } else {
      window.location.href = "cart.html";
    }
  });
}

// ====================
// Page Specific Initialization
// ====================
document.addEventListener("DOMContentLoaded", () => {
  checkAuthStatus();
  updateCartCount();

  // Initialize cart page
  if (document.querySelector(".cart-section")) {
    renderCartItems();
  }

  // Initialize wishlist page
  if (document.querySelector(".wishlist-section")) {
    renderWishlistItems();
  }

  // Initialize category page
  if (document.querySelector(".category-section")) {
    const urlParams = new URLSearchParams(window.location.search);
    const type = urlParams.get("type");

    if (type) {
      const filteredProducts = products.filter((p) => p.category === type);
      const container = document.querySelector(".products-grid");

      document.getElementById("categoryTitle").textContent =
        getCategoryName(type);
      document.getElementById("categoryDescription").textContent =
        getCategoryDescription(type);

      // Set banner based on category
      const banner = document.getElementById("categoryBanner");
      banner.style.backgroundImage = `url('${getCategoryBanner(type)}')`;
      banner.innerHTML = `
        <h2>${getCategoryName(type)}</h2>
        <p>${getCategoryDescription(type)}</p>
      `;

      renderProducts(filteredProducts, container);
    }
  }

  // Initialize policy tabs
  if (document.querySelector(".policy-tabs")) {
    const tabs = document.querySelectorAll(".policy-tab");
    const tabContents = document.querySelectorAll(".tab-content");

    tabs.forEach((tab) => {
      tab.addEventListener("click", () => {
        tabs.forEach((t) => t.classList.remove("active"));
        tabContents.forEach((c) => c.classList.remove("active"));

        tab.classList.add("active");
        document.getElementById(tab.dataset.tab).classList.add("active");
      });
    });
  }
});

// ====================
// Helper Functions
// ====================
// ...existing code...
function getCategoryName(type) {
  const names = {
    hg: "High Grade (HG)",
    rg: "Real Grade (RG)",
    mg: "Master Grade (MG)",
    pg: "Perfect Grade (PG)",
  };
  return names[type] || "Danh Mục Sản Phẩm";
}
// ...existing code...

function getCategoryDescription(type) {
  const descriptions = {
    hg: "Các mẫu High Grade 1/144 với giá thành hợp lý",
    rg: "Các mẫu Real Grade 1/144 chi tiết cao",
    mg: "Các mẫu Master Grade 1/100 hoàn hảo",
    pg: "Các mẫu Perfect Grade 1/60 đỉnh cao",
  };
  return descriptions[type] || "Các sản phẩm chất lượng từ Bandai";
}

function getCategoryBanner(type) {
  const banners = {
    hg: "https://via.placeholder.com/1200x400?text=High+Grade+Collection",
    rg: "https://via.placeholder.com/1200x400?text=Real+Grade+Collection",
    mg: "https://via.placeholder.com/1200x400?text=Master+Grade+Collection",
    pg: "https://via.placeholder.com/1200x400?text=Perfect+Grade+Collection",
  };
  return (
    banners[type] ||
    "https://via.placeholder.com/1200x400?text=Gundam+Collection"
  );
}
function editAddress() {
  document.getElementById("addressModal").style.display = "block";
}

function closeModal() {
  document.getElementById("addressModal").style.display = "none";
}

function saveAddress() {
  const name = document.getElementById("nameInput").value;
  const phone = document.getElementById("phoneInput").value;
  const address = document.getElementById("addressInput").value;

  // Cập nhật nội dung tạm thời (chưa lưu thực tế)
  const box = document.querySelector(".address-box");
  box.innerHTML = `
    <p><strong>Tên:</strong> ${name}</p>
    <p><strong>Số điện thoại:</strong> ${phone}</p>
    <p><strong>Địa chỉ:</strong> ${address}</p>
    <button onclick="editAddress()">Chỉnh sửa</button>
  `;

  closeModal();
}
// ====================
// Address Modal Functions
// ====================
function editAddress() {
  const modal = document.getElementById("addressModal");
  if (modal) modal.style.display = "flex";
}

function closeModal() {
  const modal = document.getElementById("addressModal");
  if (modal) modal.style.display = "none";
}

function saveAddress() {
  const name = document.getElementById("nameInput").value;
  const phone = document.getElementById("phoneInput").value;
  const address = document.getElementById("addressInput").value;

  const box = document.querySelector(".address-box");
  if (box) {
    box.innerHTML = `
            <p><strong>Tên:</strong> ${name}</p>
            <p><strong>Số điện thoại:</strong> ${phone}</p>
            <p><strong>Địa chỉ:</strong> ${address}</p>
            <button onclick="editAddress()">Chỉnh sửa</button>
        `;
    closeModal();
  }
}

// ====================
// Change Password Page
// ====================
document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("changePassForm");
  if (form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      const newPass = form.new.value;
      const confirm = form.confirm.value;
      const message = document.getElementById("message");

      if (newPass !== confirm) {
        message.style.color = "red";
        message.textContent = "Mật khẩu xác nhận không khớp.";
      } else {
        message.style.color = "green";
        message.textContent = "Đổi mật khẩu thành công! (giả lập)";
      }
    });
  }
});
