module.exports = (error, res) => {
  console.log('TCL: error', error);
  const errorText =
    (error.errors && error.errors[0].message) || error || 'unkown';

  res.json({ ok: false, error: errorText });
};
