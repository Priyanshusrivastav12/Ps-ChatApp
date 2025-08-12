import jwt from "jsonwebtoken";

const createTokenAndSaveCookie = (userId, res) => {
  const JWT_SECRET = process.env.JWT_SECRET || process.env.JWT_TOKEN;
  
  if (!JWT_SECRET) {
    throw new Error("JWT_SECRET environment variable is not set");
  }

  const token = jwt.sign({ userId }, JWT_SECRET, {
    expiresIn: "10d",
  });
  
  const isProduction = process.env.NODE_ENV === "production";
  
  res.cookie("jwt", token, {
    httpOnly: true, // XSS protection
    secure: isProduction, // Only use secure cookies in production (HTTPS)
    sameSite: isProduction ? "none" : "lax", // Allow cross-site cookies in production
    maxAge: 10 * 24 * 60 * 60 * 1000, // 10 days
    domain: isProduction ? undefined : undefined, // Let browser determine domain
    path: "/", // Ensure cookie is available for all paths
  });
  
  console.log(`🍪 JWT Cookie set - Production: ${isProduction}, Secure: ${isProduction}, SameSite: ${isProduction ? "none" : "lax"}`);
};
export default createTokenAndSaveCookie;
