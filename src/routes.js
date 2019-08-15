var { account, session } = require('./controllers');

const prefix = '/api';

module.exports = app => {
  app.use(`${prefix}/account`, account);
  app.use(`${prefix}/account/session`, session);
};
