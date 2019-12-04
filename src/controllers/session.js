const express = require('express');
const jwt = require('jsonwebtoken');

const errorHandler = require('./errors/session');
const models = require('../../models');

const router = express.Router();

/*
 * Getting a user session
 * https://documenter.getpostman.com/view/9580525/SW7c3TaJ?version=latest#54e19a0e-c5a2-46af-b7c3-8870298bdaf8
 */
router.get('/', (req, res) => {
  try {
    const { email, linkTransitions, admin } = req.token;
    console.log('TCL: email', email);

    res.status(200).json({
      user: { email, linkTransitions, admin }
    });
  } catch (error) {
    errorHandler.common(error, res);
  }
});

/*
 * Create a user session
 * https://documenter.getpostman.com/view/9580525/SW7c3TaJ?version=latest#6f3a8faf-b419-4339-8be2-4fffd02a232a
 */
router.put('/', (req, res) => {
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
