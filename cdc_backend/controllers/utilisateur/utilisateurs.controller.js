const express = require("express")
const RESPONSE_CODES = require("../../constants/RESPONSE_CODES")
const RESPONSE_STATUS = require("../../constants/RESPONSE_STATUS")
const Validation = require("../../class/Validation")
const Utilisateurs = require("../../models/Utilisateurs")
const { Op } = require("sequelize")
const UtilisateurUpload = require("../../class/uploads/UtilisateurUpload")
const IMAGES_DESTINATIONS = require("../../constants/IMAGES_DESTINATIONS")
const Fonction = require("../../models/Fonction")
const Sexes = require("../../models/Sexes")
const Profiles = require("../../models/Profiles")

const createUtilisateur = async (req, res) => {
    try {
        const { NOM, PRENOM, EMAIL,SEXE_ID, PHONE, DATE_NAISSANCE, FONCTION_ID, PROFIL_ID } = req.body
        const { IMAGE } = req.files

        const data = { ...req.body, ...req.files }
        const validation = new Validation(data, {
            NOM: {
                required: true,
                length: [1, 191],
                alpha: true
            },
            PRENOM: {
                required: true,
                length: [1, 191],
                alpha: true
            },
            EMAIL: {
                required: true,
                length: [1, 191],
                email: true
            },
            SEXE_ID: {
                required: true,
                number: true,
                exists: "sexes,SEXE_ID"
            },
            PHONE: {
                required: true,
                length: [1, 11],
                number: true
            },
            IMAGE: {
                required: true,
                image: 4000000
            },
            DATE_NAISSANCE: {
                required: true,
                date: true
            },
            FONCTION_ID: {
                required: true,
                number: true,
                exists: "fonctions,fonction_id"
            },
            PROFIL_ID: {
                required: true,
                number: true,
                exists: "profiles,PROFIL_ID"
            },
        })
        await validation.run()
        const isValid = await validation.isValidate()
        if (!isValid) {
            const errors = await validation.getErrors()
            return res.status(RESPONSE_CODES.UNPROCESSABLE_ENTITY).json({
                statusCode: RESPONSE_CODES.UNPROCESSABLE_ENTITY,
                httpStatus: RESPONSE_STATUS.UNPROCESSABLE_ENTITY,
                message: "Probleme de validation des donnees",
                result: errors
            })
        }
        const utilisateurUpload = new UtilisateurUpload()
        const { fileInfo } = await utilisateurUpload.upload(IMAGE, false)
        const filename = `${fileInfo.fileName}`
        const utilisateur = await Utilisateurs.create({
            NOM, PRENOM, EMAIL,SEXE_ID, PHONE,IMAGE: filename, DATE_NAISSANCE, FONCTION_ID, PROFIL_ID
        })
        res.status(RESPONSE_CODES.CREATED).json({
            statusCode: RESPONSE_CODES.CREATED,
            httpStatus: RESPONSE_STATUS.CREATED,
            message: "L'utilisateur a ete cree avec succes",
            result: utilisateur
        })
    } catch (error) {
        console.log(error)
        res.status(RESPONSE_CODES.INTERNAL_SERVER_ERROR).json({
            statusCode: RESPONSE_CODES.INTERNAL_SERVER_ERROR,
            httpStatus: RESPONSE_STATUS.INTERNAL_SERVER_ERROR,
            message: "Erreur interne du serveur, réessayer plus tard",
        })
    }
}



const findallProfile=async(req,res)=>{
    try {
        const profile=await Profiles.findAll({})
        res.status(RESPONSE_CODES.CREATED).json({
            statusCode: RESPONSE_CODES.CREATED,
            httpStatus: RESPONSE_STATUS.CREATED,
            message: "L'utilisateur a ete modifier avec succes",
            result: profile
        })
    } catch (error) {
        console.log(error)
        res.status(RESPONSE_CODES.INTERNAL_SERVER_ERROR).json({
            statusCode: RESPONSE_CODES.INTERNAL_SERVER_ERROR,
            httpStatus: RESPONSE_STATUS.INTERNAL_SERVER_ERROR,
            message: "Erreur interne du serveur, réessayer plus tard",
        })
    }
}
const findallfonction=async(req,res)=>{
    try {
        const fonction=await Fonction.findAll({})
        res.status(RESPONSE_CODES.CREATED).json({
            statusCode: RESPONSE_CODES.CREATED,
            httpStatus: RESPONSE_STATUS.CREATED,
            message: "L'utilisateur a ete modifier avec succes",
            result: fonction
        })
    } catch (error) {
        console.log(error)
        res.status(RESPONSE_CODES.INTERNAL_SERVER_ERROR).json({
            statusCode: RESPONSE_CODES.INTERNAL_SERVER_ERROR,
            httpStatus: RESPONSE_STATUS.INTERNAL_SERVER_ERROR,
            message: "Erreur interne du serveur, réessayer plus tard",
        })
    }
}

