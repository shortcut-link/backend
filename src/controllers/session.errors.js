const switchError = errorText => {
  switch (errorText) {
    case 'password-incorrect':
    case 'user-not-found':
      return 'data_incorrect';
    default:
      return 'unknown';
  }
};

/**
 * Error generation session controller
 * @param { [{ msg: string }] | string } error Error to be handled
 * @param { Response } res Response router
 */
const sessionError = (error, res) => {
  const errorText = error[0].msg || error;

  res.json({
    ok: false,
    error: switchError(errorText)
  });
};

module.exports = { sessionError };
