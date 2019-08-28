const express = require('express');
const jwt = require('jsonwebtoken');

const { authenticate } = require('../middlewares/authenticate');
const errorHandler = require('../common/errorHandler');
const models = require('../../models');

const router = express.Router();

router.use(authenticate);

/* Getting a user session by mail from a token */
router.get('/', (req, res) => {
  const token = req.decodedToken;

  try {
    const { email, linkTransitions } = token;
    res.json({
      ok: true,
      result: { user: email, linkTransitions }
    });
  } catch (error) {
    errorHandler(error, res);
  }
});

/* Creating a user session */
router.post('/', (req, res) => {
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

        res.json({
          ok: true,
          result: {
            user: { email, linkTransitions },
            token
          }
        });
      } else {
        throw 'data_incorrect';
      }
    })
    .catch(error => errorHandler(error, res));
});

module.exports = router;
