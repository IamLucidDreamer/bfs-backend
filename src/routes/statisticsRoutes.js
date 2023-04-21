const express = require('express')
const {
    mainData
} = require('../controllers/statistics')
const { isSignedIn, isValidToken, isAdmin } = require('../controllers/middleware')
const router = express.Router()

router.get('/statistics/main', isSignedIn, isValidToken, isAdmin, mainData)

module.exports = router
