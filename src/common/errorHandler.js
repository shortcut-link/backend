const link = (error, res) => {
  console.error('TCL: link -> error', error);
  switch (error) {
    case 'not_found':
      res.redirect(301, 'http://localhost:3000/link-not-found');
      break;

    default:
      res.redirect(301, 'http://localhost:3000/404');
      break;
  }
};

const common = (error, res) => {
  console.error('TCL: common -> error', error);
  const errorText =
    (error.errors && error.errors[0].message) || error || 'unkown';

  res.json({ ok: false, error: errorText });
};

module.exports = { common, link };
