const nanoid = require('nanoid');

module.exports = (sequelize, DataTypes) => {
  var link = sequelize.define(
    'link',
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
      },
      url: {
        type: DataTypes.STRING(7),
        unique: {
          args: true,
          msg: 'url_already_exists'
        }
      },
      originalUrl: {
        type: DataTypes.STRING(2084),
        allowNull: false
      },
      user: {
        type: DataTypes.INTEGER,
        defaultValue: null
      },
      linkTransitions: {
        type: DataTypes.BIGINT,
        defaultValue: null
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
          function(createdLink) {
            createdLink.url = nanoid(7);

            const transitions = createdLink.linkTransitions;
            createdLink.linkTransitions = transitions === true ? 0 : null;
          }
        ]
      }
    }
  );

  return link;
};
