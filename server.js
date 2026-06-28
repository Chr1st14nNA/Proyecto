// server.js — Servidor principal Express
const express = require('express');
const cors    = require('cors');
const path    = require('path');

const app  = express();
const PORT = process.env.PORT || 3000;

// ─── Middlewares ──────────────────────────────────────────────
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Servir vistas HTML
app.use('/views', express.static(path.join(__dirname, 'views')));

// ─── Rutas de la API ──────────────────────────────────────────
app.use('/api/auth',     require('./routes/auth'));
app.use('/api/products', require('./routes/products'));
app.use('/api/cart',     require('./routes/cart'));
app.use('/api/orders',   require('./routes/orders'));

// ─── Rutas del frontend (SPA) ─────────────────────────────────
app.get('/',          (req, res) => res.sendFile(path.join(__dirname, 'views', 'index.html')));
app.get('/login',     (req, res) => res.sendFile(path.join(__dirname, 'views', 'login.html')));
app.get('/carrito',   (req, res) => res.sendFile(path.join(__dirname, 'views', 'cart.html')));
app.get('/checkout',  (req, res) => res.sendFile(path.join(__dirname, 'views', 'checkout.html')));
app.get('/perfil',    (req, res) => res.sendFile(path.join(__dirname, 'views', 'profile.html')));
app.get('/producto',  (req, res) => res.sendFile(path.join(__dirname, 'views', 'product.html')));

// ─── Start ────────────────────────────────────────────────────
app.listen(PORT, () => {
    console.log(`\n🛒  Tienda Online corriendo en: http://localhost:${PORT}`);
    console.log(`📦  API disponible en:          http://localhost:${PORT}/api`);
    console.log(`\nPresiona Ctrl+C para detener el servidor.\n`);
});
