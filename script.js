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

// =====================================================
// ====== PANEL DE DETALLE DE PRODUCTO ======
// =====================================================

// ====== ELEMENTOS DEL DOM ======
const detailPanel = document.getElementById('detailPanel');
const detailContent = document.getElementById('detailContent');
const closeDetail = document.getElementById('closeDetail');

// ====== DATOS DE PRODUCTOS CON IMÁGENES POR COLOR ======
const productData = [
    {
        id: 0,
        name: 'Nike Shox',
        price: '₡45.000',
        desc: 'Calzado deportivo de alto rendimiento con tecnología de amortiguación Shox. Ideal para entrenamiento y uso diario.',
        category: 'Tenis Deportivos',
        rating: 4.8,
        specs: {
            'Material': 'Sintético y malla',
            'Suela': 'Goma resistente',
            'Tecnología': 'Amortiguación Shox',
            'Uso': 'Deportivo y casual'
        },
        colors: [
            { name: 'Blanco/Negro', value: '#f5f5f5', image: 'https://static.nike.com/a/images/t_web_pw_592_v2/f_auto/9a5a8f5b-2898-431b-a8ca-2916f364818e/W+SHOX+TL.png' },
            { name: 'Negro/Rojo', value: '#1a1a2e', image: 'https://static.nike.com/a/images/t_web_pw_592_v2/f_auto/9a5a8f5b-2898-431b-a8ca-2916f364818e/W+SHOX+TL.png' },
            { name: 'Azul/Blanco', value: '#002B5C', image: 'https://static.nike.com/a/images/t_web_pw_592_v2/f_auto/9a5a8f5b-2898-431b-a8ca-2916f364818e/W+SHOX+TL.png' },
            { name: 'Rojo/Blanco', value: '#C8102E', image: 'https://static.nike.com/a/images/t_web_pw_592_v2/f_auto/9a5a8f5b-2898-431b-a8ca-2916f364818e/W+SHOX+TL.png' }
        ],
        sizes: ['38', '39', '40', '41', '42', '43', '44', '45']
    },
    {
        id: 1,
        name: 'Jordan 4',
        price: '₡55.000',
        desc: 'Air Jordan 4 Retro, el clásico que nunca pasa de moda. Calzado exclusivo con diseño icónico y comodidad premium.',
        category: 'Tenis Deportivos',
        rating: 4.9,
        specs: {
            'Material': 'Cuero y malla',
            'Suela': 'Goma con patrón de espiga',
            'Tecnología': 'Air-Sole',
            'Uso': 'Baloncesto y casual'
        },
        colors: [
            { name: 'Blanco/Rojo', value: '#f5f5f5', image: 'https://static.nike.com/a/images/t_PDP_1728_v1/f_auto,q_auto:eco,u_126ab356-44d8-4a06-89b4-fcdcc8df0245,c_scale,fl_relative,w_1.0,h_1.0,fl_layer_apply/316de1b6-f526-4f5c-8683-af5420a20680/AIR+JORDAN+4+RETRO.png' },
            { name: 'Negro/Cemento', value: '#1a1a2e', image: 'https://static.nike.com/a/images/t_PDP_1728_v1/f_auto,q_auto:eco,u_126ab356-44d8-4a06-89b4-fcdcc8df0245,c_scale,fl_relative,w_1.0,h_1.0,fl_layer_apply/316de1b6-f526-4f5c-8683-af5420a20680/AIR+JORDAN+4+RETRO.png' },
            { name: 'Azul/Blanco', value: '#002B5C', image: 'https://static.nike.com/a/images/t_PDP_1728_v1/f_auto,q_auto:eco,u_126ab356-44d8-4a06-89b4-fcdcc8df0245,c_scale,fl_relative,w_1.0,h_1.0,fl_layer_apply/316de1b6-f526-4f5c-8683-af5420a20680/AIR+JORDAN+4+RETRO.png' }
        ],
        sizes: ['39', '40', '41', '42', '43', '44', '45']
    },
    {
        id: 2,
        name: 'Tacos Nike',
        price: '₡55.000',
        desc: 'Tacos Nike Mercurial Superfly 10 Elite, diseñados para la máxima velocidad y control en la cancha.',
        category: 'Tenis Deportivos',
        rating: 4.7,
        specs: {
            'Material': 'Sintético de alto rendimiento',
            'Suela': 'FG (Césped natural)',
            'Tecnología': 'Flyknit y Aerotrak',
            'Uso': 'Fútbol profesional'
        },
        colors: [
            { name: 'Blanco/Negro', value: '#f5f5f5', image: 'https://static.nike.com/a/images/t_PDP_1728_v1/f_auto,q_auto:eco/f566f622-874a-4ecd-9bd1-47f52cbe8c53/ZM+SUPERFLY+10+ELITE+FG+LV8.png' },
            { name: 'Negro/Dorado', value: '#1a1a2e', image: 'https://static.nike.com/a/images/t_PDP_1728_v1/f_auto,q_auto:eco/f566f622-874a-4ecd-9bd1-47f52cbe8c53/ZM+SUPERFLY+10+ELITE+FG+LV8.png' }
        ],
        sizes: ['39', '40', '41', '42', '43', '44', '45']
    },
    {
        id: 3,
        name: 'Lokal Big Moradas',
        price: '₡46.750',
        desc: 'Tenis Lokal Big con diseño exclusivo en tonos morados. Calzado urbano con estilo único y gran comodidad.',
        category: 'Tenis Deportivos',
        rating: 4.6,
        specs: {
            'Material': 'Sintético premium',
            'Suela': 'Goma antideslizante',
            'Estilo': 'Urbano y moderno',
            'Uso': 'Casual y diario'
        },
        colors: [
            { name: 'Morado/Negro', value: '#4a148c', image: 'https://images.tcdn.com.br/img/img_prod/703344/tenis_lokal_big_preto_roxo_9624_1_81a416a7aa2b707de690f54cbe57880b.jpg' },
            { name: 'Negro/Morado', value: '#1a1a2e', image: 'https://images.tcdn.com.br/img/img_prod/703344/tenis_lokal_big_preto_roxo_9624_1_81a416a7aa2b707de690f54cbe57880b.jpg' },
            { name: 'Blanco/Morado', value: '#f5f5f5', image: 'https://images.tcdn.com.br/img/img_prod/703344/tenis_lokal_big_preto_roxo_9624_1_81a416a7aa2b707de690f54cbe57880b.jpg' }
        ],
        sizes: ['30', '32', '34', '36', '38', '40', '42', '45']
    },
    {
        id: 4,
        name: 'Dc Court Graffik',
        price: '₡38.500',
        desc: 'DC Court Graffik, el clásico de la marca con diseño skate. Calzado duradero y cómodo para el estilo urbano.',
        category: 'Tenis Deportivos',
        rating: 4.5,
        specs: {
            'Material': 'Cuero sintético',
            'Suela': 'Goma con patrón de espiga',
            'Estilo': 'Skateboard',
            'Uso': 'Skate y casual'
        },
        colors: [
            { name: 'Blanco/Negro', value: '#f5f5f5', image: 'https://images.boardriders.com/global/dcshoes-products/all/default/xlarge/adbs100303_dcshoes,p_bc6_frt2.jpg' },
            { name: 'Negro/Blanco', value: '#1a1a2e', image: 'https://images.boardriders.com/global/dcshoes-products/all/default/xlarge/adbs100303_dcshoes,p_bc6_frt2.jpg' }
        ],
        sizes: ['30', '32', '34', '36', '38', '40', '42', '45']
    },
    {
        id: 5,
        name: 'TN Air Max',
        price: '₡38.000',
        desc: 'Tenis Air Max con estilo colombiano. Combinación perfecta entre comodidad y diseño urbano.',
        category: 'Tenis Casuales',
        rating: 4.8,
        specs: {
            'Material': 'Malla y sintético',
            'Suela': 'Goma Air Max',
            'Tecnología': 'Amortiguación Air',
            'Uso': 'Casual y diario'
        },
        colors: [
            { name: 'Blanco', value: '#FFFFFF', image: 'https://www.calzatodopaisa.com/wp-content/uploads/2025/10/Tenis-Nike-Air-Max-Tn-Plus-Para-Mujer-5.webp' },
            { name: 'Negro', value: '#1a1a2e', image: 'https://www.calzatodopaisa.com/wp-content/uploads/2025/10/Tenis-Nike-Air-Max-Tn-Plus-Para-Mujer-5.webp' },
            { name: 'Rojo', value: '#C8102E', image: 'https://www.calzatodopaisa.com/wp-content/uploads/2025/10/Tenis-Nike-Air-Max-Tn-Plus-Para-Mujer-5.webp' },
            { name: 'Azul', value: '#002B5C', image: 'https://www.calzatodopaisa.com/wp-content/uploads/2025/10/Tenis-Nike-Air-Max-Tn-Plus-Para-Mujer-5.webp' }
        ],
        sizes: ['38', '39', '40', '41', '42', '43', '44']
    },
    {
        id: 6,
        name: 'TN Nike',
        price: '₡55.000',
        desc: 'Nike Air Max Plus TN, el clásico de los 90 que sigue en tendencia. Diseño único y comodidad incomparable.',
        category: 'Tenis Casuales',
        rating: 4.9,
        specs: {
            'Material': 'Malla y sintético',
            'Suela': 'Goma Air Max',
            'Tecnología': 'Amortiguación Air',
            'Uso': 'Casual y urbano'
        },
        colors: [
            { name: 'Rojo/Blanco', value: '#C8102E', image: 'http://sneakerstaxxau.com/cdn/shop/files/NIKE-AIR-MAX-PLUS-TN-RED-MONOGRAM.jpg?v=1688449434' },
            { name: 'Negro/Rojo', value: '#1a1a2e', image: 'http://sneakerstaxxau.com/cdn/shop/files/NIKE-AIR-MAX-PLUS-TN-RED-MONOGRAM.jpg?v=1688449434' },
            { name: 'Azul/Blanco', value: '#002B5C', image: 'http://sneakerstaxxau.com/cdn/shop/files/NIKE-AIR-MAX-PLUS-TN-RED-MONOGRAM.jpg?v=1688449434' }
        ],
        sizes: ['38', '39', '40', '41', '42', '43', '44']
    },
    {
        id: 7,
        name: 'TN Nike Plus OG',
        price: '₡55.000',
        desc: 'Nike Air Max Plus OG Hyper Blue, el clásico de los 90 con un diseño renovado. Calzado icónico con tecnología Air Max y estilo inconfundible.',
        category: 'Tenis Casuales',
        rating: 4.9,
        specs: {
            'Material': 'Malla y sintético',
            'Suela': 'Goma Air Max',
            'Tecnología': 'Amortiguación Air',
            'Uso': 'Casual y urbano'
        },
        colors: [
            { name: 'Hyper Blue', value: '#0057B8', image: 'https://cms-cdn.thesolesupplier.co.uk/2023/03/nike-tn-air-max-plus-og-hyper-blue-2.jpg' },
            { name: 'Negro/Blanco', value: '#1a1a2e', image: 'https://cms-cdn.thesolesupplier.co.uk/2023/03/nike-tn-air-max-plus-og-hyper-blue-2.jpg' },
            { name: 'Rojo/Blanco', value: '#C8102E', image: 'https://cms-cdn.thesolesupplier.co.uk/2023/03/nike-tn-air-max-plus-og-hyper-blue-2.jpg' }
        ],
        sizes: ['38', '39', '40', '41', '42', '43', '44']
    },
    {
        id: 8,
        name: 'Pantalones Urbanos',
        price: '₡24.900',
        desc: 'Pantalones estilo urbano con diseño costarricense. Cómodos, duraderos y con estilo para el día a día.',
        category: 'Pantalones Urbanos',
        rating: 4.4,
        specs: {
            'Material': 'Algodón y poliéster',
            'Corte': 'Holgado',
            'Estilo': 'Urbano y moderno',
            'Uso': 'Casual y diario'
        },
        colors: [
            { name: 'Negro', value: '#1a1a2e', image: 'https://i.pinimg.com/originals/31/40/a3/3140a3ba5117866a303d6cfaab217171.jpg' },
            { name: 'Gris', value: '#888888', image: 'https://i.pinimg.com/originals/31/40/a3/3140a3ba5117866a303d6cfaab217171.jpg' },
            { name: 'Azul Marino', value: '#002B5C', image: 'https://i.pinimg.com/originals/31/40/a3/3140a3ba5117866a303d6cfaab217171.jpg' }
        ],
        sizes: ['S', 'M', 'L', 'XL', 'XXL']
    }
];

