const sequelize = require('../config/database')

const Sequelize = require('sequelize')

const Message = sequelize.define('Message', {
  id: {
    primaryKey: true,
    type: Sequelize.UUID,
    defaultValue: Sequelize.UUIDV4,
  },
  room_id: {
    type: Sequelize.UUID,
    allowNull: false
  },
  member_id: {
    type: Sequelize.INTEGER,
    allowNull: false
  },
  text: {
    type: Sequelize.STRING,
    allowNull: false
  },
  is_announcement: {
    type: Sequelize.BOOLEAN,
    allowNull: true,
    default: false
  },
  file_url: {
    type: Sequelize.STRING,
    allowNull: false
  }
})

module.exports = Message
