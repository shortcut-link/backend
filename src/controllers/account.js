const express = require('express');
const jwt = require('jsonwebtoken');

const models = require('../../models');
const errorHandler = require('../common/errorHandler');

const router = express.Router();

/* Create user account */
router.post('/', (req, res) => {
  try {
    const { email, password } = req.body;

    models.user
      .create({ email, password })
      .then(({ dataValues: { email, linkTransitions } }) => {
        const token = jwt.sign({ email }, process.env.PRIVATEKEY);

        res.json({
          ok: true,
          result: { user: { email, linkTransitions }, token }
        });
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
      .findOne({
        where: { email }
      })
      .then(user => {
        if (!user) throw 'user_not_found';

        user
          .update(field, { fields: ['linkTransitions'] })
          .then(() => res.json({ ok: true }));
      })
      .catch(error => errorHandler.common(error, res));
  } catch (error) {
    errorHandler.common(error, res);
  }
});

router.get('/links', (req, res) => {
  try {
    const { id } = req.decodedToken;
    const { offset, count } = req.query;

    models.link
      .findAll({
        where: { user: id },
        attributes: ['url', 'originalUrl', 'transitions', 'createdAt'],
        order: [['createdAt', 'DESC']],
        offset: +offset,
        limit: 30
      })
      .then(async links => {
        const countUserLinks = +count
          ? await models.link
              .count({ where: { user: id } })
              .then(count => count)
          : undefined;

        return res.json({
          count: countUserLinks,
          links
        });
      })
      .catch(error => errorHandler.common(error, res));
  } catch (error) {
    errorHandler.common(error, res);
  }
});

module.exports = router;
