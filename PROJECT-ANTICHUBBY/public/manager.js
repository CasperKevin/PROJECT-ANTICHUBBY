// manager.js
document.addEventListener("DOMContentLoaded", async () => {
  const productsContainer = document.querySelector(".products-list");

  try {
    const response = await fetch("/api/products");
    const products = await response.json();

    renderProducts(products);
  } catch (error) {
    console.error("Error loading products:", error);
    productsContainer.innerHTML = "<p>Đã xảy ra lỗi khi tải sản phẩm</p>";
  }

  function renderProducts(products) {
    productsContainer.innerHTML = "";

    products.forEach((product) => {
      const productCard = document.createElement("div");
      productCard.className = "product-card";
      productCard.dataset.id = product.maSanPham;
      productCard.dataset.name = product.tenSanPham;
      productCard.dataset.price = product.giaBan;
      productCard.dataset.image = product.hinhAnh;
      productCard.dataset.rank = product.tenLoai;
      productCard.dataset.tag = product.tenThuongHieu;

      productCard.innerHTML = `
        <img src="${product.hinhAnh}" alt="${product.tenSanPham}" />
        <h3><a href="#">${product.tenSanPham}</a></h3>
        <div class="price">${formatPrice(product.giaBan)}</div>
        <div class="product-buttons">
          <button class="btn edit-product">Sửa</button>
          <button class="btn delete-product">Xóa</button>
        </div>
      `;

      productsContainer.appendChild(productCard);
    });

    attachEventListeners();
  }

  function formatPrice(price) {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);
  }

  function attachEventListeners() {
    document.querySelectorAll(".edit-product").forEach((button) => {
      button.addEventListener("click", function () {
        const productCard = this.closest(".product-card");
        const productId = productCard.dataset.id;
        editProduct(productId);
      });
    });

    document.querySelectorAll(".delete-product").forEach((button) => {
      button.addEventListener("click", function () {
        const productCard = this.closest(".product-card");
        const productId = productCard.dataset.id;
        if (confirm("Bạn có chắc chắn muốn xóa sản phẩm này?")) {
          deleteProduct(productId, productCard);
        }
      });
    });
  }

  async function editProduct(productId) {
    window.location.href = `/HTML/edit-product.html?id=${productId}`;
  }

  async function deleteProduct(productId, productElement) {
    try {
      const response = await fetch(`/api/products/${productId}`, {
        method: "DELETE",
      });

      if (response.ok) {
        productElement.remove();
        alert("Sản phẩm đã được xóa thành công!");
      } else {
        alert("Xóa sản phẩm thất bại");
      }
    } catch (error) {
      console.error("Error deleting product:", error);
      alert("Lỗi khi xóa sản phẩm");
    }
  }
});
