function getCart() {
  return JSON.parse(localStorage.getItem("cart")) || [];
}

function formatPrice(price) {
  return price.toLocaleString("vi-VN") + "₫";
}

function renderCart() {
  const cart = getCart();
  const tbody = document.getElementById("cart_items");
  const summaryRows = document.querySelectorAll(".summary-row span:last-child");

  tbody.innerHTML = "";

  if (cart.length === 0) {
    tbody.innerHTML = `<tr><td colspan="7" style="text-align:center;">Giỏ hàng trống!</td></tr>`;
    summaryRows.forEach((el) => (el.textContent = "0đ"));
    return;
  }

  let subtotal = 0;

  cart.forEach((item, index) => {
    const itemTotal = item.price * item.quantity;
    subtotal += itemTotal;

    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${item.name}</td>
      <td><img src="${item.image}" alt="${item.name}" width="80"></td>
      <td>${formatPrice(item.price)}</td>
      <td>
        <input type="number" value="${item.quantity}" min="1" data-id="${
      item.id
    }" class="update-qty">
      </td>
      <td>${formatPrice(itemTotal)}</td>
      <td><button data-id="${
        item.id
      }" class="btn update-btn">Cập nhật</button></td>
      <td><button data-id="${item.id}" class="btn remove-btn">Xóa</button></td>
    `;
    tbody.appendChild(row);
  });

  const shipping = 30000;
  const discount = 0;
  const total = subtotal + shipping - discount;

  document.querySelectorAll(".summary-row span:last-child")[0].textContent =
    formatPrice(subtotal);
  document.querySelectorAll(".summary-row span:last-child")[1].textContent =
    formatPrice(shipping);
  document.querySelectorAll(".summary-row span:last-child")[2].textContent =
    formatPrice(discount);
  document.querySelectorAll(".summary-row span:last-child")[3].textContent =
    formatPrice(total);
}

document.addEventListener("click", (e) => {
  if (e.target.classList.contains("remove-btn")) {
    const id = parseInt(e.target.dataset.id);
    const cart = getCart().filter((item) => item.id !== id);
    localStorage.setItem("cart", JSON.stringify(cart));
    renderCart();
  }
});

document.addEventListener("click", (e) => {
  if (e.target.classList.contains("update-btn")) {
    const id = parseInt(e.target.dataset.id);
    const qtyInput = document.querySelector(`input[data-id='${id}']`);
    const newQty = parseInt(qtyInput.value);
    const cart = getCart();
    const item = cart.find((p) => p.id === id);
    if (item && newQty > 0) item.quantity = newQty;
    localStorage.setItem("cart", JSON.stringify(cart));
    renderCart();
  }
});

document.addEventListener("DOMContentLoaded", renderCart);
window.addEventListener("storage", renderCart);
