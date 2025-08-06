// Thêm vào giỏ hàng (trong products.html)
document.querySelectorAll(".add-to-cart").forEach((btn) => {
  btn.addEventListener("click", () => {
    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    const product = {
      id: parseInt(btn.dataset.id),
      name: btn.dataset.name,
      price: parseInt(btn.dataset.price.replace(/\D/g, "")),
      image: btn.dataset.image,
      quantity: 1,
    };

    // Kiểm tra sản phẩm đã có trong giỏ chưa
    const existingItem = cart.find((item) => item.id === product.id);
    if (existingItem) {
      existingItem.quantity += 1;
    } else {
      cart.push(product);
    }

    // Lưu giỏ hàng và thông báo
    localStorage.setItem("cart", JSON.stringify(cart));
    window.dispatchEvent(new Event("storage")); // Kích hoạt cập nhật real-time
    alert(`${product.name} đã được thêm vào giỏ hàng!`);
  });
});
// Cập nhật giá trị của thanh trượt giá
const priceRange = document.getElementById("priceRange");
const rangeValue = document.getElementById("rangeValue");
priceRange.addEventListener("input", function () {
  const value = parseInt(priceRange.value).toLocaleString("vi-VN");
  rangeValue.textContent = `${value}đ`;
});
priceRange.dispatchEvent(new Event("input")); // Cập nhật giá trị ban đầu
//Sorting and filtering functionality
const products = document.querySelectorAll(".product-card");
const sortSelect = document.querySelector(".sorting select");
sortSelect.addEventListener("change", function () {
  const sortValue = this.value;
  const sortedProducts = Array.from(products).sort((a, b) => {
    const priceA = parseInt(a.dataset.price);
    const priceB = parseInt(b.dataset.price);
    if (sortValue === "price-asc") return priceA - priceB;
    if (sortValue === "price-desc") return priceB - priceA;
    if (sortValue === "name-asc")
      return a.dataset.name.localeCompare(b.dataset.name);
    if (sortValue === "name-desc")
      return b.dataset.name.localeCompare(a.dataset.name);
    if (sortValue === "newest")
      return new Date(b.dataset.date) - new Date(a.dataset.date);
    if (sortValue === "bestseller") return b.dataset.sales - a.dataset.sales;
    return 0;
  });
  const productsList = document.querySelector(".products-list");
  productsList.innerHTML = "";
  sortedProducts.forEach((product) => productsList.appendChild(product));
});
//View toggle functionality
const viewButtons = document.querySelectorAll(".view-btn");
viewButtons.forEach((button) => {
  button.addEventListener("click", function () {
    viewButtons.forEach((btn) => btn.classList.remove("active"));
    this.classList.add("active");
    const view = this.dataset.view;
    const productsList = document.querySelector(".products-list");
    productsList.className = `products-list ${view}-view`;
    if (view === "list") {
      productsList.classList.add("list-view");
    } else {
      productsList.classList.remove("list-view");
    }
  });
});
document.querySelectorAll(".product-card").forEach((card) => {
  const addToCartBtn = card.querySelector(".add-to-cart");
  const id = parseInt(card.dataset.id);
  const name = card.dataset.name;
  const price = parseInt(card.dataset.price);
  const image = card.dataset.image;
  const sku = card.dataset.rank || "";

  const buyNowBtn = document.createElement("button");
  buyNowBtn.className = "btn buy-now";
  buyNowBtn.textContent = "Mua";
  buyNowBtn.addEventListener("click", () => {
    addToCart({ id, name, price, image, sku });
    window.location.href = "/HTML/checkout.html";
  });

  addToCartBtn.insertAdjacentElement("afterend", buyNowBtn);

  addToCartBtn.addEventListener("click", () => {
    addToCart({ id, name, price, image, sku });
    alert("Đã thêm vào giỏ hàng");
  });
});

function addToCart(product) {
  let cart = JSON.parse(localStorage.getItem("cart")) || [];
  const existing = cart.find((p) => p.id === product.id);

  if (existing) {
    existing.quantity += 1;
  } else {
    cart.push({ ...product, quantity: 1 });
  }

  localStorage.setItem("cart", JSON.stringify(cart));
  updateCartCount();
}

function updateCartCount() {
  let cart = JSON.parse(localStorage.getItem("cart")) || [];
  let total = cart.reduce((sum, item) => sum + item.quantity, 0);
  const countElement = document.querySelector(".cart-count");
  if (countElement) countElement.textContent = total;
}

document.addEventListener("DOMContentLoaded", updateCartCount);
document.addEventListener("DOMContentLoaded", async () => {
  try {
    // Gọi API để lấy sản phẩm
    const response = await fetch("/api/products");
    const products = await response.json();

    renderProducts(products);
    setupEventListeners();
  } catch (error) {
    console.error("Error loading products:", error);
  }
});

function renderProducts(products) {
  const container = document.getElementById("productsContainer");
  container.innerHTML = "";

  products.forEach((product) => {
    const productCard = document.createElement("div");
    productCard.className = "product-card";
    productCard.dataset.id = product.maSanPham;
    productCard.dataset.name = product.tenSanPham;
    productCard.dataset.price = product.giaBan;
    productCard.dataset.image = product.hinhAnh;
    productCard.dataset.rank = product.maLoaiSanPham;
    productCard.dataset.date = product.ngayThem;
    productCard.dataset.sales = product.soLuongDaBan || 0;

    productCard.innerHTML = `
      <a href="/HTML/product-detail.html?id=${product.maSanPham}">
        <img src="${product.hinhAnh}" alt="${product.tenSanPham}">
        <div class="product-info">
          <h3>${product.tenSanPham}</h3>
          <div class="price">${formatPrice(product.giaBan)}</div>
          <button class="btn add-to-cart">Thêm vào giỏ</button>
        </div>
      </a>
    `;

    container.appendChild(productCard);
  });
}

function formatPrice(price) {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(price);
}

function setupEventListeners() {
  // Xử lý sắp xếp
  const sortSelect = document.querySelector(".sorting select");
  sortSelect.addEventListener("change", async function () {
    const sortValue = this.value;
    const response = await fetch(`/api/products?sort=${sortValue}`);
    const sortedProducts = await response.json();
    renderProducts(sortedProducts);
  });

  // Xử lý thêm vào giỏ hàng
  document.querySelectorAll(".add-to-cart").forEach((btn) => {
    btn.addEventListener("click", function (e) {
      e.preventDefault();
      const productCard = this.closest(".product-card");

      const product = {
        id: parseInt(productCard.dataset.id),
        name: productCard.dataset.name,
        price: parseFloat(productCard.dataset.price),
        image: productCard.dataset.image,
        quantity: 1,
      };

      addToCart(product);
      alert(`${product.name} đã được thêm vào giỏ hàng!`);
    });
  });
}
