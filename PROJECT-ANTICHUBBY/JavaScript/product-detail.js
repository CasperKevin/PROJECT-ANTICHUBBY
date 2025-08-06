// product-detail.js

document.addEventListener("DOMContentLoaded", async () => {
  // Get product ID from URL
  const urlParams = new URLSearchParams(window.location.search);
  const productId = urlParams.get("id");

  if (!productId) {
    alert("Không tìm thấy sản phẩm");
    window.location.href = "/index.html";
    return;
  }

  try {
    // Fetch product details from server
    const response = await fetch(`/api/products/${productId}`);
    const product = await response.json();

    // Display product details
    displayProductDetails(product);

    // Load related products
    loadRelatedProducts(product.maLoaiSanPham, product.maThuongHieu);
  } catch (error) {
    console.error("Error loading product details:", error);
    alert("Đã xảy ra lỗi khi tải chi tiết sản phẩm");
  }

  // Add event listeners
  setupEventListeners();
});

function displayProductDetails(product) {
  // Set page title
  document.getElementById("productDetailTitle").textContent =
    product.tenSanPham;

  // Main product details
  document.getElementById("productName").textContent = product.tenSanPham;
  document.getElementById("productRank").textContent = getRankName(
    product.maLoaiSanPham
  );
  document.getElementById("productStock").textContent =
    product.soLuong > 0 ? "Còn hàng" : "Hết hàng";
  document.getElementById("productPrice").textContent = formatPrice(
    product.giaBan
  );
  document.getElementById("productDescription").textContent =
    product.moTa ||
    "Mô hình Gundam cao cấp, chất lượng chính hãng từ Bandai Nhật Bản";

  // Set main image
  const mainImage = document.getElementById("mainProductImage");
  mainImage.src = product.hinhAnh;
  mainImage.alt = product.tenSanPham;

  // Add thumbnails (in this example, we only have one image)
  const thumbnailContainer = document.getElementById("thumbnailContainer");
  const thumbnail = document.createElement("img");
  thumbnail.src = product.hinhAnh;
  thumbnail.alt = product.tenSanPham;
  thumbnail.classList.add("thumbnail", "active");
  thumbnail.addEventListener("click", () => {
    mainImage.src = thumbnail.src;
    document
      .querySelectorAll(".thumbnail")
      .forEach((t) => t.classList.remove("active"));
    thumbnail.classList.add("active");
  });
  thumbnailContainer.appendChild(thumbnail);

  // Full description
  document.getElementById("fullDescription").innerHTML = `
    <p>${
      product.moTa ||
      "Mô hình Gundam cao cấp, chất lượng chính hãng từ Bandai Nhật Bản."
    }</p>
    <h3>Đặc điểm nổi bật:</h3>
    <ul>
      <li>Chất liệu nhựa ABS/PS cao cấp, an toàn</li>
      <li>Chi tiết sắc nét, độ khớp nối chính xác</li>
      <li>Màu sắc đẹp mắt, bám sát nguyên tác</li>
      <li>Dễ dàng lắp ráp với hướng dẫn chi tiết</li>
      <li>Phù hợp với người chơi từ 15 tuổi trở lên</li>
    </ul>
  `;

  // Technical specifications
  document.getElementById("specScale").textContent = getScaleByRank(
    product.maLoaiSanPham
  );
  document.getElementById("specHeight").textContent = getHeightByRank(
    product.maLoaiSanPham
  );
  document.getElementById("specDifficulty").textContent = getDifficultyByRank(
    product.maLoaiSanPham
  );
  document.getElementById("specAge").textContent = "15+";

  // Category
  document.getElementById("productCategory").textContent = getRankName(
    product.maLoaiSanPham
  );
}

function getRankName(rankId) {
  const ranks = {
    1: "High Grade (HG)",
    2: "Master Grade (MG)",
    3: "Real Grade (RG)",
    4: "Perfect Grade (PG)",
  };
  return ranks[rankId] || "Gundam Model";
}

function getScaleByRank(rankId) {
  const scales = {
    1: "1/144",
    2: "1/100",
    3: "1/144",
    4: "1/60",
  };
  return scales[rankId] || "1/144";
}

function getHeightByRank(rankId) {
  const heights = {
    1: "12-15cm",
    2: "18-20cm",
    3: "12-15cm",
    4: "30-35cm",
  };
  return heights[rankId] || "12-15cm";
}

