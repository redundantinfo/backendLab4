const sqlite = require('sqlite3').verbose();
const db = new sqlite.Database('./db.sqlite');

const createTable = () => {
  db.serialize(() => {
    db.run('CREATE TABLE IF NOT EXISTS users (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT, role TEXT, password TEXT)');
    db.run("INSERT INTO Users(name, role, password) VALUES('admin', 'admin', 'admin'), ('user1', 'student', 'password'), ('user2', 'student', 'password2'), ('teacher', 'teacher', 'password3')")
  });
};

const getAllUsers = () => {
  return new Promise((resolve, reject) => {
    db.all('SELECT * FROM users', (err, rows) => {
      if (err) {
        reject(err);
      }
      resolve(rows);
    });
  });
}

const getUserByName = (name) => {
  return new Promise((resolve, reject) => {
    db.get('SELECT * FROM users WHERE name = ?', [name], (err, row) => {
      if (err) {
        reject(err);
      }
      resolve(row);
    });
  });
}

const insertUser = (name, role, password) => {
  return new Promise((resolve, reject) => {
    db.run('INSERT INTO users (name, role, password) VALUES (?, ?, ?)', [name, role, password], (err) => {
      if (err) {
        reject(err);
      }
      resolve();
    });
  });
}

module.exports = {
  createTable,
  getAllUsers,
  getUserByName,
  insertUser
};