const express = require('express');

const models = require('../../models');
const errorHandler = require('./errors/account');

const router = express.Router();

/*
 * Create user account
 * https://documenter.getpostman.com/view/9580525/SW7c3TaJ?version=latest#678789c5-14b7-408a-9cb4-68fb83b6af3c
 */
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

/*
 * Changing the parameters of the created link
 * https://documenter.getpostman.com/view/9580525/SW7c3TaJ?version=latest#ebf6248b-923d-4b4e-b71d-1b800a4ba2d7
 */
router.post('/linkSettings', (req, res) => {
  try {
    const { email } = req.token;
    const { parameter, value } = req.body;

    models.user
      .update(
        { [parameter]: value },
        {
          where: { email },
          fields: ['linkTransitions']
        }
      )
      .then(() => res.status(200).end())
      .catch(error => errorHandler.common(error, res));
  } catch (error) {
    errorHandler.common(error, res);
  }
});

/*
 * Number of user links
 * https://documenter.getpostman.com/view/9580525/SW7c3TaJ?version=latest#d3cfcc87-6d60-45ee-a633-5f8ddb78afa1
 */
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

/*
 * Download user links
 * https://documenter.getpostman.com/view/9580525/SW7c3TaJ?version=latest#7bc0ea50-602d-4b6a-8ac5-d1104b3c080b
 */
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
