import { getDatabase } from './database';

export interface Pedido {
  id?: number;
  usuario_id: number;
  estado: 'pendiente' | 'en_preparacion' | 'listo' | 'entregado' | 'cancelado';
  total: number;
  notas: string;
  created_at?: string;
  // campos joined
  nombre_cliente?: string;
}

export interface ItemCarrito {
  platillo_id: number;
  nombre: string;
  precio: number;
  cantidad: number;
}

// Crear pedido con su detalle
export const crearPedido = (
  usuario_id: number,
  items: ItemCarrito[],
  notas: string
): number => {
  const db = getDatabase();
  const total = items.reduce((sum, i) => sum + i.precio * i.cantidad, 0);

  const result = db.runSync(
    `INSERT INTO pedidos (usuario_id, estado, total, notas) VALUES (?, 'pendiente', ?, ?)`,
    [usuario_id, total, notas]
  );
  const pedido_id = result.lastInsertRowId;

  for (const item of items) {
    db.runSync(
      `INSERT INTO pedido_detalle (pedido_id, platillo_id, cantidad, precio_unitario)
       VALUES (?, ?, ?, ?)`,
      [pedido_id, item.platillo_id, item.cantidad, item.precio]
    );
  }

  return pedido_id;
};

// Obtener pedidos de un cliente
export const obtenerPedidosCliente = (usuario_id: number): Pedido[] => {
  const db = getDatabase();
  return db.getAllSync<Pedido>(
    'SELECT * FROM pedidos WHERE usuario_id = ? ORDER BY created_at DESC',
    [usuario_id]
  );
};

// Obtener todos los pedidos (empleado) con nombre del cliente
export const obtenerTodosPedidos = (): Pedido[] => {
  const db = getDatabase();
  return db.getAllSync<Pedido>(`
    SELECT p.*, u.nombre as nombre_cliente
    FROM pedidos p
    JOIN usuarios u ON p.usuario_id = u.id
    ORDER BY p.created_at DESC
  `);
};

// Obtener detalle de un pedido
export const obtenerDetallePedido = (pedido_id: number) => {
  const db = getDatabase();
  return db.getAllSync<{
    nombre: string;
    cantidad: number;
    precio_unitario: number;
    subtotal: number;
  }>(`
    SELECT pl.nombre, pd.cantidad, pd.precio_unitario,
           (pd.cantidad * pd.precio_unitario) as subtotal
    FROM pedido_detalle pd
    JOIN platillos pl ON pd.platillo_id = pl.id
    WHERE pd.pedido_id = ?
  `, [pedido_id]);
};

// Cambiar estado del pedido
export const cambiarEstadoPedido = (
  id: number,
  estado: Pedido['estado']
): void => {
  const db = getDatabase();
  db.runSync('UPDATE pedidos SET estado = ? WHERE id = ?', [estado, id]);
};

// Cancelar pedido (solo si está pendiente)
export const cancelarPedido = (id: number): { ok: boolean; error?: string } => {
  const db = getDatabase();
  const pedido = db.getFirstSync<Pedido>('SELECT * FROM pedidos WHERE id = ?', [id]);
  if (!pedido) return { ok: false, error: 'Pedido no encontrado.' };
  if (pedido.estado !== 'pendiente')
    return { ok: false, error: 'Solo se pueden cancelar pedidos pendientes.' };

  db.runSync("UPDATE pedidos SET estado = 'cancelado' WHERE id = ?", [id]);
  return { ok: true };
};

// Eliminar pedido (empleado)
export const eliminarPedido = (id: number): void => {
  const db = getDatabase();
  db.runSync('DELETE FROM pedido_detalle WHERE pedido_id = ?', [id]);
  db.runSync('DELETE FROM pedidos WHERE id = ?', [id]);
};

// Estadísticas para dashboard
export const obtenerEstadisticas = () => {
  const db = getDatabase();
  const total = db.getFirstSync<{ count: number }>(
    'SELECT COUNT(*) as count FROM pedidos'
  ) ?? { count: 0 };
  const pendientes = db.getFirstSync<{ count: number }>(
    "SELECT COUNT(*) as count FROM pedidos WHERE estado = 'pendiente'"
  ) ?? { count: 0 };
  const ventas = db.getFirstSync<{ sum: number }>(
    "SELECT COALESCE(SUM(total), 0) as sum FROM pedidos WHERE estado != 'cancelado'"
  ) ?? { sum: 0 };
  const clientes = db.getFirstSync<{ count: number }>(
    "SELECT COUNT(*) as count FROM usuarios WHERE rol = 'cliente'"
  ) ?? { count: 0 };

  return {
    totalPedidos: total.count,
    pedidosPendientes: pendientes.count,
    totalVentas: ventas.sum,
    totalClientes: clientes.count,
  };
};