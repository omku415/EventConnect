const jwt = require('jsonwebtoken');
require("dotenv").config();
const jwtSecretKey = process.env.JWT_SECRET_KEY
const authenticateToken = (req, res, next) => {
  // Get the token from the Authorization header
  const token = req.headers['authorization']?.split(' ')[1];
 

  // If no token is provided
  if (!token) {
    return res.status(401).json({ message: 'Token not provided' });
  }

  // Verify the token using the secret key
  jwt.verify(token, jwtSecretKey, (err, user) => {
    if (err) {
      return res.status(403).json({ message: 'Invalid or expired token' });
    }

    // Attach the decoded user data to the request object
    req.user = user;

    // Proceed to the next middleware or route handler
    next();
  });
};

module.exports = authenticateToken;
