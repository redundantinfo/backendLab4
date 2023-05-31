require("dotenv").config()
const express = require("express")
const app = express()
const db = require("./database")
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")

app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.set("view engine", "ejs")

var currentKey = ""
var currentPassword = ""

app.get("/", (req, res) => {
  res.redirect("/identify")
})

app.post("/identify", (req, res) => {
  const username = req.body.password
  const token = jwt.sign(username, process.env.ACCESS_TOKEN)
  currentKey = token
  currentPassword = username
  res.redirect("/granted")
})

app.get("/identify", (req, res) => {
  res.render("identify.ejs")
})

function authToken(req, res, next) {
  if (currentKey == "") {
    res.redirect("/identify")
  } else if (jwt.verify(currentKey, process.env.ACCESS_TOKEN)) {
    next()
  } else {
    res.redirect("/identify")
  }
}

app.get("/granted", authToken, (req, res) => {
  res.render("start.ejs")
})

app.listen(3000, () => {
  console.log("Listening on port 3000...")
})
