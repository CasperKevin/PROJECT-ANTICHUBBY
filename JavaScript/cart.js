// ====================
// Xử lý trang Giỏ hàng (cart.js)
// ====================

// Hàm định dạng số thành chuỗi tiền tệ Việt Nam
function formatPrice(value) {
  return value.toLocaleString("vi-VN") + "đ";
}

// Hiển thị nội dung giỏ hàng
function renderCart() {
  const cart = getCart();
  const tbody = document.getElementById("cart_items");
  tbody.innerHTML = "";

  cart.forEach((item) => {
    const tr = document.createElement("tr");

    // Tên
    const nameTd = document.createElement("td");
    nameTd.textContent = item.name;

    // Ảnh
    const imgTd = document.createElement("td");
    const img = document.createElement("img");
    img.src = item.image;
    img.alt = item.name;
    img.className = "cart-image";
    imgTd.appendChild(img);

    // Giá
    const priceTd = document.createElement("td");
    priceTd.textContent = formatPrice(item.price);

    // Số lượng
    const qtyTd = document.createElement("td");
    const minusBtn = document.createElement("button");
    minusBtn.textContent = "-";
    minusBtn.className = "qty-btn";
    minusBtn.addEventListener("click", () =>
      changeQuantity(item.id, item.quantity - 1)
    );

    const qtySpan = document.createElement("span");
    qtySpan.textContent = item.quantity;
    qtySpan.className = "qty-number";

    const plusBtn = document.createElement("button");
    plusBtn.textContent = "+";
    plusBtn.className = "qty-btn";
    plusBtn.addEventListener("click", () =>
      changeQuantity(item.id, item.quantity + 1)
    );

    qtyTd.append(minusBtn, qtySpan, plusBtn);

    // Tổng tiền
    const totalTd = document.createElement("td");
    totalTd.textContent = formatPrice(item.price * item.quantity);
    totalTd.className = "item-total";

    // Nút cập nhật (nếu cần)
    const editTd = document.createElement("td");
    editTd.textContent = "";

    // Nút xóa
    const delTd = document.createElement("td");
    const delBtn = document.createElement("button");
    delBtn.innerHTML = '<i class="fas fa-trash-alt"></i>';
    delBtn.className = "del-btn";
    delBtn.addEventListener("click", () => removeItem(item.id));
    delTd.appendChild(delBtn);

    tr.append(nameTd, imgTd, priceTd, qtyTd, totalTd, editTd, delTd);
    tbody.appendChild(tr);
  });

  updateSummary();
}

// Thay đổi số lượng sản phẩm
function changeQuantity(id, newQty) {
  const cart = getCart();
  const item = cart.find((p) => p.id === id);
  if (!item) return;

  if (newQty <= 0) {
    // Xóa nếu số lượng <= 0
    removeItem(id);
    return;
  }

  item.quantity = newQty;
  saveCart(cart);
  showNotification(`Đã cập nhật số lượng ${item.name} thành ${newQty}!`);
  renderCart();
}

// Xóa sản phẩm khỏi giỏ
function removeItem(id) {
  let cart = getCart();
  const item = cart.find((p) => p.id === id);
  cart = cart.filter((p) => p.id !== id);
  saveCart(cart);
  showNotification(`${item.name} đã được xóa khỏi giỏ hàng!`, "error");
  renderCart();
}

// Cập nhật phần Tóm tắt Đơn hàng
function updateSummary() {
  const cart = getCart();
  const subtotal = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  const shipping = 0;
  const discount = 0;
  const total = subtotal + shipping - discount;

  const rows = document.querySelectorAll(".cart-summary .summary-row");
  rows.forEach((row) => {
    const label = row.querySelector("span:first-child").textContent.trim();
    const valueSpan = row.querySelector("span:last-child");

    if (label === "Tạm tính") valueSpan.textContent = formatPrice(subtotal);
    if (label === "Phí vận chuyển")
      valueSpan.textContent = formatPrice(shipping);
    if (label === "Giảm giá") valueSpan.textContent = formatPrice(discount);
    if (label === "Tổng cộng") valueSpan.textContent = formatPrice(total);
  });
}

// Khởi tạo khi tải trang
document.addEventListener("DOMContentLoaded", () => {
  renderCart();
});
