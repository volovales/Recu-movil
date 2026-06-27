import * as SQLite from 'expo-sqlite';

let db: SQLite.SQLiteDatabase | null = null;

export const getDatabase = (): SQLite.SQLiteDatabase => {
  if (!db) {
    db = SQLite.openDatabaseSync('restaurante.db');
  }
  return db;
};

export const initDatabase = async (): Promise<void> => {
  const database = getDatabase();

  // Tabla de usuarios
  database.execSync(`
    CREATE TABLE IF NOT EXISTS usuarios (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      nombre TEXT NOT NULL,
      correo TEXT NOT NULL UNIQUE,
      password TEXT NOT NULL,
      rol TEXT NOT NULL DEFAULT 'cliente',
      created_at TEXT DEFAULT (datetime('now'))
    );
  `);

  // Tabla de platillos
  database.execSync(`
    CREATE TABLE IF NOT EXISTS platillos (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      nombre TEXT NOT NULL,
      descripcion TEXT NOT NULL,
      precio REAL NOT NULL,
      categoria TEXT NOT NULL,
      disponible INTEGER NOT NULL DEFAULT 1,
      created_at TEXT DEFAULT (datetime('now'))
    );
  `);

  // Tabla de pedidos (del cliente)
  database.execSync(`
    CREATE TABLE IF NOT EXISTS pedidos (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      usuario_id INTEGER NOT NULL,
      estado TEXT NOT NULL DEFAULT 'pendiente',
      total REAL NOT NULL DEFAULT 0,
      notas TEXT DEFAULT '',
      created_at TEXT DEFAULT (datetime('now')),
      FOREIGN KEY (usuario_id) REFERENCES usuarios(id)
    );
  `);

  // Tabla detalle de pedido
  database.execSync(`
    CREATE TABLE IF NOT EXISTS pedido_detalle (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      pedido_id INTEGER NOT NULL,
      platillo_id INTEGER NOT NULL,
      cantidad INTEGER NOT NULL DEFAULT 1,
      precio_unitario REAL NOT NULL,
      FOREIGN KEY (pedido_id) REFERENCES pedidos(id),
      FOREIGN KEY (platillo_id) REFERENCES platillos(id)
    );
  `);

  // Datos de ejemplo si no hay platillos
  const count = database.getFirstSync<{ count: number }>(
    'SELECT COUNT(*) as count FROM platillos'
  );

  if (count?.count === 0) {
    database.execSync(`
      INSERT INTO platillos (nombre, descripcion, precio, categoria, disponible) VALUES
        ('Tacos al Pastor', 'Carne de cerdo marinada con piña, cebolla y cilantro', 65.00, 'Tacos', 1),
        ('Tacos de Birria', 'Tacos de birria de res con consomé', 75.00, 'Tacos', 1),
        ('Tacos de Canasta', 'Surtidos: frijol, papa y chicharrón', 45.00, 'Tacos', 1),
        ('Enchiladas Verdes', 'Bañadas en salsa verde con crema y queso', 89.00, 'Entradas', 1),
        ('Quesadillas', 'Con queso oaxaca y opción de guisado', 55.00, 'Entradas', 1),
        ('Sopa de Lima', 'Sopa tradicional con lima, tortilla y pollo desmenuzado', 75.00, 'Sopas', 1),
        ('Caldo Tlalpeño', 'Caldo de pollo con chipotle y garbanzos', 80.00, 'Sopas', 1),
        ('Agua de Jamaica', 'Agua fresca de flor de jamaica', 25.00, 'Bebidas', 1),
        ('Agua de Horchata', 'Horchata de arroz con canela', 25.00, 'Bebidas', 1),
        ('Refresco', 'Coca-Cola, Sprite o Fanta 355ml', 30.00, 'Bebidas', 1),
        ('Churros con Cajeta', 'Churros crujientes con cajeta casera', 45.00, 'Postres', 1),
        ('Flan Napolitano', 'Flan casero con cajeta y nuez', 50.00, 'Postres', 1);
    `);
  }

  // Crear empleado de prueba si no existe
  const empleado = database.getFirstSync<{ count: number }>(
    "SELECT COUNT(*) as count FROM usuarios WHERE rol = 'empleado'"
  );
  if (empleado?.count === 0) {
    database.execSync(`
      INSERT INTO usuarios (nombre, correo, password, rol)
      VALUES ('Administrador', 'admin@elsabor.mx', 'admin123', 'empleado');
    `);
  }
};