import { sql } from '@vercel/postgres';
import { Pool } from '@neondatabase/serverless';

// Create a connection pool for better performance
let pool: Pool | undefined;

export function getPool() {
  if (!pool) {
    if (!process.env.POSTGRES_URL) {
      throw new Error('POSTGRES_URL environment variable is not set');
    }
    pool = new Pool({ connectionString: process.env.POSTGRES_URL });
  }
  return pool;
}

// Export the sql template tag for queries
export { sql };

// Helper function for transactions
export async function withTransaction<T>(
  callback: (client: any) => Promise<T>
): Promise<T> {
  const pool = getPool();
  const client = await pool.connect();
  
  try {
    await client.query('BEGIN');
    const result = await callback(client);
    await client.query('COMMIT');
    return result;
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
}

// Query helper with performance logging in development
export async function query<T = any>(
  text: string,
  params?: any[]
): Promise<T[]> {
  const start = Date.now();
  
  try {
    const pool = getPool();
    const result = await pool.query(text, params);
    
    if (process.env.NODE_ENV === 'development') {
      const duration = Date.now() - start;
      console.log('Query executed in', duration, 'ms');
      if (duration > 100) {
        console.warn('Slow query detected:', text);
      }
    }
    
    return result.rows as T[];
  } catch (error) {
    console.error('Database query error:', error);
    throw error;
  }
}

// Helper for single row queries
export async function queryOne<T = any>(
  text: string,
  params?: any[]
): Promise<T | null> {
  const rows = await query<T>(text, params);
  return rows[0] || null;
}

// Helper for insert queries that return the inserted row
export async function insert<T = any>(
  table: string,
  data: Record<string, any>
): Promise<T> {
  const keys = Object.keys(data);
  const values = Object.values(data);
  const placeholders = keys.map((_, i) => `$${i + 1}`).join(', ');
  
  const text = `
    INSERT INTO ${table} (${keys.join(', ')})
    VALUES (${placeholders})
    RETURNING *
  `;
  
  const rows = await query<T>(text, values);
  return rows[0];
}

// Helper for update queries
export async function update<T = any>(
  table: string,
  id: string | number,
  data: Record<string, any>,
  idColumn = 'id'
): Promise<T | null> {
  const keys = Object.keys(data);
  const values = Object.values(data);
  const setClause = keys.map((key, i) => `${key} = $${i + 2}`).join(', ');
  
  const text = `
    UPDATE ${table}
    SET ${setClause}, updated_at = CURRENT_TIMESTAMP
    WHERE ${idColumn} = $1
    RETURNING *
  `;
  
  const rows = await query<T>(text, [id, ...values]);
  return rows[0] || null;
}

// Helper for delete queries
export async function remove(
  table: string,
  id: string | number,
  idColumn = 'id'
): Promise<boolean> {
  const text = `DELETE FROM ${table} WHERE ${idColumn} = $1`;
  const result = await query(text, [id]);
  return true;
}