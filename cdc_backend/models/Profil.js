const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../utils/sequerize');


const Profil = sequelize.define("profil", {
          ID_PROFIL: {
                    type: DataTypes.INTEGER,
                    allowNull: false,
                    primaryKey: true,
                    autoIncrement: true
          },
          DESC_PROFIL: {
                    type: DataTypes.STRING(191),
                    allowNull: false
          },
          
        
}, {
          freezeTableName: true,
          tableName: 'profil',
          timestamps: false,
})



module.exports = Profil