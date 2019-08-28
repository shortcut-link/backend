const express = require('express');
const jwt = require('jsonwebtoken');

const models = require('../../models');
const errorHandler = require('../common/errorHandler');
const { authenticate } = require('../middlewares/authenticate');

const router = express.Router();

router.use(authenticate);

router.post('/', (req, res) => {
  const decodedToken = req.decodedToken;
  const { url } = req.body;

  models.link
    .create({
      originalUrl: url,
      user: decodedToken.id,
      linkTransitions: decodedToken.linkTransitions
    })
    .then(({ url }) => {
      res.json({ ok: true, result: { url } });
    })
    .catch(error => errorHandler(error, res));
});

module.exports = router;
