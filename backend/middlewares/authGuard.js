const User = require("../models/User");

const jwt = require("jsonwebtoken");

const jwtSecret = process.env.JWT_SECRET;

const authGuard = async (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  /* exemple of token: Bearer fmod456gnmjks56fsd5fs
   */

  //check if header has a token
  if (!token) return res.status(401).json({ errors: ["Acesso negado!"] });

  try {
    //verify if token matches with the secret
    const verified = jwt.verify(token, jwtSecret);

    req.user = await User.findById(verified.id).select("-password");

    next();
  } catch (error) {
    res.status(401).json({ errors: ["O Token é inválido"] });
  }
};

module.exports = authGuard;
