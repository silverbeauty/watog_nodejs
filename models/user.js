const Sequelize = require('sequelize')

const sequelize = require('../config/database')

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
})

User.associate = function (models) {
  User.hasMany(models.Category,
    {
      foreignKey: 'user_id',
      constraints: false
    }
  )
}

User.associate = function (models) {
  User.hasOne(models.Vote,
    {
      foreignKey: 'voteBy',
      constraints: false
    }
  )
}

User.sync()

module.exports = User
