const mysql = require('mysql2/promise');

const dbConfig = {
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'square',
};

async function testConnection() {
  try {
    const connection = await mysql.createConnection(dbConfig);
    console.log('Connection successful!');
    await connection.end();
  } catch (err) {
    console.error('Connection failed:', err);
  }
}

testConnection();