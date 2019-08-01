const orm = require('orm');

const settings = require('./settings');
const modelUser = require('../models/user');

let connection = null;

const setup = (db, cb) => {
  modelUser(orm, db);

  return cb(null, db);
};

module.exports = cb => {
  if (connection) return cb(null, connection);

  orm.connect(settings.database, function(err, db) {
    if (err) return cb(err);
    connection = db;
    db.settings.set('instance.returnAllErrors', true);
    setup(db, cb);
  });
};
