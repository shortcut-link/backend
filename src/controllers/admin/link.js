const express = require('express');
const Sequelize = require('sequelize');

const models = require('../../../models');
const errorHandler = require('../errors/link');
const { verifyAdmin } = require('../../middlewares/admin');

const router = express.Router();
const Op = Sequelize.Op;

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

router.get('/top', async (req, res) => {
  try {
    const { startIndex, stopIndex, period } = req.query;

    const limit = +stopIndex - +startIndex;

    let where = {};
    let date = new Date();

    if (period === 'day') {
      date = date.setDate(date.getDate() - 1);
      where.createdAt = { [Op.gte]: date };
    }

    if (period === 'month') {
      date = date.setMonth(date.getMonth() - 1);
      where.createdAt = { [Op.gte]: date };
    }

    await models.link
      .findAll({
        where,
        attributes: ['url', 'originalUrl', 'transitions', 'createdAt', 'user'],
        order: [
          ['transitions', 'DESC'],
          ['createdAt', 'DESC']
        ],
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
