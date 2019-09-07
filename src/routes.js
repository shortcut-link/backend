const express = require('express');

var { account, session, link } = require('./controllers');
const { authenticate } = require('./middlewares/authenticate');

const prefix = process.env.API_PREFIX;

const router = express.Router();

module.exports = app => {
  const middlewareAuthenticate = router.use(authenticate);
  app.use(middlewareAuthenticate);

  app.use('/', link);
  app.use(`${prefix}/link`, link);
  app.use(`${prefix}/account`, account);
  app.use(`${prefix}/account/session`, session);
};
