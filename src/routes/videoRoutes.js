const express = require('express')
const {
    createVideo,
    updateVideo,
    getVideoByID,
    getAllVideos,
    deleteVideo,
    // directUploadMux
} = require('../controllers/video')
const { isSignedIn, isValidToken, isAdmin } = require('../controllers/middleware')
const router = express.Router()

// router.post("/video/upload-url", isSignedIn,isValidToken, isAdmin , directUploadMux)
router.post('/video/create', isSignedIn, isValidToken, createVideo)
router.put('/video/update/:id', isSignedIn, isValidToken, updateVideo)
router.delete('/video/delete/:id', deleteVideo)
router.get('/video/get/:id', getVideoByID)
router.get('/video/get-all', getAllVideos)

module.exports = router
