// ====================
// Các hàm dùng chung
// ====================
function getCart() {
  return JSON.parse(localStorage.getItem("cart")) || [];
}

function saveCart(cart) {
  localStorage.setItem("cart", JSON.stringify(cart));
  updateCartCount();
}

function updateCartCount() {
  const cart = getCart();
  const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
  document.querySelectorAll(".cart-count").forEach((el) => {
    el.textContent = totalItems;
  });
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
// Xử lý giỏ hàng
// ====================
function addToCart(product) {
  const cart = getCart();
  const existing = cart.find((p) => p.id === product.id);

  if (existing) {
    existing.quantity += 1;
    showNotification(`Đã cập nhật số lượng ${product.name} trong giỏ hàng!`);
  } else {
    product.quantity = 1;
    cart.push(product);
    showNotification(`${product.name} đã được thêm vào giỏ hàng!`);
  }

  saveCart(cart);
}

// ====================
// Sắp xếp sản phẩm
// ====================
function setupSorting() {
  const sortingSelect = document.querySelector(".sorting select");
  const productsList = document.querySelector(".products-list");

  if (!sortingSelect || !productsList) return;

  sortingSelect.addEventListener("change", (e) => {
    const value = e.target.value;
    const products = Array.from(productsList.children);

    products.sort((a, b) => {
      const getPrice = (el) => {
        const priceText = el.querySelector(".price")?.textContent || "0";
        return parseInt(priceText.replace(/[^\d]/g, "")) || 0;
      };

      switch (value) {
        case "price-asc":
          return getPrice(a) - getPrice(b);
        case "price-desc":
          return getPrice(b) - getPrice(a);
        case "name-asc":
          return a
            .querySelector("h3")
            .textContent.localeCompare(b.querySelector("h3").textContent);
        case "name-desc":
          return b
            .querySelector("h3")
            .textContent.localeCompare(a.querySelector("h3").textContent);
        case "newest":
          return new Date(b.dataset.date || 0) - new Date(a.dataset.date || 0);
        case "bestseller":
          return (
            (parseInt(b.dataset.sales) || 0) - (parseInt(a.dataset.sales) || 0)
          );
        default:
          return 0;
      }
    });

    // Cập nhật lại danh sách sản phẩm
    products.forEach((product) => productsList.appendChild(product));
  });
}

// ====================
// Lọc sản phẩm
// ====================
function setupFiltering() {
  const filterBtn = document.querySelector(".filter-btn");
  const resetBtn = document.querySelector(".reset-btn");
  const checkboxes = document.querySelectorAll(".checkbox-list input");
  const productsList = document.querySelector(".products-list");

  if (!filterBtn || !resetBtn || !checkboxes || !productsList) return;

  filterBtn.addEventListener("click", () => {
    const selectedCategories = Array.from(checkboxes)
      .filter((checkbox) => checkbox.checked)
      .map((checkbox) => checkbox.parentElement.textContent.trim());

    const products = Array.from(productsList.children);
    products.forEach((product) => {
      const productCategory = product
        .querySelector("h3")
        .textContent.toLowerCase();
      const isVisible = selectedCategories.some((category) =>
        productCategory.includes(category.toLowerCase())
      );
      product.style.display = isVisible ? "block" : "none";
    });
  });

  resetBtn.addEventListener("click", () => {
    checkboxes.forEach((checkbox) => (checkbox.checked = true));
    const products = Array.from(productsList.children);
    products.forEach((product) => (product.style.display = "block"));
  });
}

// ====================
// Thay đổi chế độ xem (grid/list)
// ====================
function setupViewMode() {
  const viewButtons = document.querySelectorAll(".view-btn");
  const productsList = document.querySelector(".products-list");

  if (!viewButtons || !productsList) return;

  viewButtons.forEach((button) => {
    button.addEventListener("click", () => {
      viewButtons.forEach((btn) => btn.classList.remove("active"));
      button.classList.add("active");
      const view = button.getAttribute("data-view");
      productsList.className = `products-list ${view}-view`;
    });
  });
}

// ====================
// Xử lý thanh giá
// ====================
function setupPriceRange() {
  const priceRange = document.getElementById("priceRange");
  const rangeValue = document.getElementById("rangeValue");

  if (priceRange && rangeValue) {
    priceRange.addEventListener("input", (e) => {
      const value = e.target.value;
      rangeValue.textContent = `${value.toLocaleString()}đ`;
    });
  }
}

// ====================
// Khởi tạo tất cả chức năng
// ====================
document.addEventListener("DOMContentLoaded", () => {
  // Cập nhật số lượng giỏ hàng khi tải trang
  updateCartCount();

  // Xử lý nút "Thêm vào giỏ"
  document.querySelectorAll(".add-to-cart").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      e.preventDefault();
      const price = parseInt(btn.dataset.price.replace(/[^\d]/g, ""));

      const product = {
        id: parseInt(btn.dataset.id),
        name: btn.dataset.name,
        price: price,
        image: btn.dataset.image,
      };

      addToCart(product);
    });
  });

  // Khởi tạo các chức năng khác
  setupSorting();
  setupFiltering();
  setupViewMode();
  setupPriceRange();
});
