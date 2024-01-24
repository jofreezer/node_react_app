const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../utils/sequerize');


const Sexes = sequelize.define("sexes", {
          SEXE_ID : {
                    type: DataTypes.INTEGER,
                    allowNull: false,
                    primaryKey: true,
                    autoIncrement: true
          },
          SEXE: {
                    type: DataTypes.STRING(191),
                    allowNull: false
          },
        
}, {
          freezeTableName: true,
          tableName: 'sexes',
          timestamps: false,
})



module.exports = Sexes