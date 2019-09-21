const express = require('express');
const jwt = require('jsonwebtoken');

const errorHandler = require('./errors/session');
const models = require('../../models');

const router = express.Router();

/* Getting a user session by mail from a token */
router.get('/', (req, res) => {
  try {
    const { email, linkTransitions } = req.decodedToken;

    res.status(200).json({
      user: { email, linkTransitions }
    });
  } catch (error) {
    errorHandler.common(error, res);
  }
});

/* Creating a user session */
router.post('/', (req, res) => {
  try {
    const { email, password } = req.body;

    models.user
      .findOne({
        where: { email },
        attributes: ['email', 'password', 'linkTransitions']
      })
      .then(user => {
        if (user && user.isValidPassword(password)) {
          const { email, linkTransitions } = user.dataValues;

          const token = jwt.sign({ email }, process.env.PRIVATEKEY);

          res.status(200).json({
            user: { email, linkTransitions },
            token
          });
        } else {
          throw 'not_correct_data';
        }
      })
      .catch(error => errorHandler.common(error, res));
  } catch (error) {
    errorHandler.common(error, res);
  }
});

module.exports = router;
