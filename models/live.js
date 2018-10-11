const sequelize = require('../config/database')

const Sequelize = require('sequelize')

const LiveVideo = sequelize.define('LiveVideo', {
  id: {
    type: Sequelize.INTEGER,
    allowNull: false,
    primaryKey: true
  },
  youtube_id: {
    type: Sequelize.STRING, // email or sms
    allowNull: false
  }
})

module.exports = LiveVideo
