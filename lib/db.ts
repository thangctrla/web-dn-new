import { Pool } from 'pg';

declare global {
  // eslint-disable-next-line no-var
  var _pgPool: Pool | undefined;
}

export function getPool(): Pool {
  if (!global._pgPool) {
    global._pgPool = new Pool({
      host: process.env.DB_HOST || '138.2.86.218',
      port: parseInt(process.env.DB_PORT || '5432', 10),
      database: process.env.DB_NAME || 'companies',
      user: process.env.DB_USERNAME || 'postgres',
      password: process.env.DB_PASSWORD || 'yourpassword',
      max: 20,
      idleTimeoutMillis: 30000,
      connectionTimeoutMillis: 8000,
    });

    global._pgPool.on('error', (err) => {
      console.error('Unexpected error on idle client', err);
    });
  }
  return global._pgPool;
}
