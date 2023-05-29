const mongoose = require('mongoose');
const express = require('express');
const app = express();
const jwt = require('jsonwebtoken');
require('dotenv').config();

app.set('view engine', 'ejs');
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

var currentKey = "";
var currentPassword = "";

// The point here is that a user has to identify before they can view the welcome page
app.get('/', (req, res) => {
  res.redirect("/identify");
});

// auth route
app.post('/identify', (req, res) => {
  //auth
  const password = req.body.password;
  const token = jwt.sign(username, process.env.ACCESS_TOKEN);
  currentKey = token;
  currentPassword = password;
  res.redirect("/granted");
});

app.get('/identify', (req, res) => {
  res.render("identify.ejs");
});

function authenticateToken(req, res, next) {
  if (currentKey == "") {
    res.redirect("/identify");
  } else if (jwt.verify(currentKey, process.env.ACCESS_TOKEN)) {
  next();
  } else {
    res.redirect("/identify");
  }
}

app.get('/granted', authenticateToken, (req, res) => {
  res.render("start.ejs");
});

app.listen(3000, () => {
  console.log('Server started on port 3000');
});