// ---------- PRODUCT DATA with REAL HIGH-QUALITY IMAGES (Unsplash) ----------

const products = [
    { id: 1, name: "Recycled Denim Jacket", category: "fashion", price: 49.99, description: "Upcycled vintage denim, zero-waste dye.", imageUrl: "images/1.jpg" },

    { id: 2, name: "Bamboo Cutlery Set", category: "home", price: 18.95, description: "Portable eco-friendly kit with carry pouch.", imageUrl: "images/2.avif" },

    { id: 3, name: "Solar Power Bank 10000mAh", category: "tech", price: 39.99, description: "Solar charging, recycled plastic casing.", imageUrl: "images/3.jpg" },

    { id: 4, name: "Handwoven Jute Bag", category: "fashion", price: 24.5, description: "Fair trade, plastic-free tote.", imageUrl: "images/4.jpg" },

    { id: 5, name: "Reclaimed Wood Shelf", category: "home", price: 67.0, description: "Solid wood from deconstructed barns.", imageUrl: "images/5.jpg" },

    { id: 6, name: "Refurbished Smart Speaker", category: "tech", price: 89.0, description: "Electronics waste reduction, 1yr warranty.", imageUrl: "images/6.jpg" },

    { id: 7, name: "Organic Cotton Hoodie", category: "fashion", price: 54.9, description: "GOTS certified, carbon neutral shipping.", imageUrl: "images/7.jpg" },

    { id: 8, name: "Glass Storage Set (4pcs)", category: "home", price: 32.5, description: "Plastic-free airtight containers.", imageUrl: "images/8.jpg" },

    { id: 9, name: "Eco Yoga Mat", category: "fitness", price: 42.0, description: "Non-toxic natural rubber with anti-slip grip.", imageUrl: "images/9.jpg" },

    { id: 10, name: "LED Smart Bulb", category: "tech", price: 14.99, description: "Energy saving smart bulb with mobile control.", imageUrl: "images/10.jpg" },

    { id: 11, name: "Cork Wallet", category: "fashion", price: 29.99, description: "Vegan leather alternative made from cork.", imageUrl: "images/11.jpg" },

    { id: 12, name: "Stainless Steel Water Bottle", category: "home", price: 21.75, description: "Reusable insulated bottle keeps drinks cold.", imageUrl: "images/12.jpg" },

    { id: 13, name: "Wireless Earbuds", category: "tech", price: 59.99, description: "Compact earbuds with noise isolation.", imageUrl: "images/13.jpg" },

    { id: 14, name: "Eco Laundry Detergent Sheets", category: "home", price: 16.5, description: "Plastic-free detergent sheets for easy washing.", imageUrl: "images/14.jpg" },

    { id: 15, name: "Hemp Fabric Backpack", category: "fashion", price: 46.0, description: "Durable hemp backpack with minimalist design.", imageUrl: "images/15.jpg" },

    { id: 16, name: "Solar Garden Lights (Pack of 6)", category: "tech", price: 27.9, description: "Outdoor solar lights for eco-friendly lighting.", imageUrl: "images/16.jpg" }
];


// Helper: render product image with actual high-quality photo instead of icon
function renderProductImage(product) {
    return `<div class="img-container">
              <img class="market-img" src="${product.imageUrl}" alt="${product.name}" loading="lazy">
            </div>`;
}

let cart = []; // { id, quantity }

// DOM elements
const productsGrid = document.getElementById("productsGrid");
const cartCountSpan = document.getElementById("cartCount");
const cartOverlay = document.getElementById("cartOverlay");
const cartItemsList = document.getElementById("cartItemsList");
const cartTotalPriceSpan = document.getElementById("cartTotalPrice");
const searchInput = document.getElementById("searchInput");
const categoryBtns = document.querySelectorAll(".cat-btn");

let activeCategory = "all";
let searchQuery = "";


// Cart functions
function updateCartUI() {
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    cartCountSpan.innerText = totalItems;
    // render cart sidebar
    if (cart.length === 0) {
        cartItemsList.innerHTML = `<div class="empty-cart"><i class="fas fa-box-open"></i> Your cart is empty 🌿</div>`;
        cartTotalPriceSpan.innerText = `Total: $0.00`;
        return;
    }
    let itemsHtml = "";
    let total = 0;
    cart.forEach(cartItem => {
        const prod = products.find(p => p.id === cartItem.id);
        if (!prod) return;
        const subtotal = prod.price * cartItem.quantity;
        total += subtotal;
        // using real image in cart as well for consistency
        itemsHtml += `
        <div class="cart-item">
          <div class="cart-item-img"><img src="${prod.imageUrl}" alt="${prod.name}"></div>
          <div class="cart-item-info">
            <div class="cart-item-title">${prod.name}</div>
            <div class="cart-item-price">$${prod.price.toFixed(2)}</div>
            <div class="cart-qty">
              <button class="decr-cart" data-id="${prod.id}">-</button>
              <span>${cartItem.quantity}</span>
              <button class="incr-cart" data-id="${prod.id}">+</button>
              <button class="remove-item" data-id="${prod.id}" style="margin-left:8px; background:none; border:none; color:#e26d5c;"><i class="fas fa-trash-alt"></i></button>
            </div>
          </div>
        </div>
      `;
    });
    cartItemsList.innerHTML = itemsHtml;
    cartTotalPriceSpan.innerText = `Total: $${total.toFixed(2)}`;
    // attach events to cart dynamic buttons
    document.querySelectorAll(".decr-cart").forEach(btn => {
        btn.addEventListener("click", (e) => {
            const id = parseInt(btn.dataset.id);
            updateQuantity(id, -1);
        });
    });
    document.querySelectorAll(".incr-cart").forEach(btn => {
        btn.addEventListener("click", (e) => {
            const id = parseInt(btn.dataset.id);
            updateQuantity(id, 1);
        });
    });
    document.querySelectorAll(".remove-item").forEach(btn => {
        btn.addEventListener("click", (e) => {
            const id = parseInt(btn.dataset.id);
            removeFromCart(id);
        });
    });
}


