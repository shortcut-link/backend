var { account, session } = require('./controllers');

const prefix = process.env.API_PREFIX;

module.exports = app => {
  app.use(`${prefix}/account`, account);
  app.use(`${prefix}/account/session`, session);
};
