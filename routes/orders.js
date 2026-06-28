// routes/orders.js — Rutas de pedidos y checkout
const express = require('express');
const jwt     = require('jsonwebtoken');
const db      = require('../database/db');
const router  = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || 'tienda_secret_key_2025';

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

// ─── POST /api/orders — Realizar compra (checkout) ───────────
router.post('/', auth, (req, res) => {
    const { direccion_envio, ciudad, codigo_postal, telefono_envio, notas } = req.body;
    if (!direccion_envio || !ciudad) {
        return res.status(400).json({ error: 'Dirección y ciudad son requeridos.' });
    }

    // Obtener carrito del usuario
    const cartItems = db.prepare(`
        SELECT ci.cantidad, p.id AS product_id, p.nombre, p.precio, p.stock
        FROM cart_items ci
        JOIN products p ON ci.product_id = p.id
        WHERE ci.user_id = ?
    `).all(req.user.id);

    if (cartItems.length === 0) {
        return res.status(400).json({ error: 'El carrito está vacío.' });
    }

    // Verificar stock de todos los productos
    for (const item of cartItems) {
        if (item.stock < item.cantidad) {
            return res.status(400).json({
                error: `Stock insuficiente para "${item.nombre}". Disponibles: ${item.stock}`
            });
        }
    }

    // Calcular total
    const total = cartItems.reduce((sum, i) => sum + (i.precio * i.cantidad), 0);

    // Transacción: crear orden, insertar ítems, descontar stock, vaciar carrito
    const createOrder = db.transaction(() => {
        const orderResult = db.prepare(`
            INSERT INTO orders (user_id, total, estado, direccion_envio, ciudad, codigo_postal, telefono_envio, notas)
            VALUES (?, ?, 'confirmado', ?, ?, ?, ?, ?)
        `).run(req.user.id, total, direccion_envio, ciudad, codigo_postal || '', telefono_envio || '', notas || '');

        const orderId = orderResult.lastInsertRowid;

        for (const item of cartItems) {
            db.prepare(
                'INSERT INTO order_items (order_id, product_id, cantidad, precio_unitario) VALUES (?, ?, ?, ?)'
            ).run(orderId, item.product_id, item.cantidad, item.precio);

            db.prepare('UPDATE products SET stock = stock - ? WHERE id = ?')
              .run(item.cantidad, item.product_id);
        }

        db.prepare('DELETE FROM cart_items WHERE user_id = ?').run(req.user.id);

        return orderId;
    });

    try {
        const orderId = createOrder();
        res.status(201).json({ message: 'Compra realizada con éxito.', orderId, total });
    } catch (err) {
        res.status(500).json({ error: 'Error al procesar la compra.' });
    }
});

// ─── GET /api/orders — Historial de pedidos ──────────────────
router.get('/', auth, (req, res) => {
    const orders = db.prepare(`
        SELECT o.*, COUNT(oi.id) AS num_productos
        FROM orders o
        LEFT JOIN order_items oi ON o.id = oi.order_id
        WHERE o.user_id = ?
        GROUP BY o.id
        ORDER BY o.created_at DESC
    `).all(req.user.id);
    res.json(orders);
});

// ─── GET /api/orders/:id — Detalle de un pedido ──────────────
router.get('/:id', auth, (req, res) => {
    const order = db.prepare('SELECT * FROM orders WHERE id = ? AND user_id = ?').get(req.params.id, req.user.id);
    if (!order) return res.status(404).json({ error: 'Pedido no encontrado.' });

    const items = db.prepare(`
        SELECT oi.*, p.nombre, p.imagen
        FROM order_items oi
        JOIN products p ON oi.product_id = p.id
        WHERE oi.order_id = ?
    `).all(req.params.id);

    res.json({ ...order, items });
});

module.exports = router;
