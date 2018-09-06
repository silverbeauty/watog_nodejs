const Sequelize = require('sequelize')

const sequelize = require('../config/database')

const Vote = sequelize.define('Votes', {
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
  post_id: {
    type: Sequelize.INTEGER,
    allowNull: true // Vote can be category only
  },
  user_id: {
    type: Sequelize.INTEGER,
    allowNull: false
  },
  commend: { type: Sequelize.BOOLEAN, allowNull: false, defaultValue: true }
})

module.exports = Vote
