const Sequelize = require('sequelize')

const sequelize = require('../config/database')
const Member = require('./member')
const Message = require('./message')
const RoomReport = require('./room_report')

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
  category_id: { // Category
    type: Sequelize.INTEGER,
    allowNull: true
  },
  jobs: {
    type: Sequelize.STRING,
    allowNull: true
  },
  topics: {
    type: Sequelize.STRING,
    allowNull: true
  },
  title: {
    type: Sequelize.STRING,
    allowNull: true
  },
  description: {
    type: Sequelize.STRING,
    allowNull: true
  },
  countries: {
    type: Sequelize.STRING,
    allowNull: true
  },
  is_private: {
    type: Sequelize.BOOLEAN,
    allowNull: true,
    default: false
  },
  archived: {
    type: Sequelize.BOOLEAN,
    allowNull: true,
    default: false
  },
  is_one_to_one: { // is one to one or is multi
    type: Sequelize.BOOLEAN,
    allowNull: true,
    default: false
  },
  hash: { // represent 1:1 chat rooms
    type: Sequelize.STRING,
    allowNull: true
  },
  avatar: { // avatar photo
    type: Sequelize.STRING,
    allowNull: true
  },
  background: { // background photo
    type: Sequelize.STRING,
    allowNull: true
  }
})

Room.hasMany(Member, { foreignKey: 'room_id', sourceKey: 'id' })
Member.belongsTo(Room, { foreignKey: 'room_id', sourceKey: 'id' })

Room.hasMany(RoomReport, { foreignKey: 'room_id', sourceKey: 'id' })
RoomReport.belongsTo(Room, { foreignKey: 'room_id', sourceKey: 'id' })

Room.hasMany(Message, { foreignKey: 'room_id', sourceKey: 'id' })
Message.belongsTo(Room, { foreignKey: 'room_id', sourceKey: 'id' })

module.exports = Room