// ====== VARIABLES DE ESTADO ======
let currentProductId = 0;
let selectedColor = 0;
let selectedSize = 0;

// ====== ABRIR DETALLE ======
function openDetail(productId) {
    currentProductId = productId;
    selectedColor = 0;
    selectedSize = 0;
    renderDetail(productId);
    detailPanel.classList.add('active');
    document.body.style.overflow = 'hidden';
}

// ====== CERRAR DETALLE ======
closeDetail.addEventListener('click', () => {
    detailPanel.classList.remove('active');
    document.body.style.overflow = 'auto';
});

// Cerrar al hacer clic fuera
document.addEventListener('click', (e) => {
    if (detailPanel.classList.contains('active') && 
        !detailPanel.contains(e.target) && 
        !e.target.closest('.product-card')) {
        detailPanel.classList.remove('active');
        document.body.style.overflow = 'auto';
    }
});

// ====== RENDERIZAR DETALLE ======
function renderDetail(productId) {
    const product = productData[productId];
    if (!product) return;

    const color = product.colors[selectedColor];
    const size = product.sizes[selectedSize] || product.sizes[0];
    
    const mainImage = color.image || product.colors[0].image;
    const stars = '⭐'.repeat(Math.floor(product.rating)) + '☆'.repeat(5 - Math.floor(product.rating));

    const specsHTML = Object.entries(product.specs).map(([key, value]) => `
        <div class="spec-item">
            <i class="fas fa-check-circle"></i>
            <span><strong>${key}:</strong> ${value}</span>
        </div>
    `).join('');

    detailContent.innerHTML = `
        <div class="detail-header">
            <button id="closeDetailInner" class="close-detail">✕</button>
        </div>
        
        <div class="detail-gallery">
            <div class="detail-main-image" id="mainImage" 
                 style="background: url('${mainImage}') center/cover; transition: background-image 0.4s ease;">
            </div>
            <div class="detail-thumbnails">
                ${product.colors.map((c, index) => `
                    <div class="thumbnail ${index === selectedColor ? 'active' : ''}" 
                         style="background: url('${c.image}') center/cover;"
                         onclick="selectColor(${index})">
                    </div>
                `).join('')}
            </div>
        </div>
        
        <h2 class="detail-title">${product.name}</h2>
        <p class="detail-price">${product.price}</p>
        <div class="detail-rating">
            ${stars} <span>(${product.rating} / 5.0)</span>
        </div>
        <p class="detail-desc">${product.desc}</p>
        
        <div class="detail-specs">
            ${specsHTML}
        </div>
        
        <div class="detail-section">
            <h4>🎨 Colores disponibles</h4>
            <div class="color-options">
                ${product.colors.map((c, index) => `
                    <div class="color-option ${index === selectedColor ? 'active' : ''}" 
                         style="background: ${c.value};"
                         onclick="selectColor(${index})"
                         title="${c.name}">
                    </div>
                `).join('')}
            </div>
        </div>
        
        <div class="detail-section">
            <h4>👟 Tallas disponibles</h4>
            <div class="size-options">
                ${product.sizes.map((s, index) => `
                    <div class="size-option ${index === selectedSize ? 'active' : ''}" 
                         onclick="selectSize(${index})">
                        ${s}
                    </div>
                `).join('')}
            </div>
        </div>
        
        <button class="btn-add-detail" onclick="addToCartFromDetail()">
            <i class="fas fa-shopping-cart"></i> Agregar al carrito - ${product.price}
        </button>
    `;

    document.getElementById('closeDetailInner').addEventListener('click', () => {
        detailPanel.classList.remove('active');
        document.body.style.overflow = 'auto';
    });
}

