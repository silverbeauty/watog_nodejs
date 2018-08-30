const sequelize = require('../config/database')

const Sequelize = require('sequelize')

const File = sequelize.define('File', {
  id: {
    type: Sequelize.INTEGER,
    allowNull: false,
    autoIncrement: true,
    primaryKey: true
  },
  name: {
    type: Sequelize.STRING, // email or sms
    allowNull: false,
    unique: true
  },
  user_id: {
    type: Sequelize.INTEGER,
    allowNull: false
  }
})

module.exports = File
