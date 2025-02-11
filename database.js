const mysql = require('mysql');
const express = require('express');
const path = require('path');
const bodyparser = require('body-parser');
const app = express();
const port = 5500;

app.use(bodyparser.urlencoded({ extended: true }));

// Database connection
const con = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '1234',
  database: 'student'
});

con.connect((err) => {
  if (err) throw err;
  console.log("Connected successfully!");
});

// Route to handle form submissions
app.post('/add-record', (req, res) => {
  const { id, name, subject, marks } = req.body;

  const sql = "INSERT INTO records (id, name, subject, marks) VALUES (?, ?, ?, ?)";
  con.query(sql, [id, name, subject, marks], (err) => {
    if (err) throw err;
    console.log("Data inserted successfully!");
    res.redirect('/'); // Redirect to the homepage to display the updated data
  });
});

// Fetch all records for frontend display
app.get('/records', (req, res) => {
  const sql = "SELECT * FROM records";
  con.query(sql, (err, result) => {
    if (err) {
      console.error("Error retrieving data: ", err);
      return res.status(500).send("Failed to retrieve records.");
    }
    res.json(result);
  });
});

// Serve the HTML form file
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