function updateQuantity(productId, delta) {
    const idx = cart.findIndex(i => i.id === productId);
    if (idx !== -1) {
        const newQty = cart[idx].quantity + delta;
        if (newQty <= 0) {
            cart.splice(idx, 1);
        } else {
            cart[idx].quantity = newQty;
        }
    }
    updateCartUI();
    saveCartToLocal();
}

function removeFromCart(productId) {
    cart = cart.filter(i => i.id !== productId);
    updateCartUI();
    saveCartToLocal();
}

function addToCart(productId) {
    const existing = cart.find(i => i.id === productId);
    if (existing) {
        existing.quantity++;
    } else {
        cart.push({ id: productId, quantity: 1 });
    }
    updateCartUI();
    saveCartToLocal();
    // subtle feedback: brief animation on cart icon
    const cartIconBtn = document.getElementById("cartIcon");
    cartIconBtn.style.transform = "scale(1.1)";
    setTimeout(() => { cartIconBtn.style.transform = ""; }, 200);
}

function saveCartToLocal() {
    localStorage.setItem("ecoloop_cart", JSON.stringify(cart));
}

function loadCartFromLocal() {
    const stored = localStorage.getItem("ecoloop_cart");
    if (stored) {
        try {
            cart = JSON.parse(stored);
        } catch (e) { cart = []; }
    } else {
        cart = [];
    }
    updateCartUI();
}

// Render products based on filters
function renderProducts() {
    let filtered = products.filter(prod => {
        const matchCategory = activeCategory === "all" || prod.category === activeCategory;
        const matchSearch = prod.name.toLowerCase().includes(searchQuery.toLowerCase()) || prod.description.toLowerCase().includes(searchQuery.toLowerCase());
        return matchCategory && matchSearch;
    });
    if (filtered.length === 0) {
        productsGrid.innerHTML = `<div style="grid-column:1/-1; text-align:center; padding:60px;"><i class="fas fa-seedling" style="font-size:3rem; opacity:0.6;"></i><p>No items match. Be the first to sell!</p></div>`;
        return;
    }
    let gridHtml = "";
    filtered.forEach(prod => {
        const imgHtml = renderProductImage(prod);
        gridHtml += `
        <div class="product-card" data-id="${prod.id}">
          ${imgHtml}
          <div class="card-content">
            <div class="product-cat">${prod.category}</div>
            <div class="product-title">${prod.name}</div>
            <div class="product-price">$${prod.price.toFixed(2)}</div>
            <div class="product-desc">${prod.description}</div>
            <button class="add-btn" data-id="${prod.id}"><i class="fas fa-plus-circle"></i> Add to cart</button>
          </div>
        </div>
      `;
    });
    productsGrid.innerHTML = gridHtml;
    // attach add-to-cart events
    document.querySelectorAll(".add-btn").forEach(btn => {
        btn.addEventListener("click", (e) => {
            e.stopPropagation();
            const id = parseInt(btn.dataset.id);
            addToCart(id);
        });
    });
}

// event listeners for category & search
function initFilters() {
    categoryBtns.forEach(btn => {
        btn.addEventListener("click", () => {
            categoryBtns.forEach(b => b.classList.remove("active"));
            btn.classList.add("active");
            activeCategory = btn.dataset.cat;
            renderProducts();
        });
    });
    searchInput.addEventListener("input", (e) => {
        searchQuery = e.target.value;
        renderProducts();
    });
}

// theme toggle (light/dark)
function initTheme() {
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme === "dark") {
        document.body.classList.add("dark");
    } else {
        document.body.classList.remove("dark");
    }
    const themeBtn = document.getElementById("themeToggle");
    themeBtn.addEventListener("click", () => {
        document.body.classList.toggle("dark");
        const isDark = document.body.classList.contains("dark");
        localStorage.setItem("theme", isDark ? "dark" : "light");
    });
}

// cart sidebar open/close
function initCartDrawer() {
    const cartIconBtn = document.getElementById("cartIcon");
    const closeCartBtn = document.getElementById("closeCart");
    const overlay = document.getElementById("cartOverlay");
    cartIconBtn.addEventListener("click", () => {
        overlay.classList.add("open");
    });
    closeCartBtn.addEventListener("click", () => {
        overlay.classList.remove("open");
    });
    overlay.addEventListener("click", (e) => {
        if (e.target === overlay) overlay.classList.remove("open");
    });
    const checkout = document.getElementById("checkoutBtn");
    checkout.addEventListener("click", () => {
        if (cart.length === 0) {
            alert("Your cart is empty 🌱 Add some sustainable goods!");
        } else {
            alert(`✨ Demo checkout! Total: ${cartTotalPriceSpan.innerText}\nThank you for supporting circular economy. (showcase purpose)`);
            // optional reset cart for demo? we keep for realism
        }
    });
}


// initial load
function init() {
    loadCartFromLocal();
    initTheme();
    initFilters();
    initCartDrawer();
    renderProducts();
}

init();
