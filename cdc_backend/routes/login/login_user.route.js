const express = require('express')
const login_user_controller = require('../../controllers/login/login_user.controller')
const login_user_routes = express.Router()


 login_user_routes.post('/login', login_user_controller.login)
 login_user_routes.post('/new', login_user_controller.createUser)
 login_user_routes.post('/out', login_user_controller.logOutUser)



module.exports = login_user_routes

