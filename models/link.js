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
        allowNull: false,
        validate: {
          isUrl: {
            args: true,
            msg: 'not_valid_url'
          }
        }
      },
      user: {
        type: DataTypes.INTEGER,
        defaultValue: null
      },
      transitions: {
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

            const transitions = createdLink.transitions;
            createdLink.transitions = transitions === true ? 0 : null;

            createdLink.originalUrl = createdLink.originalUrl.replace(
              /^(http:\/\/www\.|https:\/\/www\.|http:\/\/|https:\/\/)?([a-z0-9]+([\\-\\.]{1}[a-z0-9]+)*\.[a-z]{2,5}(:[0-9]{1,5})?(\/.*)?)$/,
              '$2'
            );
          }
        ],
        beforeBulkUpdate: [
          function(link) {
            const transitions = link.attributes.transitions;

            if (typeof transitions === 'boolean') {
              if (transitions) {
                link.attributes.transitions = 0;
              } else {
                link.attributes.transitions = null;
              }
            }
          }
        ]
      }
    }
  );

  link.prototype.isTransitions = function() {
    return this.transitions !== null;
  };

  link.prototype.changeUserIdToEmail = async function(models) {
    await models.user
      .findOne({ where: { id: this.user }, attributes: ['email'] })
      .then(({ email }) => {
        this.user = email;
      });
  };

  return link;
};
