const viewButtons = document.querySelectorAll(".view-btn");
const productsList = document.querySelector(".products-list");
viewButtons.forEach((button) => {
  button.addEventListener("click", () => {
    viewButtons.forEach((btn) => btn.classList.remove("active"));
    button.classList.add("active");
    const view = button.getAttribute("data-view");
    productsList.className = `products-list ${view}-view`;
  });
});
//Sorting functionality
const sortingSelect = document.querySelector(".sorting select");

if (sortingSelect && productsList) {
  sortingSelect.addEventListener("change", (e) => {
    const value = e.target.value;
    const products = Array.from(productsList.children);

    products.sort((a, b) => {
      const getPrice = (el) => {
        const text = el.querySelector(".price")?.textContent || "0";
        return parseInt(text.replace(/[^\d]/g, "")) || 0;
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

    requestAnimationFrame(() => {
      productsList.innerHTML = "";
      products.forEach((product) => {
        productsList.appendChild(product);
      });
    });
  });
}
const priceRange = document.getElementById("priceRange");
const rangeValue = document.getElementById("rangeValue");
if (priceRange && rangeValue) {
  priceRange.addEventListener("input", (e) => {
    const value = e.target.value;
    rangeValue.textContent = `${value.toLocaleString()}đ`;
  });
}
// Filter functionality
const filterBtn = document.querySelector(".filter-btn");
const resetBtn = document.querySelector(".reset-btn");
const checkboxes = document.querySelectorAll(".checkbox-list input");
if (filterBtn && resetBtn && checkboxes) {
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
function getCart() {
  return JSON.parse(localStorage.getItem("cart")) || [];
}

function saveCart(cart) {
  localStorage.setItem("cart", JSON.stringify(cart));
}

function addToCart(product) {
  const cart = getCart();
  const existing = cart.find((p) => p.id === product.id);
  if (existing) {
    existing.quantity += 1;
  } else {
    product.quantity = 1;
    cart.push(product);
  }

  saveCart(cart);
  alert(`${product.name} đã được thêm vào giỏ hàng!`);
}

document.querySelectorAll(".add-to-cart").forEach((btn) => {
  btn.addEventListener("click", () => {
    const product = {
      id: parseInt(btn.dataset.id),
      name: btn.dataset.name,
      price: parseInt(btn.dataset.price),
      image: btn.dataset.image,
    };
    addToCart(product);
  });
});
