const express = require('express');

const models = require('../../models');
const errorHandler = require('./errors/account');

const router = express.Router();

/* Create user account */
router.put('/', (req, res) => {
  try {
    const { email, password } = req.body;

    models.user
      .create({ email, password })
      .then(() => {
        res.sendStatus(201);
      })
      .catch(error => errorHandler.common(error, res));
  } catch (error) {
    errorHandler.common(error, res);
  }
});

router.post('/linkSettings', (req, res) => {
  try {
    const { email } = req.token;
    const field = req.body;

    models.user
      .update(field, {
        where: { email },
        fields: ['linkTransitions']
      })
      .then(() => res.status(200).end())
      .catch(error => errorHandler.common(error, res));
  } catch (error) {
    errorHandler.common(error, res);
  }
});

router.get('/count-links', (req, res) => {
  try {
    const { email } = req.token;

    models.link
      .findAndCountAll({ where: { user: email } })
      .then(({ count }) => {
        return res.status(200).json({ count });
      });
  } catch (error) {
    errorHandler.common(error, res);
  }
});

router.get('/links', (req, res) => {
  try {
    const { email } = req.token;
    const { startIndex, stopIndex } = req.query;

    const limit = +stopIndex - +startIndex;

    models.link
      .findAll({
        where: { user: email },
        attributes: ['url', 'originalUrl', 'transitions', 'createdAt'],
        order: [['createdAt', 'DESC']],
        offset: +startIndex,
        limit
      })
      .then(links => {
        return res.status(200).json({ links });
      })
      .catch(error => errorHandler.common(error, res));
  } catch (error) {
    errorHandler.common(error, res);
  }
});

module.exports = router;
