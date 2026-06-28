# 🛒 TechShop — Tienda en Línea

> Proyecto: **Desarrollo e Implementación de Sistemas**  
> Autor: **Christian Navarrete Avilez**  
> Institución: Universidad Autónoma de Sinaloa  
> Fecha de entrega: 28 de junio de 2026

---

## 📖 Introducción

**TechShop** es una aplicación web de comercio electrónico (e-commerce) desarrollada como proyecto integrador de la materia *Desarrollo e Implementación de Sistemas*. Permite a los usuarios registrarse con una cuenta, explorar un catálogo de productos con múltiples filtros, gestionar un carrito de compras, completar el proceso de compra con dirección de envío a domicilio y consultar su historial de pedidos. El inventario se actualiza automáticamente con cada transacción.

### Resumen del Sistema

| Característica | Detalle |
|---|---|
| Tipo | Aplicación web full-stack |
| Backend | Node.js + Express.js (API REST) |
| Frontend | HTML5 + CSS3 + JavaScript Vanilla |
| Base de Datos | SQLite (vía better-sqlite3) |
| Autenticación | JWT (JSON Web Tokens) + bcrypt |
| Arquitectura | MVC — 3 capas |
| Puerto | 3000 (localhost) |

---

## ✅ Requisitos Funcionales y No Funcionales

### Requisitos Funcionales (RF)

| ID | Requisito | Descripción |
|---|---|---|
| RF-01 | Registro de usuario | El sistema permite crear una cuenta con nombre, email, contraseña y teléfono |
| RF-02 | Inicio de sesión | El sistema autentica usuarios con email y contraseña usando JWT |
| RF-03 | Catálogo de productos | El sistema muestra todos los productos disponibles con imagen, nombre, precio y stock |
| RF-04 | Filtrado de productos | El usuario puede filtrar por categoría, rango de precio y ordenar por nombre/precio |
| RF-05 | Búsqueda de productos | El usuario puede buscar productos por nombre o descripción |
| RF-06 | Vista detallada de producto | El sistema muestra la descripción completa, stock y precio de cada producto |
| RF-07 | Agregar al carrito | El usuario autenticado puede agregar productos al carrito con cantidad |
| RF-08 | Gestión del carrito | El usuario puede modificar cantidades o eliminar productos del carrito |
| RF-09 | Proceso de compra | El usuario completa la compra proporcionando dirección de envío |
| RF-10 | Actualización de inventario | El stock de cada producto se reduce automáticamente al realizar una compra |
| RF-11 | Historial de pedidos | El usuario puede ver todos sus pedidos anteriores con detalle |
| RF-12 | Cierre de sesión | El sistema permite cerrar la sesión del usuario |

### Requisitos No Funcionales (RNF)

| ID | Requisito | Descripción |
|---|---|---|
| RNF-01 | Seguridad | Las contraseñas se almacenan hasheadas con bcrypt (salt=10) |
| RNF-02 | Autenticación stateless | Las sesiones se manejan con JWT de 7 días de expiración |
| RNF-03 | Integridad de datos | Las compras se procesan en transacciones atómicas para garantizar consistencia |
| RNF-04 | Rendimiento | SQLite WAL mode para lectura concurrente sin bloqueos |
| RNF-05 | Usabilidad | Interfaz responsive, mobile-first, con feedback visual (toasts, loaders) |
| RNF-06 | Disponibilidad | El servidor se inicia con un solo comando (`npm start`) |
| RNF-07 | Portabilidad | SQLite no requiere instalación de servidor externo |
| RNF-08 | Mantenibilidad | Código organizado en capas (rutas, BD, vistas) con separación de responsabilidades |

### Requisitos Técnicos

| Tecnología | Versión | Uso |
|---|---|---|
| Node.js | ≥ 18.x | Runtime del servidor |
| Express.js | 4.x | Framework web y API REST |
| better-sqlite3 | 9.x | ORM/Driver de SQLite |
| bcryptjs | 2.x | Hash de contraseñas |
| jsonwebtoken | 9.x | Tokens de autenticación |
| cors | 2.x | Cross-Origin Resource Sharing |
| SQLite | 3.x | Motor de base de datos |

---

## 🎯 Casos de Uso

### Diagrama de Casos de Uso

