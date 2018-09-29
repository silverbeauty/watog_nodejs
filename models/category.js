const Sequelize = require('sequelize')

const sequelize = require('../config/database')
const Post = require('./post')
const Vote = require('./vote')
const Room = require('./room')

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

  picture: {
    type: Sequelize.STRING,
    allowNull: true
  },

  user_id: {
    type: Sequelize.INTEGER,
    allowNull: false
  },

  score_ratio: {
    type: Sequelize.FLOAT,
    allowNull: false,
    default: 0.2 // https://gitlab.com/watog-app/sql-nodejs/issues/11 //other category
  }
})

Category.hasMany(Post, { foreignKey: 'category_id', sourceKey: 'id' })
Post.belongsTo(Category, { foreignKey: 'category_id', sourceKey: 'id' })

Category.hasMany(Vote, { foreignKey: 'category_id', sourceKey: 'id' })
Vote.belongsTo(Category, { foreignKey: 'category_id', sourceKey: 'id' })

Category.hasMany(Room, { foreignKey: 'category_id', sourceKey: 'id' })
Room.belongsTo(Category, { foreignKey: 'category_id', sourceKey: 'id' })

module.exports = Category