const findallSexe=async(req,res)=>{
    try {
        const sexe=await Sexes.findAll({})
        res.status(RESPONSE_CODES.CREATED).json({
            statusCode: RESPONSE_CODES.CREATED,
            httpStatus: RESPONSE_STATUS.CREATED,
            message: "L'utilisateur a ete modifier avec succes",
            result: sexe
        })
    } catch (error) {
        console.log(error)
        res.status(RESPONSE_CODES.INTERNAL_SERVER_ERROR).json({
            statusCode: RESPONSE_CODES.INTERNAL_SERVER_ERROR,
            httpStatus: RESPONSE_STATUS.INTERNAL_SERVER_ERROR,
            message: "Erreur interne du serveur, réessayer plus tard",
        })
    }
}

const findAll = async (req, res) => {
    try {
        const { rows = 10, first = 0, sortField, sortOrder, search } = req.query
        const defaultSortDirection = "DESC"
        const sortColumns = {
            utilisateurs: {
                as: "utilisateurs",
                fields: {
                    NOM: 'PRENOM',
                    PRENOM: 'PRENOM',
                    EMAIL: 'EMAIL',
                    PHONE: 'PHONE',
                    DATE_NAISSANCE: 'DATE_NAISSANCE',
                    PHONE: 'PHONE',
                }
            },
            fonction: {
                as: "fonction",
                fields: {
                    DESC_FONCTION: 'DESC_FONCTION'
                }
            },
            sexes: {
                as: "sexes",
                fields: {
                    SEXE_ID: 'SEXE_ID'
                }
            },
            profiles: {
                as: "profiles",
                fields: {
                    PROFIL_ID: 'PROFIL_ID'
                }
            },
        }
        var orderColumn, orderDirection

        // sorting
        var sortModel
        if (sortField) {
            for (let key in sortColumns) {
                if (sortColumns[key].fields.hasOwnProperty(sortField)) {
                    sortModel = {
                        model: key,
                        as: sortColumns[key].as
                    }
                    orderColumn = sortColumns[key].fields[sortField]
                    break
                }
            }
        }


        // ordering
        if (sortOrder == 1) {
            orderDirection = 'ASC'
        } else if (sortOrder == -1) {
            orderDirection = 'DESC'
        } else {
            orderDirection = defaultSortDirection
        }

        // searching
        const globalSearchColumns = [
            "NOM",
            'PRENOM',

        ]
        var globalSearchWhereLike = {}
        if (search && search.trim() != "") {
            const searchWildCard = {}
            globalSearchColumns.forEach(column => {
                searchWildCard[column] = {
                    [Op.substring]: search
                }
            })
            globalSearchWhereLike = {
                [Op.or]: searchWildCard
            }
        }
        const result = await Utilisateurs.findAll({
            limit: parseInt(rows),
            offset: parseInt(first),
           
            where: {
                ...globalSearchWhereLike,
            },
            include: [{
                model: Sexes,
                as: 'sexes',
                required: false,
                attributes: ['SEXE_ID', 'SEXE'],
            },
            {
                model: Fonction,
                as: 'fonction',
                required: false,
                attributes: ['FONCTION_ID', 'DESC_FONCTION'],
            }]


        })

        res.status(RESPONSE_CODES.OK).json({
            statusCode: RESPONSE_CODES.OK,
            httpStatus: RESPONSE_STATUS.OK,
            message: "Liste des utilisateurs",
            result: {
                data: result.rows,
                totalRecords: result
            }
        })
    } catch (error) {
        console.log(error)
        res.status(RESPONSE_CODES.INTERNAL_SERVER_ERROR).json({
            statusCode: RESPONSE_CODES.INTERNAL_SERVER_ERROR,
            httpStatus: RESPONSE_STATUS.INTERNAL_SERVER_ERROR,
            message: "Erreur interne du serveur, réessayer plus tard",
        })
    }

}




