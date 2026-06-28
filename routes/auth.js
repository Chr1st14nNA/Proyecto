// routes/auth.js — Rutas de autenticación (registro e inicio de sesión)
const express  = require('express');
const bcrypt   = require('bcryptjs');
const jwt      = require('jsonwebtoken');
const db       = require('../database/db');

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || 'tienda_secret_key_2025';

// ─── POST /api/auth/register ────────────────────────────────
router.post('/register', (req, res) => {
    const { nombre, email, password, telefono } = req.body;

    if (!nombre || !email || !password) {
        return res.status(400).json({ error: 'Nombre, email y contraseña son requeridos.' });
    }

    // Verificar si el email ya existe
    const existing = db.prepare('SELECT id FROM users WHERE email = ?').get(email);
    if (existing) {
        return res.status(409).json({ error: 'El email ya está registrado.' });
    }

    // Hashear contraseña
    const hashedPassword = bcrypt.hashSync(password, 10);

    try {
        const stmt = db.prepare(
            'INSERT INTO users (nombre, email, password, telefono) VALUES (?, ?, ?, ?)'
        );
        const result = stmt.run(nombre, email, hashedPassword, telefono || null);

        const token = jwt.sign(
            { id: result.lastInsertRowid, email, nombre },
            JWT_SECRET,
            { expiresIn: '7d' }
        );

        res.status(201).json({
            message: 'Usuario registrado correctamente.',
            token,
            user: { id: result.lastInsertRowid, nombre, email }
        });
    } catch (err) {
        res.status(500).json({ error: 'Error al registrar usuario.' });
    }
});

// ─── POST /api/auth/login ────────────────────────────────────
router.post('/login', (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ error: 'Email y contraseña son requeridos.' });
    }

    const user = db.prepare('SELECT * FROM users WHERE email = ?').get(email);
    if (!user) {
        return res.status(401).json({ error: 'Credenciales inválidas.' });
    }

    const valid = bcrypt.compareSync(password, user.password);
    if (!valid) {
        return res.status(401).json({ error: 'Credenciales inválidas.' });
    }

    const token = jwt.sign(
        { id: user.id, email: user.email, nombre: user.nombre },
        JWT_SECRET,
        { expiresIn: '7d' }
    );

    res.json({
        message: 'Inicio de sesión exitoso.',
        token,
        user: { id: user.id, nombre: user.nombre, email: user.email }
    });
});

// ─── GET /api/auth/me ────────────────────────────────────────
router.get('/me', (req, res) => {
    const authHeader = req.headers.authorization;
    if (!authHeader) return res.status(401).json({ error: 'Token requerido.' });

    try {
        const token = authHeader.split(' ')[1];
        const decoded = jwt.verify(token, JWT_SECRET);
        const user = db.prepare('SELECT id, nombre, email, telefono, created_at FROM users WHERE id = ?').get(decoded.id);
        res.json(user);
    } catch {
        res.status(401).json({ error: 'Token inválido.' });
    }
});

module.exports = router;
