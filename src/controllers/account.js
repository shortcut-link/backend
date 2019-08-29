const express = require('express');
const jwt = require('jsonwebtoken');

const models = require('../../models');
const errorHandler = require('../common/errorHandler');
const { authenticate } = require('../middlewares/authenticate');

const router = express.Router();

router.use(authenticate);

/* Create user account */
router.post('/', (req, res) => {
  try {
    const { email, password } = req.body;

    models.user
      .create({ email, password })
      .then(({ dataValues: { email, linkTransitions } }) => {
        const token = jwt.sign({ email }, process.env.PRIVATEKEY);

        res.json({
          ok: true,
          result: { user: { email, linkTransitions }, token }
        });
      })
      .catch(error => errorHandler.common(error, res));
  } catch (error) {
    errorHandler.common(error, res);
  }
});

router.post('/link', (req, res) => {
  try {
    const { email } = req.decodedToken;
    const field = req.body;

    models.user
      .findOne({
        where: { email }
      })
      .then(user => {
        if (!user) throw 'user_not_found';

        user
          .update(field, { fields: ['linkTransitions'] })
          .then(() => res.json({ ok: true }));
      })
      .catch(error => errorHandler.common(error, res));
  } catch (error) {
    errorHandler.common(error, res);
  }
});

module.exports = router;
