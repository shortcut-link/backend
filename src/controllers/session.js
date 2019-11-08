const express = require('express');
const jwt = require('jsonwebtoken');

const errorHandler = require('./errors/session');
const models = require('../../models');

const router = express.Router();

/* Getting a user session by mail from a token */
router.get('/', (req, res) => {
  try {
    const { email, linkTransitions, admin } = req.decodedToken;

    res.status(200).json({
      user: { email, linkTransitions, admin }
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
        attributes: ['email', 'password']
      })
      .then(user => {
        if (user && user.isValidPassword(password)) {
          const token = jwt.sign({ email }, process.env.PRIVATEKEY);

          res.status(200).json({
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