// ====== SELECCIONAR COLOR ======
function selectColor(index) {
    selectedColor = index;
    const product = productData[currentProductId];
    const color = product.colors[index];
    
    const mainImage = document.getElementById('mainImage');
    if (mainImage) {
        mainImage.style.background = `url('${color.image}') center/cover`;
    }
    
    document.querySelectorAll('.thumbnail').forEach((thumb, i) => {
        thumb.classList.toggle('active', i === index);
    });
    
    document.querySelectorAll('.color-option').forEach((circle, i) => {
        circle.classList.toggle('active', i === index);
    });
    
    showToast(`🎨 Color seleccionado: ${color.name}`);
}

// ====== SELECCIONAR TALLA ======
function selectSize(index) {
    selectedSize = index;
    document.querySelectorAll('.size-option').forEach((btn, i) => {
        btn.classList.toggle('active', i === index);
    });
    const product = productData[currentProductId];
    showToast(`👟 Talla seleccionada: ${product.sizes[index]}`);
}

// =====================================================
// ====== ANIMACIÓN DEL CARRITO VOLANDO ======
// =====================================================

const flyingItem = document.getElementById('flyingItem');
const shippingBanner = document.querySelector('.shipping-banner');

function animateCartToBanner(buttonElement) {
    const buttonRect = buttonElement.getBoundingClientRect();
    const bannerRect = shippingBanner.getBoundingClientRect();
    
    const startX = buttonRect.left + buttonRect.width / 2 - 25;
    const startY = buttonRect.top + buttonRect.height / 2 - 25;
    const endX = bannerRect.left + bannerRect.width / 2 - 25;
    const endY = bannerRect.top + bannerRect.height / 2 - 25;
    
    flyingItem.style.left = startX + 'px';
    flyingItem.style.top = startY + 'px';
    flyingItem.style.opacity = '1';
    flyingItem.style.transform = 'scale(1)';
    
    void flyingItem.offsetWidth;
    
    flyingItem.style.transition = 'all 0.8s cubic-bezier(0.34, 1.56, 0.64, 1)';
    flyingItem.style.left = endX + 'px';
    flyingItem.style.top = endY + 'px';
    flyingItem.style.transform = 'scale(1.3)';
    
    setTimeout(() => {
        flyingItem.style.opacity = '0';
        flyingItem.style.transform = 'scale(0.5)';
        shippingBanner.classList.add('pulse');
        setTimeout(() => {
            shippingBanner.classList.remove('pulse');
        }, 1800);
        updateBannerCount();
    }, 850);
}

