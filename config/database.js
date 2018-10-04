
const Sequelize = require('sequelize')
const { DB_PATH, TEST_DB_PATH } = require('./path')

console.info('NODE_ENV:', process.env.NODE_ENV)
let sequelize

if (process.env.NODE_ENV === 'test') {
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
    storage: TEST_DB_PATH
  })
} else { // production mode
  sequelize = new Sequelize(process.env.DB_URL)
}

sequelize
  .authenticate()
  .then(() => {
    console.log('Connection has been established successfully.')
  })
  .catch(err => {
    console.error('Unable to connect to the database:', err)
  })

module.exports = sequelize
