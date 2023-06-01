require("dotenv").config();
const express = require("express");
const app = express();
const db = require("./database");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const authToken = require("./auth");

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.set("view engine", "ejs");

app.get("/", (req, res) => {
  res.redirect("/identify");
});

// TODO: finish this route
app.post("/register", async (req, res) => {
  try {
    const { name, role, password } = req.body;
    await db.insertUser(name, role, password);  // password is hashed in insertUser() from database.js
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Internal server error" });
  }
});

// login route
app.get("/identify", async (req, res) => {
  try {
    const { name, password } = req.body;
    const user = await db.getUserByName(name);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    // validate password
    const validPassword = await bcrypt.compare(password, user.password);

    if (!validPassword) {
      return res.status(401).json({ message: "Invalid password" });
    }
    // create and assign a token
    const token = jwt.sign({ id: user.id, role: user.role }, process.env.TOKEN_SECRET, { expiresIn: "1h" });
    res.json({ token });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Internal server error" });
  }
});

// only users with a valid token can access this route
app.get("/protected", authToken, (req, res) => {
  // get user role from token
  const { role } = req.user;
  // check user role
  if (role === "admin") {
    res.redirect("/admin");
  } else if (role === "teacher") {
    res.redirect("/teacher");
  } else if (role === "student") {
    res.redirect("/student");
  } else {
    res.status(403).json({ message: "Error: Invalid user role" });
  }
});

app.listen(3000, () => {
  console.log("Listening on port 3000...");
});

