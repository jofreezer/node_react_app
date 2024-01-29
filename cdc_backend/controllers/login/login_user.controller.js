const express = require('express');
const Validation = require('../../class/Validation');
const RESPONSE_CODES = require('../../constants/RESPONSE_CODES');
const RESPONSE_STATUS = require('../../constants/RESPONSE_STATUS');
const Login = require('../../models/app/Login');
const { query } = require('../../utils/db');
const generateToken = require('../../utils/generateToken');
const md5 = require('md5');




/**
 * Permet de LOGIN
 * @author JOFFREY <JOFFREY@mediabox.bi>
 * @param {express.Request} res 
 * @param {express.Response} res 
 */
const login = async (req, res) => {
        try {
                const { EMAIL, PASSWORD } = req.body;
                const validation = new Validation(
                        req.body,
                        {

                                EMAIL:
                                {
                                        required: true,
                                },
                                PASSWORD:
                                {
                                        required: true,
                                },
                        },
                        {
                                PASSWORD:
                                {
                                        required: "Mot de passe est obligatoire",
                                },
                                EMAIL: {
                                        required: "L'email est obligatoire",
                                        email: "Email invalide"
                                }
                        }
                );
                await validation.run();
                const isValid = await validation.isValidate()
                const errors = await validation.getErrors()
                if (!isValid) {
                        return res.status(RESPONSE_CODES.UNPROCESSABLE_ENTITY).json({
                                statusCode: RESPONSE_CODES.UNPROCESSABLE_ENTITY,
                                httpStatus: RESPONSE_STATUS.UNPROCESSABLE_ENTITY,
                                message: "Probleme de validation des donnees",
                                result: errors
                        })
                }

                var user = (await Login.findOne({ EMAIL }));
                if (user) {
                        if (user.PASSWORD == PASSWORD) {
                                const token = generateToken({ user: user.USER_ID }, 3 * 12 * 30 * 24 * 3600)
                                const { PASSWORD, ...other } = user

                                res.status(RESPONSE_CODES.CREATED).json({
                                        statusCode: RESPONSE_CODES.CREATED,
                                        httpStatus: RESPONSE_STATUS.CREATED,
                                        message: "Vous êtes connecté avec succès",
                                        result: {
                                                ...other,
                                                token
                                        }
                                })
                        } else {
                                validation.setError('main', 'Identifiants incorrects')
                                const errors = await validation.getErrors()
                                res.status(RESPONSE_CODES.NOT_FOUND).json({
                                        statusCode: RESPONSE_CODES.NOT_FOUND,
                                        httpStatus: RESPONSE_STATUS.NOT_FOUND,
                                        message: "Utilisateur n'existe pas",
                                        result: errors
                                })
                        }
                } else {
                        validation.setError('main', 'Identifiants incorrects')
                        const errors = await validation.getErrors()
                        res.status(RESPONSE_CODES.NOT_FOUND).json({
                                statusCode: RESPONSE_CODES.NOT_FOUND,
                                httpStatus: RESPONSE_STATUS.NOT_FOUND,
                                message: "Utilisateur n'existe pas",
                                result: errors
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


const createUser = async (req, res) => {
        try {
                const { NOM, PRENOM, EMAIL, USERNAME, PASSWORD } = req.body;

                const validation = new Validation({ ...req.body }, {
                        NOM: { required: true },
                        PRENOM: { required: true },
                        USERNAME: { required: true },
                        EMAIL: { email: true },
                        PASSWORD: { required: true },
                }, {
                        NOM: { required: "Le nom est obligatoire" },
                        PRENOM: { required: "Le prenom est obligatoire" },
                        EMAIL: { email: "Email invalide" },
                        PASSWORD: { required: "Le mot de passe est obligatoire" },
                });

                await validation.run();
                const isValide = await validation.isValidate();
                const errors = await validation.getErrors();
                if (!isValide) {
                        return res.status(RESPONSE_CODES.UNPROCESSABLE_ENTITY).json({
                                statusCode: RESPONSE_CODES.UNPROCESSABLE_ENTITY,
                                httpStatus: RESPONSE_STATUS.UNPROCESSABLE_ENTITY,
                                message: "Probleme de validation des donnees",
                                result: errors
                        });
                }

                // const hashedPassword = md5(MOT_PASS);

                const login = await Login.create({
                        NOM,
                        PRENOM,
                        USERNAME,
                        EMAIL,
                        PASSWORD,
                        // MOT_PASS: hashedPassword,
                });

                const token = generateToken({ login: login.USER_ID }, 3 * 12 * 30 * 24 * 3600);

                res.status(RESPONSE_CODES.CREATED).json({
                        statusCode: RESPONSE_CODES.CREATED,
                        httpStatus: RESPONSE_STATUS.CREATED,
                        message: "Enregistrement est fait avec succès",
                        result: {
                                ...login,
                                token
                        }
                });
        } catch (error) {
                console.log(error);
                res.status(RESPONSE_CODES.INTERNAL_SERVER_ERROR).json({
                        statusCode: RESPONSE_CODES.INTERNAL_SERVER_ERROR,
                        httpStatus: RESPONSE_STATUS.INTERNAL_SERVER_ERROR,
                        message: "Enregistrement echoue",
                });
        }
};



const logOutUser = async (req, res) => {
        try {

                res.status(RESPONSE_CODES.OK).json({
                        statusCode: RESPONSE_CODES.OK,
                        httpStatus: RESPONSE_STATUS.OK,
                        message: "Utilisateur deconnecte avec succes",
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
        login,
        createUser,
        logOutUser,

}