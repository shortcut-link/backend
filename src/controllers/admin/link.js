const express = require('express');

const models = require('../../../models');
const errorHandler = require('../errors/link');
const { verifyAdmin } = require('../../middlewares/admin');

const router = express.Router();

router.get('/find', (req, res) => {
  try {
    const { url } = req.query;

    models.link
      .findOne({
        where: { url },
        attributes: ['url', 'originalUrl', 'user', 'transitions', 'createdAt']
      })
      .then(async link => {
        if (!link) throw 'link_not_found';

        await link.changeUserIdToEmail(models);

        res.json(link);
      })
      .catch(error => errorHandler.common(error, res));
  } catch (error) {
    errorHandler.common(error, res);
  }
});

router.post('/parameter', (req, res) => {
  try {
    const { url, parameter } = req.query;
    const { value } = req.body;

    models.link
      .findOne({ where: { url } })
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

router.delete('/', (req, res) => {
  try {
    const { url } = req.query;

    models.link
      .destroy({ where: { url } })
      .then(() => res.status(200).end())
      .catch(error => errorHandler.common(error, res));
  } catch (error) {
    errorHandler.common(error, res);
  }
});

module.exports = router;
