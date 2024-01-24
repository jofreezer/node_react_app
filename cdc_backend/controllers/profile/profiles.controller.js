const express = require("express")
const RESPONSE_CODES = require("../../constants/RESPONSE_CODES")
const RESPONSE_STATUS = require("../../constants/RESPONSE_STATUS")
const Validation = require("../../class/Validation")
const Profiles = require("../../models/Profiles")
const { Op} = require("sequelize")


const createProfile = async (req, res) => {
    try {
        const { DESC_PROFIL} = req.body
       
        const data = { ...req.body, ...req.files }
        const validation = new Validation(data, {
            DESC_PROFIL: {
                required: true,
                length: [1, 191],
                alpha: true
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

        const profile = await Profiles.create({
            DESC_PROFIL
        })
        res.status(RESPONSE_CODES.CREATED).json({
            statusCode: RESPONSE_CODES.CREATED,
            httpStatus: RESPONSE_STATUS.CREATED,
            message: "Le profile a ete cree avec succes",
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
const findAll = async (req, res) => {
            try {
                const { rows = 10, first = 0, sortField, sortOrder, search } = req.query
                const defaultSortDirection = "DESC"
                const sortColumns = {
                    profiles: {
                        as: "profiles",
                        fields: {
        
                            DESC_PROFIL: 'DESC_PROFIL',
                        
                        
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
                    "DESC_PROFIL",
        
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
                const result = await Profiles.findAll({
                    limit: parseInt(rows),
                    offset: parseInt(first),
                   
                    where: {
                        ...globalSearchWhereLike,
                    },
                  
                })
        
                res.status(RESPONSE_CODES.OK).json({
                    statusCode: RESPONSE_CODES.OK,
                    httpStatus: RESPONSE_STATUS.OK,
                    message: "Liste des profiles",
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

const updateProfile = async (req, res) => { 
    try {
        const { ids } = req.params
        const { DESC_PROFIL} = req.body
        const data = { ...req.body }
        const validation = new Validation(data, {
            DESC_PROFIL: {
                required: true,
                length: [1, 191],
                alpha: true
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
        const profile = await Profiles.update({
            DESC_PROFIL
        }, {
            where: {
                   PROFIL_ID : ids
            }

        })
        
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


const findOneProfile = async (req, res) => {
    try {
        const { PROFIL_ID } = req.params
        const profile = await Profiles.findOne({
            where: {
                        PROFIL_ID
            }



        })
        if (profile) {
            res.status(RESPONSE_CODES.OK).json({
                statusCode: RESPONSE_CODES.OK,
                httpStatus: RESPONSE_STATUS.OK,
                message: "le profile",
                result: profile
            })
        } else {
            res.status(RESPONSE_CODES.NOT_FOUND).json({
                statusCode: RESPONSE_CODES.NOT_FOUND,
                httpStatus: RESPONSE_STATUS.NOT_FOUND,
                message: "le profile non trouve",
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

const deleteProfile = async (req, res) => {
    try {
        const { ids } = req.body
      const itemsIds = JSON.parse(ids)
        await Profiles.destroy({
            where: {
                 PROFIL_ID: {

                    [Op.in]:itemsIds
                 }
            },
        });
        res.status(RESPONSE_CODES.OK).json({
            statusCode: RESPONSE_CODES.OK,
            httpStatus: RESPONSE_STATUS.OK,
            message: "Le profile a ete supprime avec success",
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
    createProfile,
    findAll,
    findOneProfile,   
    updateProfile,
    deleteProfile,
   
}