const findOneUtilisateur = async (req, res) => {
    try {
        const { UTIL_ID } = req.params
        const utilisateur = await Utilisateurs.findOne({
            where: {
                UTIL_ID
            },
            include:[{
                model:Profiles,
                as:'profiles',
                required:true,
                attributes:['PROFIL_ID','DESC_PROFIL']

            },
            {
                model:Sexes,
                as:'sexes',
                required:true,
                attributes:['SEXE_ID','SEXE']

            },{
                model:Fonction,
                as:'fonction',
                required:true,
                attributes:['FONCTION_ID','DESC_FONCTION']

            },
            {
                model:Profiles,
                as:'profiles',
                required:true,
                attributes:['PROFIL_ID','DESC_PROFIL']

            }]
        })
        if (utilisateur) {
            res.status(RESPONSE_CODES.OK).json({
                statusCode: RESPONSE_CODES.OK,
                httpStatus: RESPONSE_STATUS.OK,
                message: "le collaborateur",
                result: utilisateur
            })
        } else {
            res.status(RESPONSE_CODES.NOT_FOUND).json({
                statusCode: RESPONSE_CODES.NOT_FOUND,
                httpStatus: RESPONSE_STATUS.NOT_FOUND,
                message: "le collaborateur non trouve",
            })
        }
    } catch (error) {
        console.log(error)
        res.status(RESPONSE_CODES.INTERNAL_SERVER_ERROR).json({
            statusCode: RESPONSE_CODES.INTERNAL_SERVER_ERROR,
            httpStatus: RESPONSE_STATUS.INTERNAL_SERVER_ERROR,
            message: "Erreur interne du serveur, réessayer plus tard",
        })
    }
}


const updateUtilisateur = async (req, res) => {
    try {
        const { UTIL_ID } = req.params
        const {  NOM, PRENOM, EMAIL,SEXE_ID, PHONE, DATE_NAISSANCE, FONCTION_ID, PROFIL_ID} = req.body
        const data = { ...req.body }
        const validation = new Validation(data, {
            NOM: {
                required: true,
                length: [1, 191],
                alpha: true
            },
            PRENOM: {
                required: true,
                length: [1, 191],
                alpha: true
            },
            PHONE: {
                required: true,
                length: [1, 11],
                number: true
            },

        })
        await validation.run()
        const isValid = await validation.isValidate()
        if (!isValid) {
            const errors = await validation.getErrors()
            return res.status(RESPONSE_CODES.UNPROCESSABLE_ENTITY).json({
                statusCode: RESPONSE_CODES.UNPROCESSABLE_ENTITY,
                httpStatus: RESPONSE_STATUS.UNPROCESSABLE_ENTITY,
                message: "Probleme de validation des donnees",
                result: errors
            })
        }
        const utilisateur = await Utilisateurs.update({
            NOM, PRENOM, EMAIL, SEXE_ID, PHONE, FONCTION_ID, PROFIL_ID
        }, {
            where: {
                UTIL_ID: UTIL_ID
            }

        })
        
        res.status(RESPONSE_CODES.CREATED).json({
            statusCode: RESPONSE_CODES.CREATED,
            httpStatus: RESPONSE_STATUS.CREATED,
            message: "L'utilisateur a ete modifier avec succes",
            result: utilisateur
        })
    } catch (error) {
        console.log(error)
        res.status(RESPONSE_CODES.INTERNAL_SERVER_ERROR).json({
            statusCode: RESPONSE_CODES.INTERNAL_SERVER_ERROR,
            httpStatus: RESPONSE_STATUS.INTERNAL_SERVER_ERROR,
            message: "Erreur interne du serveur, réessayer plus tard",
        })
    }
}


const deleteUtilisateur = async (req, res) => {
    try {
        const { UTIL_ID } = req.params
      
        await Utilisateurs.destroy({
            where: {
                UTIL_ID: UTIL_ID
            },
        });
        res.status(RESPONSE_CODES.OK).json({
            statusCode: RESPONSE_CODES.OK,
            httpStatus: RESPONSE_STATUS.OK,
            message: "Les elements ont ete supprimer avec success",
        })
    } catch (error) {
        console.log(error)
        res.status(RESPONSE_CODES.INTERNAL_SERVER_ERROR).json({
            statusCode: RESPONSE_CODES.INTERNAL_SERVER_ERROR,
            httpStatus: RESPONSE_STATUS.INTERNAL_SERVER_ERROR,
            message: "Erreur interne du serveur, réessayer plus tard",
        })
    }
}
module.exports = {
    createUtilisateur,
    findAll,
    findOneUtilisateur,
    deleteUtilisateur,
    updateUtilisateur,
    findallfonction,
    findallSexe,
    findallProfile
}