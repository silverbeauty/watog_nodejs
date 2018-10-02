const sequelize = require('../config/database')

const Sequelize = require('sequelize')

const Member = sequelize.define('Member', {
  id: {
    type: Sequelize.INTEGER,
    allowNull: false,
    autoIncrement: true,
    primaryKey: true
  },
  user_id: {
    type: Sequelize.INTEGER,
    allowNull: false
  },
  room_id: {
    type: Sequelize.UUID,
    allowNull: false
  },
  removed: {
    type: Sequelize.BOOLEAN,
    allowNull: false,
    default: false
  }
})

module.exports = Member
