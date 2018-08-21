const sequelize = require('../config/database')

const Sequelize = require('sequelize')

const Verify = sequelize.define('Verify', {
  id: {
    type: Sequelize.INTEGER,
    allowNull: false,
    autoIncrement: true,
    primaryKey: true
  },
  type: {
    type: Sequelize.STRING, // email or sms
    allowNull: false
  },
  code: {
    type: Sequelize.STRING, // code sent by email or sms
    allowNull: false
  },
  user_id: {
    type: Sequelize.INTEGER,
    allowNull: false
  }
})

Verify.sync()

module.exports = Verify
