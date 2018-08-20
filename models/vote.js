var sequelize = require('../config/database')

var Vote = sequelize.define('Votes', {
  id: {
    type: Sequelize.INTEGER,
    allowNull: false,
    autoIncrement: true,
    primaryKey: true
  },
  category_id: {
    type: Sequelize.INTEGER,
    allowNull: false
  },
  voteBy: {
    type: Sequelize.INTEGER,
    allowNull: false
  }
},
{
  classMethods: {
    associate: function (models) {
      models.Votes.belongsTo(models.Category, { constraints: false })
    }
  }
},
{
  classMethods: {
    associate: function (models) {
      models.Votes.belongsTo(models.User, { constraints: false })
    }
  }
})

Vote.sync()

module.exports = Vote
