const jwt = require('jsonwebtoken');

const models = require('../../models');

const authenticate = (req, _, next) => {
  let token = req.headers['authorization'];

  if (!token) return next();

  if (token.startsWith('Bearer ')) {
    token = token.slice(7, token.length);
  }

  jwt.verify(token, process.env.PRIVATEKEY, (error, decoded) => {
    if (error || !decoded) return next();

    models.user
      .findOne({
        where: { email: decoded.email },
        attributes: ['id', 'email', 'linkTransitions', 'admin']
      })
      .then(({ dataValues }) => {
        req.token = dataValues;
        next();
      });
  });
};

module.exports = { authenticate };
