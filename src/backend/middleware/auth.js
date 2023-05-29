const jwt = require("jsonwebtoken");
require("dotenv").config();

const userModel = require("../models/userModel");

// The point here is that a user has to identify before they can view some pages

// function that checks the user's role in the database. If they are an admin, they can access the admin page. If they are a user, they can access the user page. If they are a teacher, they can access the teacher page. If they are not logged in, they cannot access either page.
function authRole(role) {
  return async (req, res, next) => {
    try {
        const token = req.cookies.token;
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await userModel.findOne({ _id: decoded._id, "tokens.token": token });
        if (!user) {
            throw new Error();
        }
        if (role === "admin" && user.role !== "admin") {
            throw new Error();
        }
        if (role === "user" && user.role !== "user") {
            throw new Error();
        }
        if (role === "teacher" && user.role !== "teacher") {
            throw new Error();
        }
        req.token = token;
        req.user = user;
        next();
    }
    catch (error) {
      res.status(401).send({ error: "Please authenticate." });
    }
  };
}

