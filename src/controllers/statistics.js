const { statusCode: SC } = require('../utils/statusCode')
const { loggerUtil: logger } = require('../utils/logger')
const blog = require('../models/blog')
const videoModel = require("../models/video")

const mainData = async (req, res) => {
    try {
        const responseObj = {
            blogCount: 0,
            videoCount: 0,
        }
        responseObj.blogCount = await blog.count({})
        responseObj.videoCount = await videoModel.count({})
        res.status(SC.OK).json({
            status: SC.OK,
            data: responseObj
        })
    }
    catch (err) {
        logger(err, 'ERROR')
    } finally {
        logger('Get Main Stats is Executed!')
    }
}

module.exports = {
    mainData
}