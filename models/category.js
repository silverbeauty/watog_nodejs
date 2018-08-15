var sequelize = require('../config/database');


var Category = sequelize.define('Category', {
    id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
    },
    type: {
        type: Sequelize.STRING,
        allowNull: false
    }
});

Category.hasMany(Uploads, { foreignKey: 'category_id', constraints: false })
Category.belongsTo(User, { constraints: false });



module.exports = Category;