const jwt = require("jsonwebtoken");

async function authenticate(req, res, next) {
  try {
    const token = req.headers.authorization.split(" ")[1];
    const decodedToken = await jwt.verify(token, process.env.JWT_SECRET);
    const user = await decodedToken;
    req.user = user;
    next();
  } catch (error) {
    res.status(401).json({
      message: new Error("Inavlid request!"),
    });
  }
}

module.exports = authenticate;
