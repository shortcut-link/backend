var { account } = require('./controllers');

const prefix = '/api';

module.exports = app => {
  app.use(`${prefix}/account`, account);
};
