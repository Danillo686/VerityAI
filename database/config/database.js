const path = require('path');
const { Sequelize } = require('sequelize');
require('dotenv').config({ path: path.resolve(__dirname, '../../.env') });
require('dotenv').config(); // also check current dir .env

let sequelize;

if (process.env.DATABASE_URL) {
  // PostgreSQL connection via URI (e.g. Supabase, Neon, Railway, Vercel Postgres)
  const isSslRequired = process.env.DATABASE_SSL !== 'false';
  sequelize = new Sequelize(process.env.DATABASE_URL, {
    dialect: 'postgres',
    logging: process.env.NODE_ENV === 'development' ? console.log : false,
    dialectOptions: isSslRequired
      ? {
          ssl: {
            require: true,
            rejectUnauthorized: false,
          },
        }
      : {},
  });
} else if (process.env.DB_HOST && process.env.DB_NAME) {
  // PostgreSQL connection via discrete environment variables
  sequelize = new Sequelize(
    process.env.DB_NAME,
    process.env.DB_USER || 'postgres',
    process.env.DB_PASSWORD || '',
    {
      host: process.env.DB_HOST,
      port: Number(process.env.DB_PORT) || 5432,
      dialect: 'postgres',
      logging: false,
      dialectOptions: process.env.DATABASE_SSL === 'true'
        ? {
            ssl: {
              require: true,
              rejectUnauthorized: false,
            },
          }
        : {},
    }
  );
} else {
  // Zero-dependency local fallback to SQLite
  const sqliteStoragePath = path.resolve(__dirname, '../verity_ai.sqlite');
  console.log(`[Sequelize] Nenhuma credencial PostgreSQL informada. Utilizando SQLite local em: ${sqliteStoragePath}`);
  sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: sqliteStoragePath,
    logging: false,
  });
}

module.exports = sequelize;

