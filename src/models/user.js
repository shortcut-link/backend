const bcrypt = require('bcrypt');

module.exports = (orm, db) => {
  db.define(
    'users',
    {
      email: { type: 'text', size: 254, required: true, unique: true },
      password: { type: 'binary', size: 60, required: true },
      createdAt: { type: 'date', time: true, required: true }
    },
    {
      hooks: {
        beforeValidation: function() {
          this.createdAt = new Date();
        },
        beforeCreate: function() {
          this.password = bcrypt.hashSync(this.password, 10);
        }
      },
      validations: {
        email: [
          orm.enforce.patterns.email('email-invalid'),
          orm.enforce.unique({ ignoreCase: true })
        ],
        password: [orm.enforce.security.password('password-invalid')]
      },
      methods: {
        isValidPassword: function(password) {
          return bcrypt.compareSync(password, this.password);
        }
      }
    }
  );
};
