const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');

router.get('/', (req, res) => {
  res.json({
    ok: false
  });
});

router.post('/', (req, res) => {
  res.json({
    ok: false
  });
});

module.exports = router;
