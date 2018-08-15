var sequelize = require('../config/database');


var Uploads = sequelize.define('Uploads', {
    id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
    },
    pictures: {
        type: Sequelize.STRING,
        allowNull: false,
    }
});


Uploads.hasOne('Votes', {
    foreignKey: 'upload_id',
    constraints: false
})

Uploads.belongsTo(Category, { constraints: false })


module.exports = Uploads;