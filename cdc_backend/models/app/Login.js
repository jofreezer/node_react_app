const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../../utils/sequerize');


const Login = sequelize.define("login_user", {
            USER_ID: {
                        type: DataTypes.INTEGER,
                        allowNull: false,
                        primaryKey: true,
                        autoIncrement: true
            },
            NOM: {
                        type: DataTypes.STRING(191),
                        allowNull: false
            },
            PRENOM: {
                        type: DataTypes.STRING(191),
                        allowNull: false
            },
            USERNAME: {
                        type: DataTypes.STRING(191),
                        allowNull: false
            },
            EMAIL: {
                        type: DataTypes.STRING(191),
                        allowNull: false
            },
            MOT_PASS: {
                        type: DataTypes.STRING(191),
                        allowNull: false
            },

}, {
            freezeTableName: true,
            tableName: 'login_user',
            timestamps: false,
})



module.exports = Login