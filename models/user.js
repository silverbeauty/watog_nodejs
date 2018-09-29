const Sequelize = require('sequelize')

const sequelize = require('../config/database')

const Post = require('./post')
const Category = require('./category')
const Vote = require('./vote')
const Member = require('./member')

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
  bio: {
    type: Sequelize.STRING,
    allowNull: true
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
  user_name: {
    type: Sequelize.STRING,
    allowNull: false,
    unique: true
  },
  job: {
    type: Sequelize.STRING,
    allowNull: true
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
  state: {
    type: Sequelize.STRING,
    allowNull: true
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
  },
  up_vote_count: {
    type: Sequelize.INTEGER,
    allowNull: false,
    default: 0
  },
  down_vote_count: {
    type: Sequelize.INTEGER,
    allowNull: false,
    default: 0
  },
  vote_score: { // https://gitlab.com/watog-app/sql-nodejs/issues/11
    type: Sequelize.FLOAT,
    allowNull: false,
    default: 0
  },
  report_count: {
    type: Sequelize.INTEGER,
    allowNull: false,
    default: 0
  },
  removed: {
    type: Sequelize.BOOLEAN,
    allowNull: true,
    default: false
  },

  settings: { // Should be stringified using JSON.stringify
    type: Sequelize.STRING,
    allowNull: true,
    default: `{"notifications":{"vote":true,"participate":true,"spam_mark":true}}`
  }
})

User.hasMany(Post, { foreignKey: 'user_id', sourceKey: 'id' })
User.hasMany(Category, { foreignKey: 'user_id', sourceKey: 'id' })
User.hasMany(Vote, { foreignKey: 'user_id', sourceKey: 'id' })
User.hasMany(Member, { foreignKey: 'user_id', sourceKey: 'id' })


Post.belongsTo(User, { foreignKey: 'user_id', sourceKey: 'id' })
Category.belongsTo(User, { foreignKey: 'user_id', sourceKey: 'id' })
Vote.belongsTo(User, { foreignKey: 'user_id', sourceKey: 'id' })
Member.belongsTo(User, { foreignKey: 'user_id', sourceKey: 'id' })

module.exports = User
