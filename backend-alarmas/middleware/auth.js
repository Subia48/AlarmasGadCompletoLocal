// middleware/auth.js
const jwt = require("jsonwebtoken");

const JWT_SECRET = process.env.JWT_SECRET;

function auth(req, res, next) {
  const header = req.headers.authorization || "";
  const token = header.replace("Bearer ", "");

  if (!token) {
    return res.status(401).json({ message: "Sin token de autenticación" });
  }

  try {
    const payload = jwt.verify(token, JWT_SECRET);
    console.log("JWT ROL =>", payload.rol);
    req.userId = payload.userId;
    req.userRol = payload.rol;
    next();
  } catch (err) {
    return res.status(401).json({ message: "Token inválido" });
  }
}

function requireRole(...roles) {
  return (req, res, next) => {
    if (!roles.includes(req.userRol)) {
      return res.status(403).json({ message: "No autorizado" });
    }
    next();
  };
}

module.exports = { auth, requireRole };
