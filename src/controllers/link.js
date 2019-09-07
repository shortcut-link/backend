const express = require('express');

const models = require('../../models');
const errorHandler = require('../common/errorHandler');

const router = express.Router();

router.get('/:url', (req, res) => {
  try {
    const { url } = req.params;

    models.link
      .findOne({
        where: { url }
      })
      .then(link => {
        const { originalUrl, linkTransitions } = link.dataValues;

        if (!originalUrl) throw 'not_found';

        res.redirect(301, `https://www.${originalUrl}`);

        if (link.isTransitions()) {
          link.update(
            { linkTransitions: linkTransitions + 1 },
            { fields: ['linkTransitions'] }
          );
        }
      })
      .catch(error => errorHandler.link(error, res));
  } catch (error) {
    errorHandler.common(error, res);
  }
});

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
      .catch(error => errorHandler.common(error, res));
  } catch (error) {
    errorHandler.common(error, res);
  }
});

module.exports = router;
