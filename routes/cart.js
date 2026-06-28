// routes/cart.js — Rutas del carrito de compras
const express = require('express');
const jwt     = require('jsonwebtoken');
const db      = require('../database/db');
const router  = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || 'tienda_secret_key_2025';

// Middleware de autenticación
function auth(req, res, next) {
    const header = req.headers.authorization;
    if (!header) return res.status(401).json({ error: 'Token requerido.' });
    try {
        req.user = jwt.verify(header.split(' ')[1], JWT_SECRET);
        next();
    } catch {
        res.status(401).json({ error: 'Token inválido.' });
    }
}

// ─── GET /api/cart — Ver carrito ──────────────────────────────
router.get('/', auth, (req, res) => {
    const items = db.prepare(`
        SELECT ci.id, ci.cantidad, p.id AS product_id, p.nombre, p.precio, p.imagen, p.stock,
               (ci.cantidad * p.precio) AS subtotal
        FROM cart_items ci
        JOIN products p ON ci.product_id = p.id
        WHERE ci.user_id = ?
    `).all(req.user.id);

    const total = items.reduce((sum, i) => sum + i.subtotal, 0);
    res.json({ items, total });
});

// ─── POST /api/cart — Agregar/actualizar producto ─────────────
router.post('/', auth, (req, res) => {
    const { product_id, cantidad = 1 } = req.body;
    if (!product_id) return res.status(400).json({ error: 'product_id requerido.' });

    const product = db.prepare('SELECT * FROM products WHERE id = ?').get(product_id);
    if (!product) return res.status(404).json({ error: 'Producto no encontrado.' });
    if (product.stock < cantidad) return res.status(400).json({ error: 'Stock insuficiente.' });

    db.prepare(`
        INSERT INTO cart_items (user_id, product_id, cantidad)
        VALUES (?, ?, ?)
        ON CONFLICT(user_id, product_id) DO UPDATE SET cantidad = cantidad + ?
    `).run(req.user.id, product_id, cantidad, cantidad);

    res.json({ message: 'Producto agregado al carrito.' });
});

// ─── PUT /api/cart/:id — Actualizar cantidad ─────────────────
router.put('/:id', auth, (req, res) => {
    const { cantidad } = req.body;
    if (!cantidad || cantidad < 1) {
        // Si cantidad es 0, eliminar
        db.prepare('DELETE FROM cart_items WHERE id = ? AND user_id = ?').run(req.params.id, req.user.id);
        return res.json({ message: 'Ítem eliminado del carrito.' });
    }
    db.prepare('UPDATE cart_items SET cantidad = ? WHERE id = ? AND user_id = ?')
      .run(cantidad, req.params.id, req.user.id);
    res.json({ message: 'Carrito actualizado.' });
});

// ─── DELETE /api/cart/:id — Eliminar producto ─────────────────
router.delete('/:id', auth, (req, res) => {
    db.prepare('DELETE FROM cart_items WHERE id = ? AND user_id = ?').run(req.params.id, req.user.id);
    res.json({ message: 'Producto eliminado del carrito.' });
});

// ─── DELETE /api/cart — Vaciar carrito ───────────────────────
router.delete('/', auth, (req, res) => {
    db.prepare('DELETE FROM cart_items WHERE user_id = ?').run(req.user.id);
    res.json({ message: 'Carrito vaciado.' });
});

module.exports = router;
