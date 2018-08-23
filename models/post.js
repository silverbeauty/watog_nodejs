const Sequelize = require('sequelize')

const sequelize = require('../config/database')
const Vote = require('./vote')
const Report = require('./report')

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
  }
})

Post.hasMany(Vote, { foreignKey: 'post_id', sourceKey: 'id' })
Vote.belongsTo(Post, { foreignKey: 'post_id', sourceKey: 'id' })

Post.hasMany(Report, { foreignKey: 'post_id', sourceKey: 'id' })
Report.belongsTo(Post, { foreignKey: 'post_id', sourceKey: 'id' })

module.exports = Post
