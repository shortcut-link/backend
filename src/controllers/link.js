const express = require('express');

const models = require('../../models');
const errorHandler = require('../common/errorHandler');
const { authenticate } = require('../middlewares/authenticate');

const router = express.Router();

router.use(authenticate);

router.post('/', (req, res) => {
  try {
    const token = req.decodedToken;
    const { url } = req.body;

    models.link
      .create({
        originalUrl: url,
        user: token ? token.id : null,
        linkTransitions: token ? token.linkTransitions : null
      })
      .then(({ url }) => {
        const domainWithUrl = `http://localhost:8080/${url}`;
        res.json({ ok: true, result: { url: domainWithUrl } });
      })
      .catch(error => errorHandler(error, res));
  } catch (error) {
    errorHandler(error, res);
  }
});

module.exports = router;
