const { Sequelize } = require('sequelize');

const sequelize = new Sequelize(
  process.env.DB_DATABASE,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    dialect: 'postgres',
    port: process.env.DB_PORT,
  });

//Init DB/Auth and sync
async function initializeDatabase() {
  try {
    await sequelize.authenticate();
    console.log('Connected to PostgreSQL database');
    await sequelize.sync();
    console.log('Database synchronized successfully');
  } catch (error) {
    console.error('Error connecting to PostgreSQL database:', error);
    throw error;
  }
}

module.exports = {
  sequelize,
  initializeDatabase
};