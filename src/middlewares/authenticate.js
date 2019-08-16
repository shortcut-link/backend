const jwt = require('jsonwebtoken');

const authenticate = (req, res, next) => {
  const token = req.cookies['sc-token'];

  if (token) {
    jwt.verify(token, process.env.PRIVATEKEY, (_, decoded) => {
      if (decoded) {
        req.decodedToken = { email: decoded.email };
      }
    });
  }

  next();
};

module.exports = { authenticate };
