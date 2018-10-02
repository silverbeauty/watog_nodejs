
const Sequelize = require('sequelize')
const { DB_PATH, TEST_DB_PATH } = require('./file')

console.info('NODE_ENV:', process.env.NODE_ENV)

const sequelize = new Sequelize('database', null, null, {
  host: 'localhost',
  dialect: 'sqlite',
  operatorsAliases: false,

  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000
  },

  // SQLite only
  storage: process.env.NODE_ENV === 'test' ? TEST_DB_PATH : DB_PATH
})

sequelize
  .authenticate()
  .then(() => {
    console.log('Connection has been established successfully.')
  })
  .catch(err => {
    console.error('Unable to connect to the database:', err)
  })

module.exports = sequelize
