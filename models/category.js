const sequelize = require('../config/database')

const Sequelize = require('sequelize')
const Category = sequelize.define('Category', {
  id: {
    type: Sequelize.INTEGER,
    allowNull: false,
    autoIncrement: true,
    primaryKey: true
  },
  type: {
    type: Sequelize.STRING,
    allowNull: false
  },
  user_id: {
    type: Sequelize.INTEGER,
    allowNull: false
  }
},
{
  classMethods: {
    associate: function (models) {
      models.Category.belongsTo(models.User, { constraints: false })
    }
  }
})

Category.associate = function (models) {
  Category.hasMany(models.Uploads,
    {
      foreignKey: 'category_id',
      constraints: false
    }
  )
}

Category.sync()

module.exports = Category
