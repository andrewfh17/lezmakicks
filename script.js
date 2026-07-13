// ====== CARRITO DE COMPRAS ======
let cart = [];
let cartTotal = 0;

// ====== ELEMENTOS DEL DOM ======
const cartToggle = document.getElementById('cartToggle');
const cartPanel = document.getElementById('cartPanel');
const closeCart = document.getElementById('closeCart');
const cartItems = document.getElementById('cartItems');
const cartCount = document.getElementById('cartCount');
const cartTotalElement = document.getElementById('cartTotal');

// ====== ABRIR/CERRAR CARRITO ======
cartToggle.addEventListener('click', () => {
    cartPanel.classList.toggle('active');
});

closeCart.addEventListener('click', () => {
    cartPanel.classList.remove('active');
});

document.addEventListener('click', (e) => {
    if (!cartPanel.contains(e.target) && !cartToggle.contains(e.target)) {
        cartPanel.classList.remove('active');
    }
});

// ====== AGREGAR PRODUCTOS AL CARRITO ======
const addButtons = document.querySelectorAll('.btn-add');

addButtons.forEach(button => {
    button.addEventListener('click', function(e) {
        e.stopPropagation();
        
        const productCard = this.closest('.product-card');
        const productName = productCard.querySelector('h4').textContent;
        const productPrice = productCard.querySelector('.price').textContent;
        const productImage = productCard.querySelector('.product-image').style.background;
        
        const product = {
            id: Date.now() + Math.random(),
            name: productName,
            price: productPrice,
            image: productImage
        };
        
        cart.push(product);
        updateCart();
        
        this.style.transform = 'scale(0.8)';
        setTimeout(() => {
            this.style.transform = 'scale(1)';
        }, 200);
        
        showToast(`✓ ${productName} agregado al carrito`);
    });
});

// ====== ACTUALIZAR CARRITO ======
function updateCart() {
    cartCount.textContent = cart.length;
    
    cartTotal = 0;
    cart.forEach(item => {
        const price = parseInt(item.price.replace(/[^0-9]/g, ''));
        cartTotal += price;
    });
    
    cartTotalElement.textContent = `₡${cartTotal.toLocaleString()}`;
    renderCartItems();
}

// ====== RENDERIZAR ITEMS DEL CARRITO ======
function renderCartItems() {
    if (cart.length === 0) {
        cartItems.innerHTML = `
            <div class="cart-empty">
                <i class="fas fa-shopping-bag"></i>
                <p>Tu carrito está vacío</p>
                <p class="cart-empty-sub">¡Agrega tus productos favoritos!</p>
            </div>
        `;
        return;
    }
    
    cartItems.innerHTML = '';
    cart.forEach((item, index) => {
        const itemDiv = document.createElement('div');
        itemDiv.className = 'cart-item';
        itemDiv.innerHTML = `
            <div class="cart-item-image" style="${item.image}">
                👟
            </div>
            <div class="cart-item-info">
                <h4>${item.name}</h4>
                <p>${item.price}</p>
            </div>
            <button class="cart-item-remove" data-index="${index}">
                <i class="fas fa-trash"></i>
            </button>
        `;
        cartItems.appendChild(itemDiv);
    });
    
    document.querySelectorAll('.cart-item-remove').forEach(btn => {
        btn.addEventListener('click', function() {
            const index = parseInt(this.dataset.index);
            const productName = cart[index].name;
            cart.splice(index, 1);
            updateCart();
            showToast(`✕ ${productName} eliminado`);
        });
    });
}

// ====== FILTRAR PRODUCTOS POR CATEGORÍA ======
const categoryLinks = document.querySelectorAll('.nav-categories a');
const products = document.querySelectorAll('.product-card');

categoryLinks.forEach(link => {
    link.addEventListener('click', function(e) {
        e.preventDefault();
        
        document.querySelectorAll('.nav-categories li').forEach(li => {
            li.classList.remove('active');
        });
        this.parentElement.classList.add('active');
        
        const categoria = this.dataset.categoria;
        
        products.forEach(product => {
            const productCategoria = product.dataset.categoria;
            if (categoria === 'todos' || productCategoria === categoria) {
                product.style.display = 'block';
            } else {
                product.style.display = 'none';
            }
        });
    });
});

// ====== NOTIFICACIONES ======
function showToast(message) {
    document.querySelectorAll('.toast-cart').forEach(t => t.remove());
    
    const toast = document.createElement('div');
    toast.className = 'toast-cart';
    toast.innerHTML = `<i class="fas fa-check-circle"></i> ${message}`;
    document.body.appendChild(toast);
    
    setTimeout(() => {
        toast.style.animation = 'slideOut 0.4s ease';
        setTimeout(() => toast.remove(), 400);
    }, 3000);
}

// ====== BÚSQUEDA ======
const searchInput = document.querySelector('.search-bar input');
const searchBtn = document.querySelector('.search-bar button');

function buscarProductos() {
    const term = searchInput.value.toLowerCase().trim();
    const products = document.querySelectorAll('.product-card');
    
    if (term === '') {
        const activeCategory = document.querySelector('.nav-categories li.active a');
        if (activeCategory) {
            const categoria = activeCategory.dataset.categoria;
            products.forEach(product => {
                if (categoria === 'todos' || product.dataset.categoria === categoria) {
                    product.style.display = 'block';
                } else {
                    product.style.display = 'none';
                }
            });
        }
        return;
    }
    
    products.forEach(product => {
        const title = product.querySelector('h4').textContent.toLowerCase();
        const desc = product.querySelector('.product-desc').textContent.toLowerCase();
        const isVisible = product.style.display !== 'none';
        
        if ((title.includes(term) || desc.includes(term)) && isVisible) {
            product.style.display = 'block';
        } else {
            product.style.display = 'none';
        }
    });
}

searchBtn.addEventListener('click', buscarProductos);
searchInput.addEventListener('keyup', (e) => {
    if (e.key === 'Enter') buscarProductos();
});

// ====== MODO CLARO/OSCURO ======
const themeToggle = document.getElementById('themeToggle');
const body = document.body;

const savedTheme = localStorage.getItem('theme');
if (savedTheme === 'light') {
    body.classList.add('light-mode');
    themeToggle.innerHTML = '<i class="fas fa-sun"></i>';
}

themeToggle.addEventListener('click', function() {
    body.classList.toggle('light-mode');
    const icon = this.querySelector('i');
    if (body.classList.contains('light-mode')) {
        icon.className = 'fas fa-sun';
        localStorage.setItem('theme', 'light');
    } else {
        icon.className = 'fas fa-moon';
        localStorage.setItem('theme', 'dark');
    }
});

// ====== BOTÓN DE PAGO ======
document.querySelector('.btn-checkout').addEventListener('click', function() {
    if (cart.length === 0) {
        showToast('🛒 Tu carrito está vacío');
        return;
    }
    const total = cartTotal.toLocaleString();
    alert(`🛒 ¡Gracias por tu compra!\n\nTotal: ₡${total}\n\nProductos: ${cart.length}`);
    cart = [];
    updateCart();
    cartPanel.classList.remove('active');
    showToast('✅ ¡Compra realizada con éxito!');
});

console.log('🇨🇷 Felipestore - Tienda Urbana');