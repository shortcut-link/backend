const verifyAdmin = (req, _, next) => {
  const { admin } = req.token;

  if (admin) {
    return next();
  }

  throw 'you_not_admin';
};

module.exports = { verifyAdmin };
