const express = require('express');

var { account, session, link, adminLink } = require('./controllers');
const { authenticate } = require('./middlewares/authenticate');
const { verifyAdmin } = require('./middlewares/admin');

const prefix = process.env.API_PREFIX;

const router = express.Router();

module.exports = app => {
  const middlewareAuthenticate = router.use(authenticate);
  app.use(middlewareAuthenticate);

  app.use('/', link);
  app.use(`${prefix}/link`, link);
  app.use(`${prefix}/account`, account);
  app.use(`${prefix}/account/session`, session);

  /*
   * ADMIN
   */
  app.use(verifyAdmin);

  app.use(`${prefix}/admin/link`, adminLink);
};
