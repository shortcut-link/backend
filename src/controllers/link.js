const express = require('express');

const models = require('../../models');
const errorHandler = require('./errors/link');

const router = express.Router();

/*
 * Jump to shortened links
 * https://documenter.getpostman.com/view/9580525/SW7c3TaJ?version=latest#d9243e81-afc7-4813-9a11-c64e48622806
 */
router.get('/:url', (req, res) => {
  try {
    const { url } = req.params;

    models.link
      .findOne({
        where: { url }
      })
      .then(link => {
        if (!link) throw 'not_found';

        const { originalUrl, transitions } = link.dataValues;

        res.redirect(301, `https://www.${originalUrl}`);

        if (link.isTransitions()) {
          link.update(
            { transitions: transitions + 1 },
            { fields: ['transitions'] }
          );
        }
      })
      .catch(error => errorHandler.common(error, res));
  } catch (error) {
    errorHandler.common(error, res);
  }
});

/*
 * Create a shortened link
 *  https://documenter.getpostman.com/view/9580525/SW7c3TaJ?version=latest#25e7330d-4db1-49fc-b799-89a7edaf0c0d
 */
router.post('/', (req, res) => {
  try {
    const token = req.token;
    const { url } = req.body;

    models.link
      .create({
        originalUrl: url,
        user: token ? token.email : null,
        transitions: token ? token.linkTransitions : null
      })
      .then(({ url }) => {
        res.status(200).json({ url });
      })
      .catch(error => errorHandler.common(error, res));
  } catch (error) {
    errorHandler.common(error, res);
  }
});

/*
 * Delete shortened link
 * https://documenter.getpostman.com/view/9580525/SW7c3TaJ?version=latest#eefa684a-0a8d-4af0-95ac-726d4e5aba32
 */
router.delete('/', (req, res) => {
  try {
    const { email } = req.token;
    const { url } = req.query;

    models.link
      .destroy({ where: { url, user: email } })
      .then(() => res.status(200).end())
      .catch(error => errorHandler.common(error, res));
  } catch (error) {
    errorHandler.common(error, res);
  }
});

/*
 * Change link options
 * https://documenter.getpostman.com/view/9580525/SW7c3TaJ?version=latest#0c6022fd-cc25-4e84-af65-bc30f1b55c03
 */
router.post('/parameter', (req, res) => {
  try {
    const { email } = req.token;
    const { url, parameter } = req.query;
    const { value } = req.body;

    models.link
      .findOne({ where: { user: email, url } })
      .then(async link => {
        if (!link) throw 'link_not_found';

        await link.changeParameter(parameter, value);
        link.save();

        res.status(200).end();
      })
      .catch(error => errorHandler.common(error, res));
  } catch (error) {
    errorHandler.common(error, res);
  }
});

module.exports = router;