```
┌─────────────────────────────────────────────────────────────┐
│                    Sistema TechShop                          │
│                                                             │
│  ┌─────────────────────────────────────────────────────┐   │
│  │                                                     │   │
│  │   [Registrarse]           [Iniciar Sesión]          │   │
│  │        │                        │                   │   │
│  │        └───────────┬────────────┘                   │   │
│  │                    │                                │   │
│  │              <<autenticado>>                        │   │
│  │                    │                                │   │
│  │   [Ver Catálogo] ──┤── [Buscar Productos]           │   │
│  │   [Ver Detalle]    │                                │   │
│  │   [Agregar al      ├── [Gestionar Carrito]          │   │
│  │    Carrito]        │       - Modificar cantidad     │   │
│  │                    │       - Eliminar producto      │   │
│  │                    │       - Vaciar carrito         │   │
│  │                    │                                │   │
│  │                    ├── [Realizar Compra]            │   │
│  │                    │       - Ingresar dirección     │   │
│  │                    │       - Confirmar pedido       │   │
│  │                    │                                │   │
│  │                    └── [Ver Historial Pedidos]      │   │
│  │                                                     │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                             │
│  👤 Usuario (cliente)                                       │
└─────────────────────────────────────────────────────────────┘
```

### Descripción de Casos de Uso Principales

#### CU-01: Registrarse
| Campo | Descripción |
|---|---|
| **Actor** | Usuario no autenticado |
| **Precondición** | El usuario no tiene cuenta |
| **Flujo Principal** | 1. Accede a /login → 2. Selecciona "Crear Cuenta" → 3. Ingresa nombre, email, contraseña → 4. El sistema valida y crea la cuenta → 5. Se genera JWT y redirige al catálogo |
| **Flujo Alternativo** | Si el email ya existe → el sistema muestra error "El email ya está registrado" |
| **Postcondición** | Usuario autenticado con sesión activa |

#### CU-02: Iniciar Sesión
| Campo | Descripción |
|---|---|
| **Actor** | Usuario registrado |
| **Precondición** | El usuario tiene cuenta |
| **Flujo Principal** | 1. Accede a /login → 2. Ingresa email y contraseña → 3. Sistema valida credenciales con bcrypt → 4. Se genera JWT → 5. Redirige al catálogo |
| **Flujo Alternativo** | Credenciales incorrectas → "Credenciales inválidas" |
| **Postcondición** | Token JWT almacenado en localStorage |

#### CU-03: Agregar Producto al Carrito
| Campo | Descripción |
|---|---|
| **Actor** | Usuario autenticado |
| **Precondición** | Sesión activa, producto con stock > 0 |
| **Flujo Principal** | 1. Busca/filtra producto → 2. Hace clic en "Agregar al Carrito" → 3. Sistema verifica stock → 4. Inserta/actualiza cart_items → 5. Muestra notificación de éxito |
| **Flujo Alternativo** | Sin sesión → redirige a /login; Sin stock → botón deshabilitado |
| **Postcondición** | Producto en cart_items del usuario |

#### CU-04: Realizar Compra (Checkout)
| Campo | Descripción |
|---|---|
| **Actor** | Usuario autenticado |
| **Precondición** | Carrito con al menos un producto |
| **Flujo Principal** | 1. Va a /checkout → 2. Ingresa dirección de envío → 3. Confirma compra → 4. Sistema verifica stock, crea orden, descuenta inventario, vacía carrito → 5. Muestra confirmación con número de pedido |
| **Flujo Alternativo** | Stock insuficiente durante proceso → error descriptivo |
| **Postcondición** | Orden creada, inventario actualizado, carrito vacío |

---

## 🗃️ Entidades, Atributos y Relaciones

### Diagrama Entidad-Relación

