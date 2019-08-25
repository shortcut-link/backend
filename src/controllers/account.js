const express = require('express');
const jwt = require('jsonwebtoken');

const models = require('../../models');
const errorHandler = require('../common/errorHandler');

const router = express.Router();

/* Create user account */
router.post('/', (req, res) => {
  const { email, password } = req.body;

  models.user
    .create({ email, password })
    .then(({ dataValues: { email, createdAt, linkTransitions } }) => {
      const token = jwt.sign({ email, createdAt }, process.env.PRIVATEKEY);

      res.json({
        ok: true,
        result: { user: { email, linkTransitions }, token }
      });
    })
    .catch(error => errorHandler(error, res));
});

module.exports = router;
