const express = require('express');
const jwt = require('jsonwebtoken');

const { authenticate } = require('../middlewares/authenticate');
const errorHandler = require('../common/errorHandler');
const models = require('../../models');

const router = express.Router();

router.use(authenticate);

/* Getting a user session by mail from a token */
router.get('/', (req, res) => {
  const { email } = req.decodedToken;

  models.user
    .findOne({
      where: { email },
      attributes: ['email', 'linkTransitions']
    })
    .then(({ dataValues }) => {
      res.json({
        ok: true,
        result: { user: dataValues }
      });
    })
    .catch(error => errorHandler(error, res));
});

/* Creating a user session */
router.post('/', (req, res) => {
  const { email, password } = req.body;

  models.user
    .findOne({
      where: { email },
      attributes: ['email', 'password', 'createdAt', 'linkTransitions']
    })
    .then(user => {
      if (user && user.isValidPassword(password)) {
        const { email, createdAt, linkTransitions } = user.dataValues;

        const token = jwt.sign({ email, createdAt }, process.env.PRIVATEKEY);

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
