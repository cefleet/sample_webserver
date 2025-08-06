const express = require("express");
const app = express();
const mysql = require("mysql2/promise");
const path = require("path");

const port = 3000;

const pool = mysql.createPool({
  host: "YOUR_DATABASE_URL", //url for the database instance (not the database name)
  user: "YOUR_DATABASE_USER", //or whatever user you are using
  password: "YOUR_PASSWORD", //password
  database: "YOUR_DATABASE_NAME", //the name of the database you want to connect to
});

// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, "public")));

/*
app.get('/', (req, res) => {
  res.send('Hello World!')
});
*/

app.get("/items", async (req, res) => {
  const connection = await pool.getConnection();
  try {
    const [rows, fields] = await connection.execute("SELECT * FROM items;");
    console.log(rows);
    res.json(rows);
  } finally {
    connection.release(); // Release the connection back to the pool
  }
});

app.post("/add-item", async (req, res) => {
  //We will accept the value from req.body eventually
  const connection = await pool.getConnection();

  //this just randomly makes a string for now.
  const value = Math.random().toString(36).substring(2, 10);
  try {
    //Here my table is named 'items' and i only have 'name' as a column on this item
    const [rows, fields] = await connection.execute(
      "INSERT INTO items (name) VALUES (?);",
      [value]
    );
    res.json({ results: "row added" });
  } finally {
    connection.release(); // Release the connection back to the pool
  }
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
