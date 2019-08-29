var { account, session, link } = require('./controllers');

const prefix = process.env.API_PREFIX;

module.exports = app => {
  app.use('/', link);
  app.use(`${prefix}/account`, account);
  app.use(`${prefix}/account/session`, session);
  app.use(`${prefix}/link`, link);
};
