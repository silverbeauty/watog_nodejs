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
    type: Sequelize.STRING, // file name, ex: xxx-xxx-xxxx.png
    allowNull: false,
    unique: true
  },
  type: {
    type: Sequelize.STRING, // 'image' or 'verify_doc'
    allowNull: false,
    default: 'image'
  },
  user_id: {
    type: Sequelize.INTEGER,
    allowNull: false
  }
})

module.exports = File
