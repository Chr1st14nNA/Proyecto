// public/js/api.js — Utilidades de comunicación con la API
const API_BASE = '/api';

// Obtener token del localStorage
function getToken() {
    return localStorage.getItem('token');
}

// Headers con autenticación
function authHeaders() {
    return {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${getToken()}`
    };
}

// Petición genérica
async function apiFetch(endpoint, options = {}) {
    const res = await fetch(`${API_BASE}${endpoint}`, {
        headers: { 'Content-Type': 'application/json', ...options.headers },
        ...options
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Error en la solicitud');
    return data;
}

// Petición autenticada
async function authFetch(endpoint, options = {}) {
    return apiFetch(endpoint, {
        ...options,
        headers: { ...authHeaders(), ...options.headers }
    });
}

// Toast notifications
function showToast(message, type = 'info') {
    const container = document.getElementById('toast-container') || createToastContainer();
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    const icons = { success: '✓', error: '✕', info: 'ℹ' };
    toast.innerHTML = `<span>${icons[type] || 'ℹ'}</span><span>${message}</span>`;
    container.appendChild(toast);
    setTimeout(() => toast.remove(), 3200);
}

function createToastContainer() {
    const div = document.createElement('div');
    div.id = 'toast-container';
    document.body.appendChild(div);
    return div;
}

// Verificar sesión
function getUser() {
    const userStr = localStorage.getItem('user');
    if (!userStr) return null;
    try { return JSON.parse(userStr); } catch { return null; }
}

function isLoggedIn() {
    return !!(getToken() && getUser());
}

function logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '/login';
}

// Formatear precio en pesos mexicanos
function formatPrice(price) {
    return new Intl.NumberFormat('es-MX', {
        style: 'currency', currency: 'MXN', minimumFractionDigits: 2
    }).format(price);
}

// Actualizar badge del carrito en el navbar
async function updateCartBadge() {
    if (!isLoggedIn()) return;
    try {
        const data = await authFetch('/cart');
        const badge = document.getElementById('cart-badge');
        if (badge) badge.textContent = data.items.length;
    } catch (e) { /* silencioso */ }
}

// Renderizar navbar dinámico según sesión
function renderNavbar() {
    const user = getUser();
    const authEl = document.getElementById('nav-auth');
    if (!authEl) return;

    if (user) {
        authEl.innerHTML = `
            <li><a href="/perfil" id="nav-perfil">👤 ${user.nombre.split(' ')[0]}</a></li>
            <li><a href="/carrito" class="cart-badge" id="nav-carrito">
                🛒 Carrito <span class="badge" id="cart-badge">0</span>
            </a></li>
            <li><a href="#" onclick="logout()" class="btn-nav-auth">Salir</a></li>
        `;
        updateCartBadge();
    } else {
        authEl.innerHTML = `
            <li><a href="/login" class="btn-nav-auth">Iniciar Sesión</a></li>
        `;
    }
}

// Redirigir si no está logueado
function requireAuth() {
    if (!isLoggedIn()) {
        window.location.href = '/login';
    }
}

// Obtener parámetro de URL
function getParam(name) {
    return new URLSearchParams(window.location.search).get(name);
}
