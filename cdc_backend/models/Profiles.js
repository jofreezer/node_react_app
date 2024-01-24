const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../utils/sequerize');


const Profiles = sequelize.define("profiles", {
          PROFIL_ID: {
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
          tableName: 'profiles',
          timestamps: false,
})



module.exports = Profiles