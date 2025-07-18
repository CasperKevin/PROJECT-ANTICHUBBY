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
