const Sequelize = require('sequelize')

const sequelize = require('../config/database')
const Message = require('./message')

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

Member.hasMany(Message, { foreignKey: 'member_id', sourceKey: 'id' })
Message.belongsTo(Member, { foreignKey: 'member_id', sourceKey: 'id' })

module.exports = Member
