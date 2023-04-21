const mongoose = require('mongoose')
const mongoosePaginate = require('mongoose-paginate-v2')

const videoSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.ObjectId,
            required: true
        },
        title: {
            type: String,
            required: true,
            trim: true
        },
        description: {
            type: String,
            required: true,
            trim: true
        },
        playbackID: {
            type: String
        },
    },
    { timestamps: true }
)

videoSchema.plugin(mongoosePaginate)

module.exports = mongoose.model('video', videoSchema, 'video')
