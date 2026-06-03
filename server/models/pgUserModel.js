const db = require('../config/db');

const createUser = async (name, email) => {
  const query = 'INSERT INTO users (name, email) VALUES ($1, $2) RETURNING *';
  const values = [name, email];
  const { rows } = await db.query(query, values);
  return rows[0];
};

const getAllUsers = async () => {
  const query = 'SELECT * FROM users ORDER BY created_at DESC';
  const { rows } = await db.query(query);
  return rows;
};

const getUserById = async (id) => {
  const query = 'SELECT * FROM users WHERE id = $1';
  const { rows } = await db.query(query, [id]);
  return rows[0];
};

const updateUser = async (id, name, email) => {
  const query = 'UPDATE users SET name = $1, email = $2 WHERE id = $3 RETURNING *';
  const values = [name, email, id];
  const { rows } = await db.query(query, values);
  return rows[0];
};

const deleteUser = async (id) => {
  const query = 'DELETE FROM users WHERE id = $1 RETURNING *';
  const { rows } = await db.query(query, [id]);
  return rows[0];
};

const createUsersTableIfNotExists = async () => {
  const query = `
    CREATE TABLE IF NOT EXISTS users (
      id SERIAL PRIMARY KEY,
      name VARCHAR(100) NOT NULL,
      email VARCHAR(150) UNIQUE NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `;
  await db.query(query);
};

module.exports = {
  createUser,
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
  createUsersTableIfNotExists
};
