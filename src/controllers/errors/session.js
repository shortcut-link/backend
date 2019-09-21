const common = (error, res) => {
  const errorText =
    (error.errors && error.errors[0].message) ||
    (typeof error === 'string' && error) ||
    'unkown';

  switch (errorText) {
    case 'not_correct_data':
      res.status(404).json({ message: errorText });
      break;

    default:
      if (typeof errorText === 'string') {
        res.status(404).json({ message: errorText });
        break;
      }
      res.status(404).end();
      break;
  }
};

module.exports = { common };
