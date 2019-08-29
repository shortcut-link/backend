var { account, session, link, shortLink } = require('./controllers');

const prefix = process.env.API_PREFIX;

module.exports = app => {
  app.use('/', shortLink);
  app.use(`${prefix}/account`, account);
  app.use(`${prefix}/account/session`, session);
  app.use(`${prefix}/link`, link);
};
