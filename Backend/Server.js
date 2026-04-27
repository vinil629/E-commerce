const express=require("express");
const bcrypt=require('bcrypt');
const jwt=require('jsonwebtoken');
const bodyparser=require('body-parser');


const cors=require("cors");
const app=express();

require('dotenv').config();

const mysql=require("mysql2");


app.use(express.json());
app.use(cors({
  origin: ["http://localhost:5173", "http://localhost:5174"],
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true
}));
app.get('/',(req,res)=>{
    res.send('hello');
});

const db = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: 'vinil@629',
  database: 'items',
  port: 3306,
  connectionLimit: 10
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




db.getConnection((err, connection) => {
  if (err) {
    console.error("error while connecting", err);
    return;
  }
  console.log("database connected");
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

    // ✅ all variables declared here — outside any if block
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


app.listen(5000,()=> {
    console.log("hello its my ecommerce server");
})