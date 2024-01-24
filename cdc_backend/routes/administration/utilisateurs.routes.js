const express = require('express')
const utilisateurs_controller = require("../../controllers/utilisateur/utilisateurs.controller")
const utilisateur_routes = express.Router()

utilisateur_routes.post("/", utilisateurs_controller.createUtilisateur)
utilisateur_routes.get("/", utilisateurs_controller.findAll)
utilisateur_routes.get("/fonc", utilisateurs_controller.findallfonction)
utilisateur_routes.get("/sexe", utilisateurs_controller.findallSexe)
utilisateur_routes.get("/profile", utilisateurs_controller.findallProfile)
utilisateur_routes.get("/:UTIL_ID", utilisateurs_controller.findOneUtilisateur)
utilisateur_routes.put("/update/:UTIL_ID", utilisateurs_controller.updateUtilisateur)
utilisateur_routes.delete("/delete/:UTIL_ID", utilisateurs_controller.deleteUtilisateur) 

module.exports = utilisateur_routes
