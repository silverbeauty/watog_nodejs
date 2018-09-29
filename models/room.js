const sequelize = require('../config/database')
const Member = require('./member')
const Sequelize = require('sequelize')

const Room = sequelize.define('Room', {
  id: {
    primaryKey: true,
    type: Sequelize.UUID,
    defaultValue: Sequelize.UUIDV4,
  },
  user_id: { // Creator 
    type: Sequelize.INTEGER,
    allowNull: false
  },
  title: {
    type: Sequelize.STRING,
    allowNull: false
  },
  description: {
    type: Sequelize.STRING,
    allowNull: false
  },
  is_private: {
    type: Sequelize.BOOLEAN,
    allowNull: false,
    default: false
  },
  is_one_to_one: { // is one to one or is multi
    type: Sequelize.BOOLEAN,
    allowNull: false,
    default: false
  },
  hash: { // represent 1:1 chat rooms
    type: Sequelize.STRING,
    allowNull: true
  },
  avatar: {
    type: Sequelize.STRING,
    allowNull: true
  },
  background: {
    type: Sequelize.STRING,
    allowNull: true
  }
})

Room.hasMany(Member, { foreignKey: 'room_id', sourceKey: 'id' })

Member.belongsTo(Room, { foreignKey: 'room_id', sourceKey: 'id' })

module.exports = Room
