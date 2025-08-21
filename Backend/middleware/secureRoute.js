import jwt from "jsonwebtoken";
import User from "../models/user.model.js";

const secureRoute = async (req, res, next) => {
  try {
    // Try to get token from multiple sources
    let token = req.cookies.jwt;
    
    // If no cookie token, check Authorization header
    if (!token) {
      const authHeader = req.headers.authorization;
      if (authHeader && authHeader.startsWith('Bearer ')) {
        token = authHeader.substring(7); // Remove 'Bearer ' prefix
        console.log("🔑 Token found in Authorization header");
      }
    } else {
      console.log("🍪 Token found in cookies");
    }
    
    if (!token) {
      console.log("❌ No token found in cookies or Authorization header");
      return res.status(401).json({ error: "No token, authorization denied" });
    }
    
    const JWT_SECRET = process.env.JWT_SECRET || process.env.JWT_TOKEN;
    
    if (!JWT_SECRET) {
      console.error("JWT_SECRET environment variable is not set");
      return res.status(500).json({ error: "Server configuration error" });
    }
    
    const decoded = jwt.verify(token, JWT_SECRET);
    if (!decoded) {
      return res.status(401).json({ error: "Invalid Token" });
    }
    
    const user = await User.findById(decoded.userId).select("-password"); // current loggedin user
    if (!user) {
      return res.status(401).json({ error: "No user found" });
    }
    
    req.user = user;
    next();
  } catch (error) {
    console.log("Error in secureRoute: ", error);
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ error: "Invalid token" });
    }
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ error: "Token expired" });
    }
    res.status(500).json({ error: "Internal server error" });
  }
};
export default secureRoute;
