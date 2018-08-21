const Sequelize = require('sequelize')

const sequelize = require('../config/database')

const Post = require('./post')
const Category = require('./category')
const Vote = require('./vote')

const User = sequelize.define('User', {
  id: {
    type: Sequelize.INTEGER,
    allowNull: false,
    autoIncrement: true,
    primaryKey: true
  },
  first_name: {
    type: Sequelize.STRING,
    allowNull: false
  },
  last_name: {
    type: Sequelize.STRING,
    allowNull: false
  },
  password: {
    type: Sequelize.STRING,
    allowNull: false
  },
  email: {
    type: Sequelize.STRING,
    allowNull: false,
    unique: true
  },
  cell_phone: {
    type: Sequelize.STRING,
    allowNull: false,
    unique: true
  },
  country: {
    type: Sequelize.STRING,
    allowNull: false
  },
  hospital: {
    type: Sequelize.STRING,
    allowNull: false
  },
  proof_of_status: { // Proof of status doc URL
    type: Sequelize.STRING,
    allowNull: true
  },
  proof_of_status_date: { // When it is verified by admin
    type: Sequelize.DATE,
    allowNull: true
  },
  email_verified_date: {
    type: Sequelize.DATE,
    allowNull: true
  },
  sms_verified_date: {
    type: Sequelize.DATE,
    allowNull: true
  },
  picture_profile: {
    type: Sequelize.STRING,
    allowNull: true
  },
  picture_cover: {
    type: Sequelize.STRING,
    allowNull: true
  }
})

User.hasMany(Post, { foreignKey: 'user_id', sourceKey: 'id' })
User.hasMany(Category, { foreignKey: 'user_id', sourceKey: 'id' })
User.hasMany(Vote, { foreignKey: 'user_id', sourceKey: 'id' })

Post.belongsTo(User, { foreignKey: 'user_id', sourceKey: 'id' })
Category.belongsTo(User, { foreignKey: 'user_id', sourceKey: 'id' })
Vote.belongsTo(User, { foreignKey: 'user_id', sourceKey: 'id' })

module.exports = User
