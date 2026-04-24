const express = require('express');
const sqlite3 = require('sqlite3').verbose();

const app = express();
const db = new sqlite3.Database('./database.db');

app.use(express.json());

// basic route
app.get('/', (req, res) => {
  res.send('Site Acquisition Tracker v0.2');
});

// create sites table
db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS sites (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      site_name TEXT,
      address TEXT,
      postcode TEXT,
      local_authority TEXT,
      stage TEXT,
      next_step TEXT,
      last_action_date TEXT
    )
  `);
});

app.listen(3000, () => {
  console.log('Server running on http://localhost:3000');
});
