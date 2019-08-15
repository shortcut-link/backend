const express = require('express');
const jwt = require('jsonwebtoken');

const { errorCreateAccount } = require('./account.errors');

const router = express.Router();

router.post('/', (req, res) => {
  const { email, password } = req.body;

  req.models.users.create({ email, password }, (error, user) => {
    if (error) {
      errorCreateAccount(error, res);
    } else {
      const { email, createdAt } = user;
      const token = jwt.sign({ email, createdAt }, process.env.PRIVATEKEY);

      res.json({
        ok: true,
        result: { user: { email }, token }
      });
    }
  });
});

module.exports = router;