function updateBannerCount() {
    let bannerCount = document.querySelector('.banner-cart-count');
    const cartCount = cart.length;
    
    if (!bannerCount) {
        const bannerText = shippingBanner.querySelector('.shipping-content div');
        if (bannerText) {
            bannerCount = document.createElement('span');
            bannerCount.className = 'banner-cart-count';
            bannerCount.textContent = cartCount;
            bannerText.appendChild(bannerCount);
        }
    } else {
        bannerCount.textContent = cartCount;
    }
    
    const count = document.querySelector('.banner-cart-count');
    if (count) {
        count.style.display = cartCount === 0 ? 'none' : 'inline-block';
    }
}

// =====================================================
// ====== WHATSAPP AUTOMÁTICO - CORREGIDO ======
// =====================================================

const WHATSAPP_NUMBER = '50670225685';

function openWhatsApp(productName) {
    try {
        const cleanName = productName.replace(/[^a-zA-Z0-9áéíóúÁÉÍÓÚñÑ ]/g, '').trim();
        const message = `¡Hola! 👋 ¿Hay disponibles *${cleanName}*? 👟`;
        const encodedMessage = encodeURIComponent(message);
        const whatsappURL = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodedMessage}`;
        
        console.log(`📱 Abriendo WhatsApp para: ${cleanName}`);
        console.log(`📱 URL: ${whatsappURL}`);
        
        // Abrir WhatsApp
        window.open(whatsappURL, '_blank');
        
        // También mostrar un mensaje en la página
        showToast(`📱 Abriendo WhatsApp para ${cleanName}...`);
        
    } catch (error) {
        console.error('❌ Error al abrir WhatsApp:', error);
        showToast('❌ Error al abrir WhatsApp. Intenta de nuevo.');
    }
}

// ====== AGREGAR PRODUCTO AL CARRITO (CON WHATSAPP) ======
function addToCart(productName, productPrice, productImage) {
    const product = {
        id: Date.now() + Math.random(),
        name: productName,
        price: productPrice,
        image: productImage
    };
    
    cart.push(product);
    updateCart();
    showToast(`✓ ${productName} agregado al carrito`);
}

// ====== MANEJADOR DE CLICK EN BOTONES "+" ======
function handleAddToCart(e) {
    e.stopPropagation();
    const button = this;
    const productCard = button.closest('.product-card');
    
    if (!productCard) {
        console.error('❌ No se encontró el producto');
        return;
    }
    
    const productName = productCard.querySelector('h4').textContent;
    const productPrice = productCard.querySelector('.price').textContent;
    const productImage = productCard.querySelector('.product-image').style.background;
    
    console.log(`🛒 Agregando: ${productName}`);
    
    // Agregar al carrito
    addToCart(productName, productPrice, productImage);
    
    // Animación del botón
    button.style.transform = 'scale(0.8)';
    setTimeout(() => {
        button.style.transform = 'scale(1)';
    }, 200);
    
    // Animación voladora
    animateCartToBanner(button);
    
    // ABRIR WHATSAPP
    setTimeout(() => {
        openWhatsApp(productName);
    }, 600);
}

// ====== ASIGNAR EVENTOS A LOS BOTONES ======
// Primero, remover eventos anteriores
document.querySelectorAll('.btn-add').forEach(button => {
    button.removeEventListener('click', handleAddToCart);
});

// Luego, agregar el nuevo evento
document.querySelectorAll('.btn-add').forEach(button => {
    button.addEventListener('click', handleAddToCart);
});

console.log('✅ Botones configurados con WhatsApp');

// ====== AGREGAR DESDE DETALLE (CON WHATSAPP) ======
function addToCartFromDetail() {
    const product = productData[currentProductId];
    if (!product) {
        console.error('❌ Producto no encontrado');
        return;
    }
    
    const color = product.colors[selectedColor];
    const size = product.sizes[selectedSize] || product.sizes[0];
    const productName = `${product.name} (${color.name}, Talla ${size})`;
    const productPrice = product.price;
    const productImage = color.image || product.colors[0].image;
    
    console.log(`🛒 Agregando desde detalle: ${productName}`);
    
    addToCart(productName, productPrice, `url('${productImage}')`);
    
    const detailButton = document.querySelector('.btn-add-detail');
    if (detailButton) {
        animateCartToBanner(detailButton);
    }
    
    setTimeout(() => {
        openWhatsApp(product.name);
    }, 600);
    
    detailPanel.classList.remove('active');
    document.body.style.overflow = 'auto';
}

// ====== INICIALIZAR ======
document.addEventListener('DOMContentLoaded', () => {
    updateBannerCount();
    console.log('🇨🇷 Chompistore - Tienda Urbana');
    console.log('🛒 Carrito con animación voladora y WhatsApp automático activos');
    console.log(`📱 Número de WhatsApp: +${WHATSAPP_NUMBER}`);
});

console.log('✅ Código cargado correctamente');
