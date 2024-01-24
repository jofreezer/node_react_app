const express = require('express')
const login_user_routes = require('./login_user.route')
const loginRouter = express.Router()

loginRouter.use('/user', login_user_routes)

module.exports = loginRouter