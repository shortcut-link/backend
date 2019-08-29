const express = require('express');

const models = require('../../models');

const router = express.Router();

/* Creating a user session */
router.get('/:url', (req, res) => {
  const { url } = req.params;

  models.link
    .findOne({ where: { url }, attributes: ['originalUrl'] })
    .then(({ dataValues: { originalUrl } }) => {
      if (!originalUrl) throw 'not_found';
      res.redirect(301, originalUrl);
    })
    .catch(error => {
      switch (error) {
        case 'not_found':
          res.redirect(301, 'http://localhost:3000/link-not-found');
          break;

        default:
          res.redirect(301, 'http://localhost:3000');
          break;
      }
    });
});

module.exports = router;