```
┌──────────────────┐         ┌──────────────────────┐
│      USERS       │         │      CATEGORIES       │
│──────────────────│         │──────────────────────│
│ PK id (INT)      │         │ PK id (INT)           │
│    nombre (TEXT) │         │    nombre (TEXT)      │
│    email (TEXT)  │         │    descripcion (TEXT) │
│    password(TEXT)│         └──────────┬───────────┘
│    telefono(TEXT)│                    │ 1
│    created_at    │                    │
└────────┬─────────┘                   │ N
         │ 1                  ┌─────────┴────────────┐
         │                    │      PRODUCTS         │
         │ N                  │──────────────────────│
┌────────┴──────────┐         │ PK id (INT)           │
│    CART_ITEMS     │         │    nombre (TEXT)      │
│───────────────────│         │    descripcion (TEXT) │
│ PK id (INT)       │ N─────1 │    precio (REAL)      │
│ FK user_id        │         │    stock (INT)        │
│ FK product_id     │         │    imagen (TEXT)      │
│    cantidad (INT) │         │ FK category_id (INT)  │
│  UNIQUE(user,prod)│         │    created_at         │
└───────────────────┘         └──────────┬───────────┘
                                          │ N
         ┌────────────────────────────────┘
         │
┌────────┴──────────┐ N         1 ┌───────────────────┐
│   ORDER_ITEMS     │◄────────────│      ORDERS       │
│───────────────────│             │───────────────────│
│ PK id (INT)       │             │ PK id (INT)        │
│ FK order_id       │             │ FK user_id (INT)   │
│ FK product_id     │             │    total (REAL)    │
│    cantidad (INT) │             │    estado (TEXT)   │
│ precio_unitario   │             │ direccion_envio    │
│   (REAL)          │             │    ciudad (TEXT)   │
└───────────────────┘             │    codigo_postal   │
                                  │    telefono_envio  │
                                  │    notas (TEXT)    │
                                  │    created_at      │
                                  └───────────────────┘
```

### Cardinalidades
| Relación | Cardinalidad | Descripción |
|---|---|---|
| USERS — CART_ITEMS | 1 : N | Un usuario puede tener muchos ítems en el carrito |
| PRODUCTS — CART_ITEMS | 1 : N | Un producto puede estar en carritos de muchos usuarios |
| USERS — ORDERS | 1 : N | Un usuario puede tener muchos pedidos |
| ORDERS — ORDER_ITEMS | 1 : N | Un pedido puede contener muchos ítems |
| PRODUCTS — ORDER_ITEMS | 1 : N | Un producto puede aparecer en muchos pedidos |
| CATEGORIES — PRODUCTS | 1 : N | Una categoría puede tener muchos productos |

---

## 🏗️ Arquitectura del Sistema

### Tipo: Arquitectura en Capas (MVC — 3 capas)

**Justificación:** Se eligió la arquitectura MVC porque:
1. **Separación de responsabilidades** — Cada capa tiene una función clara y específica
2. **Mantenibilidad** — Los cambios en la UI no afectan la lógica de negocio
3. **Escalabilidad** — Fácil agregar nuevas rutas, modelos o vistas sin romper el sistema
4. **Testabilidad** — Las capas pueden probarse de forma independiente
5. **Estándar de la industria** — Ampliamente adoptado en aplicaciones web

### Diagrama de Componentes

```
┌────────────────────────────────────────────────────────────┐
│                      CLIENTE (Browser)                      │
│   ┌─────────────┐  ┌──────────────┐  ┌─────────────────┐  │
│   │  index.html │  │  login.html  │  │   cart.html     │  │
│   │  (Catálogo) │  │  (Auth)      │  │   checkout.html │  │
│   │  product.html  │  profile.html│  │                 │  │
│   └──────┬──────┘  └──────┬───────┘  └────────┬────────┘  │
│          │         JS (api.js) — fetch/JWT     │           │
└──────────┼─────────────────────────────────────┼───────────┘
           │ HTTP Requests                        │
           ▼                                      ▼
┌────────────────────────────────────────────────────────────┐
│                  SERVIDOR (Node.js + Express)               │
│                                                            │
│  ┌──────────────────────────────────────────────────────┐  │
│  │                   server.js (Entry)                   │  │
│  │  Middleware: cors | express.json | static files       │  │
│  └────────────────────┬─────────────────────────────────┘  │
│                       │                                    │
│  ┌────────────────────┼────────────────────────────────┐   │
│  │              CAPA DE RUTAS (Controllers)             │   │
│  │  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌────────┐ │   │
│  │  │ auth.js  │ │products.js│ │ cart.js  │ │orders.js│ │   │
│  │  │ /register│ │ GET /    │ │ GET      │ │ POST / │ │   │
│  │  │ /login   │ │ GET /:id │ │ POST     │ │ GET /  │ │   │
│  │  │ /me      │ │categories│ │ PUT /:id │ │GET /:id│ │   │
│  │  └────┬─────┘ └────┬─────┘ └────┬─────┘ └───┬────┘ │   │
│  └───────┼────────────┼────────────┼────────────┼──────┘   │
│          └────────────┼────────────┼────────────┘           │
│                       ▼                                    │
│  ┌────────────────────────────────────────────────────┐   │
│  │               CAPA DE DATOS (Model)                │   │
│  │              database/db.js + SQLite               │   │
│  │  users | categories | products | cart_items        │   │
│  │  orders | order_items                              │   │
│  └────────────────────────────────────────────────────┘   │
└────────────────────────────────────────────────────────────┘
```

