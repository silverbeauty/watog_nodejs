var sequelize = require('../config/database');

var Votes = sequelize.define('Votes', {
    id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
    }
});


Votes.belongsTo(Uploads, { constraints: false })
Votes.belongsTo(User, { constraints: false })


module.exports = Votes;