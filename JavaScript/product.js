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
