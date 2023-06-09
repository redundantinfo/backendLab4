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
  res.render("identify.ejs");
  db.createTable();
});

app.get("/register", (req, res) => {
  res.render("register.ejs");
});

app.post("/register", async (req, res) => {
  try {
    const { name, role, password } = req.body;
    await db.insertUser(name, role, password);  // password is hashed in insertUser() from database.js
    console.log("User created");
    console.log(req.body);

    const users = await db.getAllUsers();
    console.log(users);

    res.render("identify.ejs");
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Internal server error" });
  }
});

app.get("/identify", (req, res) => {
  res.render("identify.ejs");
});

// login route
app.post("/identify", async (req, res) => {
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
    // create and assign token
    const token = jwt.sign({ name: user.name, role: user.role }, process.env.ACCESS_TOKEN, { expiresIn: "1h" });
    res.redirect(`/protected?token=${token}`);

  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Server error" });
  }
});

/*
  Protected route: 
  This is not a good implementation of a protected route, but it works fine for this lab.
  My solution would be to have seperate database tables for admins, teachers and students. 
  And change the frontend code to make a HTTP request in order to render the page.
  This would make the frontend pages dynamic, the backend code would be cleaner and the protected route would be more secure.
  
  This solution would also prevent the need to create a new .ejs file for each new database entry. Eg. student1, 2, 3, 4....
*/
app.get("/protected", authToken, (req, res) => {
  // get user role from token
  const { role } = req.user;
  // check user role
  if (role === "admin") {
    res.render("admin.ejs");
  } else if (role === "teacher") {
    res.render("teacher.ejs");
  } else if (role === "student") {
    res.render("student1.ejs");
  } else {
    res.status(401).json({ message: "Error: Invalid user role" });
  }
});

app.listen(3000, () => {
  console.log("Listening on port 3000...");
});

