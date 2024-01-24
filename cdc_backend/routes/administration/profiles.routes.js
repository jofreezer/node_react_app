const express = require('express')
const profile_controller = require("../../controllers/profile/profiles.controller")
const profile_routes = express.Router()

profile_routes.post("/", profile_controller.createProfile)
profile_routes.get("/", profile_controller.findAll)
profile_routes.put("/:ids", profile_controller.updateProfile)
profile_routes.get("/:PROFIL_ID", profile_controller.findOneProfile)
profile_routes.post("/delete", profile_controller.deleteProfile) 

module.exports = profile_routes