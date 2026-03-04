import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

const jwtSecretKey = process.env.JWT_SECRET_KEY;

const authenticateToken = (req, res, next) => {
  // Get token from Authorization header
  const token = req.headers["authorization"]?.split(" ")[1];

  // If token not provided
  if (!token) {
    return res.status(401).json({ message: "Token not provided" });
  }

  // Verify token
  jwt.verify(token, jwtSecretKey, (err, user) => {
    if (err) {
      return res.status(403).json({
        message: "Invalid or expired token",
      });
    }

    // Attach decoded user to request
    req.user = user;

    next();
  });
};

export default authenticateToken;