document.addEventListener("DOMContentLoaded", async () => {
  const urlParams = new URLSearchParams(window.location.search);
  const productId = urlParams.get("id");

  const form = document.getElementById("productForm");
  const productIdInput = document.getElementById("productId");
  const productNameInput = document.getElementById("productName");
  const productPriceInput = document.getElementById("productPrice");
  const productImageInput = document.getElementById("productImage");
  const productCategorySelect = document.getElementById("productCategory");
  const productBrandSelect = document.getElementById("productBrand");
  const productDescriptionInput = document.getElementById("productDescription");

  try {
    // Lấy dữ liệu danh mục và thương hiệu
    const [categoriesRes, brandsRes] = await Promise.all([
      fetch("/api/categories"),
      fetch("/api/brands"),
    ]);

    const categories = await categoriesRes.json();
    const brands = await brandsRes.json();

    categories.forEach((category) => {
      const option = document.createElement("option");
      option.value = category.maLoai;
      option.textContent = category.tenLoai;
      productCategorySelect.appendChild(option);
    });

    // Điền thương hiệu
    brands.forEach((brand) => {
      const option = document.createElement("option");
      option.value = brand.maThuongHieu;
      option.textContent = brand.tenThuongHieu;
      productBrandSelect.appendChild(option);
    });

    if (productId) {
      const productRes = await fetch(`/api/products/${productId}`);
      const product = await productRes.json();

      productIdInput.value = product.maSanPham;
      productNameInput.value = product.tenSanPham;
      productPriceInput.value = product.giaBan;
      productImageInput.value = product.hinhAnh;
      productCategorySelect.value = product.maLoaiSanPham;
      productBrandSelect.value = product.maThuongHieu;
      productDescriptionInput.value = product.moTa || "";
    }
  } catch (error) {
    console.error("Error loading data:", error);
    alert("Đã xảy ra lỗi khi tải dữ liệu");
  }

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const productData = {
      maSanPham: productIdInput.value || 0,
      tenSanPham: productNameInput.value,
      giaBan: parseFloat(productPriceInput.value),
      hinhAnh: productImageInput.value,
      maLoaiSanPham: parseInt(productCategorySelect.value),
      maThuongHieu: parseInt(productBrandSelect.value),
      moTa: productDescriptionInput.value,
    };

    try {
      const method = productId ? "PUT" : "POST";
      const url = productId ? `/api/products/${productId}` : "/api/products";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(productData),
      });

      if (response.ok) {
        alert("Sản phẩm đã được lưu thành công!");
        window.location.href = "/HTML/manager.html";
      } else {
        alert("Lưu sản phẩm thất bại");
      }
    } catch (error) {
      console.error("Error saving product:", error);
      alert("Lỗi khi lưu sản phẩm");
    }
  });
});
