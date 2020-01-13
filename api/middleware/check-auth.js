const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  try {
    const token = req.headers.authorization.split(" ")[1];
    const decoded = jwt.verify(token, "jwt secret key is here");
    req.userData = decoded;
    console.log(decoded);
    //if we did successfully authenticate, we call next
    next();
  } catch (error) {
    return res.status(401).json({
      message: "Auth failed"
    })
  }
};
