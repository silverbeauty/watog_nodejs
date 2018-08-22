const Sequelize = require('sequelize')

const sequelize = require('../config/database')
const Vote = require('./vote')

const Post = sequelize.define('Post', {
  id: {
    type: Sequelize.INTEGER,
    allowNull: false,
    autoIncrement: true,
    primaryKey: true
  },
  picture: {
    type: Sequelize.STRING,
    allowNull: false
  },
  category_id: {
    type: Sequelize.INTEGER,
    allowNull: false
  },
  user_id: {
    type: Sequelize.INTEGER,
    allowNull: false
  },
  vote_score: {
    type: Sequelize.INTEGER,
    allowNull: false,
    default: 0
  }
})

Post.hasMany(Vote, { foreignKey: 'post_id', sourceKey: 'id' })
Vote.belongsTo(Post, { foreignKey: 'post_id', sourceKey: 'id' })

module.exports = Post
