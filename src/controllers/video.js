const { create, updateById, deleteById, getById } = require('../helpers/crud')
const videoScehama = require('../models/video')
const { statusCode: SC } = require('../utils/statusCode')
const { loggerUtil: logger } = require('../utils/logger')
const formidable = require('formidable')
const { createSiteData } = require('../helpers/fileHelper')
const multer = require('multer');
const Mux = require('@mux/mux-node');
const fs = require("fs")

const { MUX_ACCESS_TOKEN, MUX_SECRET_KEY } = process.env;
const { Video } = new Mux(MUX_ACCESS_TOKEN, MUX_SECRET_KEY);
// const upload = multer({
//     storage: multer.memoryStorage(),
//     limits: { fileSize: 100 * 1024 * 1024 },
//     fileFilter: (req, file, cb) => {
//         if (!file.mimetype.startsWith('video/')) {
//             return cb(new Error('Only video files are allowed.'));
//         }
//         return cb(null, true);
//     },
// });


// const directUploadMux = (upload.single('video'), async (req, res) => {
//     try {
//         console.log(req.file, "hii");
//         const video = await Video.Assets.create({
//             input: req.file.path,
//             playback_policy: 'public',
//             mp4_support: 'standard',
//         });
//         res.json(video);
//     } catch (err) {
//         logger(err, 'ERROR')
//     } finally {
//         logger('Create Blog Function is Executed')
//     }
// })

const createVideo = async (req, res) => {
    try {
        const form = new formidable.IncomingForm()
        form.parse(req, async (err, fields, file) => {
            console.log(file, "hello");
            const formValue = JSON.parse(fields.data)
            formValue.video = await createSiteData(file.video, res, err)
            // formValue.imageSecondary = await createSiteData(file.imageSecondary, res, err,)
            try {
                const video = await Video.Assets.create({
                    input: formValue.video,
                    playback_policy: 'public',
                    mp4_support: 'standard',
                })
                console.log(video);
            } catch (err) {
                console.log(err);
            }
            formValue.userId = req.auth._id
            await create(formValue, videoScehama)
                .then(data => {
                    res.status(SC.OK).json(data)
                })
                .catch(err => {
                    res.status(SC.INTERNAL_SERVER_ERROR).json({
                        status: 'Failed!',
                        err
                    })
                })
        })
    } catch (err) {
        logger(err, 'ERROR')
    } finally {
        logger('Create Video Function is Executed')
    }
}

const updateVideo = async (req, res) => {
    try {
        const form = new formidable.IncomingForm()
        form.parse(req, async (err, fields, file) => {
            const formValue = JSON.parse(fields.data)
            if (file.imageMain) {
                formValue.imageMain = await createSiteData(file.imageMain, res, err)
            }
            if (file.imageSecondary) {
                formValue.imageSecondary = await createSiteData(file.imageSecondary, res, err,)
            } formValue.userId = req.auth._id
            const id = req.params.id
            await updateById(formValue, id, videoScehama)
                .then(data => {
                    res.status(SC.OK).json(data)
                })
                .catch(err => {
                    res.status(SC.INTERNAL_SERVER_ERROR).json({
                        status: 'Failed!',
                        err
                    })
                })
        })
    } catch (err) {
        loggerUtil(err, 'ERROR')
    } finally {
        logger('Update Blog Function is Executed')
    }
}

const deleteVideo = async (req, res) => {
    try {
        const id = req.params.id
        await deleteById(id, videoScehama)
            .then(data => {
                res.status(SC.OK).json(data)
            })
            .catch(err => {
                res.status(SC.INTERNAL_SERVER_ERROR).json({
                    status: 'Failed!',
                    err
                })
            })
    } catch (err) {
        loggerUtil(err, 'ERROR')
    } finally {
        logger('Delete Blog Function is Executed')
    }
}

const getVideoByID = async (req, res) => {
    const id = req.params.id
    try {
        await getById(id, videoScehama)
            .then(data => {
                res.status(SC.OK).json(data)
            })
            .catch(err => {
                res.status(SC.INTERNAL_SERVER_ERROR).json({
                    status: 'Failed!',
                    err
                })
            })
    } catch (err) {
        loggerUtil(err, 'ERROR')
    } finally {
        logger('Get Blog Function is Executed')
    }
}
const label = {
    totalDocs: 'totalBlogs',
    docs: 'blogs',
    limit: 'perPage',
    page: 'currentPage',
    nextPage: 'nextPageNo',
    prevPage: 'prevPageNo',
    totalPages: 'pageCount'
}

const getAllVideos = async (req, res) => {
    const options = {
        page: 1,
        limit: 10,
        customLabels: label
    }
    req.query.page !== undefined ? (options.page = req.query.page) : null
    req.query.limit !== undefined ? (options.limit = req.query.limit) : null
    const id = req.params.id
    try {
        await videoScehama.paginate({}, options, (err, result) => {
            if (err) {
                res.status(SC.BAD_REQUEST).json({
                    error: 'Getting blogs from DB is failed!'
                })
                logger(err, 'ERROR')
            }
            res.status(SC.OK).send({
                message: 'Blogs fetched successfully',
                data: result
            })
        })
    } catch (err) {
        loggerUtil(err, 'ERROR')
    } finally {
        logger('Get all Blogs Function is Executed')
    }
}

module.exports = {
    // directUploadMux,
    createVideo,
    updateVideo,
    getVideoByID,
    getAllVideos,
    deleteVideo
}
