const { Sequelize } = require('sequelize');

const sequelize = new Sequelize(
  process.env.DB_NAME || 'port_sin_db',
  process.env.DB_USER || 'postgres',
  process.env.DB_PASS || 'postgres',
  {
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 5433,
    dialect: 'postgres',
    logging: false,
    pool: {
      max: 10,
      min: 0,
      acquire: 30000,
      idle: 10000
    }
  }
);

const connectDB = async () => {
  try {
    await sequelize.authenticate();
    console.log(`[DATABASE] PostgreSQL Connected successfully on ${process.env.DB_HOST || 'localhost'}:${process.env.DB_PORT || 5433}/${process.env.DB_NAME || 'port_sin_db'}`);
    
    // Auto-sync tables with schema
    await sequelize.sync({ alter: true });
    console.log('[DATABASE] PostgreSQL Tables synchronized successfully.');
  } catch (err) {
    console.error(`[DATABASE] PostgreSQL Connection Error:`, err.message);
  }
};

module.exports = { sequelize, connectDB };
