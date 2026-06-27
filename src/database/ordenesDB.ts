import { getDatabase } from './database';

export interface Orden {
  id?: number;
  numero_mesa: number;
  cliente: string;
  estado: 'pendiente' | 'en_preparacion' | 'listo' | 'entregado' | 'cancelado';
  total: number;
  notas: string;
  created_at?: string;
}

export interface OrdenDetalle {
  id?: number;
  orden_id: number;
  platillo_id: number;
  cantidad: number;
  precio_unitario: number;
  nombre_platillo?: string;
}

// CREATE orden
export const crearOrden = (orden: Omit<Orden, 'id' | 'created_at'>): number => {
  const db = getDatabase();
  const result = db.runSync(
    `INSERT INTO ordenes (numero_mesa, cliente, estado, total, notas)
     VALUES (?, ?, ?, ?, ?)`,
    [orden.numero_mesa, orden.cliente, orden.estado, orden.total, orden.notas]
  );
  return result.lastInsertRowId;
};

// READ - todas las órdenes
export const obtenerOrdenes = (): Orden[] => {
  const db = getDatabase();
  return db.getAllSync<Orden>('SELECT * FROM ordenes ORDER BY created_at DESC');
};

// READ - por id
export const obtenerOrdenPorId = (id: number): Orden | null => {
  const db = getDatabase();
  return db.getFirstSync<Orden>('SELECT * FROM ordenes WHERE id = ?', [id]) ?? null;
};

// READ - órdenes por estado
export const obtenerOrdenesPorEstado = (estado: string): Orden[] => {
  const db = getDatabase();
  return db.getAllSync<Orden>(
    'SELECT * FROM ordenes WHERE estado = ? ORDER BY created_at DESC',
    [estado]
  );
};

// UPDATE
export const actualizarOrden = (id: number, orden: Partial<Omit<Orden, 'id' | 'created_at'>>): void => {
  const db = getDatabase();
  const fields: string[] = [];
  const values: (string | number)[] = [];

  if (orden.numero_mesa !== undefined) { fields.push('numero_mesa = ?'); values.push(orden.numero_mesa); }
  if (orden.cliente !== undefined) { fields.push('cliente = ?'); values.push(orden.cliente); }
  if (orden.estado !== undefined) { fields.push('estado = ?'); values.push(orden.estado); }
  if (orden.total !== undefined) { fields.push('total = ?'); values.push(orden.total); }
  if (orden.notas !== undefined) { fields.push('notas = ?'); values.push(orden.notas); }

  if (fields.length === 0) return;
  values.push(id);

  db.runSync(`UPDATE ordenes SET ${fields.join(', ')} WHERE id = ?`, values);
};

// DELETE
export const eliminarOrden = (id: number): void => {
  const db = getDatabase();
  db.runSync('DELETE FROM orden_detalle WHERE orden_id = ?', [id]);
  db.runSync('DELETE FROM ordenes WHERE id = ?', [id]);
};

// Estadísticas para el dashboard
export const obtenerEstadisticas = (): {
  totalOrdenes: number;
  ordenesPendientes: number;
  totalVentas: number;
} => {
  const db = getDatabase();
  const total = db.getFirstSync<{ count: number }>('SELECT COUNT(*) as count FROM ordenes') ?? { count: 0 };
  const pendientes = db.getFirstSync<{ count: number }>(
    "SELECT COUNT(*) as count FROM ordenes WHERE estado = 'pendiente'"
  ) ?? { count: 0 };
  const ventas = db.getFirstSync<{ sum: number }>(
    "SELECT COALESCE(SUM(total), 0) as sum FROM ordenes WHERE estado != 'cancelado'"
  ) ?? { sum: 0 };

  return {
    totalOrdenes: total.count,
    ordenesPendientes: pendientes.count,
    totalVentas: ventas.sum,
  };
};