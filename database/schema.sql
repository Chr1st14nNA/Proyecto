-- ============================================================
-- TIENDA EN LÍNEA — Script de Creación de Base de Datos
-- Motor: SQLite
-- Autor: Christian Navarrete Avilez
-- ============================================================

-- Tabla de usuarios
CREATE TABLE IF NOT EXISTS users (
    id          INTEGER PRIMARY KEY AUTOINCREMENT,
    nombre      TEXT    NOT NULL,
    email       TEXT    NOT NULL UNIQUE,
    password    TEXT    NOT NULL,
    telefono    TEXT,
    created_at  TEXT    DEFAULT (datetime('now'))
);

-- Tabla de categorías
CREATE TABLE IF NOT EXISTS categories (
    id          INTEGER PRIMARY KEY AUTOINCREMENT,
    nombre      TEXT    NOT NULL,
    descripcion TEXT
);

-- Tabla de productos
CREATE TABLE IF NOT EXISTS products (
    id          INTEGER PRIMARY KEY AUTOINCREMENT,
    nombre      TEXT    NOT NULL,
    descripcion TEXT,
    precio      REAL    NOT NULL,
    stock       INTEGER NOT NULL DEFAULT 0,
    imagen      TEXT    DEFAULT 'default.png',
    category_id INTEGER,
    created_at  TEXT    DEFAULT (datetime('now')),
    FOREIGN KEY (category_id) REFERENCES categories(id)
);

-- Tabla de ítems del carrito
CREATE TABLE IF NOT EXISTS cart_items (
    id          INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id     INTEGER NOT NULL,
    product_id  INTEGER NOT NULL,
    cantidad    INTEGER NOT NULL DEFAULT 1,
    FOREIGN KEY (user_id)    REFERENCES users(id)    ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
    UNIQUE(user_id, product_id)
);

-- Tabla de órdenes / pedidos
CREATE TABLE IF NOT EXISTS orders (
    id              INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id         INTEGER NOT NULL,
    total           REAL    NOT NULL,
    estado          TEXT    NOT NULL DEFAULT 'pendiente',
    direccion_envio TEXT    NOT NULL,
    ciudad          TEXT    NOT NULL,
    codigo_postal   TEXT,
    telefono_envio  TEXT,
    notas           TEXT,
    created_at      TEXT    DEFAULT (datetime('now')),
    FOREIGN KEY (user_id) REFERENCES users(id)
);

-- Tabla de ítems de cada orden
CREATE TABLE IF NOT EXISTS order_items (
    id               INTEGER PRIMARY KEY AUTOINCREMENT,
    order_id         INTEGER NOT NULL,
    product_id       INTEGER NOT NULL,
    cantidad         INTEGER NOT NULL,
    precio_unitario  REAL    NOT NULL,
    FOREIGN KEY (order_id)   REFERENCES orders(id)   ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES products(id)
);

-- ============================================================
-- DATOS INICIALES
-- ============================================================

-- Categorías
INSERT OR IGNORE INTO categories (id, nombre, descripcion) VALUES
(1, 'Electrónica',   'Dispositivos y gadgets tecnológicos'),
(2, 'Ropa',          'Prendas de vestir para toda la familia'),
(3, 'Hogar',         'Artículos para el hogar y decoración'),
(4, 'Deportes',      'Equipos y accesorios deportivos'),
(5, 'Libros',        'Libros y material educativo');

-- Productos de ejemplo
INSERT OR IGNORE INTO products (id, nombre, descripcion, precio, stock, imagen, category_id) VALUES
(1,  'Laptop UltraBook Pro',      'Procesador Intel i7, 16GB RAM, 512GB SSD, pantalla 15.6"',              14999.00, 15, 'laptop.jpg',      1),
(2,  'Smartphone Galaxy X20',     'Pantalla AMOLED 6.5", 128GB, cámara 108MP, batería 5000mAh',            8499.00,  25, 'phone.jpg',       1),
(3,  'Audífonos Bluetooth Pro',   'Cancelación de ruido activa, 30h de batería, audio Hi-Fi',              1299.00,  40, 'headphones.jpg',  1),
(4,  'Smartwatch FitPro',         'Monitor de ritmo cardíaco, GPS, resistente al agua IP68',               2199.00,  30, 'watch.jpg',       1),
(5,  'Tablet Zen 10"',            'Pantalla 10 pulgadas FHD, 64GB, WiFi + LTE, lápiz incluido',            5499.00,  20, 'tablet.jpg',      1),
(6,  'Camiseta Premium Dry-Fit',  'Tela transpirable, ideal para entrenamiento, varios colores',             299.00, 100, 'shirt.jpg',       2),
(7,  'Jeans Slim Fit',            'Denim de alta calidad, corte moderno, disponible en tallas S-XXL',       599.00,  80, 'jeans.jpg',       2),
(8,  'Chamarra Deportiva',        'Resistente al viento y lluvia, forro térmico, diseño ergonómico',        999.00,  50, 'jacket.jpg',      2),
(9,  'Zapatillas Runner Air',     'Suela de amortiguación, plantilla ortopédica, ligeras 280g',             1499.00,  60, 'shoes.jpg',       2),
(10, 'Sudadera Hoodie Urban',     'Algodón 100%, capucha ajustable, bolsillo canguro',                      449.00,  70, 'hoodie.jpg',      2),
(11, 'Silla Ergonómica Office',   'Respaldo lumbar ajustable, reposabrazos 4D, ruedas silenciosas',         3299.00,  18, 'chair.jpg',       3),
(12, 'Lámpara LED Smart',         'Control por voz/app, 16M colores, ahorro de energía A++',                799.00,  35, 'lamp.jpg',        3),
(13, 'Set de Sartenes Titanium',  'Antiadherente triple capa, apta para inducción, 3 piezas',               1199.00,  25, 'pans.jpg',        3),
(14, 'Cafetera Espresso Pro',     'Presión 15 bar, vaporizador de leche, depósito 1.5L',                    1899.00,  20, 'coffee.jpg',      3),
(15, 'Mancuernas Hex 10kg',       'Par de mancuernas hexagonales, agarre antideslizante, recubiertas',       799.00,  45, 'weights.jpg',     4),
(16, 'Bicicleta MTB Trail 29"',   'Cuadro de aluminio, 21 velocidades, frenos hidráulicos de disco',        7999.00,  12, 'bike.jpg',        4),
(17, 'Yoga Mat Premium',          'Grosor 6mm, material TPE ecológico, correa de transporte incluida',       449.00,  60, 'yoga.jpg',        4),
(18, 'Programación en Python',    'Guía completa desde cero hasta nivel avanzado, 650 páginas',              349.00,  90, 'book1.jpg',       5),
(19, 'Diseño Web Moderno',        'HTML5, CSS3, JavaScript y frameworks modernos, incluye proyectos',        299.00,  75, 'book2.jpg',       5),
(20, 'Inteligencia Artificial',   'Fundamentos de ML y Deep Learning con ejemplos prácticos en Python',     399.00,  55, 'book3.jpg',       5);
