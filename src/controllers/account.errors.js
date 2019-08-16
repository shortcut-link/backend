const switchError = errorText => {
  switch (errorText) {
    case 'not-unique':
      return 'email_already_exists';
    case 'email-invalid':
      return 'email_invalid';
    case 'password-invalid':
      return 'password_invalid';
    default:
      return 'unknown';
  }
};

/**
 * Error generation account controller
 * @param { [{  msg: string  }] | string } error Error to be handled
 * @param  {Response } res Response router
 */
const accountError = (error, res) => {
  const errorText = error[0].msg || error;

  res.json({
    ok: false,
    error: switchError(errorText)
  });
};

module.exports = { accountError };
