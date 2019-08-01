module.exports = (orm, db) => {
  const User = db.define('users', {
    email: String,
    passwordHash: String,
    createdAt: String
  });
};
