const express = require('express');
const jwt = require('jsonwebtoken');

const models = require('../../models');
const errorHandler = require('./errors/account');

const router = express.Router();

/* Create user account */
router.post('/', (req, res) => {
  try {
    const { email, password } = req.body;

    models.user
      .create({ email, password })
      .then(({ dataValues: { email, linkTransitions } }) => {
        const token = jwt.sign({ email }, process.env.PRIVATEKEY);

        res.status(200).json({ user: { email, linkTransitions }, token });
      })
      .catch(error => errorHandler.common(error, res));
  } catch (error) {
    errorHandler.common(error, res);
  }
});

router.post('/linkSettings', (req, res) => {
  try {
    const { email } = req.decodedToken;
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
    const { id } = req.decodedToken;

    models.link.findAndCountAll({ where: { user: id } }).then(({ count }) => {
      return res.status(200).json({ count });
    });
  } catch (error) {
    errorHandler.common(error, res);
  }
});

router.get('/links', (req, res) => {
  try {
    const { id } = req.decodedToken;
    const { startIndex, stopIndex } = req.query;

    const limit = +stopIndex - +startIndex + 1;

    models.link
      .findAll({
        where: { user: id },
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
