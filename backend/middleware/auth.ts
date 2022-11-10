const jwt = require("jsonwebtoken");

const config = process.env;

const verifyToken = (req:any, res:any, next:any) => {
  const token =
    req.body.token || req.query.token || req.headers.authorization;
  if (!token) {
    return res.status(403).send("A token is required for authentication");
  }
  try {
    const decoded = jwt.verify(token, "TOKEN-KEY");
    req.user = decoded;
  } catch (err) {
    console.log(err)
    return res.status(401).send("Invalid Token");
  }
  return next();
};

module.exports = verifyToken;