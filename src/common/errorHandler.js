module.exports = (error, res) => {
  const errorText =
    (error.errors && error.errors[0].message) || error || 'unkown';

  res.json({ ok: false, error: errorText });
};