function getDifficultyByRank(rankId) {
  const difficulties = {
    1: "Trung bình",
    2: "Nâng cao",
    3: "Khó",
    4: "Chuyên gia",
  };
  return difficulties[rankId] || "Trung bình";
}

function formatPrice(price) {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(price);
}

async function loadRelatedProducts(categoryId, brandId) {
  try {
    const response = await fetch(
      `/api/related-products?category=${categoryId}&brand=${brandId}&limit=4`
    );
    const products = await response.json();

    const container = document.getElementById("relatedProducts");
    container.innerHTML = "";

    products.forEach((product) => {
      const productCard = createProductCard(product);
      container.appendChild(productCard);
    });
  } catch (error) {
    console.error("Error loading related products:", error);
  }
}

function createProductCard(product) {
  const card = document.createElement("div");
  card.className = "product-card";
  card.innerHTML = `
  <a href="/HTML/product-detail.html?id=${product.maSanPham}">
      <img src="${product.hinhAnh}" alt="${product.tenSanPham}">
      <div class="product-info">
        <h3>${product.tenSanPham}</h3>
        <div class="price">${formatPrice(product.giaBan)}</div>
        <button class="btn add-to-cart">Thêm vào giỏ</button>
      </div>
    </a>
  `;

  // Add event listener to the add-to-cart button
  const addToCartBtn = card.querySelector(".add-to-cart");
  addToCartBtn.addEventListener("click", (e) => {
    e.preventDefault();
    addToCart(product);
    alert(`Đã thêm ${product.tenSanPham} vào giỏ hàng`);
  });

  return card;
}

function setupEventListeners() {
  // Add to cart button
  document.getElementById("addToCartBtn").addEventListener("click", () => {
    const quantity = parseInt(document.getElementById("quantity").value) || 1;
    const productId = new URLSearchParams(window.location.search).get("id");
    addToCartById(productId, quantity);
    alert("Đã thêm vào giỏ hàng!");
  });

  // Buy now button
  document.getElementById("buyNowBtn").addEventListener("click", () => {
    const quantity = parseInt(document.getElementById("quantity").value) || 1;
    const productId = new URLSearchParams(window.location.search).get("id");
    addToCartById(productId, quantity);
    window.location.href = "/HTML/checkout.html";
  });

  // Tab navigation
  document.querySelectorAll(".tab-nav a").forEach((tab) => {
    tab.addEventListener("click", (e) => {
      e.preventDefault();
      const targetId = tab.getAttribute("href");

      // Update active tab
      document.querySelectorAll(".tab-nav li").forEach((li) => {
        li.classList.remove("active");
      });
      tab.parentElement.classList.add("active");

      // Show target content
      document.querySelectorAll(".tab-pane").forEach((pane) => {
        pane.classList.remove("active");
      });
      document.querySelector(targetId).classList.add("active");
    });
  });

  // Rating stars
  document.querySelectorAll(".rating-stars i").forEach((star) => {
    star.addEventListener("click", () => {
      const value = parseInt(star.dataset.value);
      setRating(value);
    });
  });
}

function addToCartById(productId, quantity = 1) {
  // In a real app, we would fetch the product details by ID
  // For this demo, we'll just create a minimal product object
  const product = {
    id: productId,
    name: document.getElementById("productName").textContent,
    price: parseFloat(
      document.getElementById("productPrice").textContent.replace(/[^\d.]/g, "")
    ),
    image: document.getElementById("mainProductImage").src,
    quantity: quantity,
  };

  addToCart(product);
}

function addToCart(product) {
  let cart = JSON.parse(localStorage.getItem("cart")) || [];

  // Check if product is already in cart
  const existingProduct = cart.find((item) => item.id === product.id);

  if (existingProduct) {
    existingProduct.quantity += product.quantity;
  } else {
    cart.push(product);
  }

  localStorage.setItem("cart", JSON.stringify(cart));
  updateCartCount();
}

function updateCartCount() {
  const cart = JSON.parse(localStorage.getItem("cart")) || [];
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);

  document.querySelectorAll(".cart-count").forEach((element) => {
    element.textContent = totalItems;
  });
}

function setRating(value) {
  const stars = document.querySelectorAll(".rating-stars i");
  const ratingInput = document.getElementById("reviewRating");

  ratingInput.value = value;

  stars.forEach((star, index) => {
    if (index < value) {
      star.classList.remove("far");
      star.classList.add("fas", "active");
    } else {
      star.classList.remove("fas", "active");
      star.classList.add("far");
    }
  });
}
