const bcrypt = require('bcrypt');

module.exports = (sequelize, DataTypes) => {
  var user = sequelize.define(
    'user',
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
      },
      email: {
        type: DataTypes.STRING(254),
        allowNull: false,
        unique: {
          args: true,
          msg: 'email_already_exists'
        },
        validate: {
          isEmail: {
            args: true,
            msg: 'email_invalid'
          }
        }
      },
      password: {
        type: DataTypes.STRING(60),
        alowNull: false,
        validate: {
          min: {
            args: 8,
            msg: 'password_invalid'
          }
        }
      },
      linkTransitions: {
        type: DataTypes.BOOLEAN,
        defaultValue: 0
      },

      createdAt: {
        type: DataTypes.DATE
      },
      updatedAt: {
        type: DataTypes.DATE
      }
    },
    {
      hooks: {
        beforeCreate: [
          function(user) {
            user.password = bcrypt.hashSync(user.password, 10);
          }
        ]
      }
    }
  );

  user.prototype.isValidPassword = function(password) {
    return bcrypt.compareSync(password, this.password);
  };

  return user;
};
