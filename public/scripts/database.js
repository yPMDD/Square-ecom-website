import express from 'express';
import bodyParser from 'body-parser';
import mysql from './node_modules/mysql2/index';


const app = express();
const port = 3000;

// Middleware to parse JSON data
app.use(json());

// Database connection setup
const db = mysql.createConnection({
host: 'localhost',
user: 'root',
password: '',
database: 'square'
});

db.connect((err) => {
if (err) {
console.error('Database connection failed:', err.stack);
return;
}
console.log('Connected to database');
});

// API endpoint to insert data
app.post('/api/insertData', (req, res) => {
const {  img,title , quantity ,price } = req.body;

// Validate data (basic example)
const query = 'INSERT INTO cart (pic,product,quantity,price) VALUES (?, ?, ?, ?)';
db.query(query, [ img,title,quantity,price], (err, result) => {
if (err) {
  console.error('Error inserting data:', err);
  return res.status(500).json({ error: 'Database error.' });
}
console.log('data inserted successfully');
res.status(200).json({ message: 'Data inserted successfully!', id: result.insertId });
});
});

// Start the server
app.listen(port, () => {
console.log(`Server running at http://localhost:${port}`);
});

document.getElementById('ajout').addEventListener('click', async () => {
const data = {  img,title , quantity ,price };

try {
  const response = await fetch('/api/insertData', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  });

  const result = await response.json();
  console.log('Success:', result);
} catch (error) {
  console.error('Error:', error);
}
});


