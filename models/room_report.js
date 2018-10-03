const Sequelize = require('sequelize')

const sequelize = require('../config/database')

const RoomReport = sequelize.define('RoomReport', {
  id: {
    type: Sequelize.INTEGER,
    allowNull: false,
    autoIncrement: true,
    primaryKey: true
  },
  user_id: { // Who reported
    type: Sequelize.INTEGER,
    allowNull: false
  },
  room_id: {
    type: Sequelize.UUID,
    allowNull: false
  },
  type: {
    type: Sequelize.STRING, // One of 'spam', 'violence', 'sex', 'other'
    allowNull: false
  },
  description: {
    type: Sequelize.STRING, // Additional description about the report
    allowNull: true
  }
})

module.exports = RoomReport
