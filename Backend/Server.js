const express = require("express");
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const cors = require("cors");
const mysql = require("mysql2");

const app = express();
require('dotenv').config();
app.use(cors({
  origin: [
    "http://localhost:5173",
    "http://localhost:5174",
    "https://ecommercesite-ashen.vercel.app",
    "https://e-commerce-jd3e.vercel.app",          // ✅ Add this
    "https://e-commerce-jd3e-nw8dlo3qq-vinil629s-projects.vercel.app"  // ✅ Add this
  ],
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true
}));

app.get('/', (req, res) => {
  res.send('hello');
});

// ✅ DB now uses environment variables
const db = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT,
  connectionLimit: 10
});

db.getConnection((err, connection) => {
  if (err) {
    console.error("error while connecting", err);
    return;
  }
  console.log("database connected ✅");
});

app.post('/register', async (req, res) => {
  const { username, email, password } = req.body;

  console.log(email);

  const hashedpassword = await bcrypt.hash(password, 10);

  db.query(
    `INSERT INTO item (username, email, passwordhash) VALUES (?, ?, ?)`,
    [username, email, hashedpassword],
    (err, result) => {
      if (err) {
        console.log(err);
        return res.status(500).send("Database error");
      }
      console.log("User registered successfully");
      res.send("User registered successfully");
    }
  );
});

app.post('/login', (req, res) => {
  const { email, password } = req.body;

  console.log(email, password);

  db.query(`SELECT * FROM item WHERE email = ?`, [email], async (err, result) => {
    if (err) {
      console.log(err);
      return res.status(500).json({ message: "Database error" });
    }

    if (result.length == 0) {
      console.log("user not found");
      return res.status(400).json({ message: "User not found" });
    }

    const user = result[0];

    const ispasswordvalidate = await bcrypt.compare(password, user.passwordhash);

    if (!ispasswordvalidate) {
      return res.status(400).json({ message: "Password didn't match" });
    }

    const userpayload = { email: user.email };

    const token = jwt.sign(
      userpayload,
      process.env.JWT_secretkey,
      { expiresIn: '1h' }
    );

    const refreshToken = jwt.sign(
      userpayload,
      process.env.REFRESH_TOKEN_SECRET,
      { expiresIn: '7d' }
    );

    db.query(
      `UPDATE item SET refresh_token = ? WHERE email = ?`,
      [refreshToken, user.email],
      (err) => {
        if (err) {
          console.log(err);
          return res.status(500).json({ message: "Database error" });
        }
        console.log("login successful");
        return res.json({
          message: "Login successful",
          token: token,
          refreshToken: refreshToken
        });
      }
    );
  });
});

// ✅ PORT now uses Render's dynamic port
app.listen(process.env.PORT || 5000, () => {
  console.log("Server running!");
});