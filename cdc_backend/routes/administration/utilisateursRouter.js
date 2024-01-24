const express = require('express')
 const utilisateur_routes = require('./utilisateurs.routes')
 const profile_routes = require('./profiles.routes')
//  const sexe_routes = require('./sexes.routes')
const utilisateursRoute = express.Router()

utilisateursRoute.use('/utilisateurs', utilisateur_routes)
utilisateursRoute.use('/profiles', profile_routes)
// utilisateursRoute.use('/sexes', sexe_routes)


module.exports = utilisateursRoute