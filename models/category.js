const Sequelize = require('sequelize')

const sequelize = require('../config/database')
const Post = require('./post')
const Vote = require('./vote')

const Category = sequelize.define('Category', {
  id: {
    type: Sequelize.INTEGER,
    allowNull: false,
    autoIncrement: true,
    primaryKey: true
  },

  type: {
    type: Sequelize.STRING,
    allowNull: false,
    unique: true
  },

  description: {
    type: Sequelize.STRING,
    allowNull: true
  },

  user_id: {
    type: Sequelize.INTEGER,
    allowNull: false
  }
})

Category.hasMany(Post, { foreignKey: 'category_id', sourceKey: 'id' })
Post.belongsTo(Category, { foreignKey: 'category_id', sourceKey: 'id' })

Category.hasMany(Vote, { foreignKey: 'category_id', sourceKey: 'id' })
Vote.belongsTo(Category, { foreignKey: 'category_id', sourceKey: 'id' })

module.exports = Category
