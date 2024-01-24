const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../utils/sequerize');


const Fonction = sequelize.define("fonctions", {
          FONCTION_ID : {
                    type: DataTypes.INTEGER,
                    allowNull: false,
                    primaryKey: true,
                    autoIncrement: true
          },
          DESC_FONCTION: {
                    type: DataTypes.STRING(191),
                    allowNull: false
          },
        
}, {
          freezeTableName: true,
          tableName: 'fonctions',
          timestamps: false,
})



module.exports = Fonction