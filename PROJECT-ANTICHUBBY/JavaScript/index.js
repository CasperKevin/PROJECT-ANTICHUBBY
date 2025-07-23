// --- Hero Slider ---
const slides = document.querySelectorAll(".slide");
const prevButton = document.querySelector(".prev-slide");
const nextButton = document.querySelector(".next-slide");
let currentSlide = 0;

function showSlide(index) {
  slides.forEach((slide, i) => {
    slide.classList.toggle("active", i === index);
  });
}

function nextSlide() {
  currentSlide = (currentSlide + 1) % slides.length;
  showSlide(currentSlide);
}

function prevSlide() {
  currentSlide = (currentSlide - 1 + slides.length) % slides.length;
  showSlide(currentSlide);
}

nextButton.addEventListener("click", nextSlide);
prevButton.addEventListener("click", prevSlide);
showSlide(currentSlide);

// --- Auto Slide Every 5 Seconds ---
setInterval(nextSlide, 5000);

// --- Sản phẩm mới ---
const newArrivals = [
  {
    name: "Gundam Barbatos HG",
    image: "IMG/barbatos-hg.webp",
    price: "450.000₫",
    link: "/HTML/product-detail.html?id=barbatos-hg"
  },
  {
    name: "RX-78-2 MG",
    image: "IMG/rx78-mg.webp",
    price: "950.000₫",
    link: "/HTML/product-detail.html?id=rx78-mg"
  },
  {
    name: "Gundam Exia RG",
    image: "IMG/exia-rg.webp",
    price: "730.000₫",
    link: "/HTML/product-detail.html?id=exia-rg"
  }
];

const newArrivalsContainer = document.querySelector('.new-arrivals .products-grid');
newArrivals.forEach(product => {
  const card = document.createElement('div');
  card.classList.add('product-card');
  card.innerHTML = `
    <a href="${product.link}">
      <img src="${product.image}" alt="${product.name}" />
      <h4>${product.name}</h4>
      <p class="price">${product.price}</p>
    </a>
  `;
  newArrivalsContainer.appendChild(card);
});

// --- Bán chạy nhất ---
const bestSellers = [
  {
    name: "Strike Freedom PG",
    image: "IMG/strike-pg.webp",
    price: "2.500.000₫",
    link: "/HTML/products.html"
  },
  {
    name: "Wing Gundam Zero Custom MG",
    image: "IMG/wing-mg.webp",
    price: "980.000₫",
    link: "/HTML/product-detail.html?id=wing-mg"
  }
];

const bestSellersContainer = document.querySelector('.best-sellers .products-grid');
bestSellers.forEach(product => {
  const card = document.createElement('div');
  card.classList.add('product-card');
  card.innerHTML = `
    <a href="${product.link}">
      <img src="${product.image}" alt="${product.name}" />
      <h4>${product.name}</h4>
      <p class="price">${product.price}</p>
    </a>
  `;
  bestSellersContainer.appendChild(card);
});
