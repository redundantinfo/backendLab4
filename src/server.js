require("dotenv").config();
const express = require("express");
const app = express();
const db = require("./database");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.set("view engine", "ejs");

app.get("/", (req, res) => {
  res.redirect("/identify");
})

// TODO: finish this route
app.post("/register", async (req, res) => {
  try {
    const { name, role, password } = req.body;
    await db.insertUser(name, role, password);  // password is hashed in insertUser() from database.js
  } catch (err) {
    console.log(err);
  }
  res.redirect("/identify");
})

app.listen(3000, () => {
  console.log("Listening on port 3000...");
})

