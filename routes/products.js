// routes/products.js — Rutas de productos
const express = require('express');
const db      = require('../database/db');
const router  = express.Router();

// ─── GET /api/products — Listar todos (con filtros opcionales) ─
router.get('/', (req, res) => {
    const { category, search, minPrice, maxPrice, sort } = req.query;

    let query  = 'SELECT p.*, c.nombre AS categoria FROM products p LEFT JOIN categories c ON p.category_id = c.id WHERE 1=1';
    const params = [];

    if (category) {
        query += ' AND p.category_id = ?';
        params.push(category);
    }
    if (search) {
        query += ' AND (p.nombre LIKE ? OR p.descripcion LIKE ?)';
        params.push(`%${search}%`, `%${search}%`);
    }
    if (minPrice) {
        query += ' AND p.precio >= ?';
        params.push(Number(minPrice));
    }
    if (maxPrice) {
        query += ' AND p.precio <= ?';
        params.push(Number(maxPrice));
    }

    if (sort === 'price_asc')  query += ' ORDER BY p.precio ASC';
    else if (sort === 'price_desc') query += ' ORDER BY p.precio DESC';
    else if (sort === 'name')  query += ' ORDER BY p.nombre ASC';
    else                       query += ' ORDER BY p.id ASC';

    const products = db.prepare(query).all(...params);
    res.json(products);
});

// ─── GET /api/products/:id — Detalle de producto ─────────────
router.get('/:id', (req, res) => {
    const product = db.prepare(
        'SELECT p.*, c.nombre AS categoria FROM products p LEFT JOIN categories c ON p.category_id = c.id WHERE p.id = ?'
    ).get(req.params.id);

    if (!product) return res.status(404).json({ error: 'Producto no encontrado.' });
    res.json(product);
});

// ─── GET /api/products/categories/all — Listar categorías ────
router.get('/categories/all', (req, res) => {
    const cats = db.prepare('SELECT * FROM categories').all();
    res.json(cats);
});

module.exports = router;
