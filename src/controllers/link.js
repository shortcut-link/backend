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
        const { originalUrl, transitions } = link.dataValues;

        if (!originalUrl) throw 'not_found';

        res.redirect(301, `https://www.${originalUrl}`);

        if (link.isTransitions()) {
          link.update(
            { transitions: transitions + 1 },
            { fields: ['transitions'] }
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
        transitions: token ? token.linkTransitions : null
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

router.delete('/', (req, res) => {
  try {
    const { id } = req.decodedToken;
    const { url } = req.query;

    models.link
      .destroy({ where: { url, user: id } })
      .then(() => res.json({ ok: true }))
      .catch(error => errorHandler.common(error, res));
  } catch (error) {
    errorHandler.common(error, res);
  }
});

router.post('/options', (req, res) => {
  try {
    const { id } = req.decodedToken;
    const {
      url,
      options: { tracking }
    } = req.body;

    models.link
      .update(
        { transitions: tracking },
        { where: { url, user: id }, fields: ['transitions'] }
      )
      .then(() => res.json({ ok: true }))
      .catch(error => errorHandler.common(error, res));
  } catch (error) {
    errorHandler.common(error, res);
  }
});

module.exports = router;
