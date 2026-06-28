// database/db.js — Conexión y configuración de SQLite
const Database = require('better-sqlite3');
const path     = require('path');
const fs       = require('fs');

const DB_PATH = path.join(__dirname, 'tienda.db');

const db = new Database(DB_PATH);

// Habilitar claves foráneas
db.pragma('journal_mode = WAL');
db.pragma('foreign_keys = ON');

// Inicializar esquema si es la primera vez
const schema = fs.readFileSync(path.join(__dirname, 'schema.sql'), 'utf8');
db.exec(schema);

module.exports = db;
