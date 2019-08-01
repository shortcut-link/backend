const express = require('express');
const router = express.Router();

router.get('/session', (res, req) => {
  req.json();
});

module.exports = router;
