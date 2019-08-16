const express = require('express');
const jwt = require('jsonwebtoken');

const { authenticate } = require('../middlewares/authenticate');
const { sessionError } = require('./session.errors');

const router = express.Router();

router.use(authenticate);

/* Getting a user session by mail from a token */
router.get('/', (req, res) => {
  const { email } = req.decodedToken;

  req.models.users.find({ email }, (error, user) => {
    try {
      if (error) throw error;
      if (!user || user.length !== 1) throw 'user-not-found';

      const { email } = user[0];

      res.json({
        ok: true,
        result: {
          user: {
            email
          }
        }
      });
    } catch (error) {
      sessionError(error, res);
    }
  });
});

/* Creating a user session */
router.post('/', (req, res) => {
  const { email, password } = req.body;

  req.models.users.find({ email }, async (error, user) => {
    try {
      if (error) throw error;
      if (!user || user.length !== 1) throw 'user-not-found';

      const { isValidPassword, createdAt } = user[0];

      if (!isValidPassword(password)) throw 'password-incorrect';

      const token = jwt.sign({ email, createdAt }, process.env.PRIVATEKEY);

      res.json({
        ok: true,
        result: {
          user: { email },
          token
        }
      });
    } catch (error) {
      sessionError(error, res);
    }
  });
});

module.exports = router;
