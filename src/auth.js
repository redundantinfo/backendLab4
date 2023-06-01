const jwt = require('jsonwebtoken');

// middleware function to check if user is authenticated
function authToken(req, res, next) {
  // get token from auth header
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(" ")[1]

  // check if token exists
  if (!token) {
    return res.status(401).json({ message: 'Access token not found' });
  }
  // verify token
  jwt.verify(token, process.env.ACCESS_TOKEN, (err, user) => {
    if (err) {
      return res.status(403).json({ message: 'Invalid token' });
    }
    // set user in req object
    req.user = user;
    next();
  });
}

module.exports = authToken;

