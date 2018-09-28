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
  private: {
    type: Sequelize.BOOLEAN,
    allowNull: false,
    default: false
  },
  one_to_one: { // is one to one or is multi
    type: Sequelize.BOOLEAN,
    allowNull: false,
    default: false
  }
})

Room.hasMany(Member, { foreignKey: 'room_id', sourceKey: 'id' })

Member.belongsTo(Room, { foreignKey: 'room_id', sourceKey: 'id' })

module.exports = Room