### Flujo de una Petición Típica
```
Usuario hace clic "Agregar al Carrito"
    → Browser ejecuta authFetch('/cart', POST)
    → Express recibe en /api/cart
    → Middleware JWT verifica token
    → routes/cart.js valida datos
    → database/db.js ejecuta INSERT en cart_items
    → Respuesta JSON 200 OK
    → Browser muestra toast de éxito
```

---

## 🎨 Diseño de Interfaz

### Páginas del Sistema

| Página | Ruta | Descripción |
|---|---|---|
| Catálogo | `/` | Página principal con grid de productos, filtros y búsqueda |
| Login/Registro | `/login` | Formulario dual con tabs para iniciar sesión o crear cuenta |
| Detalle Producto | `/producto?id=N` | Vista completa del producto con selector de cantidad |
| Carrito | `/carrito` | Lista de productos seleccionados con resumen de compra |
| Checkout | `/checkout` | Formulario de dirección + confirmación de pedido |
| Perfil | `/perfil` | Datos del usuario + historial de pedidos |

### Sistema de Diseño
- **Paleta**: Dark mode (fondo #0a0a12) con acentos violeta (#7c3aed) y cian (#06b6d4)
- **Tipografía**: Outfit (Google Fonts) — 300/400/600/700/800
- **Estilo**: Glassmorphism (backdrop-filter blur + bordes semitransparentes)
- **Animaciones**: Hover lift, spinner de carga, toast notifications, modal pop-in

---

## 📁 Estructura del Proyecto

```
tienda-online/
├── server.js                 # Entrada del servidor Express
├── package.json              # Dependencias y scripts
│
├── database/
│   ├── db.js                 # Conexión y configuración SQLite
│   ├── schema.sql            # Script DDL + datos de prueba
│   └── tienda.db             # BD generada automáticamente al iniciar
│
├── routes/
│   ├── auth.js               # POST /register, POST /login, GET /me
│   ├── products.js           # GET /products, GET /products/:id
│   ├── cart.js               # GET/POST/PUT/DELETE /cart
│   └── orders.js             # POST/GET /orders, GET /orders/:id
│
├── public/
│   ├── css/
│   │   └── styles.css        # Estilos globales (variables, cards, botones, etc.)
│   └── js/
│       └── api.js            # Utilidades compartidas (apiFetch, auth, toast)
│
├── views/
│   ├── index.html            # Catálogo de productos
│   ├── login.html            # Login y registro
│   ├── product.html          # Detalle de producto
│   ├── cart.html             # Carrito de compras
│   ├── checkout.html         # Proceso de pago
│   └── profile.html          # Perfil e historial
│
└── README.md                 # Esta documentación
```

---

## ⚙️ Instalación y Configuración

### Requisitos Previos
- **Node.js** v18 o superior — [nodejs.org](https://nodejs.org)
- **npm** (incluido con Node.js)

### Pasos de Instalación

```bash
# 1. Entrar al directorio del proyecto
cd tienda-online

# 2. Instalar dependencias
npm install

# 3. Iniciar el servidor
npm start
```

### Variables de Entorno (Opcional)
```bash
PORT=3000            # Puerto del servidor (default: 3000)
JWT_SECRET=mi_clave  # Clave secreta para JWT (tiene default seguro)
```

La base de datos **se crea automáticamente** al primer inicio en `database/tienda.db` con todas las tablas y 20 productos de ejemplo precargados.

---

## 🚀 Uso y Operación del Sistema

### Flujo de Usuario Completo

```
1. Acceder a http://localhost:3000
2. Clic en "Crear Cuenta Gratis" → Registrarse con email y contraseña
3. Explorar el catálogo → Filtrar por categoría / precio / búsqueda
4. Clic en un producto → Ver detalle → Seleccionar cantidad
5. Clic en "Agregar al Carrito"
6. Ir al carrito → Revisar productos → Ajustar cantidades si es necesario
7. Clic en "Proceder al Pago" → Ingresar dirección de envío
8. Confirmar compra → ¡Pedido confirmado! (inventario actualizado)
9. Ver historial de pedidos en "Mi Perfil"
```

### API REST — Endpoints

| Método | Endpoint | Descripción | Auth |
|---|---|---|---|
| POST | `/api/auth/register` | Registrar usuario | ✗ |
| POST | `/api/auth/login` | Iniciar sesión | ✗ |
| GET  | `/api/auth/me` | Datos del usuario actual | ✓ |
| GET  | `/api/products` | Listar productos (filtros: category, search, sort, maxPrice) | ✗ |
| GET  | `/api/products/:id` | Detalle de producto | ✗ |
| GET  | `/api/products/categories/all` | Listar categorías | ✗ |
| GET  | `/api/cart` | Ver carrito del usuario | ✓ |
| POST | `/api/cart` | Agregar producto al carrito | ✓ |
| PUT  | `/api/cart/:id` | Actualizar cantidad de ítem | ✓ |
| DELETE | `/api/cart/:id` | Eliminar ítem del carrito | ✓ |
| DELETE | `/api/cart` | Vaciar carrito | ✓ |
| POST | `/api/orders` | Realizar compra | ✓ |
| GET  | `/api/orders` | Historial de pedidos | ✓ |
| GET  | `/api/orders/:id` | Detalle de pedido | ✓ |

---

## 🗄️ Base de Datos (Modelado)

### Script de Creación (DDL)

```sql
-- Tabla de usuarios
CREATE TABLE IF NOT EXISTS users (
    id          INTEGER PRIMARY KEY AUTOINCREMENT,
    nombre      TEXT    NOT NULL,
    email       TEXT    NOT NULL UNIQUE,
    password    TEXT    NOT NULL,  -- bcrypt hash
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

-- Carrito de compras
CREATE TABLE IF NOT EXISTS cart_items (
    id          INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id     INTEGER NOT NULL,
    product_id  INTEGER NOT NULL,
    cantidad    INTEGER NOT NULL DEFAULT 1,
    FOREIGN KEY (user_id)    REFERENCES users(id)    ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
    UNIQUE(user_id, product_id)
);

-- Órdenes de compra
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

-- Ítems de cada orden
CREATE TABLE IF NOT EXISTS order_items (
    id               INTEGER PRIMARY KEY AUTOINCREMENT,
    order_id         INTEGER NOT NULL,
    product_id       INTEGER NOT NULL,
    cantidad         INTEGER NOT NULL,
    precio_unitario  REAL    NOT NULL,
    FOREIGN KEY (order_id)   REFERENCES orders(id) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES products(id)
);
```

### Datos de Prueba
El sistema incluye **5 categorías** y **20 productos** precargados en `database/schema.sql`:
- 💻 Electrónica (5 productos): Laptop, Smartphone, Audífonos, Smartwatch, Tablet
- 👗 Ropa (5 productos): Camiseta, Jeans, Chamarra, Zapatillas, Sudadera  
- 🏠 Hogar (4 productos): Silla Ergonómica, Lámpara LED, Sartenes, Cafetera
- ⚽ Deportes (3 productos): Mancuernas, Bicicleta MTB, Yoga Mat
- 📚 Libros (3 productos): Python, Diseño Web, Inteligencia Artificial

---

## 🔐 Seguridad Implementada

| Mecanismo | Implementación |
|---|---|
| Hash de contraseñas | bcryptjs con salt rounds = 10 |
| Autenticación | JWT con expiración de 7 días |
| Validación de stock | Verificación antes de agregar al carrito y al comprar |
| Transacciones atómicas | SQLite transactions en el proceso de checkout |
| Claves foráneas | `PRAGMA foreign_keys = ON` en SQLite |
| CORS | Configurado con el paquete cors |

---

## 📝 Conclusión

El proyecto **TechShop** logra implementar todos los requisitos solicitados: una tienda en línea funcional con autenticación real usando base de datos, catálogo de productos con filtros múltiples, carrito de compras modificable, proceso de checkout con dirección de envío y actualización automática del inventario.

La arquitectura **MVC de 3 capas** resultó ideal para este tipo de aplicación: permite separar claramente la presentación (HTML/JS), la lógica de negocio (rutas Express) y los datos (SQLite), facilitando tanto el desarrollo como el mantenimiento futuro del sistema.

El uso de **SQLite** fue una decisión acertada para el contexto académico, ya que elimina la necesidad de instalar y configurar un servidor de base de datos externo, mientras que `better-sqlite3` proporciona operaciones síncronas que simplifican el código del servidor.

La aplicación demuestra conceptos fundamentales de ingeniería de software: diseño de base de datos relacional, API REST, autenticación con tokens, transacciones, y diseño orientado al usuario.

---

*Desarrollado como proyecto final — Materia: Desarrollo e Implementación de Sistemas | UAS 2026*
