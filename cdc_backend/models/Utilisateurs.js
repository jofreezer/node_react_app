const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../utils/sequerize');
const Fonction = require('./Fonction');
const Sexes = require('./Sexes');
const Profiles = require('./Profiles');

const Utilisateur = sequelize.define("utilisateurs", {
            UTIL_ID: {
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
            EMAIL: {
                        type: DataTypes.STRING(191),
                        allowNull: false
            },
         
            // EMAIL:
            // {
            //           email: true,
            //           unique: "drivers,EMAIL"
            // }
            SEXE_ID: {
                        type: DataTypes.TINYINT,

            },
            PHONE: {
                        type: DataTypes.INTEGER(11),
                        allowNull: false
            },
            IMAGE: {
                        type: DataTypes.STRING(191),
                        allowNull: false
            },
            DATE_NAISSANCE: {
                        type: DataTypes.DATE,
                        allowNull: false
            },
            DATE_INSERTION: {
                        type: DataTypes.DATE,
                        allowNull: false,
                        defaultValue: DataTypes.NOW
            },
            FONCTION_ID: {
                        type: DataTypes.TINYINT,


            },
            PROFIL_ID: {
                        type: DataTypes.TINYINT,


            },
            SEXE_ID: {
                        type: DataTypes.TINYINT,


            }
},
            {
                        freezeTableName: true,
                        tableName: 'utilisateurs',
                        timestamps: false
            })
Utilisateur.belongsTo(Fonction, { foreignKey: "FONCTION_ID", as: 'fonction' })
Utilisateur.belongsTo(Profiles, { foreignKey: "PROFIL_ID", as: 'profiles' })
Utilisateur.belongsTo(Sexes, { foreignKey: "SEXE_ID", as: 'sexes' })

module.exports = Utilisateur 