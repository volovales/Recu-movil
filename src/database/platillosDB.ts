import { getDatabase } from './database';

export interface Platillo {
  id?: number;
  nombre: string;
  descripcion: string;
  precio: number;
  categoria: string;
  disponible: number; // 1 = disponible, 0 = no disponible
  created_at?: string;
}

// CREATE
export const crearPlatillo = (platillo: Omit<Platillo, 'id' | 'created_at'>): number => {
  const db = getDatabase();
  const result = db.runSync(
    `INSERT INTO platillos (nombre, descripcion, precio, categoria, disponible)
     VALUES (?, ?, ?, ?, ?)`,
    [platillo.nombre, platillo.descripcion, platillo.precio, platillo.categoria, platillo.disponible]
  );
  return result.lastInsertRowId;
};

// READ - todos
export const obtenerPlatillos = (): Platillo[] => {
  const db = getDatabase();
  return db.getAllSync<Platillo>('SELECT * FROM platillos ORDER BY categoria, nombre');
};

// READ - por id
export const obtenerPlatilloPorId = (id: number): Platillo | null => {
  const db = getDatabase();
  return db.getFirstSync<Platillo>('SELECT * FROM platillos WHERE id = ?', [id]) ?? null;
};

// READ - por categoría
export const obtenerPlatillosPorCategoria = (categoria: string): Platillo[] => {
  const db = getDatabase();
  return db.getAllSync<Platillo>(
    'SELECT * FROM platillos WHERE categoria = ? ORDER BY nombre',
    [categoria]
  );
};

// UPDATE
export const actualizarPlatillo = (id: number, platillo: Omit<Platillo, 'id' | 'created_at'>): void => {
  const db = getDatabase();
  db.runSync(
    `UPDATE platillos
     SET nombre = ?, descripcion = ?, precio = ?, categoria = ?, disponible = ?
     WHERE id = ?`,
    [platillo.nombre, platillo.descripcion, platillo.precio, platillo.categoria, platillo.disponible, id]
  );
};

// DELETE
export const eliminarPlatillo = (id: number): void => {
  const db = getDatabase();
  db.runSync('DELETE FROM platillos WHERE id = ?', [id]);
};

// Obtener categorías únicas
export const obtenerCategorias = (): string[] => {
  const db = getDatabase();
  const rows = db.getAllSync<{ categoria: string }>('SELECT DISTINCT categoria FROM platillos ORDER BY categoria');
  return rows.map(r => r.categoria);
};