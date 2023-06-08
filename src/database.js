const sqlite = require('sqlite3').verbose();
const bcrypt = require('bcrypt');

// init database
const db = new sqlite.Database('db.sqlite', (err) => {
  if (err) {
    console.error('Database init failiure', err);
  } else {
    console.log('Database init success');
  }
});

function createTable() {
  return new Promise((resolve, reject) => {
    db.run('CREATE TABLE IF NOT EXISTS users(id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT, role TEXT, password TEXT)', (err) => {
      if (err) {
        reject(err);
      } else {
        resolve('Table created');
      }
    });
  }
  );
}

function getAllUsers() {
  return new Promise((resolve, reject) => {
    db.all('SELECT * FROM users', (err, rows) => {
      if (err) {
        reject(err);
      } else {
        resolve(rows);
      }
    });
  });
}

function getUserByName(name) {
  return new Promise((resolve, reject) => {
    db.get('SELECT * FROM users WHERE name = ?', [name], (err, row) => {
      if (err) {
        reject(err);
      } else {
        resolve(row);
      }
    });
  });
}

async function insertUser(name, role, password) {
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    return new Promise((resolve, reject) => {
      db.run('INSERT INTO users(name, role, password) VALUES(?, ?, ?)', [name, role, hashedPassword], (err) => {
        if (err) {
          reject(err);
        } else {
          resolve('User created');
        }
      });
    });
  } catch (err) {
    console.log(err);
  }
}

module.exports = {
  createTable,
  getAllUsers,
  getUserByName,
  insertUser
};