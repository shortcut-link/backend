const SwitchError = errorText => {
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

const errorCreateAccount = (error, res) => {
  const errorText = error[0].msg;
  res.json({
    ok: false,
    error: SwitchError(errorText)
  });
};

module.exports = { errorCreateAccount };
