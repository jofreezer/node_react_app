const express = require('express')
const login_user_controller = require('../../controllers/login/login_user.controller')
const login_user_routes = express.Router()


 login_user_routes.post('/app', login_user_controller.login)
 login_user_routes.post('/', login_user_controller.createUser)



module.exports = login_user_routes

