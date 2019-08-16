const express = require('express');
const jwt = require('jsonwebtoken');

const { accountError } = require('./account.errors');

const router = express.Router();

/* Create user account */
router.post('/', (req, res) => {
  const { email, password } = req.body;

  req.models.users.create({ email, password }, (error, user) => {
    try {
      if (error) throw error;

      const { email, createdAt } = user;
      const token = jwt.sign({ email, createdAt }, process.env.PRIVATEKEY);

      res.json({
        ok: true,
        result: { user: { email }, token }
      });
    } catch (error) {
      accountError(error, res);
    }
  });
});

module.exports = router;
