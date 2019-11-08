const jwt = require('jsonwebtoken');

const models = require('../../models');

const authenticate = (req, _, next) => {
  const token = req.cookies['sc-token'];

  if (!token) return next();

  jwt.verify(token, process.env.PRIVATEKEY, (_, decoded) => {
    if (!decoded) return next();

    models.user
      .findOne({
        where: { email: decoded.email },
        attributes: ['id', 'email', 'linkTransitions', 'admin']
      })
      .then(({ dataValues }) => {
        req.decodedToken = dataValues;
        next();
      });
  });
};

module.exports = { authenticate };
